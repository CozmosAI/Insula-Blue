
import React, { useState, useEffect, useRef } from 'react';
import { SectionControls } from './shared/SectionControls';
import { AddItemButton } from './shared/AddItemButton';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';

// TYPES
interface ChartItemData {
  label: string;
  withIB: number[] | string;
  withoutIB: number[] | string;
}

interface ChartsContent {
  show: boolean;
  title: string;
  titleStyle: any;
  items: ChartItemData[];
  backgroundColor: string;
  titleColor: string;
  lineColorWithIB: string;
  lineColorWithoutIB: string;
  gridColor: string;
  labelColor: string;
}

interface ChartsProps {
    content: ChartsContent;
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

// UTILS
const parseChartData = (data: number[] | string): number[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        const parsed = data.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        return parsed.length > 0 ? parsed : [0];
    }
    return [0];
};

// --- BEZIER CURVE HELPERS ---
const line = (pointA: number[], pointB: number[]) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    };
};

const controlPoint = (current: number[], previous: number[] | undefined, next: number[] | undefined, reverse?: boolean, smoothing: number = 0.2) => {
    const p = previous || current;
    const n = next || current;
    const l = line(p, n);
    const angle = l.angle + (reverse ? Math.PI : 0);
    const length = l.length * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
};

const bezierCommand = (point: number[], i: number, a: number[][], smoothing: number = 0.2) => {
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point, false, smoothing);
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true, smoothing);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
};


// SUB-COMPONENT: LineChart
const LineChart: React.FC<{
    dataWith: number[];
    dataWithout: number[];
    colorWith: string;
    colorWithout: string;
    gridColor: string;
    labelColor: string;
    chartLabel: string;
    backgroundColor: string;
}> = ({ dataWith, dataWithout, colorWith, colorWithout, gridColor, labelColor, chartLabel, backgroundColor }) => {
    const [activePoint, setActivePoint] = useState<{ x: number, y: number, val: number, line: 'with' | 'without' } | null>(null);
    const pathWithRef = useRef<SVGPathElement>(null);
    const pathWithoutRef = useRef<SVGPathElement>(null);

    const width = 500;
    const height = 300;
    const padding = 40;

    const getPoints = (data: number[]) => {
        if (data.length < 1) return [];
        const maxVal = 100;
        const xStep = (width - padding * 2) / Math.max(1, data.length - 1);
        return data.map((val, i) => {
            const x = padding + i * xStep;
            const y = height - padding - ((Math.max(0, Math.min(100, val)) / maxVal) * (height - padding * 2));
            return { x, y, val };
        });
    };

    const pointsWith = getPoints(dataWith);
    const pointsWithout = getPoints(dataWithout);
    
    const generateSmoothPathData = (points: {x:number, y:number, val:number}[]) => {
        if (points.length < 2) return `M ${points[0]?.x || padding},${points[0]?.y || (height - padding)}`;
        const pointCoords = points.map(p => [p.x, p.y]);
        const d = pointCoords.reduce((acc, point, i, a) => i === 0
          ? `M ${point[0]},${point[1]}`
          : `${acc} ${bezierCommand(point, i, a)}`
        , '')
        return d;
    };
    
    const pathDataWith = generateSmoothPathData(pointsWith);
    const pathDataWithout = generateSmoothPathData(pointsWithout);
    const areaPathDataWith = pointsWith.length > 1 ? `${pathDataWith} L ${pointsWith[pointsWith.length-1].x},${height - padding} L ${pointsWith[0].x},${height - padding} Z` : '';
    const areaPathDataWithout = pointsWithout.length > 1 ? `${pathDataWithout} L ${pointsWithout[pointsWithout.length-1].x},${height - padding} L ${pointsWithout[0].x},${height - padding} Z` : '';
    
    useEffect(() => {
        const setupPath = (ref: React.RefObject<SVGPathElement>) => {
            if (ref.current) {
                const length = ref.current.getTotalLength();
                ref.current.style.setProperty('--line-length', `${length}`);
            }
        };
        setupPath(pathWithRef);
        setupPath(pathWithoutRef);
    }, [dataWith, dataWithout]);

    const gridLines = [0, 25, 50, 75, 100];
    const yPos = (val: number) => height - padding - ((val / 100) * (height - padding * 2));

    const xLabels = dataWith.map((_, i) => `Ano ${i+1}`);
    const xStep = (width - padding * 2) / Math.max(1, dataWith.length - 1);

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Gráfico de linhas para ${chartLabel}`} className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient id={`gradient-with-${chartLabel.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={colorWith} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={colorWith} stopOpacity={0.05} />
                    </linearGradient>
                     <linearGradient id={`gradient-without-${chartLabel.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={colorWithout} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={colorWithout} stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <g className="grid-lines">
                    {gridLines.map(val => (
                        <g key={val} className="text-xs" style={{ fill: labelColor }}>
                            <line x1={padding} y1={yPos(val)} x2={width - padding} y2={yPos(val)} stroke={gridColor} strokeWidth="0.5" />
                            <text x={padding - 8} y={yPos(val) + 4} textAnchor="end">{val}%</text>
                        </g>
                    ))}
                </g>
                 <g className="x-axis-labels">
                    {xLabels.map((label, i) => (
                        <text key={label} x={padding + i * xStep} y={height - padding + 20} textAnchor="middle" className="text-xs" style={{ fill: labelColor }}>
                            {label}
                        </text>
                    ))}
                </g>

                <path className="line-chart-area" d={areaPathDataWithout} fill={`url(#gradient-without-${chartLabel.replace(/\s+/g, '-')})`} />
                <path className="line-chart-area" d={areaPathDataWith} fill={`url(#gradient-with-${chartLabel.replace(/\s+/g, '-')})`} />

                <path ref={pathWithoutRef} className="line-chart-path" d={pathDataWithout} fill="none" stroke={colorWithout} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path ref={pathWithRef} className="line-chart-path" d={pathDataWith} fill="none" stroke={colorWith} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            
                <g className="data-points-with">
                    {pointsWith.map((p, i) => (
                        <circle
                            key={`with-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r="8"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setActivePoint({ ...p, line: 'with' })}
                            onMouseLeave={() => setActivePoint(null)}
                        />
                    ))}
                </g>

                 <g className="data-points-without">
                    {pointsWithout.map((p, i) => (
                        <circle
                            key={`without-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r="8"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setActivePoint({ ...p, line: 'without' })}
                            onMouseLeave={() => setActivePoint(null)}
                        />
                    ))}
                </g>

                 {activePoint && (
                    <circle
                        cx={activePoint.x}
                        cy={activePoint.y}
                        r="5"
                        fill={activePoint.line === 'with' ? colorWith : colorWithout}
                        stroke={backgroundColor || '#000'}
                        strokeWidth="2"
                        className="pointer-events-none"
                    />
                 )}
            </svg>

             {activePoint && (
                <div
                    className="absolute p-2 text-xs text-white bg-gray-900/80 backdrop-blur-sm rounded-md shadow-lg pointer-events-none transition-all"
                    style={{
                        left: activePoint.x,
                        top: activePoint.y - 45,
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <strong>{activePoint.line === 'with' ? 'Com a IB' : 'Sem a IB'}:</strong> {activePoint.val}%
                </div>
            )}
        </div>
    );
};


// MAIN COMPONENT
const Charts: React.FC<ChartsProps> = ({ content, isEditMode, onUpdate, newContentDefaults, onOpenModal, onCloseModal, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast }) => {
  return (
    <section 
      id="charts" 
      data-section-key={sectionKey}
      className={`scroll-animate py-12 lg:py-20 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{backgroundColor: content.backgroundColor}}
    >
       {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção de Gráficos', [
              { path: 'charts.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'charts.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'charts.lineColorWithIB', label: 'Cor da Linha (Com IB)', value: content.lineColorWithIB, type: 'color' },
              { path: 'charts.lineColorWithoutIB', label: 'Cor da Linha (Sem IB)', value: content.lineColorWithoutIB, type: 'color' },
              { path: 'charts.gridColor', label: 'Cor da Grade', value: content.gridColor, type: 'color' },
              { path: 'charts.labelColor', label: 'Cor dos Rótulos', value: content.labelColor, type: 'color' },
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
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
          <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={content.titleStyle}
            onUpdate={onUpdate}
            path="charts.titleStyle"
            className="scroll-animate"
          >
            <h2 
              className="font-semibold text-4xl sm:text-5xl"
              style={{ color: content.titleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título', [
                { path: 'charts.title', label: 'Título', value: content.title, type: 'text' },
                { path: 'charts.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
              ])}
            >{content.title}</h2>
          </EditableWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start justify-center max-w-7xl mx-auto">
          {content.items.map((item, index) => {
            const dataWith = parseChartData(item.withIB);
            const dataWithout = parseChartData(item.withoutIB);
            
            return (
              <div 
                key={index}
                className="flex flex-col items-center gap-4 scroll-animate relative"
                style={{ transitionDelay: `${index * 150}ms` }}
                data-editable={isEditMode}
                onClick={() => isEditMode && onOpenModal(`Editando Gráfico: ${item.label}`,
                  [
                    { path: `charts.items[${index}].label`, label: 'Rótulo', value: item.label, type: 'text' },
                    { path: `charts.items[${index}].withIB`, label: 'Dados "Com a IB" (separados por vírgula)', value: Array.isArray(item.withIB) ? item.withIB.join(', ') : item.withIB, type: 'textarea' },
                    { path: `charts.items[${index}].withoutIB`, label: 'Dados "Sem a IB" (separados por vírgula)', value: Array.isArray(item.withoutIB) ? item.withoutIB.join(', ') : item.withoutIB, type: 'textarea' },
                  ],
                  () => {
                      if (window.confirm('Tem certeza que deseja excluir este gráfico?')) {
                          onUpdate('charts.items', index, 'DELETE_ITEM');
                          onCloseModal();
                      }
                  },
                  () => {
                      onUpdate('charts.items', item, 'ADD_ITEM');
                      onCloseModal();
                  }
                )}
              >
                <LineChart 
                  dataWith={dataWith}
                  dataWithout={dataWithout}
                  colorWith={content.lineColorWithIB}
                  colorWithout={content.lineColorWithoutIB}
                  gridColor={content.gridColor}
                  labelColor={content.labelColor}
                  chartLabel={item.label}
                  backgroundColor={content.backgroundColor}
                />
                <h3 className="text-lg font-medium text-center mt-2" style={{ color: content.labelColor }}>
                  {item.label}
                </h3>
                <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-1 rounded-full" style={{ backgroundColor: content.lineColorWithIB }}></span>
                        <span style={{ color: content.labelColor }}>Com a IB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-1 rounded-full" style={{ backgroundColor: content.lineColorWithoutIB }}></span>
                        <span style={{ color: content.labelColor }}>Sem a IB</span>
                    </div>
                </div>
              </div>
            )
          })}
          {isEditMode && <AddItemButton onClick={() => onUpdate('charts.items', newContentDefaults.chartItem, 'ADD_ITEM')} />}
        </div>
      </div>
    </section>
  );
};

export default Charts;