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
import EditModal from './admin/EditModal';
import FeaturedWork from './components/FeaturedWork';
import { EditField } from './admin/EditModal';
import Content from './components/Content';
import Charts from './components/Charts';
import InteractiveTools from './components/InteractiveTools';

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
      if(lastKey) {
          if (Array.isArray(target) && /^\d+$/.test(lastKey)) {
              target[parseInt(lastKey)] = value;
          } else {
              target[lastKey] = value;
          }
      }
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
       if (Array.isArray(target) && lastKey && /^\d+$/.test(lastKey)) {
         target.splice(parseInt(lastKey), 1);
       } else if (Array.isArray(arrayPath) && typeof value === 'number') {
         arrayPath.splice(value, 1);
       }
       else {
        console.error(`Cannot delete item from path: ${path}`);
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

const componentsMap: { [key: string]: React.ElementType } = {
    hero: Hero,
    about: About,
    whatWeDo: WhatWeDo,
    howItWorks: HowItWorks,
    whyUs: WhyUs,
    content: Content,
    charts: Charts,
    interactiveTools: InteractiveTools,
    team: Team,
    featuredWork: FeaturedWork,
    media: Media,
    faq: Faq,
};

const App: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ isOpen: false, title: '', fields: [] });

  // Effect for fetching data and setting up keyboard shortcuts (runs once)
  useEffect(() => {
    fetch('/admin/content.json')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(error => console.error('Error fetching content:', error));

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toUpperCase() === 'A') {
        event.preventDefault();
        setIsEditMode(prev => !prev);
        if (isEditMode) handleCloseModal(); // Close modal if exiting edit mode
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode]);

  // Effect for scroll animations and dynamic cursor interactions
  useEffect(() => {
    if (!content) return;

    let intersectionObserver: IntersectionObserver;

    const setupCursorHover = () => {
        const interactiveElements = document.querySelectorAll('a, button, [data-editable="true"], [data-editable-img="true"]');
        const follower = document.getElementById('cursor-follower');
        if (!follower) return;

        interactiveElements.forEach(el => {
            // Avoid adding listeners multiple times
            if (!(el as any)._hasCursorListeners) {
                const enterListener = () => follower.classList.add('cursor-hover');
                const leaveListener = () => follower.classList.remove('cursor-hover');
                
                el.addEventListener('mouseenter', enterListener);
                el.addEventListener('mouseleave', leaveListener);
                (el as any)._hasCursorListeners = true;
            }
        });
    };

    const setupIntersectionObserver = () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -50px 0px',
        }
      );

      const elementsToAnimate = document.querySelectorAll('.scroll-animate:not(.is-visible)');
      elementsToAnimate.forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    setupIntersectionObserver();
    setupCursorHover();

    const mutationObserver = new MutationObserver((mutations) => {
      const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
      if (hasAddedNodes) {
        setTimeout(() => {
            setupIntersectionObserver();
            setupCursorHover();
        }, 100);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, [content]);
  
  // Effect for cursor position (runs once)
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Using transform for better performance
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    
    // Adjust follower transform to keep it centered
    if(follower.style.transform.includes('scale')) {
       // do nothing as it will be handled by the class
    } else {
        follower.style.transform = 'translate(-50%, -50%)';
    }


    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleUpdate = (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => {
    setContent(prevContent => updateStateByPath(prevContent, path, value, action));
  };
  
  const handleOpenModal = (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => {
    setModalConfig({ isOpen: true, title, fields, onDelete, onClone });
  };
  
  const handleCloseModal = () => {
    setModalConfig({ isOpen: false, title: '', fields: [] });
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
      handleUpdate(`${sectionKey}.show`, false);
  };
  
  const generateAndCopyJson = () => {
    const cleanedContent = { ...content };
    delete cleanedContent._newContentDefaults; // Remove temp data
    const output = JSON.stringify(cleanedContent, null, 2);
    navigator.clipboard.writeText(output)
        .then(() => {
            alert('JSON gerado e copiado para a área de transferência! Cole no chat para salvar permanentemente.');
        })
        .catch(err => {
            console.error('Failed to copy JSON: ', err);
            alert('Falha ao copiar JSON. Por favor, copie manualmente.');
        });
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-800">
        Carregando...
      </div>
    );
  }

  const commonProps = {
    isEditMode,
    onUpdate: handleUpdate,
    onOpenModal: handleOpenModal,
    onCloseModal: handleCloseModal,
    newContentDefaults: content._newContentDefaults
  };

  return (
    <div className="bg-gray-50 text-gray-800 antialiased font-sans">
        <Header content={content.header} {...commonProps} />
        <main>
            {content.sectionOrder?.map((sectionKey: string, index: number) => {
                const Component = componentsMap[sectionKey];
                if (!Component || !content[sectionKey] || (!isEditMode && !content[sectionKey].show)) {
                    return null;
                }
                
                return (
                    <Component
                        key={sectionKey}
                        content={content[sectionKey]}
                        sectionKey={sectionKey}
                        onMoveSection={handleMoveSection}
                        onDeleteSection={handleDeleteSection}
                        isFirst={index === 0}
                        isLast={index === content.sectionOrder.length - 1}
                        {...commonProps}
                    />
                );
            })}
        </main>
        <Footer content={content.footer} {...commonProps} />
      
        {isEditMode && (
          <>
            <EditModal 
              isOpen={modalConfig.isOpen}
              onClose={handleCloseModal}
              title={modalConfig.title}
              fields={modalConfig.fields}
              onUpdate={handleUpdate}
              content={content}
              onDelete={modalConfig.onDelete}
              onClone={modalConfig.onClone}
            />
             <div className="fixed bottom-0 left-0 right-0 z-[9998] p-4 bg-gray-900/90 backdrop-blur-sm flex justify-center items-center gap-4">
                 <button onClick={generateAndCopyJson} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Concluir e Gerar JSON
                </button>
                <button onClick={() => setIsEditMode(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Sair do Modo de Edição
                </button>
             </div>
          </>
        )}
    </div>
  );
};

export default App;