import React from 'react';

interface ContextMenuAction {
    label: string;
    onClick: () => void;
}

interface ContextMenuProps {
    isOpen: boolean;
    x: number;
    y: number;
    onClose: () => void;
    actions: ContextMenuAction[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, x, y, onClose, actions }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed z-[10001] bg-white rounded-md shadow-2xl border border-gray-200 py-2"
            style={{ top: y, left: x }}
        >
            <ul>
                {actions.map((action, index) => (
                    <li key={index}>
                        <button
                            onClick={() => {
                                action.onClick();
                                onClose();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
                        >
                            {action.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContextMenu;
