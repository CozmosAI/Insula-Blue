import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import WhatWeDo from './components/WhatWeDo';
import HowItWorks from './components/HowItWorks';
import WhyUs from './components/WhyUs';
import Team from './components/Team';
import Media from './components/Media';
import Faq from './components/Faq';
import Footer from './components/Footer';
import AdminToolbar from './admin/AdminPanel';
import FeaturedWork from './components/FeaturedWork';
import EditModal, { EditField } from './admin/EditModal';
import ContextMenu from './components/shared/ContextMenu';

const updateStateByPath = (obj: any, path: string, value: any, action: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM' = 'UPDATE') => {
  const newObj = JSON.parse(JSON.stringify(obj));

  const keys = path.split('.').reduce((acc, part) => {
    const bracketParts = part.split(/\[(\d+)\]/).filter(Boolean);
    return acc.concat(bracketParts);
  }, [] as string[]);

  const lastKey = keys.pop();
  if (lastKey === undefined && action !== 'ADD_ITEM' && action !== 'DELETE_ITEM') {
    console.error("Path is invalid for update", path);
    return newObj;
  }

  let target = newObj;
  for (const key of keys) {
    if (target[key] === undefined) {
      target[key] = /^\d+$/.test(key) ? [] : {};
    }
    target = target[key];
  }

  const arrayPath = lastKey ? target[lastKey] : target;

  switch (action) {
    case 'UPDATE':
      if(lastKey) target[lastKey] = value;
      break;
    case 'ADD_ITEM':
      if (!lastKey && Array.isArray(target)) {
        target.push(value);
      } else if (lastKey && Array.isArray(target[lastKey])) {
        target[lastKey].push(value);
      } else {
         console.error(`Cannot add item to path: ${path}`);
      }
      break;
    case 'DELETE_ITEM':
      if (Array.isArray(arrayPath)) {
        // value is the index
        arrayPath.splice(value, 1);
      } else {
        console.error(`Cannot delete item from non-array at path: ${path}`);
      }
      break;
    default:
      break;
  }

  return newObj;
};

interface ModalConfig {
    isOpen: boolean;
    title: string;
    fields: EditField[];
    onDelete?: () => void;
    onClone?: () => void;
}

interface ContextMenuConfig {
    isOpen: boolean;
    x: number;
    y: number;
    sectionKey: string | null;
}

const componentsMap: { [key: string]: React.ElementType } = {
    hero: Hero,
    about: About,
    whatWeDo: WhatWeDo,
    howItWorks: HowItWorks,
    whyUs: WhyUs,
    team: Team,
    featuredWork: FeaturedWork,
    media: Media,
    faq: Faq,
};

const App: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    fields: [],
    onDelete: undefined,
    onClone: undefined,
  });
  const [contextMenu, setContextMenu] = useState<ContextMenuConfig>({
    isOpen: false,
    x: 0,
    y: 0,
    sectionKey: null,
  });

  useEffect(() => {
    fetch('/admin/content.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setContent(data);
      })
      .catch(error => {
        console.error('Error fetching content:', error);
      });

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };
    
    const handleClick = () => {
        if(contextMenu.isOpen) {
            setContextMenu({ isOpen: false, x: 0, y: 0, sectionKey: null });
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [contextMenu.isOpen]);
  
  const handleUpdate = (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => {
    setContent(prevContent => updateStateByPath(prevContent, path, value, action));
  };

  const handleMoveSection = (sectionKey: string, direction: 'up' | 'down') => {
      setContent((prevContent: any) => {
          const newContent = { ...prevContent };
          const currentOrder = [...newContent.sectionOrder];
          const index = currentOrder.indexOf(sectionKey);

          if (direction === 'up' && index > 0) {
              [currentOrder[index], currentOrder[index - 1]] = [currentOrder[index - 1], currentOrder[index]];
          } else if (direction === 'down' && index < currentOrder.length - 1) {
              [currentOrder[index], currentOrder[index + 1]] = [currentOrder[index + 1], currentOrder[index]];
          }
          
          newContent.sectionOrder = currentOrder;
          return newContent;
      });
  };

  const handleDeleteSection = (sectionKey: string) => {
      // This is a soft delete (hiding the section)
      handleUpdate(`${sectionKey}.show`, false);
  };

  const openModal = (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => {
    setModalConfig({
        isOpen: true,
        title,
        fields,
        onDelete,
        onClone
    });
  };

  const closeModal = () => {
      setModalConfig({ isOpen: false, title: '', fields: [], onDelete: undefined, onClone: undefined });
  };

  const handleModalSave = (updates: { path: string, value: any }[]) => {
      let newContent = content;
      for (const update of updates) {
          newContent = updateStateByPath(newContent, update.path, update.value, 'UPDATE');
      }
      setContent(newContent);
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    const target = e.target as HTMLElement;
    const sectionElement = target.closest('[data-section-key]') as HTMLElement | null;
    const sectionKey = sectionElement?.dataset.sectionKey || null;

    if(sectionKey) {
        e.preventDefault();
        setContextMenu({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
            sectionKey,
        });
    }
  };


  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-800">
        Carregando...
      </div>
    );
  }

  return (
    <div 
      className={`bg-gray-50 text-gray-800 antialiased font-sans ${isEditMode ? 'pb-20' : ''}`}
      onContextMenu={handleContextMenu}
    >
      <Header content={content.header} isEditMode={isEditMode} onUpdate={handleUpdate} newContentDefaults={content._newContentDefaults} onOpenModal={openModal} onCloseModal={closeModal}/>
       <main>
          {content.sectionOrder?.map((sectionKey: string, index: number) => {
              const Component = componentsMap[sectionKey];
              // Render section in edit mode even if show is false, but not if data is missing
              if (!Component || !content[sectionKey]) {
                  return null;
              }
              // Don't render if not in edit mode and show is false
              if (!isEditMode && !content[sectionKey].show) {
                  return null;
              }
              
              const hasNewContentDefaults = ['whatWeDo', 'whyUs', 'team', 'featuredWork', 'media', 'faq'].includes(sectionKey);

              return (
                  <Component
                      key={sectionKey}
                      content={content[sectionKey]}
                      isEditMode={isEditMode}
                      onUpdate={handleUpdate}
                      onOpenModal={openModal}
                      onCloseModal={closeModal}
                      sectionKey={sectionKey}
                      onMoveSection={handleMoveSection}
                      onDeleteSection={handleDeleteSection}
                      isFirst={index === 0}
                      isLast={index === content.sectionOrder.length - 1}
                      {...(hasNewContentDefaults && { newContentDefaults: content._newContentDefaults })}
                  />
              );
          })}
      </main>
      <Footer content={content.footer} isEditMode={isEditMode} onUpdate={handleUpdate} newContentDefaults={content._newContentDefaults} onOpenModal={openModal} onCloseModal={closeModal}/>
      {isEditMode && <AdminToolbar content={content} onExit={() => setIsEditMode(false)} />}
      <EditModal 
          isOpen={modalConfig.isOpen}
          onClose={closeModal}
          onSave={handleModalSave}
          title={modalConfig.title}
          fields={modalConfig.fields}
          onDelete={modalConfig.onDelete}
          onClone={modalConfig.onClone}
      />
      <ContextMenu
          isOpen={contextMenu.isOpen}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu({ isOpen: false, x: 0, y: 0, sectionKey: null })}
          actions={[
              {
                  label: 'Adicionar Título',
                  onClick: () => {
                      if(contextMenu.sectionKey) {
                        handleUpdate(`${contextMenu.sectionKey}.customBlocks`, content._newContentDefaults.customBlockHeading, 'ADD_ITEM');
                      }
                  }
              },
              {
                  label: 'Adicionar Parágrafo',
                  onClick: () => {
                       if(contextMenu.sectionKey) {
                        handleUpdate(`${contextMenu.sectionKey}.customBlocks`, content._newContentDefaults.customBlockParagraph, 'ADD_ITEM');
                      }
                  }
              },
              {
                  label: 'Adicionar Imagem',
                  onClick: () => {
                       if(contextMenu.sectionKey) {
                        handleUpdate(`${contextMenu.sectionKey}.customBlocks`, content._newContentDefaults.customBlockImage, 'ADD_ITEM');
                      }
                  }
              }
          ]}
      />
    </div>
  );
};

export default App;