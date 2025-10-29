import React, { useState } from 'react';
import { InstagramIcon } from './icons/InstagramIcon';
import { TwitterXIcon } from './icons/TwitterXIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { AddItemButton } from './shared/AddItemButton';
import { EditSectionButton } from './shared/EditSectionButton';
import { EditField } from '../../admin/EditModal';
import { EditableWrapper } from '../../admin/EditableWrapper';

interface SocialLink {
    name: string;
    href: string;
}

interface FooterContent {
    logoUrl: string;
    logoStyle: any;
    socialLinks: SocialLink[];
    contact: {
        email: string;
        phone: string;
    };
    contactStyle: any;
    legal: {
        privacyPolicyLink: string;
        privacyPolicyText: string;
        cnpj: string;
    };
    legalStyle: any;
    backgroundColor: string;
    textColor: string;
    titleColor: string;
    linkColor: string;
    linkHoverColor: string;
}

interface FooterProps {
    content: FooterContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    newContentDefaults: any;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
}

const socialIcons: { [key: string]: React.ReactNode } = {
    instagram: <InstagramIcon className="w-5 h-5" />,
    twitter: <TwitterXIcon className="w-5 h-5" />,
    linkedin: <LinkedInIcon className="w-5 h-5" />
};

const SocialIcon: React.FC<{ 
    href: string, 
    children: React.ReactNode, 
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
    color: string,
    hoverColor: string
}> = ({ href, children, onClick, color, hoverColor }) => (
    <a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer" className="transition-colors bg-zinc-800 p-3 rounded-md block" 
        style={{ color }}
        onMouseOver={e => e.currentTarget.style.color = hoverColor}
        onMouseOut={e => e.currentTarget.style.color = color}
    >
        {children}
    </a>
);

const Footer: React.FC<FooterProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal }) => {
    const { logoUrl, socialLinks, contact, legal, backgroundColor, textColor, titleColor, linkColor, linkHoverColor, logoStyle, contactStyle, legalStyle } = content;
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (!isEditMode) return;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!isEditMode) return;
        e.preventDefault();
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        if (!isEditMode || draggedIndex === index) return;
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (!isEditMode) return;
        e.preventDefault();
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        if (!isEditMode || draggedIndex === null) return;
        e.preventDefault();

        if (draggedIndex !== dropIndex) {
            const items = [...socialLinks];
            const [reorderedItem] = items.splice(draggedIndex, 1);
            items.splice(dropIndex, 0, reorderedItem);
            onUpdate('footer.socialLinks', items);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };


    return (
        <footer id="contact" className="relative" style={{ backgroundColor, color: textColor }}>
             {isEditMode && (
                <EditSectionButton
                  onClick={() => onOpenModal('Editando Estilos do Rodapé', [
                    { path: 'footer.backgroundColor', label: 'Cor de Fundo', value: backgroundColor, type: 'color' },
                    { path: 'footer.textColor', label: 'Cor do Texto', value: textColor, type: 'color' },
                    { path: 'footer.titleColor', label: 'Cor do Título', value: titleColor, type: 'color' },
                    { path: 'footer.linkColor', label: 'Cor do Link', value: linkColor, type: 'color' },
                    { path: 'footer.linkHoverColor', label: 'Cor do Link (Hover)', value: linkHoverColor, type: 'color' },
                  ])}
                />
            )}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div>
                        <EditableWrapper
                            isEditMode={isEditMode}
                            isDraggable={true}
                            isResizable={true}
                            style={logoStyle}
                            onUpdate={onUpdate}
                            path="footer.logoStyle"
                            className="inline-block mb-6"
                        >
                            <div 
                                data-editable-img={isEditMode}
                                onClick={() => isEditMode && onOpenModal('Editando Logo do Rodapé', [
                                    { path: 'footer.logoUrl', label: 'URL do Logo', value: logoUrl, type: 'image' }
                                ])}
                                className="h-full w-full"
                            >
                                <img src={logoUrl} alt="Insula Blue Logo" className="w-full h-full object-contain" />
                            </div>
                        </EditableWrapper>
                         <div className="flex items-center space-x-3 mt-4">
                           {socialLinks.map((link, index) => (
                               <div 
                                    key={index} 
                                    className={`relative group transition-all duration-200 rounded-md ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${dragOverIndex === index ? 'bg-white/10' : ''}`}
                                    draggable={isEditMode}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={handleDragOver}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={handleDragEnd}
                                    style={{ cursor: isEditMode ? 'grab' : 'default' }}
                                    data-editable={isEditMode}
                                    onClick={(e) => {
                                        if (!isEditMode) return;
                                        // Prevent modal from opening on drag end
                                        if (e.detail === 0) return;
                                        onOpenModal(`Editando Link Social: ${link.name}`, 
                                            [
                                                { path: `footer.socialLinks[${index}].href`, label: 'URL do Link', value: link.href, type: 'text' }
                                            ],
                                            () => {
                                                if (window.confirm('Tem certeza que deseja excluir este link social?')) {
                                                    onUpdate('footer.socialLinks', index, 'DELETE_ITEM');
                                                    onCloseModal();
                                                }
                                            },
                                            () => {
                                                onUpdate('footer.socialLinks', link, 'ADD_ITEM');
                                                onCloseModal();
                                            }
                                        );
                                    }}
                                >
                                    <SocialIcon 
                                        href={link.href}
                                        onClick={(e) => { if (isEditMode) e.preventDefault(); }}
                                        color={linkColor}
                                        hoverColor={linkHoverColor}
                                    >
                                        {socialIcons[link.name] || <InstagramIcon className="w-5 h-5" />}
                                    </SocialIcon>
                               </div>
                           ))}
                           {isEditMode && <AddItemButton size="sm" onClick={() => onUpdate('footer.socialLinks', newContentDefaults.socialLink, 'ADD_ITEM')} />}
                        </div>
                    </div>
                    <EditableWrapper
                        isEditMode={isEditMode}
                        isDraggable={true}
                        isResizable={false}
                        style={contactStyle}
                        onUpdate={onUpdate}
                        path="footer.contactStyle"
                    >
                        <div 
                            className="space-y-2"
                            data-editable={isEditMode}
                            onClick={() => isEditMode && onOpenModal('Editando Contato', [
                              { path: 'footer.contact.email', label: 'Email', value: contact.email, type: 'text' },
                              { path: 'footer.contact.phone', label: 'Telefone', value: contact.phone, type: 'text' }
                            ])}
                        >
                            <h3 className="font-bold tracking-wider" style={{color: titleColor}}>Fale Conosco:</h3>
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                        </div>
                    </EditableWrapper>

                    <EditableWrapper
                        isEditMode={isEditMode}
                        isDraggable={true}
                        isResizable={false}
                        style={legalStyle}
                        onUpdate={onUpdate}
                        path="footer.legalStyle"
                    >
                        <div 
                            className="space-y-2"
                            data-editable={isEditMode}
                            onClick={() => isEditMode && onOpenModal('Editando Informações Legais', [
                                { path: 'footer.legal.privacyPolicyText', label: 'Texto do Link de Privacidade', value: legal.privacyPolicyText, type: 'text' },
                                { path: 'footer.legal.privacyPolicyLink', label: 'URL do Link de Privacidade', value: legal.privacyPolicyLink, type: 'text' },
                                { path: 'footer.legal.cnpj', label: 'CNPJ', value: legal.cnpj, type: 'text' }
                            ])}
                        >
                            <div>
                                <a href={legal.privacyPolicyLink} 
                                    onClick={(e) => { if (isEditMode) e.preventDefault(); }}
                                    className="block transition-colors underline"
                                    style={{ color: linkColor }}
                                    onMouseOver={e => e.currentTarget.style.color = linkHoverColor}
                                    onMouseOut={e => e.currentTarget.style.color = linkColor}
                                >
                                    <span>{legal.privacyPolicyText}</span>
                                </a>
                            </div>
                            <p>CNPJ: <span>{legal.cnpj}</span></p>
                        </div>
                    </EditableWrapper>

                </div>
            </div>
        </footer>
    );
};

export default Footer;