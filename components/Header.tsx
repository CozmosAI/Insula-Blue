import React, { useState } from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { RightArrowIcon } from './icons/RightArrowIcon';
import { AddItemButton } from './shared/AddItemButton';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';

interface NavLink {
  name: string;
  href: string;
}

interface HeaderContent {
  logoUrl: string;
  logoStyle: any;
  navLinks: NavLink[];
  navStyle: any;
  ctaButton: {
    text: string;
    href: string;
  };
  ctaButtonStyle: any;
  backgroundColor: string;
  navLinkColor: string;
  activeNavLinkColor: string;
  ctaBackgroundColor: string;
  ctaTextColor: string;
}

interface HeaderProps {
    content: HeaderContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    newContentDefaults: any;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logoUrl, navLinks, ctaButton, backgroundColor, navLinkColor, activeNavLinkColor, ctaBackgroundColor, ctaTextColor, logoStyle, ctaButtonStyle, navStyle } = content;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    if (menuOpen) {
        setMenuOpen(false);
    }
  };


  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
       <div className="container mx-auto px-6 py-3 flex justify-between items-center rounded-full shadow-xl backdrop-blur-sm border border-white/10 transition-all duration-300" style={{ backgroundColor: backgroundColor }}>
        <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={true}
            style={logoStyle}
            onUpdate={onUpdate}
            path="header.logoStyle"
        >
            <div 
                className="h-full w-full flex items-center"
                data-editable-img={isEditMode}
                onClick={() => isEditMode && onOpenModal('Editando Header', [
                  { path: 'header.logoUrl', label: 'URL do Logo', value: logoUrl, type: 'image' },
                  { path: 'header.backgroundColor', label: 'Cor de Fundo', value: backgroundColor, type: 'color' },
                ])}
                >
                <img src={logoUrl} alt="Insula Blue Logo" className="h-full w-full object-contain" />
            </div>
        </EditableWrapper>
        <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={true}
            style={navStyle}
            onUpdate={onUpdate}
            path="header.navStyle"
        >
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div 
                  key={index} 
                  className={`relative group transition-all duration-200 p-1 -m-1`}
                >
                  <div
                    data-editable={isEditMode}
                    onClick={() => isEditMode && onOpenModal('Editando Link de Navegação', 
                      [
                        { path: `header.navLinks[${index}].name`, label: 'Texto do Link', value: link.name, type: 'text' },
                        { path: `header.navLinks[${index}].href`, label: 'URL do Link', value: link.href, type: 'text' },
                        { path: 'header.navLinkColor', label: 'Cor do Link', value: navLinkColor, type: 'color' },
                        { path: 'header.activeNavLinkColor', label: 'Cor do Link Ativo', value: activeNavLinkColor, type: 'color' },
                      ],
                      () => {
                        if (window.confirm('Tem certeza que deseja excluir este link de navegação?')) {
                          onUpdate('header.navLinks', index, 'DELETE_ITEM');
                          onCloseModal();
                        }
                      },
                      () => {
                        onUpdate('header.navLinks', link, 'ADD_ITEM');
                        onCloseModal();
                      }
                    )}
                  >
                    <a 
                        href={link.href} 
                        className="text-xs font-medium uppercase tracking-widest transition-all duration-300 hover:opacity-100 opacity-80"
                        style={{ color: index === 0 ? activeNavLinkColor : navLinkColor }}
                        onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.name}
                    </a>
                  </div>
                </div>
              ))}
              {isEditMode && <AddItemButton size="sm" onClick={() => onUpdate('header.navLinks', newContentDefaults.navLink, 'ADD_ITEM')} />}
            </nav>
        </EditableWrapper>
        <div className="hidden lg:flex items-center relative">
            <EditableWrapper
                isEditMode={isEditMode}
                isDraggable={true}
                isResizable={false}
                style={ctaButtonStyle}
                onUpdate={onUpdate}
                path="header.ctaButtonStyle"
            >
                <div
                  data-editable={isEditMode}
                  onClick={() => isEditMode && onOpenModal('Editando Botão CTA', [
                    { path: 'header.ctaButton.text', label: 'Texto do Botão', value: ctaButton.text, type: 'text' },
                    { path: 'header.ctaButton.href', label: 'URL do Botão', value: ctaButton.href, type: 'text' },
                    { path: 'header.ctaBackgroundColor', label: 'Cor de Fundo do Botão', value: ctaBackgroundColor, type: 'color' },
                    { path: 'header.ctaTextColor', label: 'Cor do Texto do Botão', value: ctaTextColor, type: 'color' },
                  ])}
                >
                  <a href={ctaButton.href} onClick={(e) => { if(isEditMode) e.preventDefault()}} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center gap-2" style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor}}>
                      <span>{ctaButton.text}</span>
                      <RightArrowIcon className="w-3 h-3" />
                  </a>
                </div>
            </EditableWrapper>
        </div>
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ color: activeNavLinkColor }}>
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-brand-500/95 backdrop-blur-xl pt-32 px-6 transition-opacity duration-300">
          <nav className="flex flex-col items-center space-y-8">
            {navLinks.map((link, index) => (
              <a key={link.name} href={link.href} className="text-3xl font-serif italic font-medium transition-transform hover:scale-105" style={{ color: activeNavLinkColor }} onClick={(e) => handleNavClick(e, link.href)}>
                {link.name}
              </a>
            ))}
             <a href={ctaButton.href} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-colors mt-8 flex items-center gap-3 shadow-lg hover:shadow-xl" style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor }} onClick={() => setMenuOpen(false)}>
                <span>{ctaButton.text}</span>
                <RightArrowIcon className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;