import React from 'react';
import { X, Wrench, Scale, BookOpen, Layers, CheckCircle2, Shuffle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#09090d] border-2 border-[#ff007f] rounded-2xl p-6 sm:p-7 shadow-[0_0_40px_rgba(255,0,127,0.35)] relative text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff007f]/20 border border-[#ff007f] flex items-center justify-center text-[#ff007f]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              Herramientas de Auditoría y Verificación
            </h3>
            <p className="text-xs text-zinc-400">
              Prueba los flujos completos, validaciones y resolución de empates en 1 clic
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-5">
          Carga conjuntos de respuestas precalculadas para verificar la exactitud matemática de las <strong className="text-white">seis medias</strong>, la identificación de las <strong className="text-white">dos dimensiones más altas</strong>, la <strong className="text-white">ordenación</strong> y la <strong className="text-[#ff007f]">gestión de empates</strong>.
        </p>

        <div className="space-y-3 mb-6">
          {/* Preset: Exact Tie Visual - Analytical */}
          <div className="p-4 rounded-xl border border-[#ff007f]/60 bg-[#ff007f]/10 hover:bg-[#ff007f]/15 transition-all">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#ff007f]" />
                <h4 className="font-bold text-sm text-white">
                  {AUDIT_PRESETS.EXACT_TIE_VISUAL_ANALYTICAL.name}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff007f] text-white">
                AUDITORÍA EMPATE
              </span>
            </div>
            <p className="text-xs text-zinc-300 mb-3">
              {AUDIT_PRESETS.EXACT_TIE_VISUAL_ANALYTICAL.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.EXACT_TIE_VISUAL_ANALYTICAL.answers, false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 hover:border-[#ff007f] text-zinc-200 transition-colors cursor-pointer"
              >
                Cargar en Cuestionario
              </button>
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.EXACT_TIE_VISUAL_ANALYTICAL.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-[#ff007f] hover:bg-[#ff1493] text-white transition-all shadow-[0_0_12px_rgba(255,0,127,0.4)] cursor-pointer"
              >
                Ver Informe de Empate Directo
              </button>
            </div>
          </div>

          {/* Preset: Practical and Social */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-[#ff007f]/40 transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-[#ff007f]" />
              <h4 className="font-bold text-sm text-white">
                {AUDIT_PRESETS.PRACTICAL_SOCIAL.name}
              </h4>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              {AUDIT_PRESETS.PRACTICAL_SOCIAL.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.PRACTICAL_SOCIAL.answers, false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 hover:border-[#ff007f] text-zinc-200 transition-colors cursor-pointer"
              >
                Cargar en Cuestionario
              </button>
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.PRACTICAL_SOCIAL.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-[#ff007f]/30 hover:bg-[#ff007f] text-white border border-[#ff007f]/60 transition-all cursor-pointer"
              >
                Ver Informe
              </button>
            </div>
          </div>

          {/* Preset: Autonomous Verbal */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-[#ff007f]/40 transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-[#ff007f]" />
              <h4 className="font-bold text-sm text-white">
                {AUDIT_PRESETS.AUTONOMOUS_VERBAL.name}
              </h4>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              {AUDIT_PRESETS.AUTONOMOUS_VERBAL.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.AUTONOMOUS_VERBAL.answers, false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 hover:border-[#ff007f] text-zinc-200 transition-colors cursor-pointer"
              >
                Cargar en Cuestionario
              </button>
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.AUTONOMOUS_VERBAL.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-[#ff007f]/30 hover:bg-[#ff007f] text-white border border-[#ff007f]/60 transition-all cursor-pointer"
              >
                Ver Informe
              </button>
            </div>
          </div>

          {/* Preset: 6-way neutral tie */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-[#ff007f]/40 transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <Scale className="w-4 h-4 text-[#ff007f]" />
              <h4 className="font-bold text-sm text-white">
                {AUDIT_PRESETS.ALL_NEUTRAL_TIE.name}
              </h4>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              {AUDIT_PRESETS.ALL_NEUTRAL_TIE.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyPreset(AUDIT_PRESETS.ALL_NEUTRAL_TIE.answers, true);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-zinc-900 border border-zinc-700 hover:border-[#ff007f] text-zinc-200 transition-colors cursor-pointer"
              >
                Ver Informe de Empate Hexagonal
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-zinc-800">
          <button
            onClick={() => {
              onGenerateRandom(false);
              onClose();
            }}
            className="w-full sm:w-auto py-2 px-3 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 hover:border-[#ff007f] text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#ff007f]" />
            Generar 24 Respuestas Aleatorias
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2 px-4 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
