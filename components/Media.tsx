
import React, { useState } from 'react';
import { AddItemButton } from './shared/AddItemButton';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';
import { MediaInstagramIcon } from './icons/MediaInstagramIcon';
import { MediaLinkedInIcon } from './icons/MediaLinkedInIcon';
import { HeartIcon } from './icons/HeartIcon';
import { CommentIcon } from './icons/CommentIcon';

interface MediaPost {
    href: string;
    imageUrl: string;
    platform: 'instagram' | 'linkedin';
    caption: string;
    likes: number;
    comments: number;
}

interface MediaContent {
    show: boolean;
    title: string;
    titleStyle: any;
    posts: MediaPost[];
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

const platformIcons = {
    instagram: <MediaInstagramIcon className="w-6 h-6 text-white" />,
    linkedin: <MediaLinkedInIcon className="w-6 h-6 text-white" />,
};

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
             const items = [...(list === 'posts' ? content.posts : (content.customBlocks || []))];
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
            className={`scroll-animate py-12 lg:py-20 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
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
                    className="scroll-animate"
                >
                    <h2 
                        className="font-semibold text-center mb-12 lg:mb-20 text-4xl sm:text-5xl"
                        style={{ color: content.titleColor }}
                        data-editable={isEditMode}
                        onClick={() => isEditMode && onOpenModal('Editando Título', [
                          { path: 'media.title', label: 'Título', value: content.title, type: 'text' },
                          { path: 'media.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                        ])}
                        dangerouslySetInnerHTML={{ __html: content.title }}
                    />
                </EditableWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {content.posts.map((post, index) => {
                         const isComingSoon = !post.href || post.href === '#';

                         if (isComingSoon && !isEditMode) {
                             return (
                                 <div 
                                    key={index}
                                    className="aspect-square relative flex flex-col justify-center items-center rounded-lg bg-gray-200 text-gray-500 text-center p-4 select-none"
                                 >
                                    <span className="font-semibold uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: post.caption || 'Em breve' }} />
                                 </div>
                             );
                         }

                         return (
                         <a 
                            key={index}
                            href={post.href} 
                            onClick={(e) => { if(isEditMode || isComingSoon) e.preventDefault()}} 
                            target={isComingSoon ? undefined : "_blank"}
                            rel={isComingSoon ? undefined : "noopener noreferrer"}
                            draggable={isEditMode}
                            onDragStart={(e) => handleDragStart(e, index, 'posts')}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, index, 'posts')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index, 'posts')}
                            onDragEnd={handleDragEnd}
                            className={`group aspect-square relative block overflow-hidden rounded-lg transition-all duration-200 scroll-animate ${draggedIndex?.list === 'posts' && draggedIndex.index === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex?.list === 'posts' && dragOverIndex.index === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                            style={{ cursor: isEditMode ? 'grab' : (isComingSoon ? 'default' : 'pointer'), transitionDelay: `${index * 100}ms` }}
                            data-editable-img={isEditMode}
                            onClickCapture={(e) => {
                                if (!isEditMode) return;
                                e.preventDefault();
                                e.stopPropagation();
                                onOpenModal(`Editando Publicação ${index + 1}`, 
                                    [
                                        { path: `media.posts[${index}].imageUrl`, label: 'URL da Imagem', value: post.imageUrl, type: 'image' },
                                        { path: `media.posts[${index}].href`, label: 'Link da Publicação', value: post.href, type: 'text' },
                                        { path: `media.posts[${index}].platform`, label: 'Plataforma (instagram ou linkedin)', value: post.platform, type: 'text' },
                                        { path: `media.posts[${index}].caption`, label: 'Legenda', value: post.caption, type: 'textarea' },
                                        { path: `media.posts[${index}].likes`, label: 'Curtidas', value: post.likes, type: 'text' },
                                        { path: `media.posts[${index}].comments`, label: 'Comentários', value: post.comments, type: 'text' },
                                    ],
                                    () => {
                                        if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
                                            onUpdate('media.posts', index, 'DELETE_ITEM');
                                            onCloseModal();
                                        }
                                    },
                                    () => {
                                        onUpdate('media.posts', post, 'ADD_ITEM');
                                        onCloseModal();
                                    }
                                );
                            }}
                        >
                            {isComingSoon ? (
                                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <span className="font-semibold uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: post.caption || 'Em breve' }} />
                                 </div>
                            ) : (
                                <>
                                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute top-3 right-3">{platformIcons[post.platform]}</div>
                                        <p className="text-sm text-center mb-4 line-clamp-4" dangerouslySetInnerHTML={{ __html: post.caption }} />
                                        <div className="absolute bottom-3 left-3 right-3 flex justify-center items-center gap-4 text-sm font-light">
                                            <div className="flex items-center gap-1.5">
                                                <HeartIcon className="w-4 h-4" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CommentIcon className="w-4 h-4" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </a>
                    )})}
                     {isEditMode && <AddItemButton onClick={() => onUpdate('media.posts', newContentDefaults.mediaPost, 'ADD_ITEM')} text="Add Post" className="aspect-square h-full" />}
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

export default Media;
