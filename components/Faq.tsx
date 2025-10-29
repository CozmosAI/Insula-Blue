import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { AddItemButton } from './shared/AddItemButton';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../../admin/EditModal';
import { EditableWrapper } from '../../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqContent {
    show: boolean;
    title: string;
    titleStyle: any;
    items: FaqItem[];
    backgroundColor: string;
    titleColor: string;
    questionColor: string;
    openQuestionColor: string;
    answerColor: string;
    titleFontSize: string;
    questionFontSize: string;
    customBlocks?: any[];
}

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
  isEditMode: boolean;
  onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
  onCloseModal: () => void;
  index: number;
  content: FaqContent;
  // FIX: Add onUpdate to props to make it available in the component.
  onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick, isEditMode, onOpenModal, onCloseModal, index, content, onUpdate }) => {
  return (
    <div className="border-b border-gray-200 py-4 relative group">
      <div
        onClick={() => {
            if (isEditMode) {
                onOpenModal(`Editando Pergunta ${index + 1}`, 
                  [
                    { path: `faq.items[${index}].question`, label: 'Pergunta', value: item.question, type: 'text' },
                    { path: `faq.items[${index}].answer`, label: 'Resposta', value: item.answer, type: 'textarea' }
                  ],
                  () => {
                    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
                      // FIX: 'onUpdate' was not defined. It's now passed as a prop.
                      onUpdate('faq.items', index, 'DELETE_ITEM');
                      onCloseModal();
                    }
                  },
                  () => {
                      // FIX: 'onUpdate' was not defined. It's now passed as a prop.
                      onUpdate('faq.items', item, 'ADD_ITEM');
                      onCloseModal();
                  }
                );
            } else {
                onClick();
            }
        }}
        className="w-full flex justify-between items-center text-left cursor-pointer"
        data-editable={isEditMode}
      >
        <h3 
            className="font-medium text-lg md:text-xl"
            style={{ 
              color: isOpen ? content.openQuestionColor : content.questionColor,
            }}
        >
          {item.question}
        </h3>
        <span>{isOpen ? <MinusIcon color={content.openQuestionColor} /> : <PlusIcon />}</span>
      </div>
      {isOpen && !isEditMode && (
        <div className="mt-4">
          <p style={{ color: content.answerColor }}>{item.answer}</p>
        </div>
      )}
    </div>
  );
};


const Faq: React.FC<{ 
    content: FaqContent; 
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
}> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [draggedIndex, setDraggedIndex] = useState<{ list: string, index: number } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<{ list: string, index: number } | null>(null);

    const handleToggle = (index: number) => {
        if (isEditMode) return;
        setOpenIndex(openIndex === index ? null : index);
    };

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
        const items = [...(list === 'items' ? content.items : (content.customBlocks || []))];
        const [reorderedItem] = items.splice(draggedIndex.index, 1);
        items.splice(dropIndex, 0, reorderedItem);
        onUpdate(`faq.${list}`, items);
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
      id="faq" 
      data-section-key={sectionKey}
      className={`py-20 lg:py-32 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{ backgroundColor: content.backgroundColor }}
    >
       {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Estilos do FAQ', [
              { path: 'faq.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'faq.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'faq.questionColor', label: 'Cor da Pergunta', value: content.questionColor, type: 'color' },
              { path: 'faq.openQuestionColor', label: 'Cor da Pergunta (Aberta)', value: content.openQuestionColor, type: 'color' },
              { path: 'faq.answerColor', label: 'Cor da Resposta', value: content.answerColor, type: 'color' },
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
        <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={content.titleStyle}
            onUpdate={onUpdate}
            path="faq.titleStyle"
        >
            <h2 
                className="font-semibold text-center mb-12 lg:mb-20 text-4xl sm:text-5xl"
                style={{ color: content.titleColor }}
                data-editable={isEditMode}
                onClick={() => isEditMode && onOpenModal('Editando Título do FAQ', [
                  { path: 'faq.title', label: 'Título', value: content.title, type: 'text' },
                  { path: 'faq.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                ])}
            >
              {content.title}
            </h2>
        </EditableWrapper>
        <div className="max-w-3xl mx-auto">
          {content.items.map((item, index) => (
            <div
              key={index}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, index, 'items')}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, index, 'items')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index, 'items')}
              onDragEnd={handleDragEnd}
              style={{ cursor: isEditMode ? 'grab' : 'default' }}
              className={`transition-all duration-200 ${draggedIndex?.list === 'items' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'items' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2 rounded-md' : ''}`}
            >
              <AccordionItem
                item={item}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
                isEditMode={isEditMode}
                onUpdate={onUpdate}
                onOpenModal={(title, fields, onDelete, onClone) => onOpenModal(title, fields, onDelete, onClone)}
                onCloseModal={onCloseModal}
                index={index}
                content={content}
              />
            </div>
          ))}
          {isEditMode && <AddItemButton onClick={() => onUpdate('faq.items', newContentDefaults.faqItem, 'ADD_ITEM')} />}
        </div>
        <div className="max-w-3xl mx-auto mt-16 space-y-6">
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

export default Faq;