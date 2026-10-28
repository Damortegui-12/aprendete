import { DIMENSIONS, QUESTIONS } from '../data/questions';
import {
  DimensionKey,
  DimensionResult,
  StoredAnswers,
  TieGroup,
  DayPlanItem,
  UserPersonalProfile,
  SectionARecommendation,
  SectionBRecommendation,
  FodaAnalysis,
  FodaQuadrant,
  FodaStrategicRecommendation
} from '../types';

export const DIMENSION_KEYS: DimensionKey[] = [
  'visual_espacial',
  'verbal_explicativo',
  'practico_experiencial',
  'analitico_estructurado',
  'social_colaborativo',
  'autorregulacion_metacognicion'
];

function getIntensityLabel(mean: number): string {
  if (mean >= 4.25) return 'Es una de tus formas favoritas';
  if (mean >= 3.5) return 'Te resulta muy cómoda';
  if (mean >= 2.75) return 'La utilizas según el momento';
  return 'Una forma que puedes explorar';
}

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
    const val = answers[q.id] || 3;
    sums[q.dimensionKey] += val;
    counts[q.dimensionKey] += 1;
  });

  const unsorted: DimensionResult[] = DIMENSION_KEYS.map((key) => {
    const sum = sums[key];
    const count = counts[key] || 4;
    const mean = Number((sum / count).toFixed(2));
    const percentage = Math.round(((mean - 1) / 4) * 100);

    return {
      key,
      name: DIMENSIONS[key].name,
      shortName: DIMENSIONS[key].shortName,
      friendlyName: DIMENSIONS[key].friendlyName,
      tagline: DIMENSIONS[key].tagline,
      mean,
      sum,
      percentage,
      rank: 1,
      isTied: false,
      tiedKeys: [],
      meta: DIMENSIONS[key],
      intensityLabel: getIntensityLabel(mean)
    };
  });

  // Sort descending by mean score
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
      let hybridName = `Combinas varias formas de aprender (${dims.map((d) => d.friendlyName).join(' y ')})`;
      let hybridDescription = `Has respondido con un nivel de afinidad idéntico en ${dims.map((d) => d.friendlyName).join(' y ')}. Esto indica que tu mente se adapta con naturalidad a distintos caminos según la actividad.`;

      if (dims.length === 2) {
        const k1 = dims[0].key;
        const k2 = dims[1].key;
        if ((k1 === 'visual_espacial' && k2 === 'practico_experiencial') || (k2 === 'visual_espacial' && k1 === 'practico_experiencial')) {
          hybridName = 'Aprendes mejor cuando lo ves y lo haces';
          hybridDescription = 'Tienes una combinación muy potente: ver la estructura de las ideas te da la orientación inicial, y ponerte manos a la obra asienta el aprendizaje de forma duradera.';
        } else if ((k1 === 'verbal_explicativo' && k2 === 'social_colaborativo') || (k2 === 'verbal_explicativo' && k1 === 'social_colaborativo')) {
          hybridName = 'Te ayuda hablarlo y compartir ideas';
          hybridDescription = 'Tu pensamiento florece en el diálogo. Al explicar un tema a otros o contrastar opiniones, las ideas se vuelven mucho más claras para ti.';
        } else if ((k1 === 'analitico_estructurado' && k2 === 'practico_experiencial') || (k2 === 'analitico_estructurado' && k1 === 'practico_experiencial')) {
          hybridName = 'Aprendes probando y encontrando soluciones';
          hybridDescription = 'Te gusta experimentar en la práctica mientras comprendes la lógica que hay detrás. Unes el ensayo activo con el pensamiento deductivo.';
        } else if ((k1 === 'visual_espacial' && k2 === 'analitico_estructurado') || (k2 === 'visual_espacial' && k1 === 'analitico_estructurado')) {
          hybridName = 'Te funciona organizar tus ideas y conectar conceptos';
          hybridDescription = 'Ves los temas como sistemas organizados. Los esquemas visuales unidos a una secuencia paso a paso te permiten resolver problemas complejos con calma.';
        }
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

// Generates personal profile headline and narrative paragraph
export function generatePersonalProfile(
  top1: DimensionResult,
  top2: DimensionResult,
  isDominantTie: boolean
): UserPersonalProfile {
  const k1 = top1.key;
  const k2 = top2.key;

  const pairTitles: Record<string, string> = {
    'visual_espacial-practico_experiencial': 'Aprendes mejor cuando lo ves y lo haces',
    'practico_experiencial-visual_espacial': 'Aprendes mejor cuando lo haces y lo ves en acción',
    'verbal_explicativo-social_colaborativo': 'Te ayuda hablarlo y compartir ideas',
    'social_colaborativo-verbal_explicativo': 'Aprendes dialogando y contrastando opiniones',
    'analitico_estructurado-practico_experiencial': 'Te gusta entender cómo funcionan las cosas y probarlas',
    'practico_experiencial-analitico_estructurado': 'Aprendes probando y encontrando soluciones lógicas',
    'visual_espacial-analitico_estructurado': 'Te funciona organizar tus ideas y conectar conceptos',
    'analitico_estructurado-visual_espacial': 'Te gusta estructurar la lógica mediante esquemas visuales',
    'autorregulacion_metacognicion-practico_experiencial': 'Te ayuda practicar, revisar y mejorar a tu ritmo',
    'practico_experiencial-autorregulacion_metacognicion': 'Aprendes haciendo y ajustando lo que te funciona',
    'verbal_explicativo-analitico_estructurado': 'Te ayuda razonar con claridad y ponerlo en palabras',
    'analitico_estructurado-verbal_explicativo': 'Te funciona analizar los temas y explicártelos paso a paso',
    'visual_espacial-verbal_explicativo': 'Te funciona combinar imágenes y explicaciones claras',
    'verbal_explicativo-visual_espacial': 'Aprendes leyendo, resumiendo y creando mapas mentales',
    'social_colaborativo-practico_experiencial': 'Aprendes colaborando en retos y proyectos reales',
    'practico_experiencial-social_colaborativo': 'Te funciona trabajar en equipo con las manos en la masa',
    'visual_espacial-social_colaborativo': 'Te ayuda visualizar ideas y compartirlas en equipo',
    'social_colaborativo-visual_espacial': 'Te funciona debatir esquemas y co-crear soluciones',
    'verbal_explicativo-autorregulacion_metacognicion': 'Te funciona reflexionar a fondo y sintetizar con tus palabras',
    'autorregulacion_metacognicion-verbal_explicativo': 'Aprendes con autonomía, resúmenes y autoevaluación',
    'analitico_estructurado-autorregulacion_metacognicion': 'Te ayuda planificar con método y evaluar tu avance',
    'autorregulacion_metacognicion-analitico_estructurado': 'Te funciona ordenar tu tiempo y aprender con lógica',
    'social_colaborativo-autorregulacion_metacognicion': 'Combinas el trabajo en equipo con momentos de reflexión personal',
    'autorregulacion_metacognicion-social_colaborativo': 'Aprendes organizándote bien y contrastando dudas con otros'
  };

  const lookupKey = `${k1}-${k2}`;
  let title = pairTitles[lookupKey];

  if (!title) {
    if (isDominantTie) {
      title = 'Combinas varias formas de aprender con gran equilibrio';
    } else {
      title = `Te funciona apoyarte en ${top1.friendlyName.toLowerCase()} y ${top2.friendlyName.toLowerCase()}`;
    }
  }

  const paragraph = `Parece que te resulta especialmente útil combinar ${top1.friendlyName.toLowerCase()} con ${top2.friendlyName.toLowerCase()}. Cuando puedes aprovechar estas dos vías juntas, la información cobra sentido con mayor rapidez y la recuerdas con menos esfuerzo. Puedes usar esta combinación para estudiar con mayor comodidad, aprender una habilidad nueva o resolver problemas en tu día a día.`;

  return {
    title,
    paragraph,
    topSkill1: top1,
    topSkill2: top2,
    isTie: isDominantTie
  };
}

// FODA ANALYSIS & STRATEGIC RECOMMENDATIONS GENERATOR
export function generateFodaAnalysis(
  top1: DimensionResult,
  top2: DimensionResult,
  lowest1: DimensionResult,
  lowest2: DimensionResult
): FodaAnalysis {
  // Fortalezas (F) - Interno positivo
  const fortalezas: FodaQuadrant = {
    code: 'F',
    title: 'Fortalezas',
    badge: 'Factores Internos Clave',
    subtitle: 'Tus ventajas cognitivas más naturales y de mayor rendimiento',
    color: '#FF2D95',
    badgeBg: 'rgba(255, 45, 149, 0.15)',
    badgeBorder: 'rgba(255, 45, 149, 0.4)',
    badgeText: '#FF69C8',
    glowColor: 'rgba(255, 45, 149, 0.35)',
    items: [
      {
        title: `Dominio en ${top1.friendlyName} (${top1.mean.toFixed(2)}/5)`,
        description: `Tu mente procesa con rapidez y fluidez cuando utilizas ${top1.meta.summary.toLowerCase()}`,
        tag: 'Habilidad primaria'
      },
      {
        title: `Apoyo sólido en ${top2.friendlyName} (${top2.mean.toFixed(2)}/5)`,
        description: `Complementas eficazmente recurriendo a ${top2.meta.summary.toLowerCase()}`,
        tag: 'Habilidad secundaria'
      },
      {
        title: 'Sinergia de aprendizaje personalizada',
        description: `Al integrar ${top1.shortName.toLowerCase()} y ${top2.shortName.toLowerCase()}, retienes conceptos con mayor solidez y menor esfuerzo cognitivo.`,
        tag: 'Ventaja competitiva'
      }
    ]
  };

  // Oportunidades (O) - Externo positivo
  const oportunidades: FodaQuadrant = {
    code: 'O',
    title: 'Oportunidades',
    badge: 'Factores de Expansión',
    subtitle: 'Vías, formatos y herramientas que pueden maximizar tu avance',
    color: '#36CFFF',
    badgeBg: 'rgba(54, 207, 255, 0.15)',
    badgeBorder: 'rgba(54, 207, 255, 0.4)',
    badgeText: '#36CFFF',
    glowColor: 'rgba(54, 207, 255, 0.35)',
    items: [
      {
        title: 'Entornos adaptados a tus fortalezas',
        description: `Elegir materiales que enfaticen ${top1.shortName.toLowerCase()} (como vídeos interactivos, prácticas guiadas o casos de estudio) acelerará tu curva de dominio.`,
        tag: 'Formato ideal'
      },
      {
        title: `Desarrollo gradual de ${lowest1.friendlyName}`,
        description: `Incorporar micro-prácticas de ${lowest1.shortName.toLowerCase()} como complemento secundario ampliará tu repertorio sin causarte estrés.`,
        tag: 'Crecimiento'
      },
      {
        title: 'Herramientas y métodos modernos de estudio',
        description: 'La tecnología actual permite transformar cualquier temario teórico al formato que mejor asimilas en minutos.',
        tag: 'Metodología'
      }
    ]
  };

  // Debilidades (D) - Interno a cuidar (expresado de forma positiva y no deficitaria)
  const debilidades: FodaQuadrant = {
    code: 'D',
    title: 'Puntos a cuidar',
    badge: 'Puntos Ciegos Internos',
    subtitle: 'Fricciones internas cuando dependes de una sola vía de estudio',
    color: '#FFE45E',
    badgeBg: 'rgba(255, 228, 94, 0.15)',
    badgeBorder: 'rgba(255, 228, 94, 0.4)',
    badgeText: '#FFE45E',
    glowColor: 'rgba(255, 228, 94, 0.35)',
    items: [
      {
        title: 'Riesgo de sobreutilización de tus formas favoritas',
        description: `Forzar ${top1.shortName.toLowerCase()} en temas que exigen otras vías puede ralentizarte o generar agotamiento innecesario.`,
        tag: 'Sesgo de hábito'
      },
      {
        title: `Menor soltura inicial en ${lowest1.friendlyName} (${lowest1.mean.toFixed(2)}/5)`,
        description: `Tareas que dependen exclusivamente de ${lowest1.shortName.toLowerCase()} pueden provocarte cierta resistencia o desgana inicial.`,
        tag: 'Zona de mejora'
      },
      {
        title: `Baja recurrencia a ${lowest2.friendlyName} (${lowest2.mean.toFixed(2)}/5)`,
        description: `Tiendes a pasar por alto ${lowest2.meta.summary.toLowerCase()}, desaprovechando sus ventajas en revisiones finales.`,
        tag: 'Oportunidad latente'
      }
    ]
  };

  // Amenazas (A) - Externo desfavorable y fricciones
  const amenazas: FodaQuadrant = {
    code: 'A',
    title: 'Amenazas y Fricciones',
    badge: 'Fricciones del Entorno',
    subtitle: 'Situaciones externas de estudio o trabajo que chocan con tu estilo',
    color: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeBorder: 'rgba(139, 92, 246, 0.4)',
    badgeText: '#A78BFA',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    items: [
      {
        title: 'Materiales rígidos o mal estructurados',
        description: `Exposiciones monótonas o textos densos sin posibilidad de ${top1.shortName.toLowerCase()} pueden reducir drásticamente tu atención.`,
        tag: 'Rigidez externa'
      },
      {
        title: 'Evaluaciones que premian la memorización pasiva',
        description: 'Exámenes o tareas que no permiten demostrar comprensión aplicada o estructuración lógica de ideas.',
        tag: 'Evaluación desalineada'
      },
      {
        title: 'Falta de tiempo para procesar a tu ritmo',
        description: 'Plazos inmediatos que te impiden construir tus esquemas, pruebas prácticas o reflexiones habituales.',
        tag: 'Presión temporal'
      }
    ]
  };

  // Strategic Recommendations derived directly from FODA (FO, FA, DO, DA)
  const recommendations: FodaStrategicRecommendation[] = [
    {
      id: 'strat-fo',
      strategyCode: 'FO',
      typeLabel: 'Estrategia FO • Potenciar tus Fortalezas con Oportunidades',
      title: `Multiplica tu rendimiento: combina ${top1.shortName} con ${top2.shortName}`,
      rationale: `Aprovecha que tus dos mayores fortalezas (${top1.friendlyName} y ${top2.friendlyName}) se potencian entre sí. Al diseñar tus sesiones alrededor de ellas, asimilarás proyectos complejos en la mitad de tiempo.`,
      concreteExample: `Inicia cualquier sesión dedicando 10 minutos a ${top1.meta.techniques[0].toLowerCase()} y consolida con 10 minutos de ${top2.meta.techniques[0].toLowerCase()}.`,
      actionToday: `Toma el tema principal que tengas entre manos hoy y construye un resumen usando ${top1.meta.quickAction.toLowerCase()}.`,
      kpiDeliverable: `Entregable (KPI): 1 artefacto de estudio (esquema, síntesis o prototipo) que combine ambas vías terminado en menos de 25 minutos.`,
      accentColor: '#FF2D95'
    },
    {
      id: 'strat-fa',
      strategyCode: 'FA',
      typeLabel: 'Estrategia FA • Blindarte ante Amenazas usando tus Fortalezas',
      title: `Traduce materiales rígidos a tu propio lenguaje cognitivo`,
      rationale: `Cuando te enfrentes a clases magistrales pasivas, temarios aburridos o formatos poco estimulantes, no intentes adaptarte pasivamente: traduce activamente la información a ${top1.friendlyName}.`,
      concreteExample: `Si recibes un documento denso de texto puro, tradúcelo en tiempo real a una estructura de puntos clave o notas visuales según escuchas o lees.`,
      actionToday: `Frente a la tarea más monótona de hoy, detente tras el primer párrafo y reformúlala inmediatamente en tu formato favorito.`,
      kpiDeliverable: `Entregable (KPI): 1 hoja de notas traducida activamente a tu estilo antes de continuar con la lectura pasiva.`,
      accentColor: '#8B5CF6'
    },
    {
      id: 'strat-do',
      strategyCode: 'DO',
      typeLabel: 'Estrategia DO • Superar Puntos a Cuidar aprovechando Oportunidades',
      title: `Micro-dosis de baja fricción en ${lowest1.friendlyName}`,
      rationale: `Para no tropezar cuando una materia exija ${lowest1.friendlyName}, no intentes convertirte en un experto de golpe. Introduce micro-experimentos de 5 minutos apoyándote siempre en ${top1.friendlyName}.`,
      concreteExample: `Dedica 5 minutos a ${lowest1.meta.quickAction.toLowerCase()} justo después de haber repasado con tu método favorito.`,
      actionToday: `Haz una prueba rápida de 5 minutos con ${lowest1.meta.techniques[0].toLowerCase()} sin juzgar la perfección del resultado.`,
      kpiDeliverable: `Entregable (KPI): 1 micro-ejercicio completado y evaluado con una nota de 1 línea sobre lo aprendido.`,
      accentColor: '#36CFFF'
    },
    {
      id: 'strat-da',
      strategyCode: 'DA',
      typeLabel: 'Estrategia DA • Blindaje Preventivo ante Bloqueos',
      title: 'Protocolo anti-bloqueo para tareas desalineadas con tu estilo',
      rationale: `Si una tarea requiere exclusivamente ${lowest1.friendlyName} o ${lowest2.friendlyName} y además tienes poco tiempo, el riesgo de bloqueo o procrastinación aumenta. Establece un límite de tiempo estricto y divide la tarea en bloques de 15 minutos.`,
      concreteExample: `Usa la regla de los 15 minutos: trabaja en esa tarea difícil solo 15 minutos de reloj. Si te bloqueas, consulta a un compañero o cambia temporalmente de enfoque.`,
      actionToday: `Elige la tarea pendiente que más pereza te dé y fija un temporizador de 15 minutos para avanzar solo el primer paso.`,
      kpiDeliverable: `Entregable (KPI): Bloque de 15 minutos ejecutado sin distracciones con el primer hito de la tarea documentado.`,
      accentColor: '#FFE45E'
    }
  ];

  return {
    fortalezas,
    oportunidades,
    debilidades,
    amenazas,
    recommendations
  };
}

// Kept for backward compatibility
export function generateSectionARecommendations(
  top1: DimensionResult,
  top2: DimensionResult
): SectionARecommendation[] {
  return [
    {
      id: 'a1',
      skillKey: top1.key,
      title: `Aprovecha tu fortaleza principal: ${top1.friendlyName}`,
      explanation: top1.meta.summary,
      example: top1.meta.studyWorkExample,
      actionToday: top1.meta.quickAction
    },
    {
      id: 'a2',
      skillKey: top2.key,
      title: `Combina ${top1.shortName.toLowerCase()} con ${top2.shortName.toLowerCase()}`,
      explanation: `Tu gran fortaleza está en la suma de ambas: puedes utilizar ${top1.meta.techniques[0].toLowerCase()} para iniciar y complementar con ${top2.meta.techniques[0].toLowerCase()} para consolidar.`,
      example: `Utilizar ${top1.shortName.toLowerCase()} para captar la idea global y luego aplicar ${top2.shortName.toLowerCase()} para afianzar los detalles.`,
      actionToday: `En tu próxima sesión, prueba a unir ambas estrategias: dedica 10 minutos a una y los siguientes 10 minutos a la otra.`
    },
    {
      id: 'a3',
      skillKey: top2.key,
      title: `Aprovecha tu segunda vía: ${top2.friendlyName}`,
      explanation: top2.meta.summary,
      example: top2.meta.studyWorkExample,
      actionToday: top2.meta.quickAction
    }
  ];
}

export function generateSectionBRecommendations(
  lowest1: DimensionResult,
  lowest2: DimensionResult,
  dominant: DimensionResult
): SectionBRecommendation[] {
  return [
    {
      id: 'b1',
      skillName: lowest1.friendlyName,
      skillKey: lowest1.key,
      whatItOffers: lowest1.meta.summary,
      everydaySituation: lowest1.meta.everydayDescription,
      smallExercise: lowest1.meta.quickAction,
      pairingSuggestion: `Prueba a combinarla con tu forma principal (${dominant.friendlyName}): utiliza primero lo que te da seguridad y luego dedica solo 5 minutos a explorar este nuevo camino.`
    },
    {
      id: 'b2',
      skillName: lowest2.friendlyName,
      skillKey: lowest2.key,
      whatItOffers: lowest2.meta.summary,
      everydaySituation: lowest2.meta.everydayDescription,
      smallExercise: lowest2.meta.quickAction,
      pairingSuggestion: `No necesitas cambiar tu forma de ser. Basta con introducirla de vez en cuando como una herramienta más en tu caja de recursos.`
    }
  ];
}

// 7-DAY LEARNING PLAN: "Tu reto de 7 días para aprender mejor"
// Each day now includes a clear, tangible "kpiDeliverable" (Resultado esperado como KPI)
export function generate7DayPlan(
  dominant: DimensionResult,
  secondary: DimensionResult | undefined,
  lowest: DimensionResult
): DayPlanItem[] {
  const sec = secondary || dominant;

  return [
    {
      day: 1,
      title: `Día 1: Descubre tu herramienta principal (${dominant.friendlyName})`,
      theme: 'Poner a prueba lo que te funciona',
      dimensionKey: dominant.key,
      durationMinutes: '15–20 min',
      objective: `Observar cómo te sientes al estudiar aplicando deliberadamente tu forma de aprender favorita (${dominant.friendlyName}).`,
      instructions: `Elige un tema que necesites comprender hoy. Aplica esta estrategia concreta: ${dominant.meta.techniques[0]}. Trabaja durante 15 minutos en este formato y fíjate en si la comprensión fue más fluida.`,
      reflectionQuestion: '¿Sentí que el tiempo pasaba más rápido y que entendía con menos esfuerzo?',
      kpiDeliverable: 'Entregable (KPI): Mapa conceptual o esquema de 1 página con los 3 conceptos nucleares y sus relaciones completado.',
      completed: false
    },
    {
      day: 2,
      title: `Día 2: Pon a prueba tu memoria (Recuperación activa)`,
      theme: 'Aprender sin mirar los apuntes',
      dimensionKey: 'autorregulacion_metacognicion',
      durationMinutes: '15 min',
      objective: 'Comprobar qué recuerdas realmente sin consultar notas ni pistas.',
      instructions: 'Cierra todos tus libros y pantallas. Toma una hoja en blanco y anota o dibuja de memoria todo lo que recuerdes del Día 1. Después abre las notas y comprueba qué se te escapó.',
      reflectionQuestion: '¿Qué conceptos pude recordar con solidez y cuáles necesité volver a mirar?',
      kpiDeliverable: 'Entregable (KPI): Hoja de recuperación activa redactada 100% de memoria, con lista de aciertos y omisiones verificada.',
      completed: false
    },
    {
      day: 3,
      title: `Día 3: Conecta tus dos formas favoritas (${dominant.shortName} + ${sec.shortName})`,
      theme: 'Estrategia combinada',
      dimensionKey: sec.key,
      durationMinutes: '20 min',
      objective: `Unir tus dos habilidades más destacadas en una misma sesión.`,
      instructions: `Comienza utilizando ${dominant.meta.techniques[0].toLowerCase()} durante 10 minutos y después pasa a ${sec.meta.techniques[0].toLowerCase()} durante otros 10 minutos. Compara cómo se complementan.`,
      reflectionQuestion: '¿Qué me aportó la segunda técnica que no tenía con la primera?',
      kpiDeliverable: 'Entregable (KPI): Ficha combinada de estudio con síntesis explicativa y diagrama visual o caso práctico de soporte.',
      completed: false
    },
    {
      day: 4,
      title: `Día 4: Explora una nueva ruta (${lowest.friendlyName})`,
      theme: 'Flexibilidad sin presión',
      dimensionKey: lowest.key,
      durationMinutes: '15 min',
      objective: `Probar con curiosidad una forma de aprender que utilizas con menos frecuencia.`,
      instructions: `Sin juzgarte ni buscar la perfección, dedica 15 minutos a este pequeño ejercicio: ${lowest.meta.quickAction}`,
      reflectionQuestion: '¿Qué parte de este nuevo ejercicio me resultó interesante o útil?',
      kpiDeliverable: 'Entregable (KPI): Ejercicio práctico de exploración finalizado con registro de 3 minutos sobre sensaciones y aprendizajes.',
      completed: false
    },
    {
      day: 5,
      title: `Día 5: La prueba de la explicación sencilla`,
      theme: 'Explicar con tus propias palabras',
      dimensionKey: 'verbal_explicativo',
      durationMinutes: '15–20 min',
      objective: 'Demostrarte que dominas una idea explicándola de forma simple.',
      instructions: 'Elige el concepto más complicado de esta semana y explícaselo en voz alta a otra persona o a ti mismo/a en menos de 3 minutos, usando solo comparaciones de la vida diaria y cero tecnicismos.',
      reflectionQuestion: '¿En qué momentos dudé y necesité aclarar mejor mis ideas?',
      kpiDeliverable: 'Entregable (KPI): Audio de 90 segundos o nota explicativa grabada con palabras propias y sin consultar apuntes.',
      completed: false
    },
    {
      day: 6,
      title: `Día 6: De la teoría a la práctica real`,
      theme: 'Aprender haciendo',
      dimensionKey: 'practico_experiencial',
      durationMinutes: '20–25 min',
      objective: 'Resolver un reto práctico, caso real o problema concreto.',
      instructions: 'Aplica lo aprendido a un ejercicio práctico, escribe un ejemplo del mundo real o crea una pequeña solución útil. No te quedes en la teoría: haz algo tangible con lo que sabes.',
      reflectionQuestion: '¿Qué descubrí al poner la idea en práctica que no había notado en la teoría?',
      kpiDeliverable: 'Entregable (KPI): Caso práctico o problema resuelto paso a paso con documentación tangible de la solución.',
      completed: false
    },
    {
      day: 7,
      title: `Día 7: Tu propio manual para aprender`,
      theme: 'Reflexión y balance semanal',
      dimensionKey: 'autorregulacion_metacognicion',
      durationMinutes: '15 min',
      objective: 'Elegir qué técnicas conservarás para tus próximos estudios o proyectos.',
      instructions: 'Revisa los experimentos de la semana y responde a las tres preguntas clave: ¿Qué actividad me ayudó más? ¿Qué pude recordar sin consultar apuntes? ¿Qué estrategia quiero seguir utilizando?',
      reflectionQuestion: '¿Cómo ha cambiado mi mirada sobre mi manera de aprender?',
      kpiDeliverable: 'Entregable (KPI): Manifiesto de Aprendizaje de 1 página con tus 3 reglas de oro permanentes para futuros retos.',
      completed: false
    }
  ];
}

// Preset testing fixtures for audit and verification
export const AUDIT_PRESETS: Record<
  string,
  { name: string; description: string; answers: StoredAnswers }
> = {
  EXACT_TIE_VISUAL_PRACTICAL: {
    name: 'Empate: Visual y Práctico (5.00 y 5.00)',
    description: 'Empate perfecto en el 1.er lugar para probar: Aprendes mejor cuando lo ves y lo haces.',
    answers: {
      1: 5, 2: 5, 3: 5, 4: 5, // Visual = 5.00
      5: 3, 6: 3, 7: 3, 8: 3, // Verbal = 3.00
      9: 5, 10: 5, 11: 5, 12: 5, // Práctico = 5.00
      13: 3, 14: 3, 15: 3, 16: 3, // Analítico = 3.00
      17: 2, 18: 2, 19: 2, 20: 2, // Social = 2.00
      21: 4, 22: 4, 23: 4, 24: 4  // Metacognición = 4.00
    }
  },
  VERBAL_SOCIAL: {
    name: 'Perfil: Verbal y Social (5.00 y 4.75)',
    description: 'Prueba de: Te ayuda hablarlo y compartir ideas.',
    answers: {
      1: 2, 2: 3, 3: 2, 4: 3, // Visual = 2.50
      5: 5, 6: 5, 7: 5, 8: 5, // Verbal = 5.00
      9: 3, 10: 3, 11: 3, 12: 3, // Práctico = 3.00
      13: 3, 14: 3, 15: 3, 16: 3, // Analítico = 3.00
      17: 5, 18: 5, 19: 5, 20: 4, // Social = 4.75
      21: 4, 22: 4, 23: 4, 24: 4  // Metacognición = 4.00
    }
  },
  ANALYTICAL_STRUCTURED: {
    name: 'Perfil: Analítico y Metacognitivo (5.00 y 4.75)',
    description: 'Prueba de: Te funciona organizar tus ideas y conectar conceptos.',
    answers: {
      1: 4, 2: 4, 3: 4, 4: 4, // Visual = 4.00
      5: 3, 6: 3, 7: 3, 8: 3, // Verbal = 3.00
      9: 2, 10: 2, 11: 2, 12: 2, // Práctico = 2.00
      13: 5, 14: 5, 15: 5, 16: 5, // Analítico = 5.00
      17: 2, 18: 2, 19: 2, 20: 2, // Social = 2.00
      21: 5, 22: 5, 23: 4, 24: 5  // Metacognición = 4.75
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
