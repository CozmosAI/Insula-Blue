
import React from 'react';
import { EditField } from '../../admin/EditModal';
import { TrashIcon } from '../icons/TrashIcon';

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
    path: string;
    onDelete: () => void;
    onClone: () => void;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
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
    block, isEditMode, onUpdate, path, onDelete, onClone, onOpenModal, onCloseModal,
    isDraggable, onDragStart, onDragOver, onDragEnter, onDragLeave, onDrop, onDragEnd, className = '' 
}) => {

    const handleOpenEditModal = () => {
        let fields: EditField[] = [];
        let label = '';

        switch(block.type) {
            case 'heading':
                label = 'Editando Título';
                fields = [
                    { path: `${path}.text`, label: 'Texto', value: block.text || '', type: 'text' },
                    { path: `${path}.style.fontSize`, label: 'Tamanho da Fonte (ex: 2rem)', value: block.style?.fontSize || '2rem', type: 'size' },
                    { path: `${path}.style.color`, label: 'Cor do Texto', value: block.style?.color || '#000000', type: 'color' },
                ];
                break;
            case 'paragraph':
                label = 'Editando Parágrafo';
                fields = [
                    { path: `${path}.text`, label: 'Texto', value: block.text || '', type: 'textarea' },
                    { path: `${path}.style.fontSize`, label: 'Tamanho da Fonte (ex: 1rem)', value: block.style?.fontSize || '1rem', type: 'size' },
                    { path: `${path}.style.color`, label: 'Cor do Texto', value: block.style?.color || '#000000', type: 'color' },
                    { path: `${path}.style.lineHeight`, label: 'Altura da Linha (ex: 1.75)', value: block.style?.lineHeight || '1.75', type: 'text' },
                ];
                break;
            case 'image':
                 label = 'Editando Imagem';
                fields = [
                    { path: `${path}.imageUrl`, label: 'URL da Imagem', value: block.imageUrl || '', type: 'image' },
                    { path: `${path}.style.width`, label: 'Largura (ex: 100% or 500px)', value: block.style?.width || '100%', type: 'size' },
                    { path: `${path}.style.height`, label: 'Altura (ex: auto or 300px)', value: block.style?.height || 'auto', type: 'size' },
                ];
                break;
        }
        
        onOpenModal(label, fields, onDelete, onClone);
    };
    
    const renderBlock = () => {
        const style = { ...block.style, whiteSpace: 'pre-line' } as React.CSSProperties;

        switch (block.type) {
            case 'heading':
                return <h2 style={style} dangerouslySetInnerHTML={{ __html: block.text || '' }} />;
            case 'paragraph':
                return <p style={style} dangerouslySetInnerHTML={{ __html: block.text || '' }} />;
            case 'image':
                return <img src={block.imageUrl} style={block.style} alt="Custom content" />;
            default:
                return null;
        }
    };

    return (
        <div 
            className={`relative group transition-all duration-200 ${className}`}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            data-editable={isEditMode}
            onClick={() => isEditMode && handleOpenEditModal()}
        >
            {renderBlock()}
        </div>
    );
};
