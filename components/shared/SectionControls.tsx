import React from 'react';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';

interface SectionControlsProps {
    onSelect: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    isHidden: boolean;
}

export const SectionControls: React.FC<SectionControlsProps> = ({ onSelect, onMoveUp, onMoveDown, onDelete, isFirst, isLast, isHidden }) => {
    return (
        <div className={`absolute top-4 right-4 z-30 flex items-center gap-1 p-1 bg-gray-900/80 backdrop-blur-sm text-white rounded-full shadow-lg border border-white/20 ${isHidden ? 'bg-red-900/80' : ''}`}>
            <button onClick={onSelect} title="Editar Seção" className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <PencilIcon className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/20"></div>
            <button onClick={onMoveUp} disabled={isFirst} title="Mover para Cima" className="p-2 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowUpIcon className="w-5 h-5" />
            </button>
            <button onClick={onMoveDown} disabled={isLast} title="Mover para Baixo" className="p-2 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowDownIcon className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/20"></div>
            <button onClick={onDelete} title="Ocultar Seção" className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
};