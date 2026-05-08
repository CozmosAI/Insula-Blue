import React, { useState } from 'react';
import { RightArrowIcon } from './icons/RightArrowIcon';
import { Step1Icon, Step2Icon, Step3Icon, Step4Icon } from './icons/StepIcons';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

const stepIcons = [
    <Step1Icon />,
    <Step2Icon />,
    <Step3Icon />,
    <Step4Icon />
];

interface Step {
    title: string;
    description: string;
}

interface HowItWorksContent {
    show: boolean;
    pretitle: string;
    titleStart: string;
    titleAccent: string;
    description: string;
    steps: Step[];
    ctaButton: {
        text: string;
        href: string;
    };
    backgroundColor: string;
    pretitleColor: string;
    titleColor: string;
    titleAccentColor: string;
    descriptionColor: string;
    stepCardBackgroundColor: string;
    stepTitleColor: string;
    stepDescriptionColor: string;
    ctaBackgroundColor: string;
    ctaTextColor: string;
    pretitleFontSize: string;
    titleFontSize: string;
    descriptionFontSize: string;
    stepTitleFontSize: string;
    pretitleStyle: any;
    titleStyle: any;
    descriptionStyle: any;
    ctaButtonStyle: any;
    customBlocks?: any[];
}

interface HowItWorksProps {
    content: HowItWorksContent;
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

const HowItWorks: React.FC<HowItWorksProps> = ({ content, isEditMode, onUpdate, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
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
      const items = [...(list === 'steps' ? content.steps : (content.customBlocks || []))];
      const [reorderedItem] = items.splice(draggedIndex.index, 1);
      items.splice(dropIndex, 0, reorderedItem);
      onUpdate(`howItWorks.${list}`, items);
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
      id="how-it-works" 
      data-section-key={sectionKey}
      className={`py-20 lg:py-32 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{ backgroundColor: content.backgroundColor }}
    >
      {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção "Como funciona"', [
              { path: 'howItWorks.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'howItWorks.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'howItWorks.stepCardBackgroundColor', label: 'Cor de Fundo da Etapa', value: content.stepCardBackgroundColor, type: 'color' },
              { path: 'howItWorks.stepTitleColor', label: 'Cor do Título da Etapa', value: content.stepTitleColor, type: 'color' },
              { path: 'howItWorks.stepDescriptionColor', label: 'Cor da Descrição da Etapa', value: content.stepDescriptionColor, type: 'color' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
                 <EditableWrapper
                    isEditMode={isEditMode}
                    isDraggable={true}
                    isResizable={false}
                    style={content.pretitleStyle}
                    onUpdate={onUpdate}
                    path="howItWorks.pretitleStyle"
                 >
                    <p 
                      className="uppercase tracking-widest font-light mb-4 text-base md:text-lg"
                      style={{ color: content.pretitleColor }}
                      data-editable={isEditMode}
                      onClick={() => isEditMode && onOpenModal('Editando Pré-título', [
                        { path: 'howItWorks.pretitle', label: 'Pré-título', value: content.pretitle, type: 'text' },
                        { path: 'howItWorks.pretitleColor', label: 'Cor do Pré-título', value: content.pretitleColor, type: 'color' },
                      ])}
                   >{content.pretitle}</p>
                 </EditableWrapper>
                 <EditableWrapper
                    isEditMode={isEditMode}
                    isDraggable={true}
                    isResizable={false}
                    style={content.titleStyle}
                    onUpdate={onUpdate}
                    path="howItWorks.titleStyle"
                 >
                    <h2 
                      className="font-semibold leading-tight text-3xl sm:text-4xl lg:text-5xl"
                      style={{ color: content.titleColor }}
                      data-editable={isEditMode}
                      onClick={() => isEditMode && onOpenModal('Editando Título', [
                        { path: 'howItWorks.titleStart', label: 'Início do Título', value: content.titleStart, type: 'text' },
                        { path: 'howItWorks.titleAccent', label: 'Destaque do Título', value: content.titleAccent, type: 'text' },
                        { path: 'howItWorks.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                        { path: 'howItWorks.titleAccentColor', label: 'Cor de Destaque do Título', value: content.titleAccentColor, type: 'color' },
                      ])}
                   >
                      <span>{content.titleStart}</span>
                      <span style={{ color: content.titleAccentColor }}>{content.titleAccent}</span>
                   </h2>
                 </EditableWrapper>
            </div>
            <div>
              <EditableWrapper
                isEditMode={isEditMode}
                isDraggable={true}
                isResizable={false}
                style={content.descriptionStyle}
                onUpdate={onUpdate}
                path="howItWorks.descriptionStyle"
              >
                  <p 
                      className="text-base md:text-lg"
                      style={{ color: content.descriptionColor }}
                      data-editable={isEditMode}
                      onClick={() => isEditMode && onOpenModal('Editando Descrição', [
                        { path: 'howItWorks.description', label: 'Descrição', value: content.description, type: 'textarea' },
                        { path: 'howItWorks.descriptionColor', label: 'Cor da Descrição', value: content.descriptionColor, type: 'color' },
                      ])}
                  >
                      {content.description}
                  </p>
                </EditableWrapper>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.steps.map((step, index) => (
            <div 
              key={index}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, index, 'steps')}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, index, 'steps')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index, 'steps')}
              onDragEnd={handleDragEnd}
              className={`p-6 rounded-md transition-all duration-200 ${draggedIndex?.list === 'steps' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'steps' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ backgroundColor: content.stepCardBackgroundColor, cursor: isEditMode ? 'grab' : 'default' }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal(`Editando Etapa ${index + 1}`, 
                [
                  { path: `howItWorks.steps[${index}].title`, label: 'Título da Etapa', value: step.title, type: 'text' },
                  { path: `howItWorks.steps[${index}].description`, label: 'Descrição da Etapa', value: step.description, type: 'textarea' },
                ],
                () => {
                    if (window.confirm('Tem certeza que deseja excluir esta etapa?')) {
                        onUpdate(`howItWorks.steps`, index, 'DELETE_ITEM');
                        onCloseModal();
                    }
                },
                () => {
                    onUpdate(`howItWorks.steps`, step, 'ADD_ITEM');
                    onCloseModal();
                }
              )}
            >
                <div className="flex items-center gap-4">
                    {stepIcons[index % stepIcons.length]}
                    <h3 
                        className="font-semibold text-xl"
                        style={{ color: content.stepTitleColor }}
                    >{step.title}</h3>
                </div>
              <p 
                className="mt-4 text-sm"
                style={{ color: content.stepDescriptionColor }}
              >{step.description}</p>
            </div>
          ))}
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
        
        <div className="text-center mt-16">
            <EditableWrapper
                isEditMode={isEditMode}
                isDraggable={true}
                isResizable={false}
                style={content.ctaButtonStyle}
                onUpdate={onUpdate}
                path="howItWorks.ctaButtonStyle"
                className="inline-block"
            >
               <div 
                  data-editable={isEditMode}
                  onClick={() => isEditMode && onOpenModal('Editando Botão CTA', [
                    { path: 'howItWorks.ctaButton.text', label: 'Texto do Botão', value: content.ctaButton.text, type: 'text' },
                    { path: 'howItWorks.ctaButton.href', label: 'Link do Botão', value: content.ctaButton.href, type: 'text' },
                    { path: 'howItWorks.ctaBackgroundColor', label: 'Cor de Fundo do Botão', value: content.ctaBackgroundColor, type: 'color' },
                    { path: 'howItWorks.ctaTextColor', label: 'Cor do Texto do Botão', value: content.ctaTextColor, type: 'color' }
                  ])}
                >
                  <a 
                    href={content.ctaButton.href} 
                    onClick={e => { if (isEditMode) e.preventDefault(); }}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-bold uppercase px-8 py-3 rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-3"
                    style={{ backgroundColor: content.ctaBackgroundColor, color: content.ctaTextColor }}
                  >
                    <span>{content.ctaButton.text}</span>
                    <RightArrowIcon className="w-3.5 h-3.5" />
                  </a>
              </div>
            </EditableWrapper>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;