import React from 'react';
import {
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Compass,
  Zap
} from 'lucide-react';
import { DIMENSIONS } from '../data/questions';
import { DimensionKey } from '../types';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenAudit: () => void;
  hasSavedProgress: boolean;
  savedAnswersCount: number;
  onResume: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onOpenAudit,
  hasSavedProgress,
  savedAnswersCount,
  onResume
}) => {
  const dimensionKeys = Object.keys(DIMENSIONS) as DimensionKey[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-[#FFF8FC] relative">
      {/* Background Neon Lights and Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-[#FF2D95]/20 via-[#8B5CF6]/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-[240px] h-[240px] bg-[#36CFFF]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Brand Tag / Badge */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121018] border border-[#FF2D95]/40 text-[#FF69C8] text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(255,45,149,0.25)]">
          <Zap className="w-3.5 h-3.5 text-[#FF2D95] fill-[#FF2D95]" />
          Apréndete
        </div>
      </div>

      {/* Main Title & Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-[#FFF8FC] mb-5 font-['Space_Grotesk'] leading-[1.12]">
          Descubre cómo <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D95] via-[#FF69C8] to-[#8B5CF6] drop-shadow-[0_0_25px_rgba(255,45,149,0.45)]">
            aprendes mejor.
          </span>
        </h1>

        {/* Updated Main Message: EXACT PHRASING */}
        <p className="text-base sm:text-xl text-[#B8ADBF] leading-relaxed font-normal max-w-2xl mx-auto">
          «Identifica tus preferencias de aprendizaje, aprende estrategias prácticas y aprovecha al máximo tu potencial.{' '}
          <span className="text-[#FFF8FC] font-semibold block sm:inline">Totalmente personalizadas.</span>»
        </p>
      </div>

      {/* Primary Action Button: Comenzar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 relative z-10">
        {hasSavedProgress ? (
          <>
            <button
              onClick={onResume}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#FF2D95] hover:bg-[#FF69C8] text-white text-base font-extrabold tracking-wide transition-all shadow-[0_0_30px_rgba(255,45,149,0.6)] hover:shadow-[0_0_45px_rgba(255,45,149,0.85)] flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.98]"
            >
              <span>Continuar cuestionario ({savedAnswersCount}/24)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-[#2D2838] bg-[#121018] hover:border-[#FF2D95]/50 text-[#B8ADBF] hover:text-[#FFF8FC] text-sm font-semibold transition-all cursor-pointer"
            >
              Comenzar desde cero
            </button>
          </>
        ) : (
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-11 py-4.5 rounded-2xl bg-gradient-to-r from-[#FF2D95] to-[#e61e84] hover:from-[#FF69C8] hover:to-[#FF2D95] text-white text-lg font-extrabold tracking-wide transition-all shadow-[0_0_35px_rgba(255,45,149,0.65)] hover:shadow-[0_0_50px_rgba(255,45,149,0.9)] flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.98]"
          >
            <span>Comenzar</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        )}
      </div>

      {/* 4 Required Indicators Styled in Dark Luminous Glass */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-14 relative z-10">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/40 flex flex-col items-center text-center shadow-lg transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] flex items-center justify-center mb-2.5 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[#FFF8FC] font-bold text-sm">24 preguntas</span>
          <span className="text-[#B8ADBF] text-xs mt-0.5">Sencillas y directas</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121018] border border-[#2D2838] hover:border-[#FFE45E]/40 flex flex-col items-center text-center shadow-lg transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#FFE45E]/15 border border-[#FFE45E]/30 text-[#FFE45E] flex items-center justify-center mb-2.5 shadow-[0_0_12px_rgba(255,228,94,0.3)]">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[#FFF8FC] font-bold text-sm">5–7 minutos</span>
          <span className="text-[#B8ADBF] text-xs mt-0.5">A tu propio ritmo</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/40 flex flex-col items-center text-center shadow-lg transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#FF2D95]/15 border border-[#FF2D95]/30 text-[#FF69C8] flex items-center justify-center mb-2.5 shadow-[0_0_12px_rgba(255,45,149,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[#FFF8FC] font-bold text-sm">Seis dimensiones</span>
          <span className="text-[#B8ADBF] text-xs mt-0.5">Gráfica radial real</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121018] border border-[#2D2838] hover:border-[#36CFFF]/40 flex flex-col items-center text-center shadow-lg transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#36CFFF]/15 border border-[#36CFFF]/30 text-[#36CFFF] flex items-center justify-center mb-2.5 shadow-[0_0_12px_rgba(54,207,255,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[#FFF8FC] font-bold text-sm">Gratis y sin registro</span>
          <span className="text-[#B8ADBF] text-xs mt-0.5">100% privado</span>
        </div>
      </div>

      {/* The 6 Learning Skills Overview */}
      <div className="bg-[#121018] border border-[#2D2838] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#FFF8FC] font-['Space_Grotesk']">
              Las 6 formas de aprender que exploraremos
            </h2>
            <p className="text-xs text-[#B8ADBF]">
              Cada habilidad se evalúa con 4 preguntas para construir tu mapa radial y recomendaciones personalizadas.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1A1724] border border-[#2D2838] text-[#FF69C8] self-start sm:self-auto">
            4 preguntas × 6 habilidades = 24
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dimensionKeys.map((key) => {
            const dim = DIMENSIONS[key];
            return (
              <div
                key={key}
                className="p-4 rounded-2xl border transition-all group"
                style={{
                  backgroundColor: dim.theme.bg,
                  borderColor: dim.theme.border
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-[#FFF8FC] group-hover:text-[#FF69C8] transition-colors">
                    {dim.friendlyName}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: dim.theme.badgeBg,
                      color: dim.theme.badgeText,
                      borderColor: dim.theme.border
                    }}
                  >
                    Habilidad
                  </span>
                </div>
                <p className="text-xs text-[#B8ADBF] line-clamp-2 leading-relaxed">
                  {dim.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discrete Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121018] border border-[#2D2838] text-xs text-[#B8ADBF] flex items-start gap-3.5 mb-8 shadow-md relative z-10">
        <HeartHandshake className="w-5 h-5 text-[#FF2D95] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          «Este resultado es una guía para explorar tus preferencias de aprendizaje, no una etiqueta definitiva. Puedes aprender de muchas maneras y descubrir nuevas estrategias con la práctica».
        </p>
      </div>

      {/* Test / Audit Shortcut */}
      <div className="p-3.5 rounded-2xl border border-dashed border-[#2D2838] bg-[#0E0C14] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <span className="text-[#B8ADBF] text-center sm:text-left">
          <strong>Acceso de prueba:</strong> Puedes cargar respuestas de ejemplo para ver la gráfica radial y las recomendaciones de inmediato.
        </span>
        <button
          onClick={onOpenAudit}
          className="px-3.5 py-1.5 rounded-xl bg-[#1A1724] border border-[#2D2838] hover:border-[#FF2D95] text-[#FFF8FC] font-semibold transition-all shrink-0 cursor-pointer"
        >
          Cargar ejemplos
        </button>
      </div>
    </div>
  );
};
