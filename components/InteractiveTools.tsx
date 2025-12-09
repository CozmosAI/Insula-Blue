
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SectionControls } from './shared/SectionControls';
import { EditField } from '../admin/EditModal';
import { EditableWrapper } from '../admin/EditableWrapper';
import { RightArrowIcon } from './icons/RightArrowIcon';


// --- TYPES ---
interface InteractiveToolsContent {
    show: boolean;
    title: string;
    description: string;
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    titleStyle: any;
    calculator: CalculatorContent;
    quiz: QuizContent;
}

interface CalculatorContent {
    tabTitle: string;
    title: string;
    initialAmountLabel: string;
    monthlyContributionLabel: string;
    annualRateLabel: string;
    yearsLabel: string;
    buttonText: string;
    resultsTitle: string;
    futureValueLabel: string;
    totalInvestedLabel: string;
    totalInterestLabel: string;
    chartLineColor: string;
    chartPrincipalColor: string;
}

interface QuizContent {
    tabTitle: string;
    title: string;
    buttonText: string;
    backButtonText: string;
    resultsButtonText: string;
    retakeButtonText: string;
    questions: QuizQuestion[];
    results: QuizResult[];
}

interface QuizQuestion {
    text: string;
    options: { text: string; score: number }[];
}

interface QuizResult {
    profile: string;
    scoreRange: [number, number];
    description: string;
    ctaText: string;
}

interface InteractiveToolsProps {
    content: InteractiveToolsContent;
    isEditMode: boolean;
    onUpdate: (path: string, value: any, action?: 'UPDATE' | 'ADD_ITEM' | 'DELETE_ITEM') => void;
    sectionKey: string;
    onMoveSection: (sectionKey: string, direction: 'up' | 'down') => void;
    onDeleteSection: (sectionKey: string) => void;
    isFirst: boolean;
    isLast: boolean;
    onOpenModal: (title: string, fields: EditField[], onDelete?: () => void, onClone?: () => void) => void;
}

// --- HELPERS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Custom hook for animating number count-up
const useCountUp = (target: number, duration = 800) => {
    const [count, setCount] = useState(0);
    const prevTarget = usePrevious(target) ?? 0;

    useEffect(() => {
        const start = prevTarget;
        const end = target;
        let startTime: number | null = null;
        
        if (start === end) {
            setCount(end);
            return;
        }

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easedProgress = 1 - Math.pow(1 - percentage, 3); // easeOutCubic
            const current = start + (end - start) * easedProgress;
            
            setCount(current);

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        
        requestAnimationFrame(animate);

    }, [target, duration, prevTarget]);

    return count;
};


// --- SUB-COMPONENTS ---
const InvestmentCalculator: React.FC<{ content: CalculatorContent }> = ({ content }) => {
    const [initialAmount, setInitialAmount] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [annualRate, setAnnualRate] = useState(8);
    const [years, setYears] = useState(10);
    const [result, setResult] = useState({ futureValue: 0, totalInvested: 0, totalInterest: 0 });

    const animatedFutureValue = useCountUp(result.futureValue);
    const animatedTotalInvested = useCountUp(result.totalInvested);
    const animatedTotalInterest = useCountUp(result.totalInterest);

    const chartData = useMemo(() => {
        if (!result) return null;
        const data = [];
        const monthlyRate = annualRate / 100 / 12;

        for (let i = 0; i <= years; i++) {
            let futureValue = initialAmount * Math.pow(1 + monthlyRate, i * 12);
            let futureValueMonthly = monthlyContribution * ((Math.pow(1 + monthlyRate, i * 12) - 1) / monthlyRate);
            const total = futureValue + futureValueMonthly;
            const totalInvested = initialAmount + (monthlyContribution * i * 12);
            data.push({ year: i, total, totalInvested });
        }
        return data;
    }, [result, initialAmount, monthlyContribution, annualRate, years]);
    
    const handleCalculate = () => {
        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = years * 12;

        const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, totalMonths);
        const futureValueMonthly = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

        const total = futureValueInitial + futureValueMonthly;
        const totalInvested = initialAmount + (monthlyContribution * totalMonths);
        const totalInterest = total - totalInvested;
        
        setResult({ futureValue: total, totalInvested, totalInterest });
    };
    
    useEffect(() => {
        handleCalculate();
    }, [initialAmount, monthlyContribution, annualRate, years]);

    const LineChart = () => {
        if (!chartData) return null;
        const width = 500, height = 300, padding = 50;
        const maxVal = chartData[chartData.length - 1].total;
        
        const getCoords = (year: number, value: number) => {
            const x = padding + (year / years) * (width - padding * 2);
            const y = height - padding - (value / maxVal) * (height - padding * 2);
            return { x, y };
        }

        const createPath = (key: 'total' | 'totalInvested') => chartData.map((d, i) => {
            const { x, y } = getCoords(d.year, d[key]);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-6">
                 <path d={createPath('total')} fill="none" stroke={content.chartLineColor} strokeWidth="3" style={{ transition: 'd 0.5s ease-in-out' }} />
                <path d={createPath('totalInvested')} fill="none" stroke={content.chartPrincipalColor} strokeWidth="2" strokeDasharray="5,5" style={{ transition: 'd 0.5s ease-in-out' }}/>
            </svg>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                 <div>
                    <label className="flex justify-between font-medium text-gray-700">
                        <span>{content.initialAmountLabel}</span>
                        <span key={initialAmount} className="font-bold text-gray-900 value-pop">{formatCurrency(initialAmount)}</span>
                    </label>
                    <input type="range" min="0" max="1000000" step="1000" value={initialAmount} onChange={e => setInitialAmount(Number(e.target.value))} className="w-full mt-2" />
                </div>
                <div>
                    <label className="flex justify-between font-medium text-gray-700">
                         <span>{content.monthlyContributionLabel}</span>
                         <span key={monthlyContribution} className="font-bold text-gray-900 value-pop">{formatCurrency(monthlyContribution)}</span>
                    </label>
                    <input type="range" min="0" max="20000" step="100" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full mt-2" />
                </div>
                <div>
                    <label className="flex justify-between font-medium text-gray-700">
                        <span>{content.annualRateLabel}</span>
                        <span key={annualRate} className="font-bold text-gray-900 value-pop">{annualRate.toFixed(1)}%</span>
                    </label>
                    <input type="range" min="1" max="20" step="0.5" value={annualRate} onChange={e => setAnnualRate(Number(e.target.value))} className="w-full mt-2" />
                </div>
                 <div>
                    <label className="flex justify-between font-medium text-gray-700">
                        <span>{content.yearsLabel}</span>
                        <span key={years} className="font-bold text-gray-900 value-pop">{years} anos</span>
                    </label>
                    <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full mt-2" />
                </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                
                    <>
                        <h4 className="text-xl font-semibold text-gray-800">{content.resultsTitle}</h4>
                        <LineChart />
                        <div className="mt-6 space-y-4 text-left">
                           <div className="flex justify-between items-baseline border-b pb-2">
                                <span className="text-gray-600">{content.totalInvestedLabel}:</span>
                                <span className="font-semibold text-lg text-gray-800" style={{color: content.chartPrincipalColor}}>{formatCurrency(animatedTotalInvested)}</span>
                            </div>
                           <div className="flex justify-between items-baseline border-b pb-2">
                                <span className="text-gray-600">{content.totalInterestLabel}:</span>
                                <span className="font-semibold text-lg text-green-600">{formatCurrency(animatedTotalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-2">
                                <span className="font-bold text-gray-900">{content.futureValueLabel}:</span>
                                <span className="font-bold text-2xl" style={{color: content.chartLineColor}}>{formatCurrency(animatedFutureValue)}</span>
                            </div>
                        </div>
                    </>
                
            </div>
        </div>
    );
};

const RiskQuiz: React.FC<{ content: QuizContent }> = ({ content }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<(number | undefined)[]>(Array(content.questions.length).fill(undefined));
    const [result, setResult] = useState<QuizResult | null>(null);

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = score;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < content.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResult();
        }
    };
    
    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateResult = () => {
        const totalScore = answers.reduce<number>((acc, score) => acc + (score || 0), 0);
        const finalResult = content.results.find(r => totalScore >= r.scoreRange[0] && totalScore <= r.scoreRange[1]);
        setResult(finalResult || null);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers(Array(content.questions.length).fill(undefined));
        setResult(null);
    };

    if (result) {
        return (
            <div className="text-center max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                <h3 className="text-3xl font-bold" style={{ color: '#00263E' }}>{result.profile}</h3>
                <p className="mt-4 text-gray-600">{result.description}</p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                     <a href="https://wa.me/554896969403?text=Quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Insula%20Blue" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 text-sm font-bold uppercase px-8 py-3 rounded-md hover:opacity-90 transition-opacity bg-blue-900 text-white">
                        <span>{result.ctaText}</span>
                        <RightArrowIcon className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={resetQuiz} className="text-sm font-bold uppercase px-8 py-3 rounded-md hover:bg-gray-200 transition-colors border border-gray-300">
                        {content.retakeButtonText}
                    </button>
                </div>
            </div>
        );
    }

    const question = content.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / content.questions.length) * 100;
    const isLastQuestion = currentQuestion === content.questions.length - 1;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-xl">
            <div className="mb-8">
                <div className="flex justify-between mb-1 text-sm font-medium text-gray-500">
                    <span>Pergunta {currentQuestion + 1} de {content.questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-800 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div key={currentQuestion} className="animate-fade-in">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-8">{question.text}</h3>
                <div className="space-y-4">
                    {question.options.map((option, index) => (
                        <div key={index} className="quiz-option">
                            <input 
                                type="radio" 
                                id={`q${currentQuestion}-o${index}`} 
                                name={`q${currentQuestion}`} 
                                value={option.score}
                                checked={answers[currentQuestion] === option.score}
                                onChange={() => handleAnswer(option.score)}
                            />
                            <label htmlFor={`q${currentQuestion}-o${index}`}>{option.text}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 flex justify-between items-center">
                <button 
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    className="text-sm font-bold uppercase px-6 py-3 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {content.backButtonText}
                </button>
                <button 
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === undefined}
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold uppercase px-6 py-3 rounded-md hover:opacity-90 transition-opacity bg-blue-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>{isLastQuestion ? content.resultsButtonText : content.buttonText}</span>
                    {!isLastQuestion && <RightArrowIcon className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const InteractiveTools: React.FC<InteractiveToolsProps> = ({ content, isEditMode, sectionKey, onMoveSection, onDeleteSection, isFirst, isLast, onOpenModal }) => {
    const [activeTab, setActiveTab] = useState('calculator');

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'calculator': return <InvestmentCalculator content={content.calculator} />;
            case 'quiz': return <RiskQuiz content={content.quiz} />;
            default: return null;
        }
    };
    
    const TabButton: React.FC<{tabKey: string, title: string}> = ({ tabKey, title }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`px-6 py-3 font-semibold text-lg rounded-t-lg transition-colors ${activeTab === tabKey ? 'bg-white text-blue-900 shadow-md' : 'bg-transparent text-gray-600 hover:bg-white/50'}`}
        >
            {title}
        </button>
    );

  return (
    <section 
      id="interactive-tools" 
      data-section-key={sectionKey}
      className={`scroll-animate py-12 lg:py-20 px-6 relative ${!content.show && isEditMode ? 'opacity-50 border-2 border-dashed border-red-400' : ''}`} 
      style={{backgroundColor: content.backgroundColor}}
    >
       {isEditMode && (
          <SectionControls
            onEdit={() => onOpenModal('Editando Seção "Ferramentas"', [
              { path: 'interactiveTools.show', label: 'Visibilidade da Seção', value: content.show, type: 'boolean' },
              { path: 'interactiveTools.backgroundColor', label: 'Cor de Fundo', value: content.backgroundColor, type: 'color' },
              { path: 'interactiveTools.titleColor', label: 'Cor do Título', value: content.titleColor, type: 'color' },
              { path: 'interactiveTools.descriptionColor', label: 'Cor da Descrição', value: content.descriptionColor, type: 'color' },
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
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <EditableWrapper
            isEditMode={isEditMode}
            isDraggable={true}
            isResizable={false}
            style={content.titleStyle}
            onUpdate={() => {}}
            path="interactiveTools.titleStyle"
            className="scroll-animate"
          >
            <h2 
              className="font-semibold text-4xl sm:text-5xl"
              style={{ color: content.titleColor }}
              data-editable={isEditMode}
              onClick={() => isEditMode && onOpenModal('Editando Título', [
                { path: 'interactiveTools.title', label: 'Título', value: content.title, type: 'text' },
              ])}
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
          </EditableWrapper>
          <div className="scroll-animate" style={{ transitionDelay: '150ms' }}>
             <p 
                className="mt-4 text-lg max-w-3xl mx-auto"
                style={{ color: content.descriptionColor }}
                data-editable={isEditMode}
                onClick={() => isEditMode && onOpenModal('Editando Descrição', [
                    { path: 'interactiveTools.description', label: 'Descrição', value: content.description, type: 'textarea' },
                ])}
                dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-center border-b border-gray-200 mb-8">
                <TabButton tabKey="calculator" title={content.calculator.tabTitle} />
                <TabButton tabKey="quiz" title={content.quiz.tabTitle} />
            </div>
            
            <div className="transition-opacity duration-300">
                {renderActiveComponent()}
            </div>
        </div>

      </div>
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default InteractiveTools;
