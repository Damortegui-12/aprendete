import { DIMENSIONS, QUESTIONS, HYBRID_TIE_DESCRIPTIONS } from '../data/questions';
import { DimensionKey, DimensionResult, StoredAnswers, TieGroup, DayPlanItem } from '../types';

export const DIMENSION_KEYS: DimensionKey[] = [
  'visual_espacial',
  'verbal_explicativo',
  'practico_experiencial',
  'analitico_estructurado',
  'social_colaborativo',
  'autorregulacion_metacognicion'
];

export function calculateDimensionResults(answers: StoredAnswers): DimensionResult[] {
  const sums: Record<DimensionKey, number> = {
    visual_espacial: 0,
    verbal_explicativo: 0,
    practico_experiencial: 0,
    analitico_estructurado: 0,
    social_colaborativo: 0,
    autorregulacion_metacognicion: 0
  };

  const counts: Record<DimensionKey, number> = {
    visual_espacial: 0,
    verbal_explicativo: 0,
    practico_experiencial: 0,
    analitico_estructurado: 0,
    social_colaborativo: 0,
    autorregulacion_metacognicion: 0
  };

  QUESTIONS.forEach((q) => {
    const val = answers[q.id] || 3; // Default to neutral if omitted
    sums[q.dimensionKey] += val;
    counts[q.dimensionKey] += 1;
  });

  // Calculate arithmetic means for each of the 6 dimensions
  const unsorted: DimensionResult[] = DIMENSION_KEYS.map((key) => {
    const sum = sums[key];
    const count = counts[key] || 4;
    const mean = Number((sum / count).toFixed(2));
    const percentage = Math.round(((mean - 1) / 4) * 100);

    return {
      key,
      name: DIMENSIONS[key].name,
      shortName: DIMENSIONS[key].shortName,
      tagline: DIMENSIONS[key].tagline,
      mean,
      sum,
      percentage,
      rank: 1,
      isTied: false,
      tiedKeys: [],
      meta: DIMENSIONS[key]
    };
  });

  // Sort descending by mean score (ordenación de mayor a menor)
  const sorted = [...unsorted].sort((a, b) => b.mean - a.mean);

  // Assign ranks and detect ties
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const tiedWith = sorted.filter(
      (other) => other.key !== current.key && Math.abs(other.mean - current.mean) < 0.001
    );

    if (tiedWith.length > 0) {
      current.isTied = true;
      current.tiedKeys = tiedWith.map((t) => t.key);
    } else {
      current.isTied = false;
      current.tiedKeys = [];
    }

    if (i > 0 && Math.abs(current.mean - sorted[i - 1].mean) < 0.001) {
      current.rank = sorted[i - 1].rank;
    } else {
      current.rank = i + 1;
    }
  }

  return sorted;
}

export function detectTieGroups(results: DimensionResult[]): TieGroup[] {
  const groupsMap = new Map<number, DimensionResult[]>();

  results.forEach((res) => {
    const current = groupsMap.get(res.mean) || [];
    current.push(res);
    groupsMap.set(res.mean, current);
  });

  const tieGroups: TieGroup[] = [];

  groupsMap.forEach((dims, mean) => {
    if (dims.length > 1) {
      const isDominant = dims.some((d) => d.rank === 1);
      let hybridName: string | undefined;
      let hybridDescription: string | undefined;

      if (dims.length === 2) {
        const pairKey = `${dims[0].key}-${dims[1].key}`;
        const pairKeyRev = `${dims[1].key}-${dims[0].key}`;
        const lookup = HYBRID_TIE_DESCRIPTIONS[pairKey] || HYBRID_TIE_DESCRIPTIONS[pairKeyRev];
        if (lookup) {
          hybridName = lookup.title;
          hybridDescription = lookup.desc;
        } else {
          hybridName = `Perfil Híbrido: ${dims[0].shortName} y ${dims[1].shortName}`;
          hybridDescription = `Presentas una afinidad equilibrada en ${dims[0].name} y ${dims[1].name}. Ambas estrategias conviven como pilares principales en tu forma de aprender.`;
        }
      } else {
        hybridName = `Perfil Multidimensional (${dims.length} dimensiones empatadas)`;
        hybridDescription = `Has obtenido una puntuación media idéntica de ${mean.toFixed(2)} en ${dims.map((d) => d.shortName).join(', ')}. Esto indica una alta flexibilidad para alternar entre diferentes métodos según el contexto del aprendizaje.`;
      }

      tieGroups.push({
        mean,
        dimensions: dims,
        isDominant,
        hybridName,
        hybridDescription
      });
    }
  });

  return tieGroups.sort((a, b) => b.mean - a.mean);
}

export function generate7DayPlan(
  dominant: DimensionResult,
  secondary: DimensionResult | undefined,
  lowest: DimensionResult
): DayPlanItem[] {
  const domKey = dominant.key;
  const secKey = secondary ? secondary.key : dominant.key;
  const lowKey = lowest.key;

  return [
    {
      day: 1,
      title: `Día 1: Diagnóstico y Auditoría de tu Enfoque Principal`,
      theme: dominant.shortName,
      dimensionKey: domKey,
      objective: `Identificar cómo influye tu preferencia principal (${dominant.name}) en tus hábitos de estudio actuales.`,
      actionTask: `Elige un tema que estés aprendiendo hoy. Aplica de forma deliberada la técnica clave de ${dominant.shortName}: ${dominant.meta.techniques[0]}. Toma notas durante 20 minutos empleando este formato.`,
      reflectionPrompt: `¿Noté mayor agilidad mental o retención al alinear el estudio con mi preferencia dominante?`,
      completed: false
    },
    {
      day: 2,
      title: `Día 2: Integración de tu Segunda Fortaleza`,
      theme: secondary ? secondary.shortName : 'Estrategia Combinada',
      dimensionKey: secKey,
      objective: `Combinar tu estilo dominante con tu segunda dimensión más alta (${secondary?.name || dominant.name}).`,
      actionTask: `Combina ambas fortalezas: utiliza ${dominant.meta.techniques[1] || dominant.meta.techniques[0]} junto con ${secondary?.meta.techniques[0] || 'la técnica Feynman'}. Registra cómo se complementan.`,
      reflectionPrompt: `¿Qué ventajas encontré al unir estas dos estrategias en una misma sesión de estudio?`,
      completed: false
    },
    {
      day: 3,
      title: `Día 3: Optimización del Entorno y Eliminación de Fricciones`,
      theme: 'Condiciones de Estudio',
      dimensionKey: domKey,
      objective: `Acondicionar tu espacio de trabajo para potenciar tus preferencias de aprendizaje.`,
      actionTask: `Aplica la recomendación de entorno para tu perfil: "${dominant.meta.idealEnvironment}". Retira cualquier distractor que interfiera con este modelo de procesamiento.`,
      reflectionPrompt: `¿Cómo influyó el cambio ambiental en mi nivel de concentración sostenida?`,
      completed: false
    },
    {
      day: 4,
      title: `Día 4: Exploración Guiada de tu Dimensión Menor`,
      theme: `Expansión: ${lowest.shortName}`,
      dimensionKey: lowKey,
      objective: `Probar una técnica de tu dimensión con menor puntuación (${lowest.name}) para desarrollar flexibilidad cognitiva.`,
      actionTask: getLowestDimensionTask(lowKey),
      reflectionPrompt: `¿Qué resistencia inicial sentí y qué elemento útil puedo rescatar para enriquecer mi método habitual?`,
      completed: false
    },
    {
      day: 5,
      title: `Día 5: Sesión de Práctica y Evocación Activa`,
      theme: 'Recuperación Activa (Active Recall)',
      dimensionKey: 'autorregulacion_metacognicion',
      objective: `Comprobar la asimilación real de la información sin mirar los apuntes de apoyo.`,
      actionTask: `Dedica 15 minutos a escribir o dibujar de memoria todo lo que recuerdas sobre el tema trabajado esta semana. Compara luego con tus notas originales para identificar omisiones o sesgos.`,
      reflectionPrompt: `¿Fui capaz de reconstruir las ideas clave con mis propios recursos cognitivos?`,
      completed: false
    },
    {
      day: 6,
      title: `Día 6: Prueba de Transferencia y Aplicación Concreta`,
      theme: 'Aplicación Práctica',
      dimensionKey: 'practico_experiencial',
      objective: `Aplicar lo aprendido a una situación real, un ejercicio práctico o un problema concreto.`,
      actionTask: `Resuelve un caso real, escribe un artículo breve, programa un código o elabora un ejemplo aplicado que demuestre el uso práctico de los conceptos estudiados.`,
      reflectionPrompt: `¿Pude llevar la teoría a una solución tangible y funcional?`,
      completed: false
    },
    {
      day: 7,
      title: `Día 7: Síntesis Metacognitiva y Protocolo Personalizado`,
      theme: 'Protocolo de Aprendizaje',
      dimensionKey: 'autorregulacion_metacognicion',
      objective: `Definir tu protocolo de estudio personalizado para futuros proyectos o materias.`,
      actionTask: `Redacta una guía de 1 página con tus "3 Reglas de Oro para Aprender": cuándo usar mapas visuales, cómo verbalizar ideas y qué momentos reservar para la práctica empírica y el descanso.`,
      reflectionPrompt: `¿Cómo ha evolucionado mi visión sobre mis estrategias de estudio tras esta semana de experimentación?`,
      completed: false
    }
  ];
}

function getLowestDimensionTask(key: DimensionKey): string {
  switch (key) {
    case 'visual_espacial':
      return 'Dibuja un diagrama o esquema de una página que represente visualmente el tema estudiado, asignando colores distintos a cada categoría.';
    case 'verbal_explicativo':
      return 'Grábate con el móvil explicando en 3 minutos el concepto principal con tus propias palabras, como si se lo enseñaras a un principiante.';
    case 'practico_experiencial':
      return 'Encuentra un ejemplo de la vida real o realiza un ejercicio práctico directo que ponga a prueba de inmediato la teoría que estás estudiando.';
    case 'analitico_estructurado':
      return 'Elabora una tabla comparativa o una lista secuencial paso a paso que descomponga lógicamente el proceso estudiado.';
    case 'social_colaborativo':
      return 'Comparte una duda o debate un punto clave del material con un colega, compañero de estudio o en una comunidad de aprendizaje en línea.';
    case 'autorregulacion_metacognicion':
      return 'Establece un temporizador de 25 minutos con una meta específica y escribe una breve autoevaluación al finalizar sobre lo logrado.';
    default:
      return 'Dedica 15 minutos a probar una estrategia complementaria de aprendizaje.';
  }
}

// Preset testing fixtures for audit and testing of Learning Profile
export const AUDIT_PRESETS: Record<
  string,
  { name: string; description: string; answers: StoredAnswers }
> = {
  EXACT_TIE_VISUAL_ANALYTICAL: {
    name: 'Empate Dominante (Visual 5.00 y Analítico 5.00)',
    description: 'Empate perfecto en el 1.er lugar entre Procesamiento visual/espacial y Razonamiento analítico para verificar la detección y gestión de empates.',
    answers: {
      1: 5, 2: 5, 3: 5, 4: 5, // Visual = 5.00
      5: 3, 6: 3, 7: 3, 8: 3, // Verbal = 3.00
      9: 2, 10: 2, 11: 3, 12: 2, // Práctico = 2.25
      13: 5, 14: 5, 15: 5, 16: 5, // Analítico = 5.00
      17: 2, 18: 2, 19: 1, 20: 2, // Social = 1.75
      21: 4, 22: 4, 23: 4, 24: 4  // Autorregulación = 4.00
    }
  },
  PRACTICAL_SOCIAL: {
    name: 'Perfil Práctico y Colaborador (Práctico 5.00, Social 4.75)',
    description: 'Preferencia muy alta por el aprendizaje experiencial e interactivo en equipo.',
    answers: {
      1: 3, 2: 3, 3: 3, 4: 3, // Visual = 3.00
      5: 3, 6: 4, 7: 4, 8: 3, // Verbal = 3.50
      9: 5, 10: 5, 11: 5, 12: 5, // Práctico = 5.00
      13: 2, 14: 2, 15: 2, 16: 2, // Analítico = 2.00
      17: 5, 18: 5, 19: 5, 20: 4, // Social = 4.75
      21: 3, 22: 3, 23: 3, 24: 3  // Autorregulación = 3.00
    }
  },
  AUTONOMOUS_VERBAL: {
    name: 'Perfil Investigador Autónomo (Verbal 5.00, Metacognición 4.75)',
    description: 'Alta capacidad explicativa, lectura profunda y autorregulación metódica.',
    answers: {
      1: 3, 2: 3, 3: 2, 4: 3, // Visual = 2.75
      5: 5, 6: 5, 7: 5, 8: 5, // Verbal = 5.00
      9: 2, 10: 2, 11: 2, 12: 2, // Práctico = 2.00
      13: 4, 14: 4, 15: 4, 16: 4, // Analítico = 4.00
      17: 2, 18: 2, 19: 1, 20: 2, // Social = 1.75
      21: 5, 22: 5, 23: 4, 24: 5  // Autorregulación = 4.75
    }
  },
  ALL_NEUTRAL_TIE: {
    name: 'Empate Hexagonal Equilibrado (Todas a 3.00)',
    description: 'Caso límite: 6 medias exactamente idénticas en 3.00.',
    answers: {
      1: 3, 2: 3, 3: 3, 4: 3,
      5: 3, 6: 3, 7: 3, 8: 3,
      9: 3, 10: 3, 11: 3, 12: 3,
      13: 3, 14: 3, 15: 3, 16: 3,
      17: 3, 18: 3, 19: 3, 20: 3,
      21: 3, 22: 3, 23: 3, 24: 3
    }
  }
};
