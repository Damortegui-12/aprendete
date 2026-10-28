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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#121018] border border-[#FF2D95]/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_35px_rgba(255,45,149,0.3)] relative text-[#FFF8FC]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B8ADBF] hover:text-[#FFF8FC] p-1 rounded-xl transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#FFF8FC] mb-1 font-['Space_Grotesk']">
          Mapa de las 24 preguntas
        </h3>
        <p className="text-xs text-[#B8ADBF] mb-6">
          Pulsa en cualquier número para revisar o cambiar tu respuesta libremente.
        </p>

        <div className="grid grid-cols-6 gap-2.5 mb-6">
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
                className={`h-11 rounded-2xl flex flex-col items-center justify-center relative font-bold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#FF2D95] text-white shadow-[0_0_15px_#FF2D95] scale-105'
                    : isAnswered
                    ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#A78BFA] hover:bg-[#8B5CF6]/30'
                    : 'bg-[#181522] border border-[#2D2838] text-[#B8ADBF] hover:border-[#FF2D95]/40 hover:text-white'
                }`}
              >
                <span>{q.id}</span>
                {isAnswered && !isCurrent && (
                  <Check className="w-3 h-3 text-[#A78BFA] absolute bottom-1 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-[#B8ADBF] pt-4 border-t border-[#252030]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF2D95] shadow-[0_0_8px_#FF2D95]" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6]" />
            <span>Respondida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#181522] border border-[#2D2838]" />
            <span>Pendiente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
