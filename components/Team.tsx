
import React, { useState } from 'react';
import { AddItemButton } from './shared/AddItemButton';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { CustomBlock } from './shared/CustomBlock';

interface TeamMember {
    name: string;
    title: string;
    imageUrl: string;
    achievements: string[];
}

interface TeamContent {
    show: boolean;
    title:string;
    titleStyle: any;
    members: TeamMember[];
    backgroundColor: string;
    titleColor: string;
    memberNameColor: string;
    memberTitleColor: string;
    memberTextColor: string;
    titleFontSize: string;
    memberNameFontSize: string;
    memberTitleFontSize: string;
    customBlocks?: any[];
}

interface TeamProps {
    content: TeamContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    newContentDefaults: any;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
    onCloseModal: () => void;
    sectionKey: string;
    onMoveSection: (sectionKey: string, direction: 'up' | 'down') => void;
    onDeleteSection: (sectionKey: string) => void;
    isFirst: boolean;
    isLast: boolean;
}

const Team: React.FC<TeamProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
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
      const items = [...(content.customBlocks || [])];
      const [reorderedItem] = items.splice(draggedIndex, 1);
      items.splice(dropIndex, 0, reorderedItem);
      onUpdate('team.customBlocks', items);
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
      id="team" 
      data-section-key={sectionKey}
      className={`scroll-animate py-12 lg:py-20 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{ backgroundColor: content.backgroundColor }}
    >
      {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção Equipe', [
              { path: 'team.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'team.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'team.memberNameColor', label: 'Cor do Nome', value: content.memberNameColor, type: 'color' },
              { path: 'team.memberTitleColor', label: 'Cor do Cargo', value: content.memberTitleColor, type: 'color' },
              { path: 'team.memberTextColor', label: 'Cor do Texto', value: content.memberTextColor, type: 'color' },
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
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
                 <EditableWrapper
                    isEditMode={isEditMode}
                    isDraggable={true}
                    isResizable={false}
                    style={content.titleStyle}
                    onUpdate={onUpdate}
                    path="team.titleStyle"
                    className="scroll-animate"
                 >
                    <h2 
                      className="font-semibold text-4xl sm:text-5xl"
                      style={{ color: content.titleColor }}
                      data-editable={isEditMode}
                      onClick={() => isEditMode && onOpenModal('Editando Título da Seção', [
                        { path: 'team.title', label: 'Título', value: content.title, type: 'text' },
                        { path: 'team.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
                      ])}
                      dangerouslySetInnerHTML={{ __html: content.title }}
                   />
                 </EditableWrapper>
            </div>
            <div className="lg:col-span-2">
                <div className="space-y-6">
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
                
                {(content.members.length > 0 || isEditMode) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
                        {content.members.map((member, memberIndex) => {
                            if (!member.name && !isEditMode) return null;

                            if (!member.name && isEditMode) {
                                return (
                                    <div
                                        key={memberIndex}
                                        className="flex flex-col relative group p-4 border-2 border-dashed border-gray-400 rounded-lg items-center justify-center text-gray-500 h-full min-h-[200px] cursor-pointer hover:bg-gray-500/10"
                                        data-editable={isEditMode}
                                        onClick={() => onOpenModal(`Editando Novo Membro`, 
                                            [
                                                { path: `team.members[${memberIndex}].name`, label: 'Nome', value: member.name, type: 'text' },
                                                { path: `team.members[${memberIndex}].title`, label: 'Cargo', value: member.title, type: 'text' },
                                                { path: `team.members[${memberIndex}].imageUrl`, label: 'URL da Imagem', value: member.imageUrl, type: 'image' },
                                                { path: `team.members[${memberIndex}].achievements`, label: 'Realizações (uma por linha)', value: member.achievements.join('\n'), type: 'textarea' },
                                            ],
                                            () => {
                                                if (window.confirm('Tem certeza que deseja excluir este membro da equipe?')) {
                                                    onUpdate('team.members', memberIndex, 'DELETE_ITEM');
                                                    onCloseModal();
                                                }
                                            },
                                            () => {
                                                onUpdate('team.members', member, 'ADD_ITEM');
                                                onCloseModal();
                                            }
                                        )}
                                    >
                                        Membro Vazio. <br /> Clique para editar ou excluir.
                                    </div>
                                )
                            }
                            
                            return (
                                <div 
                                key={memberIndex} 
                                className="flex flex-col relative group scroll-animate"
                                style={{ transitionDelay: `${memberIndex * 150}ms` }}
                                data-editable={isEditMode}
                                onClick={() => isEditMode && onOpenModal(`Editando Membro: ${member.name}`, 
                                    [
                                    { path: `team.members[${memberIndex}].name`, label: 'Nome', value: member.name, type: 'text' },
                                    { path: `team.members[${memberIndex}].title`, label: 'Cargo', value: member.title, type: 'text' },
                                    { path: `team.members[${memberIndex}].imageUrl`, label: 'URL da Imagem', value: member.imageUrl, type: 'image' },
                                    { path: `team.members[${memberIndex}].achievements`, label: 'Realizações (uma por linha)', value: member.achievements.join('\n'), type: 'textarea' },
                                    ],
                                    () => {
                                        if (window.confirm('Tem certeza que deseja excluir este membro da equipe?')) {
                                            onUpdate('team.members', memberIndex, 'DELETE_ITEM');
                                            onCloseModal();
                                        }
                                    },
                                    () => {
                                        onUpdate('team.members', member, 'ADD_ITEM');
                                        onCloseModal();
                                    }
                                )}
                                >
                                    <div>
                                        <img src={member.imageUrl} alt={member.name} className="w-full rounded-2xl mb-6" />
                                    </div>
                                    <h3 
                                        className="font-semibold text-xl md:text-2xl"
                                        style={{ color: content.memberNameColor }}
                                        dangerouslySetInnerHTML={{ __html: member.name }}
                                    />
                                    <p 
                                        className="mb-4 text-lg"
                                        style={{ color: content.memberTitleColor }}
                                        dangerouslySetInnerHTML={{ __html: member.title }}
                                    />
                                    <div>
                                    <ul className="space-y-2 font-light text-sm list-disc list-inside" style={{ color: content.memberTextColor }}>
                                        {member.achievements.map((item, achievementIndex) => (
                                            <li key={achievementIndex} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                    </div>
                                </div>
                            )
                        })}
                        {isEditMode && <AddItemButton onClick={() => onUpdate('team.members', newContentDefaults.teamMember, 'ADD_ITEM')} text="Add Team Member" />}
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
