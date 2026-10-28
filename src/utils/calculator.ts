import { DIMENSIONS, QUESTIONS } from '../data/questions';
import {
  DimensionKey,
  DimensionResult,
  StoredAnswers,
  TieGroup,
  DayPlanItem,
  UserPersonalProfile,
  SectionARecommendation,
  SectionBRecommendation
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

  // Title dictionary based on combinations
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

  // Generates 2-3 tailored conversational sentences
  const paragraph = `Parece que te resulta especialmente útil combinar ${top1.friendlyName.toLowerCase()} con ${top2.friendlyName.toLowerCase()}. Cuando puedes aprovechar estas dos vías juntas, la información cobra sentido con mayor rapidez y la recuerdas con menos esfuerzo. Puedes usar esta combinación para estudiar con mayor comodidad, aprender una habilidad nueva o resolver problemas en tu día a día.`;

  return {
    title,
    paragraph,
    topSkill1: top1,
    topSkill2: top2,
    isTie: isDominantTie
  };
}

// SECTION A: Aprovecha lo que ya te funciona (3 to 4 personalized recommendations)
export function generateSectionARecommendations(
  top1: DimensionResult,
  top2: DimensionResult
): SectionARecommendation[] {
  const recommendations: SectionARecommendation[] = [];

  // Recommendation 1 based on top 1
  if (top1.key === 'visual_espacial') {
    recommendations.push({
      id: 'a1',
      skillKey: 'visual_espacial',
      title: 'Primero visualízalo, luego profundiza',
      explanation: 'Antes de leer un texto denso o memorizar fórmulas, busca una imagen, un vídeo corto o crea un boceto rápido de una sola página.',
      example: 'Al preparar una reunión o un examen, dibuja las ideas principales conectadas en un esquema circular.',
      actionToday: 'Toma el tema que tengas entre manos hoy y crea un mapa mental con tres colores distintos.'
    });
  } else if (top1.key === 'verbal_explicativo') {
    recommendations.push({
      id: 'a1',
      skillKey: 'verbal_explicativo',
      title: 'Explícalo con tus propias palabras',
      explanation: 'No te limites a releer pasivamente. Lo que realmente asienta tus conocimientos es traducir lo que aprendes a frases sencillas y naturales.',
      example: 'Al terminar un capítulo, cierra el texto e intenta explicarle a alguien en dos minutos qué decía.',
      actionToday: 'Graba una nota de voz de 90 segundos explicando la idea central de lo que has aprendido hoy.'
    });
  } else if (top1.key === 'practico_experiencial') {
    recommendations.push({
      id: 'a1',
      skillKey: 'practico_experiencial',
      title: 'Aprende probando desde el primer minuto',
      explanation: 'La teoría cobra sentido cuando ves qué pasa al aplicarla. Comienza con pequeños ejercicios o retos reales antes de leer explicaciones largas.',
      example: 'Si estás aprendiendo a usar un software, ábrelo y crea un mini-proyecto de prueba antes de leer todo el manual.',
      actionToday: 'Elige un ejercicio práctico del tema que estudias y resuélvelo directamente sin mirar la solución.'
    });
  } else if (top1.key === 'analitico_estructurado') {
    recommendations.push({
      id: 'a1',
      skillKey: 'analitico_estructurado',
      title: 'Descompón lo complejo en pasos claros',
      explanation: 'Te ayuda mucho ver el hilo conductor y el orden lógico. Cuando un tema te abrume, divídelo en partes pequeñas y abórdalas una a una.',
      example: 'Crear una lista secuencial de 5 pasos para dominar un proceso antes de intentar abarcarlo entero.',
      actionToday: 'Crea una lista de 3 pasos numerados para resolver la tarea más difícil que tengas pendiente hoy.'
    });
  } else if (top1.key === 'social_colaborativo') {
    recommendations.push({
      id: 'a1',
      skillKey: 'social_colaborativo',
      title: 'Convierte el estudio en un intercambio activo',
      explanation: 'Dialogar y contrastar dudas te aporta energía cognitiva. Encuentra momentos para comentar lo que aprendes con compañeros.',
      example: 'Una sesión de 30 minutos con un colega para hacerse tres preguntas difíciles cada uno sobre el temario.',
      actionToday: 'Escribe a un compañero de clase o trabajo para compartir una duda o punto interesante sobre lo que estudias.'
    });
  } else {
    recommendations.push({
      id: 'a1',
      skillKey: 'autorregulacion_metacognicion',
      title: 'Define tu meta antes de abrir los apuntes',
      explanation: 'Tu capacidad de organizar tus sesiones te da una gran ventaja. Saber exactamente qué quieres conseguir en cada bloque te ahorra tiempo y dispersión.',
      example: 'Anotar en una tarjeta: "En estos 30 minutos voy a dominar los conceptos A y B", y evaluar el resultado al terminar.',
      actionToday: 'Fija una meta única de 20 minutos de concentración para hoy y anota si la alcanzaste.'
    });
  }

  // Recommendation 2: Combining Top 1 and Top 2
  recommendations.push({
    id: 'a2',
    skillKey: top2.key,
    title: `Combina ${top1.shortName.toLowerCase()} con ${top2.shortName.toLowerCase()}`,
    explanation: `Tu gran fortaleza está en la suma de ambas: puedes utilizar ${top1.meta.techniques[0].toLowerCase()} para iniciar y complementar con ${top2.meta.techniques[0].toLowerCase()} para consolidar.`,
    example: `Utilizar ${top1.shortName.toLowerCase()} para captar la idea global y luego aplicar ${top2.shortName.toLowerCase()} para afianzar los detalles.`,
    actionToday: `En tu próxima sesión, prueba a unir ambas estrategias: dedica 10 minutos a una y los siguientes 10 minutos a la otra.`
  });

  // Recommendation 3: Concrete daily habit based on Top 2
  recommendations.push({
    id: 'a3',
    skillKey: top2.key,
    title: `Aprovecha tu segunda vía: ${top2.friendlyName}`,
    explanation: top2.meta.summary,
    example: top2.meta.studyWorkExample,
    actionToday: top2.meta.quickAction
  });

  return recommendations;
}

// SECTION B: Explora otras formas de aprender (2 complementary skills, non-judgmental)
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
    description: 'Empate perfecto en el 1.er lugar para probar «Aprendes mejor cuando lo ves y lo haces».',
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
    description: 'Prueba de «Te ayuda hablarlo y compartir ideas».',
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
    description: 'Prueba de «Te funciona organizar tus ideas y conectar conceptos».',
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
