import React from 'react';
import { ArrowRight, Clock, Layers, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-14">
      {/* Product Tag */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/40 text-[#ff007f] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,127,0.2)]">
          <BookOpen className="w-3.5 h-3.5" />
          Learning Profile
        </div>
      </div>

      {/* Main Title & Hero */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-['Space_Grotesk'] leading-[1.15]">
          Descubre cómo aprendes mejor.
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
          «Un test interactivo para identificar tus preferencias de aprendizaje y recibir estrategias prácticas y personalizadas».
        </p>
      </div>

      {/* Primary Action Button: Comenzar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
        {hasSavedProgress ? (
          <>
            <button
              onClick={onResume}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#ff007f] hover:bg-[#ff1493] text-white text-base font-extrabold tracking-wide transition-all shadow-[0_0_30px_rgba(255,0,127,0.5)] hover:shadow-[0_0_40px_rgba(255,0,127,0.7)] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Continuar Cuestionario ({savedAnswersCount}/24)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-[#ff007f]/50 text-zinc-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
            >
              Comenzar desde cero
            </button>
          </>
        ) : (
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#ff1493] hover:from-[#ff1493] hover:to-[#ff007f] text-white text-lg font-extrabold tracking-wide transition-all shadow-[0_0_30px_rgba(255,0,127,0.5)] hover:shadow-[0_0_45px_rgba(255,0,127,0.8)] flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.98]"
          >
            <span>Comenzar</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Required Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-12">
        <div className="p-4 rounded-xl bg-[#09090d] border border-zinc-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f] mb-2">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-white font-bold text-sm">24 preguntas</span>
          <span className="text-zinc-400 text-xs mt-0.5">Distribución equitativa</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09090d] border border-zinc-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f] mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-white font-bold text-sm">5–7 minutos</span>
          <span className="text-zinc-400 text-xs mt-0.5">Respuestas breves</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09090d] border border-zinc-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f] mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-white font-bold text-sm">Seis dimensiones</span>
          <span className="text-zinc-400 text-xs mt-0.5">Medias aritméticas</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09090d] border border-zinc-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f] mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-white font-bold text-sm">Gratis y sin registro</span>
          <span className="text-zinc-400 text-xs mt-0.5">100% confidencial</span>
        </div>
      </div>

      {/* The 6 Dimensions Grid */}
      <div className="bg-[#08080c] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
              Las Seis Dimensiones Evaluadas
            </h2>
            <p className="text-xs text-zinc-400">
              Cada dimensión se calcula como la media aritmética de sus 4 preguntas correspondientes.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] self-start sm:self-auto">
            4 PREGUNTAS × 6 DIMENSIONES = 24
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dimensionKeys.map((key, index) => {
            const dim = DIMENSIONS[key];
            return (
              <div
                key={key}
                className="p-4 rounded-xl bg-black border border-zinc-800/70 hover:border-[#ff007f]/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-white group-hover:text-[#ff007f] transition-colors">
                    {dim.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#ff007f] font-bold">
                    0{index + 1}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {dim.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Honestidad Científica / Nota Aclaratoria */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#060609] text-xs text-zinc-400 flex items-start gap-3 mb-6">
        <ShieldCheck className="w-5 h-5 text-[#ff007f] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-zinc-200">Nota informativa:</strong> Este producto es un cuestionario orientativo de preferencias y estrategias de aprendizaje. Su objetivo es brindar pautas prácticas de reflexión personal y organización del estudio; no constituye un diagnóstico clínico ni una evaluación psicométrica validada.
        </p>
      </div>

      {/* Auditoría / Prueba Rápida */}
      <div className="p-3.5 rounded-xl border border-dashed border-[#ff007f]/30 bg-[#ff007f]/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-zinc-300 text-center sm:text-left">
          <strong>Acceso de auditoría:</strong> Permite simular respuestas para comprobar el cálculo de medias, empates y el plan de siete días.
        </span>
        <button
          onClick={onOpenAudit}
          className="px-3.5 py-1.5 rounded-lg bg-[#ff007f]/20 hover:bg-[#ff007f] text-white font-semibold transition-all shrink-0 cursor-pointer"
        >
          Cargar Pruebas
        </button>
      </div>
    </div>
  );
};
