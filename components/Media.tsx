import React, { useState } from 'react';
import { AddItemButton } from './shared/AddItemButton';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface Article {
    href: string;
    imageUrl: string;
}

interface MediaContent {
    show: boolean;
    title: string;
    titleStyle: any;
    articles: Article[];
    backgroundColor: string;
    titleColor: string;
    titleFontSize: string;
    customBlocks?: any[];
}

interface MediaProps {
    content: MediaContent;
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

const Media: React.FC<MediaProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
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
             const items = [...(list === 'articles' ? content.articles : (content.customBlocks || []))];
            const [reorderedItem] = items.splice(draggedIndex.index, 1);
            items.splice(dropIndex, 0, reorderedItem);
            onUpdate(`media.${list}`, items);
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
            id="media" 
            data-section-key={sectionKey}
            className={`py-20 lg:py-32 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
            style={{ backgroundColor: content.backgroundColor }}
        >
             {isEditMode && (
                <SectionControls
                    onEdit={() => onOpenModal('Editando Seção "Mídia"', [
                        { path: 'media.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
                        { path: 'media.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
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
                    path="media.titleStyle"
                >
                    <h2 
                        className="font-semibold text-center mb-12 lg:mb-20 text-4xl sm:text-5xl"
                        style={{ color: content.titleColor }}
                        data-editable={isEditMode}
                        onClick={() => isEditMode && onOpenModal('Editando Título', [
                          { path: 'media.title', label: 'Título', value: content.title, type: 'text' },
                          { path: 'media.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                        ])}
                    >
                        {content.title}
                    </h2>
                </EditableWrapper>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
                    {content.articles.map((article, index) => (
                        <div 
                            key={index}
                            draggable={isEditMode}
                            onDragStart={(e) => handleDragStart(e, index, 'articles')}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, index, 'articles')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index, 'articles')}
                            onDragEnd={handleDragEnd}
                            className={`relative group transition-all duration-200 bg-white p-2 rounded-lg shadow-md hover:shadow-xl ${draggedIndex?.list === 'articles' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'articles' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                            style={{ cursor: isEditMode ? 'grab' : 'default' }}
                        >
                             <div 
                                data-editable-img={isEditMode}
                                onClick={() => isEditMode && onOpenModal(`Editando Artigo da Mídia ${index + 1}`, 
                                    [
                                        { path: `media.articles[${index}].imageUrl`, label: 'URL da Imagem', value: article.imageUrl, type: 'image' },
                                        { path: `media.articles[${index}].href`, label: 'Link do Artigo', value: article.href, type: 'text' }
                                    ],
                                    () => {
                                        if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
                                            onUpdate('media.articles', index, 'DELETE_ITEM');
                                            onCloseModal();
                                        }
                                    },
                                    () => {
                                        onUpdate('media.articles', article, 'ADD_ITEM');
                                        onCloseModal();
                                    }
                                )}
                            >
                                <a href={article.href} onClick={(e) => { if(isEditMode) e.preventDefault()}} target="_blank" rel="noopener noreferrer" className="block">
                                    <img 
                                        src={article.imageUrl} 
                                        alt={`Media article ${index + 1}`} 
                                        className="w-full object-contain transition-transform duration-300 group-hover:scale-105" 
                                    />
                                </a>
                            </div>
                        </div>
                    ))}
                    {isEditMode && <AddItemButton size="sm" onClick={() => onUpdate('media.articles', newContentDefaults.article, 'ADD_ITEM')} />}
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

export default Media;