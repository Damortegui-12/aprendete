import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Compass,
  Check,
  HeartHandshake,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Radar
} from 'lucide-react';
import {
  DimensionResult,
  TieGroup,
  DayPlanItem,
  DimensionKey
} from '../types';
import {
  generatePersonalProfile,
  generateSectionARecommendations,
  generateSectionBRecommendations
} from '../utils/calculator';
import { DIMENSIONS } from '../data/questions';
import { RadarChart } from './RadarChart';

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
  const [selectedSkillKey, setSelectedSkillKey] = useState<DimensionKey | null>(null);

  // Top and lower skills
  const top1 = results[0];
  const top2 = results[1] || results[0];
  const lowest1 = results[results.length - 1];
  const lowest2 = results[results.length - 2] || lowest1;

  const isDominantTie = tieGroups.some((g) => g.isDominant);

  // Generate personal profile & recommendations
  const personalProfile = generatePersonalProfile(top1, top2, isDominantTie);
  const sectionARecs = generateSectionARecommendations(top1, top2);
  const sectionBRecs = generateSectionBRecommendations(lowest1, lowest2, top1);

  const completedDaysCount = dayPlan.filter((d) => d.completed).length;
  const planProgressPercent = Math.round((completedDaysCount / 7) * 100);

  // Real action: Copy report
  const handleCopyReport = async () => {
    const textReport = `===========================================
LEARNING PROFILE — ASÍ ES COMO TE RESULTA MÁS FÁCIL APRENDER
===========================================
Perfil: ${personalProfile.title}

${personalProfile.paragraph}

TUS FORMAS DE APRENDER (Medias de 1.00 a 5.00):
${results.map((r, i) => `${i + 1}. ${r.friendlyName.padEnd(30)}: ${r.mean.toFixed(2)}/5.00 — ${r.intensityLabel}`).join('\n')}

SECCIÓN A: APROVECHA LO QUE YA TE FUNCIONA
${sectionARecs.map((r) => `• ${r.title}\n  ${r.explanation}\n  Acción para hoy: ${r.actionToday}`).join('\n\n')}

SECCIÓN B: EXPLORA OTRAS FORMAS DE APRENDER
${sectionBRecs.map((r) => `• ${r.skillName}\n  Qué te aporta: ${r.whatItOffers}\n  Pequeño ejercicio: ${r.smallExercise}\n  Cómo combinarla: ${r.pairingSuggestion}`).join('\n\n')}

TU RETO DE 7 DÍAS PARA APRENDER MEJOR:
${dayPlan.map((d) => `[${d.completed ? 'COMPLETADO' : 'PENDIENTE'}] Día ${d.day} (${d.durationMinutes}): ${d.title}\n  ${d.instructions}\n  Reflexión: ${d.reflectionQuestion}`).join('\n\n')}

Aviso: Este resultado es una guía para explorar tus preferencias de aprendizaje, no una etiqueta definitiva. Puedes aprender de muchas maneras y descubrir nuevas estrategias con la práctica.
===========================================`;

    try {
      await navigator.clipboard.writeText(textReport);
      onShowToast('¡Resultados copiados al portapapeles!');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textReport;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onShowToast('¡Resultados copiados al portapapeles!');
    }
  };

  // Real action: Download TXT
  const handleDownloadTxt = () => {
    const textReport = `===========================================
LEARNING PROFILE — TUS RESULTADOS
===========================================
Perfil: ${personalProfile.title}
Fecha: ${new Date().toLocaleDateString('es-ES')}

${personalProfile.paragraph}

TUS HABILIDADES Y PUNTUACIONES:
${results.map((r) => `- ${r.friendlyName}: ${r.mean.toFixed(2)}/5.00 (${r.intensityLabel})`).join('\n')}

ESTRATEGIAS CLAVE:
${sectionARecs.map((r) => `* ${r.title}: ${r.explanation} (Acción: ${r.actionToday})`).join('\n')}

RETO DE 7 DÍAS:
${dayPlan.map((d) => `Día ${d.day}: ${d.title} (${d.durationMinutes})\n- Instrucciones: ${d.instructions}\n- Pregunta: ${d.reflectionQuestion}\n`).join('\n')}

Aviso: Este resultado es una guía para explorar tus preferencias de aprendizaje, no una etiqueta definitiva.
===========================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-profile-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Archivo guardado en tu dispositivo.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-[#FFF8FC] relative">
      {/* Background Neon Lights and Glows */}
      <div className="absolute top-10 right-1/4 w-[420px] h-[320px] bg-gradient-to-br from-[#FF2D95]/15 to-[#8B5CF6]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* 1. Header & Title: Así es como te resulta más fácil aprender */}
      <div className="mb-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121018] border border-[#FF2D95]/40 text-[#FF69C8] text-xs font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(255,45,149,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
            Tus resultados de aprendizaje
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 rounded-xl bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/50 text-[#B8ADBF] hover:text-[#FFF8FC] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Copiar resumen al portapapeles"
            >
              <Copy className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span className="hidden sm:inline">Copiar</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 rounded-xl bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/50 text-[#B8ADBF] hover:text-[#FFF8FC] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Descargar archivo de texto"
            >
              <Download className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span className="hidden sm:inline">Descargar .TXT</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/50 text-[#B8ADBF] hover:text-[#FFF8FC] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Imprimir o guardar en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FFF8FC] mb-3 font-['Space_Grotesk'] tracking-tight">
          «Así es como te resulta más fácil aprender»
        </h1>
        <p className="text-sm sm:text-base text-[#B8ADBF] leading-relaxed max-w-3xl">
          Tus respuestas nos dan algunas pistas sobre las formas de aprender que podrían funcionarte mejor. Descubre cómo aprovecharlas y qué otras habilidades puedes desarrollar.
        </p>
      </div>

      {/* 2. Tarjeta del Perfil Personal */}
      <div className="bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/50 rounded-3xl p-6 sm:p-9 shadow-2xl mb-10 relative overflow-hidden transition-all z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-[#FF69C8] uppercase tracking-wider block mb-1">
              Tu combinación principal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8FC] font-['Space_Grotesk'] leading-snug drop-shadow-sm">
              {personalProfile.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm"
              style={{
                backgroundColor: top1.meta.theme.badgeBg,
                color: top1.meta.theme.badgeText,
                borderColor: top1.meta.theme.border
              }}
            >
              {top1.friendlyName}
            </span>
            <span className="text-[#B8ADBF] text-xs font-bold">+</span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm"
              style={{
                backgroundColor: top2.meta.theme.badgeBg,
                color: top2.meta.theme.badgeText,
                borderColor: top2.meta.theme.border
              }}
            >
              {top2.friendlyName}
            </span>
          </div>
        </div>

        <p className="text-base text-[#FFF8FC] leading-relaxed mb-6 font-normal">
          {personalProfile.paragraph}
        </p>

        {/* 3 Preguntas Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-6 border-t border-[#252030]">
          <div className="p-4 rounded-2xl bg-[#181522] border border-[#2A2436]">
            <span className="text-xs font-bold text-[#FF69C8] block mb-1">
              1. ¿Qué te resulta más fácil?
            </span>
            <p className="text-xs text-[#B8ADBF] leading-relaxed">
              Apoyarte en {top1.friendlyName.toLowerCase()} ({top1.mean.toFixed(2)}/5) y {top2.friendlyName.toLowerCase()} ({top2.mean.toFixed(2)}/5).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#181522] border border-[#2A2436]">
            <span className="text-xs font-bold text-[#36CFFF] block mb-1">
              2. ¿Cómo aprovecharlo hoy?
            </span>
            <p className="text-xs text-[#B8ADBF] leading-relaxed">
              Combinando ambas vías en tus sesiones de estudio y proyectos personales.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#181522] border border-[#2A2436]">
            <span className="text-xs font-bold text-[#FFE45E] block mb-1">
              3. ¿Qué puedes explorar?
            </span>
            <p className="text-xs text-[#B8ADBF] leading-relaxed">
              Probar pequeñas dosis de {lowest1.friendlyName.toLowerCase()} sin presión.
            </p>
          </div>
        </div>
      </div>

      {/* 3. GRÁFICA RADIAL INTERACTIVA DE LAS SEIS HABILIDADES */}
      <section className="mb-12 relative z-10">
        <RadarChart
          results={results}
          selectedKey={selectedSkillKey}
          onSelectKey={(key) => setSelectedSkillKey(key)}
        />
      </section>

      {/* 4. SECCIÓN A — Aprovecha lo que ya te funciona */}
      <section className="mb-12 relative z-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95]/40 text-[#FF69C8] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(255,45,149,0.3)]">
            <CheckCircle2 className="w-5 h-5 text-[#FF2D95]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFF8FC] font-['Space_Grotesk']">
              SECCIÓN A — Aprovecha lo que ya te funciona
            </h3>
            <p className="text-xs text-[#B8ADBF]">
              Estrategias construidas sobre tus dos puntuaciones más altas para estudiar con mayor comodidad y eficacia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {sectionARecs.map((rec, i) => (
            <div
              key={rec.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#121018] border border-[#2D2838] hover:border-[#FF2D95]/50 shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[11px] font-bold text-[#FF69C8] uppercase tracking-wider block mb-1.5">
                  Recomendación 0{i + 1}
                </span>
                <h4 className="text-base font-bold text-[#FFF8FC] mb-2 font-['Space_Grotesk'] group-hover:text-[#FF69C8] transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#B8ADBF] leading-relaxed mb-3">
                  {rec.explanation}
                </p>
                <div className="p-3 rounded-2xl bg-[#181522] border border-[#282334] text-xs text-[#B8ADBF] mb-4">
                  <strong className="text-[#FFF8FC] block mb-0.5">Ejemplo concreto:</strong>
                  {rec.example}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1F0F1A] border border-[#FF2D95]/40 text-xs">
                <strong className="text-[#FF69C8] block mb-0.5 font-bold">
                  Acción para hoy:
                </strong>
                <p className="text-[#FFF8FC]">{rec.actionToday}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECCIÓN B — Explora otras formas de aprender */}
      <section className="mb-12 relative z-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#A78BFA] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Lightbulb className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFF8FC] font-['Space_Grotesk']">
              SECCIÓN B — Explora otras formas de aprender
            </h3>
            <p className="text-xs text-[#B8ADBF]">
              No son debilidades: son recursos adicionales para ampliar tu repertorio de estrategias cuando lo necesites.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {sectionBRecs.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-3xl bg-[#121018] border border-[#2D2838] hover:border-[#8B5CF6]/50 shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider">
                  Habilidad para explorar
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
                  Oportunidad
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#FFF8FC] mb-2 font-['Space_Grotesk']">
                {rec.skillName}
              </h4>

              <p className="text-xs sm:text-sm text-[#B8ADBF] leading-relaxed mb-4">
                {rec.whatItOffers}
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#181522] border border-[#282334]">
                  <strong className="text-[#36CFFF] block mb-0.5">En qué situación te ayuda:</strong>
                  <p className="text-[#B8ADBF]">{rec.everydaySituation}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#181522] border border-[#282334]">
                  <strong className="text-[#FFE45E] block mb-0.5 font-bold">
                    Pequeño ejercicio para probar:
                  </strong>
                  <p className="text-[#B8ADBF]">{rec.smallExercise}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1F0F1A] border border-[#FF2D95]/40 text-xs">
                  <strong className="text-[#FF69C8] block mb-0.5 font-bold">
                    Cómo combinarla con lo que ya te funciona:
                  </strong>
                  <p className="text-[#FFF8FC]">{rec.pairingSuggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Plan de Acción: Tu reto de 7 días para aprender mejor */}
      <section className="mb-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-[#121018] border border-[#2D2838] mb-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#FF2D95] text-white flex items-center justify-center shadow-[0_0_12px_#FF2D95]">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-[#FFF8FC] font-['Space_Grotesk']">
                Tu reto de 7 días para aprender mejor
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#B8ADBF]">
              Pequeños experimentos para descubrir qué te funciona.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xl font-black text-[#FF69C8] font-mono">
                {completedDaysCount}/7
              </span>
              <span className="text-[10px] text-[#B8ADBF] uppercase block font-semibold">
                Completados ({planProgressPercent}%)
              </span>
            </div>
            <button
              onClick={() => {
                onResetDayPlan();
                onShowToast('Reto de 7 días restablecido.');
              }}
              className="py-1.5 px-3 rounded-xl bg-[#181522] border border-[#2D2838] text-xs text-[#B8ADBF] hover:text-[#FFF8FC] hover:border-[#FF2D95]/40 transition-colors cursor-pointer"
              title="Restablecer casillas del reto"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#121018] border border-[#231E2E] rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#FF2D95] via-[#FF69C8] to-[#8B5CF6] transition-all duration-300 rounded-full shadow-[0_0_12px_#FF2D95]"
            style={{ width: `${planProgressPercent}%` }}
          />
        </div>

        {/* 7 Daily Activities */}
        <div className="space-y-3 mb-6">
          {dayPlan.map((item) => (
            <div
              key={item.day}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                item.completed
                  ? 'bg-[#101E17] border-[#10B981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-[#121018] border-[#2D2838] hover:border-[#FF2D95]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleDayPlan(item.day);
                      onShowToast(
                        item.completed
                          ? `Día ${item.day} desmarcado`
                          : `¡Genial! Día ${item.day} completado 🎉`
                      );
                    }}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                      item.completed
                        ? 'bg-[#10B981] border-[#10B981] text-white shadow-[0_0_10px_#10B981]'
                        : 'bg-[#1A1724] border-[#3A3348] hover:border-[#FF2D95] text-transparent'
                    }`}
                    title={item.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FF69C8]">
                        DÍA {item.day}
                      </span>
                      <span className="text-[11px] text-[#B8ADBF] font-semibold">
                        • {item.durationMinutes}
                      </span>
                      <span className="text-[11px] text-[#B8ADBF] hidden sm:inline">
                        • {item.theme}
                      </span>
                    </div>
                    <h4
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        item.completed ? 'text-[#B8ADBF] line-through' : 'text-[#FFF8FC]'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>

                {item.completed && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 shrink-0">
                    Completado
                  </span>
                )}
              </div>

              <div className="pl-10 space-y-2 text-xs text-[#B8ADBF]">
                <p className="leading-relaxed">
                  <strong className="text-[#FFF8FC]">Instrucciones:</strong> {item.instructions}
                </p>
                <div className="p-3 rounded-2xl bg-[#181522] border border-[#282334] text-[#FFF8FC]">
                  <span className="text-[#FF69C8] font-bold block mb-0.5">Pregunta de reflexión:</span>
                  <p className="italic text-[#B8ADBF]">«{item.reflectionQuestion}»</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Reflection Box */}
        <div className="p-6 rounded-3xl bg-[#121018] border border-[#2D2838] shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#FF2D95]" />
            <h4 className="text-sm font-bold text-[#FFF8FC] font-['Space_Grotesk']">
              Al finalizar tu semana de experimentos, pregúntate:
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-[#B8ADBF] pl-5 list-disc leading-relaxed">
            <li><strong>¿Qué actividad me ayudó más?</strong> Observa cuál de los 7 días te dio mejores resultados prácticos.</li>
            <li><strong>¿Qué pude recordar sin consultar mis apuntes?</strong> Comprueba el impacto de la evocación activa.</li>
            <li><strong>¿Qué estrategia quiero seguir utilizando?</strong> Incorpora de forma permanente una o dos técnicas a tu rutina.</li>
          </ul>
        </div>
      </section>

      {/* Discrete Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121018] border border-[#2D2838] text-xs text-[#B8ADBF] flex items-start gap-3.5 mb-8 shadow-md relative z-10">
        <HeartHandshake className="w-5 h-5 text-[#FF2D95] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          «Este resultado es una guía para explorar tus preferencias de aprendizaje, no una etiqueta definitiva. Puedes aprender de muchas maneras y descubrir nuevas estrategias con la práctica».
        </p>
      </div>

      {/* Reset Section */}
      <div className="pt-6 border-t border-[#252030] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-xs text-[#B8ADBF] text-center sm:text-left">
          ¿Quieres repetir el cuestionario para evaluar otra materia o contexto de estudio?
        </p>

        <button
          onClick={onRequestReset}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#2D2838] bg-[#121018] hover:border-[#FF2D95]/50 text-[#B8ADBF] hover:text-[#FFF8FC] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#FF2D95]" />
          <span>Repetir el cuestionario</span>
        </button>
      </div>
    </div>
  );
};
