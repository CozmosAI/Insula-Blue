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
    <header className="fixed top-0 left-0 right-0 z-50 p-2.5">
       <div className="container mx-auto px-5 py-4 flex justify-between items-center rounded-lg shadow-md relative" style={{ backgroundColor: backgroundColor }}>
        <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={true}
            style={logoStyle}
            onUpdate={onUpdate}
            path="header.logoStyle"
        >
            <div 
                className="h-full w-full"
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
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <div 
                  key={index} 
                  className={`relative group transition-all duration-200 p-1 -m-1 rounded-md`}
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
                        className="text-sm font-light transition-colors"
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
                  <a href={ctaButton.href} onClick={(e) => { if(isEditMode) e.preventDefault()}} target="_blank" rel="noopener noreferrer" className="text-sm font-medium uppercase px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2" style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor}}>
                      <span>{ctaButton.text}</span>
                      <RightArrowIcon className="w-3.5 h-3.5" />
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
        <div className="lg:hidden bg-orange-600/95 backdrop-blur-md absolute top-full left-0 w-full h-screen" style={{backgroundColor: `${backgroundColor}e6`}}>
          <nav className="flex flex-col items-center justify-center h-2/3 space-y-6">
            {navLinks.map((link, index) => (
              <a key={link.name} href={link.href} className="text-2xl font-medium" style={{ color: activeNavLinkColor }} onClick={(e) => handleNavClick(e, link.href)}>
                {link.name}
              </a>
            ))}
             <a href={ctaButton.href} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold px-8 py-4 rounded-full transition-colors mt-8 flex items-center gap-3" style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor }} onClick={() => setMenuOpen(false)}>
                <span>{ctaButton.text}</span>
                <RightArrowIcon className="w-5 h-5" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;