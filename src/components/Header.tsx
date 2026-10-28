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
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-[#ff007f]/25 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff007f] to-[#ff1493] flex items-center justify-center shadow-[0_0_18px_rgba(255,0,127,0.5)] shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider uppercase text-white font-['Space_Grotesk']">
                Learning Profile
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 tracking-wider">
                24 ÍTEMS
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden xs:block">
              Preferencias y Estrategias de Aprendizaje
            </p>
          </div>
        </div>

        {/* Status / Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep === 'quiz' && (
            <div className="hidden sm:flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-zinc-400">Progreso:</span>
              <span className="font-bold text-[#ff007f]">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          )}

          {/* Audit / Test Fixtures button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/40 text-[#ff007f] hover:bg-[#ff007f]/20 hover:border-[#ff007f] transition-all shadow-[0_0_12px_rgba(255,0,127,0.15)] cursor-pointer"
            title="Herramientas para probar empates, perfiles y flujos rápidamente"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auditoría / Pruebas</span>
            <span className="sm:hidden">Test</span>
          </button>

          {/* Reset button if not on welcome screen */}
          {currentStep !== 'welcome' && (
            <button
              onClick={onRequestReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ff007f]/50 transition-all cursor-pointer"
              title="Reiniciar cuestionario y respuestas"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#ff007f]" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
