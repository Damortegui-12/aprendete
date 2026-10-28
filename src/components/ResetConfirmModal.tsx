import React from 'react';
import { RotateCcw, X, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0a0a0f] border-2 border-[#ff007f] rounded-2xl p-6 shadow-[0_0_35px_rgba(255,0,127,0.3)] relative text-white">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f] mb-4">
          <RotateCcw className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white mb-2">
          ¿Deseas reiniciar el test?
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          Esta acción restablecerá todas las respuestas a las 24 preguntas, borrará los resultados calculados y te llevará de vuelta a la pantalla inicial.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#ff007f] hover:bg-[#ff1493] text-white text-sm font-bold shadow-[0_0_18px_rgba(255,0,127,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Sí, reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};
