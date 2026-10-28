import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutGrid, AlertCircle } from 'lucide-react';
import { QUESTIONS, LIKERT_OPTIONS } from '../data/questions';
import { StoredAnswers } from '../types';

interface QuizScreenProps {
  currentIndex: number;
  answers: StoredAnswers;
  onAnswer: (questionId: number, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpToQuestion: (index: number) => void;
  onFinish: () => void;
  onOpenGrid: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  currentIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onFinish,
  onOpenGrid
}) => {
  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const currentAnswer = answers[currentQuestion.id];
  const [validationAttempted, setValidationAttempted] = useState(false);

  // Reset validation feedback when moving questions
  useEffect(() => {
    setValidationAttempted(false);
  }, [currentIndex]);

  // Keyboard navigation support (1-5 for options, Left/Right for nav)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or modal
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) {
        onAnswer(currentQuestion.id, num);
        setValidationAttempted(false);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNextClick();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion.id, currentAnswer]);

  const handleOptionSelect = (value: number) => {
    onAnswer(currentQuestion.id, value);
    setValidationAttempted(false);
  };

  const handleNextClick = () => {
    if (currentAnswer === undefined) {
      setValidationAttempted(true);
      return;
    }

    if (currentIndex === totalQuestions - 1) {
      onFinish();
    } else {
      onNext();
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Navigation & Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] font-bold">
              Pregunta {currentQuestion.id} de {totalQuestions}
            </span>
            <span className="text-zinc-400 hidden xs:inline">
              • {progressPercent}% completado
            </span>
          </div>

          <button
            onClick={onOpenGrid}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ff007f]/50 transition-colors cursor-pointer text-xs"
            title="Ver mapa de las 24 preguntas"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#ff007f]" />
            <span>Ver Mapa</span>
          </button>
        </div>

        {/* Progress Bar in Black & Hot Pink */}
        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-[#ff007f] to-[#ff1493] transition-all duration-300 shadow-[0_0_12px_rgba(255,0,127,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#09090d] border-2 border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative transition-all mb-6">
        {/* Dimension category label */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#ff007f] shadow-[0_0_8px_#ff007f]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Dimensión {Math.floor((currentQuestion.id - 1) / 4) + 1}/6:
          </span>
          <span className="text-xs font-bold text-[#ff007f]">
            {currentQuestion.dimensionName}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3 font-['Space_Grotesk']">
          «{currentQuestion.text}»
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6">
          {currentQuestion.subtext}
        </p>

        {/* Validation Warning if attempted without answer */}
        {validationAttempted && currentAnswer === undefined && (
          <div className="mb-5 p-3 rounded-xl bg-[#ff007f]/15 border border-[#ff007f] text-white text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-[#ff007f] shrink-0" />
            <span>Por favor, selecciona una opción de la escala antes de continuar.</span>
          </div>
        )}

        {/* 5-Point Likert Options */}
        <div className="space-y-2.5">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = currentAnswer === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleOptionSelect(opt.value)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#ff007f]/15 border-[#ff007f] text-white shadow-[0_0_20px_rgba(255,0,127,0.35)] ring-1 ring-[#ff007f]'
                    : 'bg-black/60 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white hover:bg-zinc-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {opt.value}
                  </span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'border-[#ff007f] bg-[#ff007f] text-white'
                      : 'border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard hints */}
        <div className="mt-4 pt-3 border-t border-zinc-900 hidden sm:flex items-center justify-between text-[11px] text-zinc-400">
          <span>Pulsa las teclas [1] a [5] para seleccionar</span>
          <span>[Enter] o [Flecha Der] para avanzar</span>
        </div>
      </div>

      {/* Navigation Buttons: Anterior & Siguiente */}
      <div className="flex items-center justify-between gap-3">
        {/* Navegación hacia atrás */}
        <button
          onClick={onPrev}
          className="px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-[#ff007f]/50 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
          title={currentIndex === 0 ? 'Volver a la pantalla inicial' : 'Volver a la pregunta anterior'}
        >
          <ArrowLeft className="w-4 h-4 text-[#ff007f]" />
          <span>{currentIndex === 0 ? 'Volver a Inicio' : 'Anterior'}</span>
        </button>

        {/* Siguiente / Ver Informe con validación */}
        <button
          onClick={handleNextClick}
          className={`px-7 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            currentAnswer === undefined
              ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-[#ff007f]/40'
              : 'bg-[#ff007f] hover:bg-[#ff1493] text-white shadow-[0_0_25px_rgba(255,0,127,0.5)] active:scale-[0.98]'
          }`}
        >
          <span>{isLastQuestion ? 'Finalizar y Ver Informe' : 'Siguiente'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
