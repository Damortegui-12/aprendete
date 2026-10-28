import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Compass,
  ArrowUpDown,
  Check,
  ShieldCheck,
  Award
} from 'lucide-react';
import { DimensionResult, TieGroup, DayPlanItem, DimensionKey } from '../types';
import { DIMENSIONS } from '../data/questions';

interface ReportScreenProps {
  results: DimensionResult[];
  tieGroups: TieGroup[];
  dayPlan: DayPlanItem[];
  onToggleDayPlan: (day: number) => void;
  onResetDayPlan: () => void;
  onRequestReset: () => void;
  onShowToast: (message: string) => void;
  onSimulateTie: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  results,
  tieGroups,
  dayPlan,
  onToggleDayPlan,
  onResetDayPlan,
  onRequestReset,
  onShowToast,
  onSimulateTie
}) => {
  const [sortMode, setSortMode] = useState<'ranked' | 'original'>('ranked');
  const [activeTab, setActiveTab] = useState<'all' | 'means' | 'top2' | 'ties' | 'recommendations' | 'plan'>('all');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [expandedDim, setExpandedDim] = useState<string | null>(results[0]?.key || null);
  const [tieBreakChoice, setTieBreakChoice] = useState<string | null>(null);

  // The two highest dimensions
  const primary = results[0];
  const secondary = results[1] || results[0];
  const lowest = results[results.length - 1];

  // Dominant tie check
  const dominantTie = tieGroups.find((g) => g.isDominant);
  const otherTies = tieGroups.filter((g) => !g.isDominant);

  // Sorting
  const displayResults = [...results].sort((a, b) => {
    if (sortMode === 'original') {
      const order: DimensionKey[] = [
        'visual_espacial',
        'verbal_explicativo',
        'practico_experiencial',
        'analitico_estructurado',
        'social_colaborativo',
        'autorregulacion_metacognicion'
      ];
      return order.indexOf(a.key) - order.indexOf(b.key);
    }
    return b.mean - a.mean;
  });

  const completedDaysCount = dayPlan.filter((d) => d.completed).length;
  const planProgressPercent = Math.round((completedDaysCount / 7) * 100);

  const toggleDayExpanded = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Real action: Copy report
  const handleCopyReport = async () => {
    const textReport = `===========================================
INFORME: LEARNING PROFILE - PREFERENCIAS DE APRENDIZAJE
===========================================
Fecha: ${new Date().toLocaleDateString('es-ES')}

LAS DOS DIMENSIONES MÁS ALTAS:
1. ${primary.name}: Media ${primary.mean.toFixed(2)} / 5.00 (${primary.percentage}% afinidad)
2. ${secondary.name}: Media ${secondary.mean.toFixed(2)} / 5.00 (${secondary.percentage}% afinidad)
${dominantTie ? `\n¡EMPATE EN PRIMER LUGAR!: ${dominantTie.dimensions.map((d) => d.shortName).join(' y ')} con media ${dominantTie.mean.toFixed(2)}\nPerfil Híbrido: ${dominantTie.hybridName || 'Co-dominante'}\n${dominantTie.hybridDescription}` : ''}

LAS SEIS MEDIAS ARITMÉTICAS (Orden de mayor a menor):
${results.map((r, i) => `${i + 1}. ${r.name.padEnd(38)}: Media ${r.mean.toFixed(2)} / 5.00 (${r.percentage}% afinidad) [Suma: ${r.sum}/20 pts] ${r.isTied ? '(Empatada)' : ''}`).join('\n')}

ESTILOS EMPATADOS:
${tieGroups.length > 0 ? tieGroups.map((g) => `- Media ${g.mean.toFixed(2)}: ${g.dimensions.map((d) => d.shortName).join(' y ')} (${g.hybridName || 'Empate'})`).join('\n') : 'No se registraron empates en el perfil.'}

RECOMENDACIONES PRÁCTICAS PERSONALIZADAS:
- Fortaleza Principal (${primary.shortName}): ${primary.meta.coreStrength}
- Técnica Recomendada: ${primary.meta.techniques.join(', ')}
- Pauta Clave: ${primary.meta.practicalAdvice}
- Segunda Fortaleza (${secondary.shortName}): ${secondary.meta.practicalAdvice}
- Para equilibrar tu dimensión menor (${lowest.shortName}): ${lowest.meta.practicalAdvice}

PLAN DE APRENDIZAJE DE SIETE DÍAS:
${dayPlan.map((d) => `[${d.completed ? 'COMPLETADO' : 'PENDIENTE'}] Día ${d.day} (${d.theme}): ${d.objective}\n  Tarea: ${d.actionTask}\n  Reflexión: ${d.reflectionPrompt}`).join('\n\n')}

Nota: Cuestionario orientativo de preferencias y estrategias de aprendizaje.
===========================================`;

    try {
      await navigator.clipboard.writeText(textReport);
      onShowToast('¡Informe completo copiado al portapapeles!');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textReport;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onShowToast('¡Informe completo copiado al portapapeles!');
    }
  };

  // Real action: Download TXT
  const handleDownloadTxt = () => {
    const textReport = `===========================================
INFORME: LEARNING PROFILE
===========================================
Fecha de evaluación: ${new Date().toLocaleDateString('es-ES')}

LAS DOS DIMENSIONES MÁS ALTAS:
1. ${primary.name} — Media: ${primary.mean.toFixed(2)} / 5.00
2. ${secondary.name} — Media: ${secondary.mean.toFixed(2)} / 5.00
${dominantTie ? `Empate Dominante: ${dominantTie.hybridName}\n` : ''}

LAS SEIS MEDIAS CALCULADAS (Escala 1 a 5):
${results.map((r, i) => `#${i + 1} ${r.name}: Media ${r.mean.toFixed(2)} | Suma ${r.sum}/20 pts | Afinidad ${r.percentage}%`).join('\n')}

ESTRATEGIAS RECOMENDADAS:
- ${primary.name}: ${primary.meta.practicalAdvice}
- ${secondary.name}: ${secondary.meta.practicalAdvice}

PLAN DE APRENDIZAJE DE SIETE DÍAS:
${dayPlan.map((d) => `Día ${d.day}: ${d.title}\nObjetivo: ${d.objective}\nAcción: ${d.actionTask}\nReflexión: ${d.reflectionPrompt}\n`).join('\n')}
===========================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-profile-informe-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Archivo descargado con éxito.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-white">
      {/* Top Banner: Profile Overview */}
      <div className="bg-[#09090d] border-2 border-[#ff007f] rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(255,0,127,0.35)] relative mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff007f]/20 border border-[#ff007f] text-[#ff007f] text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,0,127,0.3)]">
              <Sparkles className="w-3.5 h-3.5" />
              Informe de Preferencias de Aprendizaje
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#ff007f] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copiar informe al portapapeles"
              >
                <Copy className="w-3.5 h-3.5 text-[#ff007f]" />
                <span className="hidden sm:inline">Copiar Informe</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#ff007f] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Descargar informe como archivo de texto"
              >
                <Download className="w-3.5 h-3.5 text-[#ff007f]" />
                <span className="hidden sm:inline">Descargar .TXT</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#ff007f] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Imprimir informe o guardar como PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#ff007f]" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 font-['Space_Grotesk'] leading-tight">
            {dominantTie ? (
              <>
                Perfil Co-dominante: <span className="text-[#ff007f]">{dominantTie.hybridName}</span>
              </>
            ) : (
              <>
                Preferencia Principal: <span className="text-[#ff007f]">{primary.name}</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl mb-6">
            {dominantTie ? dominantTie.hybridDescription : primary.meta.summary}
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Media Principal
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#ff007f] font-['Space_Grotesk']">
                {primary.mean.toFixed(2)}
                <span className="text-xs text-zinc-400 font-normal"> / 5.00</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Segunda Media
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
                {secondary.mean.toFixed(2)}
                <span className="text-xs text-zinc-400 font-normal"> / 5.00</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Segunda Dimensión
              </span>
              <span className="text-sm sm:text-base font-bold text-zinc-200 block truncate">
                {secondary.shortName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Dimensión Menor
              </span>
              <span className="text-sm sm:text-base font-bold text-zinc-400 block truncate">
                {lowest.shortName} ({lowest.mean.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-zinc-900 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Vista Completa
        </button>
        <button
          onClick={() => setActiveTab('top2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'top2'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Las Dos Más Altas
        </button>
        <button
          onClick={() => setActiveTab('means')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'means'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Las Seis Medias ({results.length})
        </button>
        <button
          onClick={() => setActiveTab('ties')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'ties'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Gestión de Empates {tieGroups.length > 0 && `(${tieGroups.length})`}
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'recommendations'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Recomendaciones Prácticas
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'plan'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Plan de 7 Días</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/60 text-[10px] font-extrabold text-[#ff007f]">
            {completedDaysCount}/7
          </span>
        </button>
      </div>

      {/* SECTION: LAS DOS DIMENSIONES MÁS ALTAS */}
      {(activeTab === 'all' || activeTab === 'top2') && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Tus Dos Dimensiones Más Altas
              </h2>
              <p className="text-xs text-zinc-400">
                Las estrategias prioritarias que potencian tu asimilación y rendimiento de estudio
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top 1 */}
            <div className="p-6 rounded-2xl bg-[#0e0a12] border-2 border-[#ff007f] shadow-[0_0_25px_rgba(255,0,127,0.25)] relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]">
                  #1 Dimensión Principal
                </span>
                <span className="text-xl font-mono font-black text-[#ff007f]">
                  {primary.mean.toFixed(2)} / 5.00
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-['Space_Grotesk']">
                {primary.name}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {primary.meta.summary}
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-black border border-zinc-800">
                  <strong className="text-white block mb-0.5">Fortaleza clave:</strong>
                  <p className="text-zinc-300">{primary.meta.coreStrength}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-[#ff007f]/30">
                  <strong className="text-[#ff007f] block mb-0.5">Estrategia recomendada:</strong>
                  <p className="text-zinc-200">{primary.meta.practicalAdvice}</p>
                </div>
              </div>
            </div>

            {/* Top 2 */}
            <div className="p-6 rounded-2xl bg-[#08080c] border border-zinc-800 hover:border-[#ff007f]/50 transition-all relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                  #2 Segunda Dimensión
                </span>
                <span className="text-xl font-mono font-black text-white">
                  {secondary.mean.toFixed(2)} / 5.00
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-['Space_Grotesk']">
                {secondary.name}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {secondary.meta.summary}
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-black border border-zinc-800">
                  <strong className="text-white block mb-0.5">Fortaleza clave:</strong>
                  <p className="text-zinc-300">{secondary.meta.coreStrength}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-zinc-800">
                  <strong className="text-zinc-300 block mb-0.5">Estrategia complementaria:</strong>
                  <p className="text-zinc-300">{secondary.meta.practicalAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: TIES ANALYSIS (GESTIÓN DE EMPATES) */}
      {(activeTab === 'all' || activeTab === 'ties') && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Diagnóstico y Gestión de Empates
                </h2>
                <p className="text-xs text-zinc-400">
                  Verificación de puntuaciones iguales y resolución guiada de co-dominancia
                </p>
              </div>
            </div>

            <button
              onClick={onSimulateTie}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#ff007f] text-xs text-zinc-300 transition-colors cursor-pointer"
              title="Cargar un empate exacto para auditar este componente"
            >
              <Scale className="w-3.5 h-3.5 text-[#ff007f]" />
              <span>Simular Empate 5.00</span>
            </button>
          </div>

          {dominantTie ? (
            <div className="p-6 rounded-2xl bg-[#0e0a12] border-2 border-[#ff007f] shadow-[0_0_30px_rgba(255,0,127,0.3)] mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ff007f] text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_#ff007f]">
                  <Scale className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff007f]/20 border border-[#ff007f] text-xs font-extrabold text-[#ff007f] mb-1.5">
                    EMPATE EN EL PRIMER PUESTO DETECTADO
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                    {dominantTie.hybridName}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Las dimensiones{' '}
                    <strong className="text-white">
                      {dominantTie.dimensions.map((d) => d.name).join(' y ')}
                    </strong>{' '}
                    han obtenido exactamente la misma media aritmética de{' '}
                    <strong className="text-[#ff007f] font-mono">
                      {dominantTie.mean.toFixed(2)} / 5.00
                    </strong>{' '}
                    ({dominantTie.dimensions[0].sum} puntos en 4 preguntas cada una).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-[#ff007f]/40 mb-5">
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {dominantTie.hybridDescription}
                </p>
              </div>

              {/* Interactive tie-breaker selector */}
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#ff007f]" />
                  Criterio de Priorización Guiado:
                </h4>
                <p className="text-xs text-zinc-400 mb-3">
                  ¿A cuál de estos enfoques prefieres recurrir cuando el tiempo de estudio es limitado o el contenido es muy difícil?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dominantTie.dimensions.map((dim) => {
                    const isSelected = tieBreakChoice === dim.key;
                    return (
                      <button
                        key={dim.key}
                        onClick={() => {
                          setTieBreakChoice(dim.key);
                          onShowToast(`Prioridad asignada a ${dim.shortName}`);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff007f]/20 border-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] ring-1 ring-[#ff007f]'
                            : 'bg-black/60 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">{dim.shortName}</span>
                          <span className="text-[10px] text-[#ff007f] font-mono font-bold">
                            Media {dim.mean.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 line-clamp-2">
                          {dim.meta.coreStrength}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {tieBreakChoice && (
                  <p className="text-xs text-[#ff007f] font-semibold mt-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Has priorizado <strong>{DIMENSIONS[tieBreakChoice as DimensionKey]?.name}</strong> como estrategia central en situaciones de alta demanda.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#09090d] border border-zinc-800/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ff007f]/10 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Jerarquía Clara sin Empate en el Puesto #1
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tu dimensión más alta ({primary.shortName}: {primary.mean.toFixed(2)}) supera con claridad a tu segunda dimensión ({secondary.shortName}: {secondary.mean.toFixed(2)}), definiendo un perfil claro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {otherTies.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Otros Empates en el Perfil:
              </h4>
              {otherTies.map((tg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#ff007f]" />
                    <span>
                      Empate en la media <strong className="text-white font-mono">{tg.mean.toFixed(2)}</strong>: {tg.dimensions.map((d) => d.shortName).join(' y ')}.
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    Posición compartida
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION: LAS SEIS MEDIAS (THE SIX MEANS & ORDERING) */}
      {(activeTab === 'all' || activeTab === 'means') && (
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
                  Las Seis Medias Aritméticas
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f]">
                  6/6
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Media aritmética de las 4 preguntas de cada dimensión (escala de 1.00 a 5.00).
              </p>
            </div>

            {/* Sorting toggle */}
            <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0">
              <button
                onClick={() => setSortMode('ranked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sortMode === 'ranked'
                    ? 'bg-[#ff007f] text-white shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>De mayor a menor</span>
              </button>
              <button
                onClick={() => setSortMode('original')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sortMode === 'original'
                    ? 'bg-[#ff007f] text-white shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Orden de Cuestionario
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="bg-[#09090d] border border-zinc-800/80 rounded-2xl p-6 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Puntuaciones Comparativas de las Seis Dimensiones
            </h3>
            <div className="space-y-3.5">
              {displayResults.map((dim) => {
                const isTop = dim.rank === 1;
                return (
                  <div key={dim.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-black text-[10px] ${
                            isTop
                              ? 'bg-[#ff007f] text-white'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                          }`}
                        >
                          #{dim.rank}
                        </span>
                        <span className="font-bold text-white">{dim.name}</span>
                        {dim.isTied && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] font-bold">
                            Empate
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 font-mono text-[11px]">
                          {dim.sum}/20 pts
                        </span>
                        <span className="font-mono font-black text-sm text-[#ff007f]">
                          {dim.mean.toFixed(2)}
                          <span className="text-zinc-500 text-xs font-normal"> / 5.00</span>
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isTop
                            ? 'bg-gradient-to-r from-[#ff007f] to-[#ff1493] shadow-[0_0_15px_#ff007f]'
                            : 'bg-[#ff007f]/60'
                        }`}
                        style={{ width: `${(dim.mean / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards for each dimension */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayResults.map((dim) => {
              const isExpanded = expandedDim === dim.key;
              const isTop = dim.rank === 1;

              return (
                <div
                  key={dim.key}
                  className={`rounded-2xl border transition-all p-5 ${
                    isTop
                      ? 'bg-[#0e0a12] border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.25)]'
                      : 'bg-[#08080c] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            isTop
                              ? 'bg-[#ff007f] text-white shadow-[0_0_8px_#ff007f]'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                          }`}
                        >
                          #{dim.rank} {isTop ? 'Principal' : ''}
                        </span>
                        {dim.isTied && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40">
                            Empate
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                        {dim.name}
                      </h3>
                      <p className="text-xs text-zinc-400">{dim.tagline}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-[#ff007f] font-mono block">
                        {dim.mean.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Media (1-5)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {dim.meta.summary}
                  </p>

                  <button
                    onClick={() => setExpandedDim(isExpanded ? null : dim.key)}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#ff007f]/50 text-xs font-semibold text-zinc-300 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Ocultar técnicas y detalles' : 'Ver técnicas y recomendaciones'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs animate-in fade-in duration-200">
                      <div>
                        <strong className="text-white block mb-1">Técnicas recomendadas:</strong>
                        <ul className="space-y-1 text-zinc-300 pl-4 list-disc">
                          {dim.meta.techniques.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-zinc-200 block mb-1">Puntos de fricción a vigilar:</strong>
                        <ul className="space-y-1 text-zinc-400 pl-4 list-disc">
                          {dim.meta.vulnerabilities.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-black border border-zinc-800 text-zinc-300">
                        <strong className="text-[#ff007f] block mb-1">Consejo práctico:</strong>
                        <p>{dim.meta.practicalAdvice}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400">
                        <strong className="text-white block mb-0.5">Entorno de estudio ideal:</strong>
                        <p>{dim.meta.idealEnvironment}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION: RECOMENDACIONES (RECOMMENDATIONS) */}
      {(activeTab === 'all' || activeTab === 'recommendations') && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Recomendaciones Prácticas Personalizadas
              </h2>
              <p className="text-xs text-zinc-400">
                Estrategias aplicadas para tus preferencias más destacadas y desarrollo de flexibilidad
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Rec 1 */}
            <div className="p-5 rounded-2xl bg-[#09090d] border border-zinc-800/90 relative">
              <div className="w-8 h-8 rounded-lg bg-[#ff007f]/20 text-[#ff007f] flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">
                Maximizar tu Fortaleza ({primary.shortName})
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                {primary.meta.coreStrength}
              </p>
              <div className="p-3 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-400">
                <strong className="text-white block mb-0.5">Acción inmediata:</strong>
                {primary.meta.practicalAdvice}
              </div>
            </div>

            {/* Rec 2 */}
            <div className="p-5 rounded-2xl bg-[#09090d] border border-zinc-800/90 relative">
              <div className="w-8 h-8 rounded-lg bg-[#ff007f]/20 text-[#ff007f] flex items-center justify-center mb-3">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">
                Prevenir Puntos de Fricción
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                {primary.meta.vulnerabilities[0]}
              </p>
              <div className="p-3 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-400">
                <strong className="text-white block mb-0.5">Estrategia preventiva:</strong>
                Combina sesiones con técnicas de {secondary.shortName} para mantener la frescura y evitar el agotamiento metodológico.
              </div>
            </div>

            {/* Rec 3 */}
            <div className="p-5 rounded-2xl bg-[#09090d] border border-zinc-800/90 relative">
              <div className="w-8 h-8 rounded-lg bg-[#ff007f]/20 text-[#ff007f] flex items-center justify-center mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">
                Desarrollar tu Dimensión Menor ({lowest.shortName})
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Tu puntuación menor fue en {lowest.name} ({lowest.mean.toFixed(2)}). Incorporar pequeñas dosis de esta dimensión aumentará tu adaptabilidad ante cualquier formato de estudio.
              </p>
              <div className="p-3 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-400">
                <strong className="text-white block mb-0.5">Micro-ejercicio:</strong>
                {lowest.meta.practicalAdvice}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: PLAN DE APRENDIZAJE DE SIETE DÍAS */}
      {(activeTab === 'all' || activeTab === 'plan') && (
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e0a12] border-2 border-[#ff007f]/50 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#ff007f] text-white flex items-center justify-center shadow-[0_0_12px_#ff007f]">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Plan de Aprendizaje de Siete Días
                </h2>
              </div>
              <p className="text-xs text-zinc-300">
                Retos y micro-ejercicios estructurados día a día para poner a prueba y optimizar tus métodos de estudio.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-xl font-black text-[#ff007f] font-mono">
                  {completedDaysCount}/7
                </span>
                <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                  Completados ({planProgressPercent}%)
                </span>
              </div>
              <button
                onClick={() => {
                  onResetDayPlan();
                  onShowToast('Progreso del plan de 7 días restablecido.');
                }}
                className="py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-[#ff007f]/50 transition-colors cursor-pointer"
                title="Restablecer checkboxes del plan"
              >
                Reiniciar días
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 mb-6">
            <div
              className="h-full bg-gradient-to-r from-[#ff007f] to-[#ff1493] transition-all duration-300 shadow-[0_0_15px_#ff007f]"
              style={{ width: `${planProgressPercent}%` }}
            />
          </div>

          {/* Daily Cards */}
          <div className="space-y-3">
            {dayPlan.map((item) => {
              const isExpanded = !!expandedDays[item.day];

              return (
                <div
                  key={item.day}
                  className={`rounded-2xl border transition-all ${
                    item.completed
                      ? 'bg-black/90 border-[#ff007f]/60 shadow-[0_0_15px_rgba(255,0,127,0.15)]'
                      : 'bg-[#08080c] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Interactive checkbox */}
                      <button
                        type="button"
                        onClick={() => {
                          onToggleDayPlan(item.day);
                          onShowToast(
                            item.completed
                              ? `Día ${item.day} marcado como pendiente`
                              : `¡Día ${item.day} completado!`
                          );
                        }}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          item.completed
                            ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_12px_#ff007f]'
                            : 'bg-zinc-950 border-zinc-700 hover:border-[#ff007f] text-transparent'
                        }`}
                        title={item.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#ff007f]">
                            DÍA {item.day}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-semibold uppercase">
                            • {item.theme}
                          </span>
                        </div>
                        <h4
                          className={`text-sm sm:text-base font-bold transition-colors ${
                            item.completed ? 'text-zinc-400 line-through' : 'text-white'
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDayExpanded(item.day)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Expandir o contraer día"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 space-y-3 border-t border-zinc-900 animate-in fade-in duration-150">
                      <div>
                        <strong className="text-white block mb-0.5">Objetivo:</strong>
                        <p className="text-zinc-300">{item.objective}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-black border border-[#ff007f]/30">
                        <strong className="text-[#ff007f] block mb-0.5">
                          Tarea Práctica / Micro-ejercicio:
                        </strong>
                        <p className="text-zinc-200">{item.actionTask}</p>
                      </div>

                      <div>
                        <strong className="text-zinc-400 block mb-0.5">Pregunta de Reflexión Metacognitiva:</strong>
                        <p className="italic text-zinc-400">«{item.reflectionPrompt}»</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Honestidad Científica en Informe */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#060609] text-xs text-zinc-400 flex items-start gap-3 mb-8">
        <ShieldCheck className="w-5 h-5 text-[#ff007f] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-zinc-200">Aviso informativo:</strong> Este cuestionario tiene carácter orientativo y formativo. Su función es facilitar la autorreflexión y proporcionar estrategias prácticas de estudio personalizadas. No constituye una evaluación psicométrica estandarizada ni un diagnóstico neuropsicológico.
        </p>
      </div>

      {/* Reset Section */}
      <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-400">
            ¿Deseas responder nuevamente el cuestionario para evaluar otra materia o contexto?
          </p>
        </div>

        <button
          onClick={onRequestReset}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-[#ff007f]/10 hover:border-[#ff007f] text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4 text-[#ff007f]" />
          <span>Reiniciar Cuestionario Completo</span>
        </button>
      </div>
    </div>
  );
};
