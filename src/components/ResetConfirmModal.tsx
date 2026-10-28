import React from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#121018] border border-[#FF2D95]/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_35px_rgba(255,45,149,0.3)] relative text-[#FFF8FC]">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#B8ADBF] hover:text-[#FFF8FC] p-1 rounded-xl transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95]/40 flex items-center justify-center text-[#FF2D95] mb-4 shadow-[0_0_12px_#FF2D95]">
          <RotateCcw className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-xl font-bold tracking-tight text-[#FFF8FC] mb-2 font-['Space_Grotesk']">
          ¿Quieres empezar de nuevo?
        </h3>
        <p className="text-sm text-[#B8ADBF] leading-relaxed mb-6">
          Se borrarán las respuestas guardadas para que puedas responder las 24 preguntas desde cero cuando lo desees.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-[#2D2838] bg-[#181522] text-[#B8ADBF] hover:text-[#FFF8FC] hover:bg-[#201C2E] text-sm font-semibold transition-colors cursor-pointer"
          >
            Volver atrás
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FF2D95] hover:bg-[#FF69C8] text-white text-sm font-bold shadow-[0_0_20px_rgba(255,45,149,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};
