import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutGrid, AlertCircle, Sparkles } from 'lucide-react';
import { QUESTIONS, LIKERT_OPTIONS, DIMENSIONS } from '../data/questions';
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
  const currentDimension = DIMENSIONS[currentQuestion.dimensionKey];
  const [validationAttempted, setValidationAttempted] = useState(false);

  useEffect(() => {
    setValidationAttempted(false);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 text-[#FFF8FC]">
      {/* Top Navigation & Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#121018] border border-[#2D2838] text-[#FF69C8] font-bold shadow-[0_0_10px_rgba(255,45,149,0.2)]">
              Pregunta {currentQuestion.id} de {totalQuestions}
            </span>
            <span className="text-[#B8ADBF] hidden xs:inline">
              • {progressPercent}% completado
            </span>
          </div>

          <button
            onClick={onOpenGrid}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FF2D95]/50 transition-colors cursor-pointer text-xs"
            title="Ver mapa de las 24 preguntas"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span>Ver mapa</span>
          </button>
        </div>

        {/* Luminous Progress Bar */}
        <div className="w-full h-2.5 bg-[#121018] border border-[#231E2E] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF2D95] via-[#FF69C8] to-[#8B5CF6] transition-all duration-300 rounded-full shadow-[0_0_12px_#FF2D95]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card in Dark Surface with Subtle Glow */}
      <div className="bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/40 rounded-3xl p-6 sm:p-9 shadow-2xl relative transition-all mb-6">
        {/* Dimension indicator badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm"
            style={{
              backgroundColor: currentDimension.theme.badgeBg,
              color: currentDimension.theme.badgeText,
              borderColor: currentDimension.theme.border
            }}
          >
            {currentDimension.friendlyName}
          </span>
          <span className="text-xs text-[#B8ADBF]">
            Habilidad {Math.floor((currentQuestion.id - 1) / 4) + 1} de 6
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#FFF8FC] leading-snug mb-3 font-['Space_Grotesk']">
          «{currentQuestion.text}»
        </h2>
        <p className="text-sm text-[#B8ADBF] mb-7 leading-relaxed">
          {currentQuestion.subtext}
        </p>

        {/* Validation Warning */}
        {validationAttempted && currentAnswer === undefined && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95] text-[#FFF8FC] text-xs font-semibold flex items-center gap-2.5 animate-pulse shadow-[0_0_15px_rgba(255,45,149,0.3)]">
            <AlertCircle className="w-4 h-4 text-[#FF2D95] shrink-0" />
            <span>Elige una opción en la escala para continuar.</span>
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
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#220F1E] border-[#FF2D95] text-[#FFF8FC] shadow-[0_0_18px_rgba(255,45,149,0.35)] ring-1 ring-[#FF2D95]'
                    : 'bg-[#181522] border-[#2A2436] text-[#FFF8FC] hover:border-[#FF2D95]/40 hover:bg-[#1E1B2A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#FF2D95] text-white shadow-[0_0_10px_#FF2D95]'
                        : 'bg-[#121018] border border-[#2D2838] text-[#B8ADBF]'
                    }`}
                  >
                    {opt.value}
                  </span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'border-[#FF2D95] bg-[#FF2D95] text-white shadow-[0_0_8px_#FF2D95]'
                      : 'border-[#3D374D] bg-[#121018]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard hints */}
        <div className="mt-5 pt-4 border-t border-[#252030] hidden sm:flex items-center justify-between text-[11px] text-[#B8ADBF]">
          <span>Pulsa las teclas [1] a [5] para elegir</span>
          <span>[Enter] o [Flecha Der] para avanzar</span>
        </div>
      </div>

      {/* Navigation Buttons: Anterior & Siguiente */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          className="px-5 py-3 rounded-2xl border border-[#2D2838] bg-[#121018] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FF2D95]/40 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          title={currentIndex === 0 ? 'Volver a la pantalla inicial' : 'Volver a la pregunta anterior'}
        >
          <ArrowLeft className="w-4 h-4 text-[#FF2D95]" />
          <span>{currentIndex === 0 ? 'Volver a inicio' : 'Anterior'}</span>
        </button>

        <button
          onClick={handleNextClick}
          className={`px-7 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
            currentAnswer === undefined
              ? 'bg-[#1E1B2A] border border-[#2D2838] text-[#B8ADBF] hover:border-[#FF2D95]/40'
              : 'bg-[#FF2D95] hover:bg-[#FF69C8] text-white shadow-[0_0_25px_rgba(255,45,149,0.6)] active:scale-[0.98]'
          }`}
        >
          <span>{isLastQuestion ? 'Ver mis resultados' : 'Siguiente'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
