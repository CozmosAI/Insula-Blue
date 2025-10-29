import React, { useState } from 'react';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface AboutContent {
  show: boolean;
  imageUrl: string;
  imageStyle: any;
  title: string;
  titleStyle: any;
  backgroundColor: string;
  titleColor: string;
  accentColor: string;
  titleFontSize: string;
  customBlocks?: any[];
}

interface AboutProps {
    content: AboutContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
    sectionKey: string;
    onMoveSection: (sectionKey: string, direction: 'up' | 'down') => void;
    onDeleteSection: (sectionKey: string) => void;
    isFirst: boolean;
    isLast: boolean;
}

const About: React.FC<AboutProps> = ({ content, isEditMode, onUpdate, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (!isEditMode || draggedIndex === index) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!isEditMode || draggedIndex === null) return;
    e.preventDefault();

    if (draggedIndex !== dropIndex) {
      const items = [...(content.customBlocks || [])];
      const [reorderedItem] = items.splice(draggedIndex, 1);
      items.splice(dropIndex, 0, reorderedItem);
      onUpdate('about.customBlocks', items);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  return (
    <section 
      id="about"
      data-section-key={sectionKey}
      className={`py-20 lg:py-32 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{ backgroundColor: content.backgroundColor }}
    >
      {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção Sobre', [
              { path: 'about.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'about.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
            ])}
            onMoveUp={() => onMoveSection(sectionKey, 'up')}
            onMoveDown={() => onMoveSection(sectionKey, 'down')}
            onDelete={() => {
                if (window.confirm('Tem certeza que deseja ocultar esta seção?')) {
                    onDeleteSection(sectionKey);
                }
            }}
            isFirst={isFirst}
            isLast={isLast}
            isHidden={!content.show}
          />
      )}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={true}
            style={content.imageStyle}
            onUpdate={onUpdate}
            path="about.imageStyle"
        >
            <div 
                data-editable-img={isEditMode}
                onClick={() => isEditMode && onOpenModal('Editando Imagem', [
                    { path: 'about.imageUrl', label: 'URL da Imagem', value: content.imageUrl, type: 'image' }
                ])}
            >
              <img 
                decoding="async" 
                src={content.imageUrl} 
                className="w-full h-full object-cover" 
                alt="Illustration of a person holding a chart" 
              />
            </div>
        </EditableWrapper>
        <div className="flex flex-col">
          <hr className="w-1/4 border-t-[10px] mb-6" style={{ borderColor: content.accentColor }} />
          <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={content.titleStyle}
            onUpdate={onUpdate}
            path="about.titleStyle"
          >
            <h2 
              className="font-semibold leading-tight text-3xl sm:text-4xl lg:text-5xl"
              style={{ color: content.titleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título', [
                  { path: 'about.title', label: 'Título', value: content.title, type: 'textarea' },
                  { path: 'about.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                  { path: 'about.accentColor', label: 'Cor de Destaque', value: content.accentColor, type: 'color' },
              ])}
            >
              {content.title}
            </h2>
          </EditableWrapper>
           <div className="mt-8 space-y-6">
                {content.customBlocks?.map((block, index) => (
                    <CustomBlock
                        key={index}
                        block={block}
                        isEditMode={isEditMode}
                        onUpdate={onUpdate}
                        onOpenModal={onOpenModal}
                        onCloseModal={onCloseModal}
                        path={`${sectionKey}.customBlocks[${index}]`}
                        onDelete={() => {
                            if (window.confirm('Tem certeza que deseja excluir este bloco?')) {
                                onUpdate(`${sectionKey}.customBlocks`, index, 'DELETE_ITEM');
                            }
                        }}
                        isDraggable={isEditMode}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`${draggedIndex === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;