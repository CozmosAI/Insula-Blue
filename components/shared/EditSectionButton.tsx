import React from 'react';
import { PencilIcon } from '../icons/PencilIcon';

interface EditSectionButtonProps {
    onClick: () => void;
    label?: string;
    className?: string;
}

export const EditSectionButton: React.FC<EditSectionButtonProps> = ({ onClick, label = "Editar Seção", className = '' }) => {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`absolute top-4 right-4 z-20 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${className}`}
        >
            <PencilIcon className="w-5 h-5" />
        </button>
    );
};
