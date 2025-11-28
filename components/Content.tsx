
import React, { useState } from 'react';
import { SectionControls } from './shared/SectionControls';
import { AddItemButton } from './shared/AddItemButton';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { RightArrowIcon } from './icons/RightArrowIcon';

interface ContentItem {
  icon: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

interface ContentSection {
  show: boolean;
  title: string;
  subtitle: string;
  items: ContentItem[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  cardBackgroundColor: string;
  cardTitleColor: string;
  cardTextColor: string;
  cardLinkColor: string;
  iconColor: string;
  hoverBorderColor: string;
  titleStyle: any;
}

interface ContentProps {
    content: ContentSection;
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

const MentorshipIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const EventsIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path>
    <path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>
  </svg>
);

const MaterialsIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const iconMap: { [key: string]: React.ElementType } = {
  mentorship: MentorshipIcon,
  events: EventsIcon,
  materials: MaterialsIcon,
};


const Content: React.FC<ContentProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
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
      const items = [...content.items];
      const [reorderedItem] = items.splice(draggedIndex, 1);
      items.splice(dropIndex, 0, reorderedItem);
      onUpdate('content.items', items);
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
      id="content" 
      data-section-key={sectionKey}
      className={`scroll-animate py-12 lg:py-20 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{backgroundColor: content.backgroundColor}}
    >
       {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção "Conteúdos"', [
              { path: 'content.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'content.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'content.subtitleColor', label: 'Cor do Subtítulo', value: content.subtitleColor, type: 'color' },
              { path: 'content.cardBackgroundColor', label: 'Cor de Fundo do Card', value: content.cardBackgroundColor, type: 'color' },
              { path: 'content.cardTitleColor', label: 'Cor do Título do Card', value: content.cardTitleColor, type: 'color' },
              { path: 'content.cardTextColor', label: 'Cor do Texto do Card', value: content.cardTextColor, type: 'color' },
              { path: 'content.iconColor', label: 'Cor do Ícone', value: content.iconColor, type: 'color' },
              { path: 'content.cardLinkColor', label: 'Cor do Link do Card', value: content.cardLinkColor, type: 'color' },
              { path: 'content.hoverBorderColor', label: 'Cor da Borda (Hover)', value: content.hoverBorderColor, type: 'color' },
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
            style={content.titleStyle}
            onUpdate={onUpdate}
            path="content.titleStyle"
            className="scroll-animate"
          >
            <h2 
              className="font-semibold text-4xl sm:text-5xl"
              style={{ color: content.titleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título', [
                { path: 'content.title', label: 'Título', value: content.title, type: 'text' },
                { path: 'content.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
              ])}
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
          </EditableWrapper>
          <div 
            className="scroll-animate"
            style={{ transitionDelay: '150ms' }}
            data-editable={isEditMode}
            onClick={() => isEditMode && onOpenModal('Editando Subtítulo', [
              { path: 'content.subtitle', label: 'Subtítulo', value: content.subtitle, type: 'textarea' },
              { path: 'content.subtitleColor', label: 'Cor do Subtítulo', value: content.subtitleColor, type: 'color' },
            ])}
          >
             <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: content.subtitleColor }} dangerouslySetInnerHTML={{ __html: content.subtitle }} />
          </div>
        </div>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <div 
                key={index}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-8 rounded-lg flex flex-col relative group transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden scroll-animate ${draggedIndex === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{ 
                  backgroundColor: content.cardBackgroundColor,
                  cursor: isEditMode ? 'grab' : 'default',
                  transitionDelay: `${(index + 2) * 100}ms`
                }}
                data-editable={isEditMode}
                onClick={() => isEditMode && onOpenModal(`Editando Card: ${item.title}`, 
                    [
                      { path: `content.items[${index}].icon`, label: 'Ícone (mentorship, events, materials)', value: item.icon, type: 'text' },
                      { path: `content.items[${index}].title`, label: 'Título do Card', value: item.title, type: 'text' },
                      { path: `content.items[${index}].description`, label: 'Descrição', value: item.description, type: 'textarea' },
                      { path: `content.items[${index}].ctaText`, label: 'Texto do Botão', value: item.ctaText, type: 'text' },
                      { path: `content.items[${index}].ctaHref`, label: 'Link do Botão', value: item.ctaHref, type: 'text' },
                    ],
                    () => {
                      if (window.confirm('Tem certeza que deseja excluir este card?')) {
                        onUpdate('content.items', index, 'DELETE_ITEM');
                        onCloseModal();
                      }
                    },
                    () => {
                        onUpdate('content.items', item, 'ADD_ITEM');
                        onCloseModal();
                    }
                  )}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100 origin-left" style={{ backgroundColor: content.hoverBorderColor }}></div>
                <div className="mb-6" style={{ color: content.iconColor }}>
                  {Icon && <Icon className="w-12 h-12" />}
                </div>
                <div className="flex-grow">
                  <h3 
                      className="font-semibold text-lg md:text-xl uppercase"
                      style={{ color: content.cardTitleColor }}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                  <p 
                      className="mt-4 text-base font-light"
                      style={{ color: content.cardTextColor, whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
                <div className="mt-auto pt-8">
                  <a
                    href={item.ctaHref}
                    onClick={(e) => {
                      if (isEditMode) e.preventDefault();
                      if (item.ctaHref.startsWith('#')) {
                        e.preventDefault();
                        document.querySelector(item.ctaHref)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    target={item.ctaHref.startsWith('#') ? '' : '_blank'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all duration-300 text-sm"
                    style={{ color: content.cardLinkColor }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: item.ctaText }} />
                    <RightArrowIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}
          {isEditMode && <AddItemButton onClick={() => onUpdate('content.items', newContentDefaults.contentItem, 'ADD_ITEM')} />}
        </div>
      </div>
    </section>
  );
};

export default Content;
