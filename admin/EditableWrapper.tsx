import React from 'react';

interface EditableWrapperProps {
    children: React.ReactNode;
    isEditMode: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    style?: React.CSSProperties;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    path: string;
    className?: string;
}

export const EditableWrapper: React.FC<EditableWrapperProps> = ({ children, isEditMode, style, className }) => {
    // A simple wrapper that just renders children with given style and class.
    // In edit mode, it could add some visual indicators, but for fixing the bug,
    // just rendering is enough. The main point is to export a component.
    const editModeClass = isEditMode ? 'outline-dashed outline-1 outline-blue-500 relative' : '';
    
    return (
        <div style={style} className={`${className || ''} ${editModeClass}`}>
            {children}
        </div>
    );
};

export default EditableWrapper;
