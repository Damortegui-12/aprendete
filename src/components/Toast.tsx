import React, { useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/95 border-2 border-[#ff007f] text-white px-5 py-3.5 rounded-xl shadow-[0_0_25px_rgba(255,0,127,0.45)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="w-8 h-8 rounded-full bg-[#ff007f]/20 border border-[#ff007f] flex items-center justify-center text-[#ff007f] shrink-0">
        <Check className="w-4 h-4 stroke-[2.5]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{message}</p>
        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
          <Sparkles className="w-3 h-3 text-[#ff007f]" />
          Acción ejecutada correctamente
        </p>
      </div>
    </div>
  );
};
