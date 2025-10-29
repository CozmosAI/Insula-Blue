import React from 'react';
import { TrashIcon } from '../icons/TrashIcon';

interface DeleteItemButtonProps {
    onClick: () => void;
    className?: string;
}

export const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            title="Excluir item"
            className={`absolute -top-3 -right-3 z-20 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${className}`}
        >
            <TrashIcon className="w-4 h-4" />
        </button>
    );
};
