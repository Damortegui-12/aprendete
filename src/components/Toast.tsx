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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#121018]/95 border border-[#FF2D95]/60 text-[#FFF8FC] px-5 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(255,45,149,0.35)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="w-8 h-8 rounded-full bg-[#FF2D95]/20 border border-[#FF2D95] flex items-center justify-center text-[#FF2D95] shrink-0 shadow-[0_0_10px_#FF2D95]">
        <Check className="w-4 h-4 stroke-[2.5]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#FFF8FC]">{message}</p>
        <p className="text-xs text-[#B8ADBF] flex items-center gap-1 mt-0.5">
          <Sparkles className="w-3 h-3 text-[#FF2D95]" />
          Acción guardada
        </p>
      </div>
    </div>
  );
};
