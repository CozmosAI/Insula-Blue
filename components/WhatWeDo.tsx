import React, { useState } from 'react';
import { SectionControls } from './shared/SectionControls';
import { AddItemButton } from './shared/AddItemButton';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface Service {
  name: string;
  description: string;
}

interface WhatWeDoContent {
  show: boolean;
  pretitle: string;
  title: string;
  services: Service[];
  backgroundColor: string;
  pretitleColor: string;
  titleColor: string;
  cardBackgroundColor: string;
  cardTitleColor: string;
  cardTextColor: string;
  pretitleFontSize: string;
  titleFontSize: string;
  cardTitleFontSize: string;
  pretitleStyle: any;
  titleStyle: any;
  customBlocks?: any[];
}

interface WhatWeDoProps {
    content: WhatWeDoContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    newContentDefaults: any;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
    sectionKey: string;
    onMoveSection: (sectionKey: string, direction: 'up' | 'down') => void;
    onDeleteSection: (sectionKey: string) => void;
    isFirst: boolean;
    isLast: boolean;
}

const WhatWeDo: React.FC<WhatWeDoProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
  const [draggedIndex, setDraggedIndex] = useState<{ list: string, index: number } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<{ list: string, index: number } | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number, list: string) => {
    if (!isEditMode) return;
    setDraggedIndex({ list, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, index: number, list: string) => {
    if (!isEditMode || (draggedIndex && draggedIndex.index === index && draggedIndex.list === list)) return;
    e.preventDefault();
    setDragOverIndex({ list, index });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number, list: string) => {
    if (!isEditMode || draggedIndex === null || draggedIndex.list !== list) return;
    e.preventDefault();

    if (draggedIndex.index !== dropIndex) {
      const items = [...(list === 'services' ? content.services : (content.customBlocks || []))];
      const [reorderedItem] = items.splice(draggedIndex.index, 1);
      items.splice(dropIndex, 0, reorderedItem);
      onUpdate(`whatWeDo.${list}`, items);
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
      id="what-we-do" 
      data-section-key={sectionKey}
      className={`py-20 lg:py-32 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{backgroundColor: content.backgroundColor}}
    >
       {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção "O que fazemos"', [
              { path: 'whatWeDo.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'whatWeDo.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'whatWeDo.cardBackgroundColor', label: 'Cor de Fundo do Card', value: content.cardBackgroundColor, type: 'color' },
              { path: 'whatWeDo.cardTitleColor', label: 'Cor do Título do Card', value: content.cardTitleColor, type: 'color' },
              { path: 'whatWeDo.cardTextColor', label: 'Cor do Texto do Card', value: content.cardTextColor, type: 'color' },
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
      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
          <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={content.pretitleStyle}
            onUpdate={onUpdate}
            path="whatWeDo.pretitleStyle"
          >
            <h2 
              className="font-light uppercase tracking-wide text-base md:text-lg lg:text-xl"
              style={{ color: content.pretitleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Pré-título', [
                { path: 'whatWeDo.pretitle', label: 'Pré-título', value: content.pretitle, type: 'text' },
                { path: 'whatWeDo.pretitleColor', label: 'Cor do Pré-título', value: content.pretitleColor, type: 'color' },
              ])}
            >{content.pretitle}</h2>
          </EditableWrapper>
          <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={content.titleStyle}
            onUpdate={onUpdate}
            path="whatWeDo.titleStyle"
            className="mt-4"
          >
            <p 
              className="font-semibold text-4xl sm:text-5xl"
              style={{ color: content.titleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título', [
                { path: 'whatWeDo.title', label: 'Título', value: content.title, type: 'text' },
                { path: 'whatWeDo.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
              ])}
            >{content.title}</p>
          </EditableWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((service, index) => (
            <div 
                 key={index}
                 draggable={isEditMode}
                 onDragStart={(e) => handleDragStart(e, index, 'services')}
                 onDragOver={handleDragOver}
                 onDragEnter={(e) => handleDragEnter(e, index, 'services')}
                 onDragLeave={handleDragLeave}
                 onDrop={(e) => handleDrop(e, index, 'services')}
                 onDragEnd={handleDragEnd}
                 className={`p-8 rounded-lg flex flex-col justify-between relative group transition-all duration-200 ${draggedIndex?.list === 'services' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'services' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                 style={{ 
                   backgroundColor: content.cardBackgroundColor,
                   cursor: isEditMode ? 'grab' : 'default',
                 }}
                 data-editable={isEditMode}
                 onClick={() => isEditMode && onOpenModal(`Editando Serviço ${index + 1}`, 
                    [
                      { path: `whatWeDo.services[${index}].name`, label: 'Nome do Serviço', value: service.name, type: 'text' },
                      { path: `whatWeDo.services[${index}].description`, label: 'Descrição do Serviço', value: service.description, type: 'textarea' },
                    ],
                    () => {
                      if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
                        onUpdate('whatWeDo.services', index, 'DELETE_ITEM');
                        onCloseModal();
                      }
                    },
                    () => {
                        onUpdate('whatWeDo.services', service, 'ADD_ITEM');
                        onCloseModal();
                    }
                  )}
            >
              <div>
                <h3 
                    className="font-semibold text-lg md:text-xl"
                    style={{ color: content.cardTitleColor }}
                >{service.name}</h3>
                <p 
                    className="mt-4 text-base font-light"
                    style={{ color: content.cardTextColor }}
                >{service.description}</p>
              </div>
            </div>
          ))}
          {isEditMode && <AddItemButton onClick={() => onUpdate('whatWeDo.services', newContentDefaults.service, 'ADD_ITEM')} />}
        </div>
        <div className="mt-16 space-y-6">
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
                    onDragStart={(e) => handleDragStart(e, index, 'customBlocks')}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index, 'customBlocks')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index, 'customBlocks')}
                    onDragEnd={handleDragEnd}
                    className={`${draggedIndex?.list === 'customBlocks' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'customBlocks' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;