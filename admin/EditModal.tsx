import React, { useState, useEffect } from 'react';
import { XIcon } from '../components/icons/XIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { CopyIcon } from '../components/icons/CopyIcon';


export interface EditField {
    path: string;
    label: string;
    value: any;
    type: 'text' | 'textarea' | 'image' | 'video' | 'color' | 'boolean' | 'size';
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: EditField[];
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    content: any;
    onDelete?: () => void;
    onClone?: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, title, fields, onUpdate, content, onDelete, onClone }) => {
    
    const getInitialValues = () => {
      return fields.reduce((acc, field) => {
        const value = field.path.split(/[.\[\]]+/).filter(Boolean).reduce((o, k) => (o || {})[k], content);
        acc[field.path] = value;
        return acc;
      }, {} as { [key: string]: any });
    }

    const [fieldValues, setFieldValues] = useState(getInitialValues);

    useEffect(() => {
        if (isOpen) {
            setFieldValues(getInitialValues());
        }
    }, [isOpen, fields, content]);


    const handleChange = (path: string, value: any) => {
        const newValues = { ...fieldValues, [path]: value };
        setFieldValues(newValues);
        
        const field = fields.find(f => f.path === path);
        // Handle multiline textarea for achievements
        if (field?.label.includes('Realizações')) {
             const stringValue = String(value ?? '').trim();
             const achievements = stringValue ? stringValue.split('\n') : [];
             onUpdate(path, achievements);
        } else {
            onUpdate(path, value);
        }
    };
    
    if (!isOpen) {
        return null;
    }

    const renderField = (field: EditField) => {
        const value = fieldValues[field.path] ?? (field.type === 'boolean' ? false : '');
        switch (field.type) {
            case 'textarea':
                return <textarea
                    id={field.path}
                    value={value}
                    onChange={(e) => handleChange(field.path, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white h-32 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                />;
            case 'color':
                return (
                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white">
                        <input
                            type="color"
                            id={`${field.path}-color`}
                            value={value}
                            onChange={(e) => handleChange(field.path, e.target.value)}
                            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
                            style={{'WebkitAppearance': 'none', 'MozAppearance': 'none', 'appearance': 'none'}}
                        />
                        <input
                            type="text"
                            id={field.path}
                            value={value}
                            onChange={(e) => handleChange(field.path, e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-md bg-white text-gray-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                );
            case 'boolean':
                return (
                     <label className="flex items-center space-x-3 cursor-pointer bg-white p-3 rounded-md border border-gray-300">
                        <input
                            type="checkbox"
                            id={field.path}
                            checked={!!value}
                            onChange={(e) => handleChange(field.path, e.target.checked)}
                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 font-medium select-none">{field.label}</span>
                    </label>
                );
            case 'image':
            case 'video':
            case 'size':
            case 'text':
            default:
                return <input
                    type="text"
                    id={field.path}
                    value={value}
                    onChange={(e) => handleChange(field.path, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />;
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content text-gray-800" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-300">
                        <XIcon />
                    </button>
                </header>
                <main className="space-y-4">
                    {fields.map(field => (
                        <div key={field.path}>
                             {field.type !== 'boolean' && (
                                <label htmlFor={field.path} className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                            )}
                            {renderField(field)}
                        </div>
                    ))}
                </main>
                 {(onDelete || onClone) && (
                    <footer className="mt-6 pt-4 border-t border-gray-300 flex justify-end gap-3">
                        {onClone && (
                            <button onClick={onClone} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                <CopyIcon className="w-4 h-4" />
                                <span>Clonar</span>
                            </button>
                        )}
                        {onDelete && (
                            <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                <TrashIcon className="w-4 h-4" />
                                <span>Excluir</span>
                            </button>
                        )}
                    </footer>
                )}
            </div>
        </div>
    );
};

export default EditModal;