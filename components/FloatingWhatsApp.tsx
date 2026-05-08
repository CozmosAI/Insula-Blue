import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface FloatingWhatsAppProps {
    href: string;
    backgroundColor?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ href, backgroundColor = '#25D366' }) => {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group hover:shadow-green-500/30 bg-green-500"
            style={{ backgroundColor }}
            aria-label="Fale conosco no WhatsApp"
        >
             <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-50 pointer-events-none"></div>
             <div className="relative">
                <WhatsAppIcon className="w-8 h-8 text-white" />
             </div>
             <div className="absolute right-full mr-4 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none hidden md:block">
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 transform"></div>
                Fale Conosco
             </div>
        </a>
    );
};