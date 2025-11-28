
import React, { useState } from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { RightArrowIcon } from './icons/RightArrowIcon';
import { AddItemButton } from './shared/AddItemButton';
import { EditField } from '../admin/EditModal';

interface NavLink {
  name: string;
  href: string;
}

interface HeaderContent {
  logoUrl: string;
  logoStyle: any;
  navLinks: NavLink[];
  navStyle: any;
  containerStyle?: any;
  navContainerStyle?: any;
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
  const { logoUrl, navLinks, ctaButton, backgroundColor, navLinkColor, activeNavLinkColor, ctaBackgroundColor, ctaTextColor, logoStyle, ctaButtonStyle, navStyle, containerStyle, navContainerStyle } = content;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Em modo de edição, previne a navegação para permitir a edição do link.
    if (isEditMode) {
      e.preventDefault();
      return;
    }

    // Se for um link de âncora interno, usa JavaScript para fazer a rolagem suave.
    // Isso garante o funcionamento correto em todos os cenários.
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Para links externos, o comportamento padrão do navegador será usado.

    // Fecha o menu móvel após o clique, se estiver aberto.
    if (menuOpen) {
        setMenuOpen(false);
    }
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-2.5">
       <div 
         className="container mx-auto px-5 py-4 flex justify-between items-center rounded-lg shadow-md relative transition-all" 
         style={{ backgroundColor: backgroundColor, ...containerStyle }}
         data-editable={isEditMode}
         onClick={() => isEditMode && onOpenModal('Editando Header', [
             { path: 'header.backgroundColor', label: 'Cor de Fundo', value: backgroundColor, type: 'color' },
             { path: 'header.containerStyle.maxWidth', label: 'Largura Máxima (ex: 1280px)', value: containerStyle?.maxWidth || '', type: 'size' },
             { path: 'header.navStyle.fontSize', label: 'Tamanho da Fonte dos Links (ex: 1.2rem)', value: navStyle?.fontSize || '', type: 'size' },
             { path: 'header.navStyle.gap', label: 'Espaçamento entre Links (ex: 1.5rem)', value: navStyle?.gap || '', type: 'size' },
             { path: 'header.navContainerStyle.gap', label: 'Espaçamento Links/Botão (ex: 2rem)', value: content.navContainerStyle?.gap || '', type: 'size' },
         ])}
        >
          <div 
              style={logoStyle}
              data-editable-img={isEditMode}
              onClick={(e) => {
                  if(!isEditMode) return;
                  e.stopPropagation();
                  onOpenModal('Editando Logo', [
                      { path: 'header.logoUrl', label: 'URL do Logo', value: logoUrl, type: 'image' },
                      { path: 'header.logoStyle.width', label: 'Largura', value: logoStyle.width, type: 'size' },
                      { path: 'header.logoStyle.height', label: 'Altura', value: logoStyle.height, type: 'size' },
                  ]);
              }}
            >
              <img src={logoUrl} alt="Insula Blue Logo" className="h-full w-full object-contain" />
          </div>
          <div className="hidden lg:flex items-center" style={navContainerStyle}>
            <nav className="flex items-center" style={{ ...navStyle, gap: navStyle.gap }}>
              {navLinks.map((link, index) => (
                <div key={index} 
                  className="relative group transition-all duration-200 p-1 -m-1 rounded-md"
                  data-editable={isEditMode}
                  onClick={(e) => {
                      if(!isEditMode) return;
                      e.stopPropagation();
                      onOpenModal(`Editando Link: ${link.name}`, 
                          [
                              { path: `header.navLinks[${index}].name`, label: 'Texto do Link', value: link.name, type: 'text' },
                              { path: `header.navLinks[${index}].href`, label: 'URL do Link', value: link.href, type: 'text' },
                              { path: 'header.navLinkColor', label: 'Cor do Link', value: navLinkColor, type: 'color' },
                              { path: 'header.activeNavLinkColor', label: 'Cor do Link Ativo', value: activeNavLinkColor, type: 'color' },
                          ],
                          () => {
                            if (window.confirm('Tem certeza que deseja excluir este link?')) {
                                onUpdate('header.navLinks', index, 'DELETE_ITEM');
                                onCloseModal();
                            }
                          },
                          () => {
                              onUpdate('header.navLinks', link, 'ADD_ITEM');
                              onCloseModal();
                          }
                      );
                  }}
                >
                  <a 
                      href={link.href} 
                      className="font-light transition-colors"
                      style={{ color: index === 0 ? activeNavLinkColor : navLinkColor }}
                      onClick={(e) => handleNavClick(e, link.href)}
                  >
                    <span dangerouslySetInnerHTML={{ __html: link.name }} />
                  </a>
                </div>
              ))}
              {isEditMode && <AddItemButton size="sm" onClick={() => onUpdate('header.navLinks', newContentDefaults.navLink, 'ADD_ITEM')} />}
            </nav>
            <div className="relative" style={ctaButtonStyle}>
                <div
                    data-editable={isEditMode}
                    onClick={(e) => {
                        if(!isEditMode) return;
                        e.stopPropagation();
                        onOpenModal('Editando Botão CTA', [
                          { path: 'header.ctaButton.text', label: 'Texto do Botão', value: ctaButton.text, type: 'text' },
                          { path: 'header.ctaButton.href', label: 'URL do Botão', value: ctaButton.href, type: 'text' },
                          { path: 'header.ctaBackgroundColor', label: 'Cor de Fundo do Botão', value: ctaBackgroundColor, type: 'color' },
                          { path: 'header.ctaTextColor', label: 'Cor do Texto do Botão', value: ctaTextColor, type: 'color' },
                        ]);
                    }}
                  >
                    <a href={ctaButton.href} onClick={(e) => { if(isEditMode) e.preventDefault()}} target="_blank" rel="noopener noreferrer" className="text-sm font-medium uppercase px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2" style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor}}>
                        <span dangerouslySetInnerHTML={{ __html: ctaButton.text }} />
                        <RightArrowIcon className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
          </div>
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ color: activeNavLinkColor }}>
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
       <div 
        className={`
          lg:hidden absolute top-full left-0 right-0 transition-all duration-500 ease-in-out overflow-hidden
          bg-brand-600/95 backdrop-blur-lg
          ${menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <nav className="flex flex-col items-center justify-center px-8 pt-8 pb-12 space-y-8">
          {navLinks.map((link, index) => (
            <div
              key={link.name}
              className={`transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: `${index * 100 + 100}ms` }}
            >
              <a 
                href={link.href} 
                className="text-2xl font-semibold" 
                style={{ color: activeNavLinkColor }} 
                onClick={(e) => handleNavClick(e, link.href)}
                dangerouslySetInnerHTML={{ __html: link.name }}
              />
            </div>
          ))}
          <div
            className={`transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            style={{ transitionDelay: `${navLinks.length * 100 + 100}ms` }}
          >
            <a 
              href={ctaButton.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-2xl font-semibold px-8 py-4 rounded-full transition-colors mt-8 flex items-center gap-3" 
              style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor }} 
              onClick={() => setMenuOpen(false)}
            >
              <span dangerouslySetInnerHTML={{ __html: ctaButton.text }} />
              <RightArrowIcon className="w-5 h-5" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
