import React, { useState } from 'react';
import { RightArrowIcon } from './icons/RightArrowIcon';
import { AddItemButton } from './shared/AddItemButton';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface Feature {
    title: string;
    description: string;
}

interface WhyUsContent {
    show: boolean;
    imageUrl: string;
    imageStyle: any;
    title: string;
    titleStyle: any;
    ctaButton: {
        text: string;
        href: string;
    };
    ctaButtonStyle: any;
    features: Feature[];
    backgroundColor: string;
    titleColor: string;
    ctaBackgroundColor: string;
    ctaTextColor: string;
    cardBackgroundColor: string;
    cardTitleColor: string;
    cardTextColor: string;
    cardAccentColor: string;
    titleFontSize: string;
    cardTitleFontSize: string;
    customBlocks?: any[];
}

interface WhyUsProps {
    content: WhyUsContent;
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

const WhyUs: React.FC<WhyUsProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
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
            const items = [...(list === 'features' ? content.features : (content.customBlocks || []))];
            const [reorderedItem] = items.splice(draggedIndex.index, 1);
            items.splice(dropIndex, 0, reorderedItem);
            onUpdate(`whyUs.${list}`, items);
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
            id="why-us" 
            data-section-key={sectionKey}
            className={`py-20 lg:py-32 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
            style={{ backgroundColor: content.backgroundColor }}
        >
             {isEditMode && (
                <SectionControls
                    onEdit={() => onOpenModal('Editando Seção "Por que nós"', [
                      { path: 'whyUs.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
                      { path: 'whyUs.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
                      { path: 'whyUs.cardBackgroundColor', label: 'Cor de Fundo do Card', value: content.cardBackgroundColor, type: 'color' },
                      { path: 'whyUs.cardTitleColor', label: 'Cor do Título do Card', value: content.cardTitleColor, type: 'color' },
                      { path: 'whyUs.cardTextColor', label: 'Cor do Texto do Card', value: content.cardTextColor, type: 'color' },
                      { path: 'whyUs.cardAccentColor', label: 'Cor de Destaque do Card', value: content.cardAccentColor, type: 'color' },
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
                    isResizable={true}
                    style={content.imageStyle}
                    onUpdate={onUpdate}
                    path="whyUs.imageStyle"
                    className="mb-12"
                >
                    <div 
                        data-editable-img={isEditMode}
                        onClick={() => isEditMode && onOpenModal('Editando Imagem', [
                          { path: 'whyUs.imageUrl', label: 'URL da Imagem', value: content.imageUrl, type: 'image' }
                        ])}
                    >
                        <img 
                            loading="lazy" 
                            decoding="async" 
                            src={content.imageUrl}
                            alt="Artistic depiction of hands" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </EditableWrapper>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <EditableWrapper
                            isEditMode={isEditMode}
                            isDraggable={true}
                            isResizable={false}
                            style={content.titleStyle}
                            onUpdate={onUpdate}
                            path="whyUs.titleStyle"
                        >
                            <h2 
                                className="font-semibold text-4xl sm:text-5xl"
                                style={{ color: content.titleColor }}
                                data-editable={isEditMode}
                                onClick={() => isEditMode && onOpenModal('Editando Título', [
                                  { path: 'whyUs.title', label: 'Título', value: content.title, type: 'text' },
                                  { path: 'whyUs.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                                ])}
                            >{content.title}</h2>
                        </EditableWrapper>
                        <EditableWrapper
                            isEditMode={isEditMode}
                            isDraggable={true}
                            isResizable={false}
                            style={content.ctaButtonStyle}
                            onUpdate={onUpdate}
                            path="whyUs.ctaButtonStyle"
                            className="inline-block"
                        >
                             <div
                                data-editable={isEditMode}
                                onClick={() => isEditMode && onOpenModal('Editando Botão CTA', [
                                  { path: 'whyUs.ctaButton.text', label: 'Texto do Botão', value: content.ctaButton.text, type: 'text' },
                                  { path: 'whyUs.ctaButton.href', label: 'Link do Botão', value: content.ctaButton.href, type: 'text' },
                                  { path: 'whyUs.ctaBackgroundColor', label: 'Cor de Fundo do Botão', value: content.ctaBackgroundColor, type: 'color' },
                                  { path: 'whyUs.ctaTextColor', label: 'Cor do Texto do Botão', value: content.ctaTextColor, type: 'color' },
                                ])}
                             >
                                <a 
                                    href={content.ctaButton.href} 
                                    onClick={e => { if (isEditMode) e.preventDefault(); }}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-3 text-sm font-bold uppercase px-8 py-3 rounded-md hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: content.ctaBackgroundColor, color: content.ctaTextColor }}
                                >
                                    <span>{content.ctaButton.text}</span>
                                    <RightArrowIcon className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </EditableWrapper>
                    </div>
                    <div className="lg:col-span-2 grid md:grid-cols-1 gap-6">
                        {content.features.map((feature, index) => (
                            <div 
                                key={index} 
                                draggable={isEditMode}
                                onDragStart={(e) => handleDragStart(e, index, 'features')}
                                onDragOver={handleDragOver}
                                onDragEnter={(e) => handleDragEnter(e, index, 'features')}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index, 'features')}
                                onDragEnd={handleDragEnd}
                                className={`p-6 rounded-md relative group transition-all duration-200 ${draggedIndex?.list === 'features' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'features' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`} 
                                style={{ 
                                    backgroundColor: content.cardBackgroundColor, 
                                    color: content.cardTextColor,
                                    cursor: isEditMode ? 'grab' : 'default',
                                }}
                                data-editable={isEditMode}
                                onClick={() => isEditMode && onOpenModal(`Editando Característica ${index + 1}`, 
                                  [
                                    { path: `whyUs.features[${index}].title`, label: 'Título da Característica', value: feature.title, type: 'text' },
                                    { path: `whyUs.features[${index}].description`, label: 'Descrição da Característica', value: feature.description, type: 'textarea' },
                                  ],
                                  () => {
                                    if (window.confirm('Tem certeza que deseja excluir esta característica?')) {
                                      onUpdate('whyUs.features', index, 'DELETE_ITEM');
                                      onCloseModal();
                                    }
                                  },
                                  () => {
                                      onUpdate('whyUs.features', feature, 'ADD_ITEM');
                                      onCloseModal();
                                  }
                                )}
                            >
                                <h3 
                                    className="font-semibold text-xl md:text-2xl"
                                    style={{ color: content.cardTitleColor }}
                                >{feature.title}</h3>
                                <hr className="w-1/3 border-t-2 my-4" style={{ borderColor: content.cardAccentColor }} />
                                <p 
                                    className="font-light"
                                >{feature.description}</p>
                            </div>
                        ))}
                        {isEditMode && <AddItemButton onClick={() => onUpdate('whyUs.features', newContentDefaults.feature, 'ADD_ITEM')} text="Add Feature" />}
                    </div>
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

export default WhyUs;