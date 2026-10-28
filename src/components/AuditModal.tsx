import React from 'react';
import { X, Wrench, Scale, Sparkles, Shuffle, BookOpen } from 'lucide-react';
import { AUDIT_PRESETS } from '../utils/calculator';
import { StoredAnswers } from '../types';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (answers: StoredAnswers, directToReport: boolean) => void;
  onGenerateRandom: (directToReport: boolean) => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
  onGenerateRandom
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#121018] border border-[#FF2D95]/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_35px_rgba(255,45,149,0.3)] relative text-[#FFF8FC] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B8ADBF] hover:text-[#FFF8FC] p-1 rounded-xl transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95]/40 flex items-center justify-center text-[#FF2D95] shadow-[0_0_12px_#FF2D95]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#FFF8FC] font-['Space_Grotesk']">
              Pruebas Rápidas y Auditoría
            </h3>
            <p className="text-xs text-[#B8ADBF]">
              Carga escenarios precalculados para revisar los resultados de inmediato
            </p>
          </div>
        </div>

        <p className="text-sm text-[#B8ADBF] leading-relaxed mb-5">
          Puedes cargar conjuntos de respuestas predefinidas para comprobar las <strong>seis medias</strong>, la <strong className="text-[#FF69C8]">gráfica radial de 6 ejes</strong>, la generación del perfil personal y el reto de siete días.
        </p>

        <div className="space-y-3 mb-6">
          {/* Preset: Exact Tie Visual - Practical */}
          <div className="p-4 rounded-2xl border border-[#FF2D95]/40 bg-[#1A0E17] hover:border-[#FF2D95] transition-all">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#FF2D95]" />
                <h4 className="font-bold text-sm text-[#FFF8FC]">
                  {AUDIT_PRESETS.EXACT_TIE_VISUAL_PRACTICAL.name}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF2D95] text-white shadow-[0_0_8px_#FF2D95]">
                EMPATE EN 1.º
              </span>
            </div>
            <p className="text-xs text-[#B8ADBF] mb-3">
              {AUDIT_PRESETS.EXACT_TIE_VISUAL_PRACTICAL.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.EXACT_TIE_VISUAL_PRACTICAL.answers, false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FF2D95]/40 transition-colors cursor-pointer"
              >
                Cargar en cuestionario
              </button>
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.EXACT_TIE_VISUAL_PRACTICAL.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#FF2D95] hover:bg-[#FF69C8] text-white shadow-[0_0_15px_rgba(255,45,149,0.5)] transition-all cursor-pointer"
              >
                Ver resultados de empate
              </button>
            </div>
          </div>

          {/* Preset: Verbal and Social */}
          <div className="p-4 rounded-2xl border border-[#FFE45E]/30 bg-[#1A1810] hover:border-[#FFE45E]/60 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-[#FFE45E]" />
              <h4 className="font-bold text-sm text-[#FFF8FC]">
                {AUDIT_PRESETS.VERBAL_SOCIAL.name}
              </h4>
            </div>
            <p className="text-xs text-[#B8ADBF] mb-3">
              {AUDIT_PRESETS.VERBAL_SOCIAL.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.VERBAL_SOCIAL.answers, false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FFE45E]/40 transition-colors cursor-pointer"
              >
                Cargar en cuestionario
              </button>
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.VERBAL_SOCIAL.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#FF2D95] hover:bg-[#FF69C8] text-white shadow-[0_0_15px_rgba(255,45,149,0.5)] transition-all cursor-pointer"
              >
                Ver resultados
              </button>
            </div>
          </div>

          {/* Preset: Analytical and Metacognitive */}
          <div className="p-4 rounded-2xl border border-[#36CFFF]/30 bg-[#0E1724] hover:border-[#36CFFF]/60 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#36CFFF]" />
              <h4 className="font-bold text-sm text-[#FFF8FC]">
                {AUDIT_PRESETS.ANALYTICAL_STRUCTURED.name}
              </h4>
            </div>
            <p className="text-xs text-[#B8ADBF] mb-3">
              {AUDIT_PRESETS.ANALYTICAL_STRUCTURED.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.ANALYTICAL_STRUCTURED.answers, false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#36CFFF]/40 transition-colors cursor-pointer"
              >
                Cargar en cuestionario
              </button>
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.ANALYTICAL_STRUCTURED.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-bold bg-[#FF2D95] hover:bg-[#FF69C8] text-white shadow-[0_0_15px_rgba(255,45,149,0.5)] transition-all cursor-pointer"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-[#252030]">
          <button
            onClick={() => {
              onGenerateRandom(true);
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#181522] border border-[#2D2838] hover:border-[#FF2D95] text-[#FFF8FC] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#FF2D95]" />
            Generar respuestas aleatorias
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-semibold bg-[#121018] border border-[#2D2838] text-[#B8ADBF] hover:text-[#FFF8FC] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
