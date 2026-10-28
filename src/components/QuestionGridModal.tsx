import React from 'react';
import { X, Check } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { StoredAnswers } from '../types';

interface QuestionGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  answers: StoredAnswers;
  onSelectQuestion: (index: number) => void;
}

export const QuestionGridModal: React.FC<QuestionGridModalProps> = ({
  isOpen,
  onClose,
  currentIndex,
  answers,
  onSelectQuestion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0a0a0f] border-2 border-[#ff007f] rounded-2xl p-6 shadow-[0_0_35px_rgba(255,0,127,0.3)] relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1 font-['Space_Grotesk']">
          Mapa de las 24 Preguntas
        </h3>
        <p className="text-xs text-zinc-400 mb-5">
          Haz clic en cualquier número para saltar directamente y revisar o modificar tu respuesta.
        </p>

        <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 sm:gap-2.5 mb-6">
          {QUESTIONS.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative font-bold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#ff007f] text-white ring-2 ring-white shadow-[0_0_15px_rgba(255,0,127,0.8)]'
                    : isAnswered
                    ? 'bg-[#ff007f]/20 border border-[#ff007f] text-white hover:bg-[#ff007f]/30'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span>{q.id}</span>
                {isAnswered && !isCurrent && (
                  <Check className="w-3 h-3 text-[#ff007f] absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#ff007f]" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#ff007f]/20 border border-[#ff007f]" />
            <span>Respondida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-zinc-950 border border-zinc-800" />
            <span>Pendiente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
