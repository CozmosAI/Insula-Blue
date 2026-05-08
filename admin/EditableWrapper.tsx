import React, { useState, useRef, useCallback } from 'react';
import { MoveIcon } from '../components/icons/MoveIcon';

interface Style {
    position: 'relative' | 'absolute';
    width?: string | number;
    height?: string | number;
    top?: string | number;
    left?: string | number;
}

interface EditableWrapperProps {
    children: React.ReactNode;
    isEditMode: boolean;
    isResizable: boolean;
    isDraggable: boolean;
    style: Style;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    path: string;
    className?: string;
}

const parseUnit = (value: string | number | undefined) => {
    if (typeof value === 'number') return { value, unit: 'px' };
    if (typeof value !== 'string') return { value: 0, unit: 'px' };
    const match = value.match(/(-?[\d.]+)([a-z%]*)/);
    return match ? { value: parseFloat(match[1]), unit: match[2] || 'px' } : { value: 0, unit: 'px' };
};

export const EditableWrapper: React.FC<EditableWrapperProps> = ({ children, isEditMode, isResizable, isDraggable, style, onUpdate, path, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState('');
    
    const initialPos = useRef({ x: 0, y: 0 });
    const initialStyle = useRef({ top: 0, left: 0, width: 0, height: 0 });

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggable || !isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        initialPos.current = { x: e.clientX, y: e.clientY };

        const currentTop = parseUnit(style.top).value;
        const currentLeft = parseUnit(style.left).value;
        initialStyle.current = { ...initialStyle.current, top: currentTop, left: currentLeft };
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
        if (!isResizable || !isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        setResizeHandle(handle);
        initialPos.current = { x: e.clientX, y: e.clientY };

        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            initialStyle.current = { ...initialStyle.current, width: rect.width, height: rect.height };
        }
    };
    
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging && !isResizing) return;
        e.preventDefault();
        e.stopPropagation();
        
        const dx = e.clientX - initialPos.current.x;
        const dy = e.clientY - initialPos.current.y;

        if (isDragging) {
            const newStyle = {
                ...style,
                top: `${initialStyle.current.top + dy}px`,
                left: `${initialStyle.current.left + dx}px`,
            };
            onUpdate(path, newStyle);
        }

        if (isResizing && ref.current) {
            let newWidth = initialStyle.current.width;
            let newHeight = initialStyle.current.height;
            let newTop = parseUnit(style.top).value;
            let newLeft = parseUnit(style.left).value;

            if (resizeHandle.includes('r')) newWidth += dx;
            if (resizeHandle.includes('l')) {
                newWidth -= dx;
                newLeft += dx;
            }
            if (resizeHandle.includes('b')) newHeight += dy;
            if (resizeHandle.includes('t')) {
                newHeight -= dy;
                newTop += dy;
            }

            const newStyle = {
                ...style,
                width: `${newWidth}px`,
                height: `${newHeight}px`,
                top: `${newTop}px`,
                left: `${newLeft}px`,
            };
             onUpdate(path, newStyle);
        }

    }, [isDragging, isResizing, resizeHandle, onUpdate, path, style]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
    }, []);

    React.useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);


    const finalStyle: React.CSSProperties = {
        position: style?.position || 'relative',
        top: style?.top || 0,
        left: style?.left || 0,
        width: style?.width,
        height: style?.height,
        touchAction: 'none',
    };
    
    if (isEditMode) {
        finalStyle.outline = '2px dashed rgba(0, 169, 255, 0.7)';
        finalStyle.outlineOffset = '4px';
    }
    
    const resizeHandles = ['tl', 't', 'tr', 'l', 'r', 'bl', 'b', 'br'];

    return (
        <div ref={ref} style={finalStyle} className={className}>
            {children}
            {isEditMode && isDraggable && (
                <div 
                    className="absolute -top-3 -left-3 z-50 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 cursor-move"
                    onMouseDown={handleDragStart}
                    title="Mover elemento"
                >
                    <MoveIcon className="w-4 h-4" />
                </div>
            )}
            {isEditMode && isResizable && resizeHandles.map(handle => (
                <div
                    key={handle}
                    onMouseDown={(e) => handleResizeStart(e, handle)}
                    className="absolute z-40 bg-white border-2 border-blue-500 rounded-full"
                    style={{
                        width: '12px',
                        height: '12px',
                        top: handle.includes('t') ? '-6px' : handle.includes('b') ? 'calc(100% - 6px)' : 'calc(50% - 6px)',
                        left: handle.includes('l') ? '-6px' : handle.includes('r') ? 'calc(100% - 6px)' : 'calc(50% - 6px)',
                        cursor: `${handle}-resize`,
                    }}
                />
            ))}
        </div>
    );
};
