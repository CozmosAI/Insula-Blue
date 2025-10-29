import React from 'react';
import { PlusIcon } from '../icons/PlusIcon';

interface AddItemButtonProps {
    onClick: () => void;
    text?: string;
    className?: string;
    size?: 'sm' | 'md';
}

export const AddItemButton: React.FC<AddItemButtonProps> = ({ onClick, text = 'Adicionar Item', className = '', size = 'md' }) => {
    const sizeClasses = size === 'sm' 
        ? 'p-2 rounded-full' 
        : 'w-full p-4 mt-4 rounded-lg';

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors border-2 border-dashed border-green-300 ${sizeClasses} ${className}`}
        >
            <PlusIcon />
            {size === 'md' && <span>{text}</span>}
        </button>
    );
};
