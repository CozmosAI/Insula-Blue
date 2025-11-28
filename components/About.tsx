
import React, { useState } from 'react';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
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
      className={`scroll-animate py-12 lg:py-20 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{ backgroundColor: content.backgroundColor }}
    >
      {isEditMode && (
          <SectionControls
            onSelect={() => onOpenModal('Editando Seção Sobre', [
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
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div
            style={{
                ...content.imageStyle,
                objectFit: undefined
            }}
            className="scroll-animate relative overflow-hidden rounded-lg shadow-xl"
            data-editable-img={isEditMode}
            onClick={() => isEditMode && onOpenModal('Editando Imagem', [
                { path: 'about.imageUrl', label: 'URL da Imagem', value: content.imageUrl, type: 'image' },
                { path: 'about.imageStyle.width', label: 'Largura (ex: 100%, 500px)', value: content.imageStyle?.width || '100%', type: 'size' },
                { path: 'about.imageStyle.height', label: 'Altura (ex: auto, 400px)', value: content.imageStyle?.height || 'auto', type: 'size' },
                { path: 'about.imageStyle.objectFit', label: 'Ajuste (cover, contain)', value: content.imageStyle?.objectFit || 'cover', type: 'text' }
            ])}
        >
          <img 
            decoding="async" 
            src={content.imageUrl} 
            className="w-full h-full"
            style={{ objectFit: content.imageStyle?.objectFit || 'cover' }} 
            alt="Illustration of a person holding a chart" 
          />
        </div>
        <div className="flex flex-col items-start text-left">
          <hr className="w-1/4 border-t-[10px] mb-6 scroll-animate" style={{ borderColor: content.accentColor, transitionDelay: '150ms' }} />
          <div
            style={{...content.titleStyle, transitionDelay: '300ms'}}
            className="scroll-animate"
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
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
          </div>
           <div className="mt-8 space-y-6 w-full">
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
                        onClone={() => onUpdate(`${sectionKey}.customBlocks`, block, 'ADD_ITEM')}
                        isDraggable={isEditMode}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`scroll-animate ${draggedIndex === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
