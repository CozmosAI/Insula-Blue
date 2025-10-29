import React from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';

interface SectionVisibilityToggleProps {
  path: string;
  isVisible: boolean;
  onUpdate: (path: string, value: boolean, action: 'UPDATE') => void;
}

export const SectionVisibilityToggle: React.FC<SectionVisibilityToggleProps> = ({ path, isVisible, onUpdate }) => {
  return (
    <button
      onClick={() => onUpdate(path, !isVisible, 'UPDATE')}
      title={isVisible ? 'Ocultar Seção' : 'Mostrar Seção'}
      className="p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-100"
    >
      {isVisible ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5 text-red-500" />}
    </button>
  );
};
