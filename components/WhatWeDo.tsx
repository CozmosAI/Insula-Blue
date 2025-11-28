
import React, { useState } from 'react';
import { SectionControls } from './shared/SectionControls';
import { AddItemButton } from './shared/AddItemButton';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';
import * as ServiceIcons from './icons/ServiceIcons';

type IconName = keyof typeof ServiceIcons;

interface Service {
  icon: IconName;
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
  cardBorderColor: string;
  cardHoverBorderColor: string;
  iconColor: string;
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

  const handleDragStart = (e: React.DragEvent, absoluteIndex: number, list: string) => {
    if (!isEditMode) return;
    setDraggedIndex({ list, index: absoluteIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, absoluteIndex: number, list: string) => {
    if (!isEditMode || (draggedIndex && draggedIndex.index === absoluteIndex && draggedIndex.list === list)) return;
    e.preventDefault();
    setDragOverIndex({ list, index: absoluteIndex });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropAbsoluteIndex: number, list: string) => {
    if (!isEditMode || draggedIndex === null || draggedIndex.list !== list) return;
    e.preventDefault();

    if (draggedIndex.index !== dropAbsoluteIndex) {
      const items = [...(list === 'services' ? content.services : (content.customBlocks || []))];
      const [reorderedItem] = items.splice(draggedIndex.index, 1);
      items.splice(dropAbsoluteIndex, 0, reorderedItem);
      onUpdate(`whatWeDo.${list}`, items);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  const gridClasses = `grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;

  return (
    <section 
      id="what-we-do" 
      data-section-key={sectionKey}
      className={`scroll-animate py-12 lg:py-20 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
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
              { path: 'whatWeDo.cardBorderColor', label: 'Cor da Borda do Card', value: content.cardBorderColor, type: 'color' },
              { path: 'whatWeDo.cardHoverBorderColor', label: 'Cor da Borda do Card (Hover)', value: content.cardHoverBorderColor, type: 'color' },
              { path: 'whatWeDo.iconColor', label: 'Cor do Ícone', value: content.iconColor, type: 'color' },
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
            className="scroll-animate"
          >
            <h2 
              className="font-light uppercase tracking-wide text-base md:text-lg lg:text-xl"
              style={{ color: content.pretitleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Pré-título', [
                { path: 'whatWeDo.pretitle', label: 'Pré-título', value: content.pretitle, type: 'text' },
                { path: 'whatWeDo.pretitleColor', label: 'Cor do Pré-título', value: content.pretitleColor, type: 'color' },
              ])}
              dangerouslySetInnerHTML={{ __html: content.pretitle }}
            />
          </EditableWrapper>
          <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={{...content.titleStyle, transitionDelay: '150ms'}}
            onUpdate={onUpdate}
            path="whatWeDo.titleStyle"
            className="mt-4 scroll-animate"
          >
            <p 
              className="font-semibold text-4xl sm:text-5xl"
              style={{ color: content.titleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título', [
                { path: 'whatWeDo.title', label: 'Título', value: content.title, type: 'text' },
                { path: 'whatWeDo.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
              ])}
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
          </EditableWrapper>
        </div>
        <div className={gridClasses}>
          {content.services.map((service, index) => {
              const absoluteIndex = index;
              const getIconComponent = (iconName: string): React.FC => {
                const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1) + 'Icon';
                return (ServiceIcons as any)[capitalized] || ServiceIcons.DefaultIcon;
              };
              const IconComponent = getIconComponent(service.icon);
              
              return (
                <div 
                    key={absoluteIndex}
                    draggable={isEditMode}
                    onDragStart={(e) => handleDragStart(e, absoluteIndex, 'services')}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, absoluteIndex, 'services')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, absoluteIndex, 'services')}
                    onDragEnd={handleDragEnd}
                    onMouseMove={handleCardMouseMove}
                    className={`service-card p-8 rounded-lg flex flex-col relative group transition-all duration-300 hover:-translate-y-1 border-2 scroll-animate ${draggedIndex?.list === 'services' && draggedIndex.index === absoluteIndex ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'services' && dragOverIndex.index === absoluteIndex ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                    style={{ 
                      backgroundColor: content.cardBackgroundColor,
                      borderColor: content.cardBorderColor,
                      cursor: isEditMode ? 'grab' : 'default',
                      transitionDelay: `${index * 100}ms`
                    }}
                    onMouseEnter={(e) => { if (!isEditMode) e.currentTarget.style.borderColor = content.cardHoverBorderColor; }}
                    onMouseLeave={(e) => { if (!isEditMode) e.currentTarget.style.borderColor = content.cardBorderColor; }}
                    data-editable={isEditMode}
                    onClick={() => isEditMode && onOpenModal(`Editando Serviço ${absoluteIndex + 1}`, 
                        [
                          { path: `whatWeDo.services[${absoluteIndex}].icon`, label: 'Nome do Ícone', value: service.icon, type: 'text' },
                          { path: `whatWeDo.services[${absoluteIndex}].name`, label: 'Nome do Serviço', value: service.name, type: 'text' },
                          { path: `whatWeDo.services[${absoluteIndex}].description`, label: 'Descrição do Serviço', value: service.description, type: 'textarea' },
                        ],
                        () => {
                          if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
                            onUpdate('whatWeDo.services', absoluteIndex, 'DELETE_ITEM');
                            onCloseModal();
                          }
                        },
                        () => {
                            onUpdate('whatWeDo.services', service, 'ADD_ITEM');
                            onCloseModal();
                        }
                      )}
                >
                  <div style={{ color: content.iconColor }}>
                    <IconComponent />
                  </div>
                  <div className="flex-grow">
                    <h3 
                        className="font-semibold text-xl"
                        style={{ color: content.cardTitleColor }}
                        dangerouslySetInnerHTML={{ __html: service.name }}
                    />
                    <ul 
                        className="mt-4 text-base font-light space-y-2"
                        style={{ color: content.cardTextColor }}
                    >
                      {service.description.split('\n').filter(line => line.trim().startsWith('•')).map((line, i) => (
                        <li key={i} className="flex items-start">
                           <span className="mr-2 mt-1 text-lg leading-none" style={{ color: content.iconColor }}>•</span>
                           <span dangerouslySetInnerHTML={{ __html: line.replace('•', '').trim() }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}

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
                    className={`scroll-animate ${draggedIndex?.list === 'customBlocks' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'customBlocks' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
