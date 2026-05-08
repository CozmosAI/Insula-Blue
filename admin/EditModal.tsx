import React, { useState, useEffect } from 'react';
import { XIcon } from '../components/icons/XIcon';

export interface EditField {
    path: string;
    label: string;
    value: any;
    type: 'text' | 'textarea' | 'image' | 'video' | 'color' | 'boolean' | 'size';
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updates: { path: string, value: any }[]) => void;
    title: string;
    fields: EditField[];
    onDelete?: () => void;
    onClone?: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, title, fields, onDelete, onClone }) => {
    const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        if (isOpen) {
            const initialValues = fields.reduce((acc, field) => {
                acc[field.path] = field.value;
                return acc;
            }, {} as { [key: string]: any });
            setFieldValues(initialValues);
        }
    }, [isOpen, fields]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (path: string, value: any) => {
        setFieldValues(prev => ({ ...prev, [path]: value }));
    };

    const handleSave = () => {
        const updates = Object.entries(fieldValues).map(([path, value]) => {
            if (fields.find(f => f.path === path)?.label.includes('Realizações')) {
                const stringValue = String(value ?? '').trim();
                // If the textarea is empty after trimming, save an empty array. Otherwise, split by lines.
                const achievements = stringValue ? stringValue.split('\n') : [];
                return { path, value: achievements };
            }
            return { path, value };
        });
        onSave(updates);
        onClose();
    };
    
    const renderField = (field: EditField) => {
        const value = fieldValues[field.path] ?? (field.type === 'boolean' ? false : '');
        switch (field.type) {
            case 'textarea':
                return <textarea
                    id={field.path}
                    value={value}
                    onChange={(e) => handleChange(field.path, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 h-40 text-gray-800"
                    rows={5}
                />;
            case 'color':
                return (
                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                        <input
                            type="color"
                            id={`${field.path}-color`}
                            value={value}
                            onChange={(e) => handleChange(field.path, e.target.value)}
                            className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-transparent"
                            style={{'WebkitAppearance': 'none', 'MozAppearance': 'none', 'appearance': 'none'}}
                        />
                        <input
                            type="text"
                            id={field.path}
                            value={value}
                            onChange={(e) => handleChange(field.path, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 font-mono"
                        />
                    </div>
                );
            case 'boolean':
                return (
                     <label className="flex items-center space-x-3 cursor-pointer bg-gray-100 p-3 rounded-md">
                        <input
                            type="checkbox"
                            id={field.path}
                            checked={!!value}
                            onChange={(e) => handleChange(field.path, e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 font-medium">Mostrar esta seção</span>
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
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                />;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {fields.map(field => (
                        <div key={field.path}>
                            <label htmlFor={field.path} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
                    <div>
                        {onDelete && (
                            <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                Excluir
                            </button>
                        )}
                        {onClone && (
                            <button onClick={onClone} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ml-2">
                                Clonar
                            </button>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;