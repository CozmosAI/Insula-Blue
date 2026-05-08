import React, { useState } from 'react';

const AdminToolbar: React.FC<{ content: any, onExit: () => void }> = ({ content, onExit }) => {
    const [showJson, setShowJson] = useState(false);
    const [jsonOutput, setJsonOutput] = useState('');

    const generateAndCopyJson = () => {
        const cleanedContent = { ...content };
        delete cleanedContent._newContentDefaults; // Remove temp data before generating JSON
        const output = JSON.stringify(cleanedContent, null, 2);
        setJsonOutput(output);
        setShowJson(true);
        navigator.clipboard.writeText(output)
            .then(() => {
                alert('JSON gerado e copiado para a área de transferência! Cole no chat para que eu possa salvar as alterações permanentemente.');
            })
            .catch(err => {
                console.error('Failed to copy JSON: ', err);
                alert('Falha ao copiar JSON. Por favor, copie manualmente da caixa de texto.');
            });
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-center items-center gap-4 z-[9999] shadow-lg">
                <span className="text-lg font-semibold">Modo de Edição Ativado</span>
                <button onClick={generateAndCopyJson} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Concluir e Gerar JSON
                </button>
                <button onClick={onExit} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Sair do Modo de Edição
                </button>
            </div>
            {showJson && (
                 <div className="fixed inset-0 bg-black bg-opacity-80 z-[10000] flex items-center justify-center p-4">
                     <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[80vh]">
                        <div className="p-4 border-b border-gray-700">
                             <h3 className="text-xl font-semibold text-white">JSON Gerado</h3>
                             <p className="text-sm text-gray-400 mt-1">Suas alterações foram aplicadas visualmente. Para torná-las permanentes, cole este JSON de volta no chat.</p>
                        </div>
                        <textarea 
                            readOnly 
                            value={jsonOutput} 
                            className="w-full bg-black text-green-400 font-mono p-4 text-sm flex-grow focus:outline-none"
                        />
                        <div className="p-4 bg-gray-900 border-t border-gray-700">
                             <button onClick={() => setShowJson(false)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors">
                                Fechar
                            </button>
                        </div>
                     </div>
                 </div>
            )}
        </>
    );
};

export default AdminToolbar;
