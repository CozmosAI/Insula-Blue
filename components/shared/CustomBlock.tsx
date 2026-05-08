import React from 'react';
import { EditField } from '../../admin/EditModal';

interface Block {
    type: 'heading' | 'paragraph' | 'image';
    text?: string;
    imageUrl?: string;
    style?: React.CSSProperties;
}

interface CustomBlockProps {
    block: Block;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
    path: string;
    onDelete: () => void;
    isDraggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDragEnter?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
    className?: string;
}

export const CustomBlock: React.FC<CustomBlockProps> = ({ 
    block, isEditMode, onUpdate, onOpenModal, onCloseModal, path, onDelete,
    isDraggable, onDragStart, onDragOver, onDragEnter, onDragLeave, onDrop, onDragEnd, className = '' 
}) => {
    
    const openEditModal = () => {
        let fields: EditField[] = [];
        let title = '';

        switch(block.type) {
            case 'heading':
                title = 'Editando Título';
                fields = [
                    { path: `${path}.text`, label: 'Texto do Título', value: block.text || '', type: 'text' },
                    { path: `${path}.style.fontSize`, label: 'Tamanho da Fonte (ex: 2rem)', value: block.style?.fontSize || '2rem', type: 'size' },
                    { path: `${path}.style.color`, label: 'Cor do Texto', value: block.style?.color || '#000000', type: 'color' },
                ];
                break;
            case 'paragraph':
                title = 'Editando Parágrafo';
                fields = [
                    { path: `${path}.text`, label: 'Texto do Parágrafo', value: block.text || '', type: 'textarea' },
                    { path: `${path}.style.fontSize`, label: 'Tamanho da Fonte (ex: 1rem)', value: block.style?.fontSize || '1rem', type: 'size' },
                    { path: `${path}.style.color`, label: 'Cor do Texto', value: block.style?.color || '#000000', type: 'color' },
                    { path: `${path}.style.lineHeight`, label: 'Altura da Linha (ex: 1.75)', value: block.style?.lineHeight || '1.75', type: 'text' },
                ];
                break;
            case 'image':
                 title = 'Editando Imagem';
                fields = [
                    { path: `${path}.imageUrl`, label: 'URL da Imagem', value: block.imageUrl || '', type: 'image' },
                    { path: `${path}.style.width`, label: 'Largura (ex: 100% or 500px)', value: block.style?.width || '100%', type: 'size' },
                    { path: `${path}.style.height`, label: 'Altura (ex: auto or 300px)', value: block.style?.height || 'auto', type: 'size' },
                ];
                break;
        }

        const sectionKey = path.split('.')[0];
        const onClone = () => {
            onUpdate(`${sectionKey}.customBlocks`, { ...block }, 'ADD_ITEM');
            onCloseModal();
        };

        onOpenModal(title, fields, () => {
            onDelete();
            onCloseModal();
        }, onClone);
    };
    
    const renderBlock = () => {
        const style = { ...block.style, whiteSpace: 'pre-line' } as React.CSSProperties;
        switch (block.type) {
            case 'heading':
                return <h2 style={style}>{block.text}</h2>;
            case 'paragraph':
                return <p style={style}>{block.text}</p>;
            case 'image':
                return <img src={block.imageUrl} style={block.style} alt="Custom content" />;
            default:
                return null;
        }
    };

    return (
        <div 
            data-editable={isEditMode}
            onClick={() => isEditMode && openEditModal()}
            className={`relative transition-all duration-200 ${className}`}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            style={{ cursor: isDraggable ? 'grab' : 'pointer' }}
        >
            {renderBlock()}
        </div>
    );
};