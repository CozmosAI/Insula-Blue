import React from 'react';

interface ColorPickerProps {
  color: string;
  path: string;
  onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
  title?: string;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, path, onUpdate, title, className = '' }) => {
  const inputId = `color-picker-${path.replace(/\./g, '-')}`;
  return (
    <div className={`p-1 bg-white rounded-full shadow-lg ${className}`} title={title || 'Mudar cor'}>
      <label htmlFor={inputId} style={{ backgroundColor: color }} className="block w-6 h-6 rounded-full cursor-pointer border border-gray-300"></label>
      <input
        id={inputId}
        type="color"
        value={color || '#FFFFFF'}
        onChange={(e) => onUpdate(path, e.target.value, 'UPDATE')}
        className="absolute w-0 h-0 opacity-0"
      />
    </div>
  );
};
