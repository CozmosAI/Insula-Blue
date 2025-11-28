
import React, { useState } from 'react';
import { RightArrowIcon } from './icons/RightArrowIcon';
import { SectionControls } from './shared/SectionControls';
import { CustomBlock } from './shared/CustomBlock';
import { EditField } from '../admin/EditModal';

interface HeroContent {
  show: boolean;
  title: string;
  subtitle: string;
  ctaButton: {
    text: string;
    href:string;
  };
  videoUrl: string;
  videoStyle: any;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  ctaBackgroundColor: string;
  ctaTextColor: string;
  titleFontSize: string;
  subtitleFontSize: string;
  titleStyle: any;
  subtitleStyle: any;
  ctaButtonStyle: any;
  customBlocks?: any[];
}

interface HeroProps {
    content: HeroContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    sectionKey: string;
    onMoveSection: (sectionKey: string, direction: 'up' | 'down') => void;
    onDeleteSection: (sectionKey: string) => void;
    isFirst: boolean;
    isLast: boolean;
    newContentDefaults: any;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ content, isEditMode, onUpdate, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast, onOpenModal, onCloseModal, newContentDefaults }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
      const items = [...(content.customBlocks || [])];
      const [reorderedItem] = items.splice(draggedIndex, 1);
      items.splice(dropIndex, 0, reorderedItem);
      onUpdate('hero.customBlocks', items);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };


  return (
    <section 
      id="hero"
      data-section-key={sectionKey}
      className={`scroll-animate min-h-screen flex items-center pt-32 pb-16 md:pt-40 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{ backgroundColor: content.backgroundColor }}
    >
      {isEditMode && (
          <SectionControls
            onSelect={() => onOpenModal('Editando Seção Hero', [
              { path: 'hero.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'hero.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
            ])}
            onMoveUp={() => onMoveSection(sectionKey, 'up')}
            onMoveDown={() => onMoveSection(sectionKey, 'down')}
            onDelete={() => {
                if (window.confirm('Tem certeza que deseja ocultar esta seção?')) {
                    onDeleteSection(sectionKey);
                }
            }}
            isFirst={isFirst}
            isLast={isLast}
            isHidden={!content.show}
          />
      )}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div style={content.titleStyle}>
            <h1 
              className="font-semibold leading-tight text-4xl sm:text-5xl lg:text-6xl scroll-animate" 
              style={{ color: content.titleColor }}
              dangerouslySetInnerHTML={{ __html: content.title }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título Principal', [
                  { path: 'hero.title', label: 'Título', value: content.title, type: 'textarea' },
                  { path: 'hero.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
              ])}
            />
          </div>
          <div style={{...content.subtitleStyle, transitionDelay: '150ms'}} className="mt-6 scroll-animate">
            <p 
              className="font-light text-lg sm:text-xl"
              style={{ color: content.subtitleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Subtítulo', [
                  { path: 'hero.subtitle', label: 'Subtítulo', value: content.subtitle, type: 'textarea' },
                  { path: 'hero.subtitleColor', label: 'Cor do Subtítulo', value: content.subtitleColor, type: 'color' },
              ])}
              dangerouslySetInnerHTML={{ __html: content.subtitle }}
            />
          </div>
          <div style={{...content.ctaButtonStyle, transitionDelay: '300ms'}} className="inline-block mt-8 scroll-animate">
            <div 
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Botão CTA', [
                { path: 'hero.ctaButton.text', label: 'Texto do Botão', value: content.ctaButton.text, type: 'text' },
                { path: 'hero.ctaButton.href', label: 'Link do Botão', value: content.ctaButton.href, type: 'text' },
                { path: 'hero.ctaBackgroundColor', label: 'Cor de Fundo do Botão', value: content.ctaBackgroundColor, type: 'color' },
                { path: 'hero.ctaTextColor', label: 'Cor do Texto do Botão', value: content.ctaTextColor, type: 'color' }
              ])}
            >
              <a 
                href={content.ctaButton.href} 
                onClick={e => { if (isEditMode) e.preventDefault(); }}
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 text-sm font-bold uppercase px-8 py-3 rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: content.ctaBackgroundColor, color: content.ctaTextColor }}
              >
                <span dangerouslySetInnerHTML={{ __html: content.ctaButton.text }} />
                <RightArrowIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="mt-8 space-y-6">
              {content.customBlocks?.map((block, index) => (
                  <CustomBlock
                      key={index}
                      block={block}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                      onOpenModal={onOpenModal}
                      onCloseModal={onCloseModal}
                      path={`${sectionKey}.customBlocks[${index}]`}
                      onDelete={() => {
                          if (window.confirm('Tem certeza que deseja excluir este bloco?')) {
                              onUpdate(`${sectionKey}.customBlocks`, index, 'DELETE_ITEM');
                          }
                      }}
                      onClone={() => onUpdate(`${sectionKey}.customBlocks`, block, 'ADD_ITEM')}
                      isDraggable={isEditMode}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`scroll-animate ${draggedIndex === index ? 'opacity-50 scale-95 shadow-2xl' : ''} ${dragOverIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  />
              ))}
          </div>
        </div>
        <div 
          style={{...content.videoStyle, transitionDelay: '200ms'}} 
          className="scroll-animate"
          data-editable-img={isEditMode}
          onClick={() => isEditMode && onOpenModal('Editando Vídeo', [
              { path: 'hero.videoUrl', label: 'URL do Vídeo (Vimeo embed)', value: content.videoUrl, type: 'video' },
              { path: 'hero.videoStyle.width', label: 'Largura', value: content.videoStyle.width, type: 'size'},
              { path: 'hero.videoStyle.height', label: 'Altura', value: content.videoStyle.height, type: 'size'},
          ])}
        >
            <div className="w-full h-full aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-gray-500"></div>
                </div>
              )}
              <iframe
                className={`w-full h-full rounded-lg pointer-events-none transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`} 
                src={content.videoUrl} 
                title="Hero video"
                frameBorder="0"
                allow="autoplay"
                key={content.videoUrl}
                onLoad={() => setIsVideoLoaded(true)}
              ></iframe>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
