import React, { useState } from 'react';
import { AddItemButton } from './shared/AddItemButton';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface Project {
    name: string;
    category: string;
    imageUrl: string;
}

interface FeaturedWorkContent {
    show: boolean;
    title: string;
    titleStyle: any;
    ctaButton: {
        text: string;
        href: string;
    };
    ctaButtonStyle: any;
    projects: Project[];
    backgroundColor: string;
    titleColor: string;
    ctaBorderColor: string;
    ctaTextColor: string;
    ctaHoverBackgroundColor: string;
    ctaHoverTextColor: string;
    titleFontSize: string;
    customBlocks?: any[];
}

interface FeaturedWorkProps {
    content: FeaturedWorkContent;
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

const FeaturedWork: React.FC<FeaturedWorkProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
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
            const items = [...(list === 'projects' ? content.projects : (content.customBlocks || []))];
            const [reorderedItem] = items.splice(draggedIndex.index, 1);
            items.splice(dropIndex, 0, reorderedItem);
            onUpdate(`featuredWork.${list}`, items);
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
            id="featured-work"
            data-section-key={sectionKey}
            className={`py-20 lg:py-32 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
            style={{ backgroundColor: content.backgroundColor }}
        >
             {isEditMode && (
                <SectionControls
                    onEdit={() => onOpenModal('Editando Seção "Trabalhos em Destaque"', [
                        { path: 'featuredWork.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
                        { path: 'featuredWork.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
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
                    path="featuredWork.titleStyle"
                >
                    <h2 
                        className="font-bold text-center mb-12 lg:mb-20 text-4xl sm:text-5xl"
                        style={{ color: content.titleColor }}
                        data-editable={isEditMode}
                        onClick={() => isEditMode && onOpenModal('Editando Título', [
                          { path: 'featuredWork.title', label: 'Título', value: content.title, type: 'text' },
                          { path: 'featuredWork.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                        ])}
                    >
                        {content.title}
                    </h2>
                </EditableWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {content.projects.map((project, index) => (
                        <div 
                            key={index} 
                            draggable={isEditMode}
                            onDragStart={(e) => handleDragStart(e, index, 'projects')}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, index, 'projects')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index, 'projects')}
                            onDragEnd={handleDragEnd}
                            className={`group relative overflow-hidden rounded-lg transition-all duration-200 ${draggedIndex?.list === 'projects' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'projects' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                            style={{ cursor: isEditMode ? 'grab' : 'default' }}
                        >
                            <div 
                                data-editable-img={isEditMode} 
                                onClick={() => isEditMode && onOpenModal(`Editando Projeto: ${project.name}`, 
                                  [
                                    { path: `featuredWork.projects[${index}].imageUrl`, label: 'URL da Imagem', value: project.imageUrl, type: 'image' },
                                    { path: `featuredWork.projects[${index}].name`, label: 'Nome do Projeto', value: project.name, type: 'text' },
                                    { path: `featuredWork.projects[${index}].category`, label: 'Categoria', value: project.category, type: 'text' }
                                  ],
                                  () => {
                                    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
                                      onUpdate('featuredWork.projects', index, 'DELETE_ITEM');
                                      onCloseModal();
                                    }
                                  },
                                  () => {
                                      onUpdate('featuredWork.projects', project, 'ADD_ITEM');
                                      onCloseModal();
                                  }
                                )}
                                className="w-full h-full"
                            >
                                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                  <p className="text-gray-300 text-sm">{project.category}</p>
                                  <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 {isEditMode && <div className="text-center mt-8"><AddItemButton onClick={() => onUpdate('featuredWork.projects', newContentDefaults.project, 'ADD_ITEM')} text="Add Project" /></div>}
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
                        path="featuredWork.ctaButtonStyle"
                        className="inline-block"
                    >
                        <div
                          data-editable={isEditMode}
                          onClick={() => isEditMode && onOpenModal('Editando Botão CTA', [
                            { path: 'featuredWork.ctaButton.text', label: 'Texto do Botão', value: content.ctaButton.text, type: 'text' },
                            { path: 'featuredWork.ctaButton.href', label: 'Link do Botão', value: content.ctaButton.href, type: 'text' },
                            { path: 'featuredWork.ctaBorderColor', label: 'Cor da Borda', value: content.ctaBorderColor, type: 'color' },
                            { path: 'featuredWork.ctaTextColor', label: 'Cor do Texto', value: content.ctaTextColor, type: 'color' },
                            { path: 'featuredWork.ctaHoverBackgroundColor', label: 'Cor de Fundo (Hover)', value: content.ctaHoverBackgroundColor, type: 'color' },
                            { path: 'featuredWork.ctaHoverTextColor', label: 'Cor do Texto (Hover)', value: content.ctaHoverTextColor, type: 'color' },
                          ])}
                        >
                          <a 
                              href={content.ctaButton.href} 
                              onClick={e => { if (isEditMode) e.preventDefault(); }}
                              className="border font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                              style={{ borderColor: content.ctaBorderColor, color: content.ctaTextColor }}
                              onMouseOver={e => { e.currentTarget.style.backgroundColor = content.ctaHoverBackgroundColor; e.currentTarget.style.color = content.ctaHoverTextColor; }}
                              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = content.ctaTextColor; }}
                          >
                               <span>{content.ctaButton.text}</span>
                          </a>
                        </div>
                    </EditableWrapper>
                </div>
            </div>
        </section>
    );
};

export default FeaturedWork;