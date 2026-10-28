import React from 'react';
import { BookOpen, RotateCcw, Wrench } from 'lucide-react';

interface HeaderProps {
  currentStep: 'welcome' | 'quiz' | 'report';
  answeredCount: number;
  totalQuestions: number;
  onOpenAudit: () => void;
  onRequestReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  answeredCount,
  totalQuestions,
  onOpenAudit,
  onRequestReset
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08070B]/90 backdrop-blur-md border-b border-[#252030] transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF2D95] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,45,149,0.4)] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#FFF8FC] font-['Space_Grotesk']">
                Learning Profile
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF2D95]/15 text-[#FF69C8] border border-[#FF2D95]/30 tracking-wider">
                24 PREGUNTAS
              </span>
            </div>
            <p className="text-xs text-[#B8ADBF] hidden xs:block">
              Descubre cómo aprendes mejor
            </p>
          </div>
        </div>

        {/* Status / Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep === 'quiz' && (
            <div className="hidden sm:flex items-center gap-2 bg-[#121018] border border-[#2D2838] rounded-xl px-3 py-1.5 text-xs shadow-inner">
              <span className="text-[#B8ADBF]">Progreso:</span>
              <span className="font-bold text-[#FF2D95]">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          )}

          {/* Audit / Test Fixtures button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FF2D95]/50 transition-all shadow-sm cursor-pointer"
            title="Herramientas para probar empates, perfiles y flujos rápidamente"
          >
            <Wrench className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span className="hidden sm:inline">Pruebas / Demo</span>
            <span className="sm:hidden">Test</span>
          </button>

          {/* Reset button if not on welcome screen */}
          {currentStep !== 'welcome' && (
            <button
              onClick={onRequestReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FF2D95]/50 transition-all cursor-pointer shadow-sm"
              title="Reiniciar cuestionario y respuestas"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
