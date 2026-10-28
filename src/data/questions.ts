import { DimensionKey, DimensionMeta, Question } from '../types';

export const DIMENSIONS: Record<DimensionKey, DimensionMeta> = {
  visual_espacial: {
    key: 'visual_espacial',
    name: 'Procesamiento visual y espacial',
    shortName: 'Visual y Espacial',
    tagline: 'Comprensión a través de imágenes, diagramas, esquemas y mapas espaciales',
    summary: 'Procesas y retienes la información con mayor facilidad cuando está estructurada visualmente. Transformas conceptos abstractos en mapas mentales, gráficos o asociaciones espaciales claras.',
    coreStrength: 'Facilidad para sintetizar panoramas globales y relaciones espaciales entre conceptos.',
    techniques: [
      'Mapas conceptuales y diagramas de flujo',
      'Codificación de apuntes mediante paletas cromáticas',
      'Infografías, esquemas jerárquicos y bocetos explicativos'
    ],
    vulnerabilities: [
      'Fatiga o pérdida de atención ante explicaciones puramente auditivas o textos planos y densos',
      'Riesgo de invertir excesivo tiempo decorando apuntes en lugar de practicar activamente'
    ],
    practicalAdvice: 'Antes de estudiar un tema complejo, dibuja un esquema general de una sola página que conecte las ideas clave.',
    idealEnvironment: 'Espacio visualmente ordenado, con pizarras o pantallas donde desplegar información visual simultánea.'
  },
  verbal_explicativo: {
    key: 'verbal_explicativo',
    name: 'Procesamiento verbal y explicativo',
    shortName: 'Verbal y Explicativo',
    tagline: 'Asimilación mediante lectura, redacción, diálogo y reformulación propia',
    summary: 'Consolidas el conocimiento cuando traduces las ideas a palabras precisas. Explicarte los temas a ti mismo/a, redactar síntesis y participar en intercambios verbales maximiza tu retención.',
    coreStrength: 'Precisión conceptual, fluidez lingüística y habilidad para formular explicaciones coherentes.',
    techniques: [
      'Técnica Feynman (explicar el concepto en términos sencillos)',
      'Grabación y escucha de tus propias notas o podcasts temáticos',
      'Redacción de ensayos breves, glosarios y resúmenes narrativos'
    ],
    vulnerabilities: [
      'Memorización pasiva o repetición verbal sin comprobar la aplicación práctica',
      'Dificultad ante materiales con gráficos numéricos abstractos sin descripción textual'
    ],
    practicalAdvice: 'Al terminar de leer un capítulo, cierra el libro y explica en voz alta durante 3 minutos lo que acabas de asimilar.',
    idealEnvironment: 'Ambiente tranquilo que permita verbalizar o escuchar sin distracciones sonoras externas.'
  },
  practico_experiencial: {
    key: 'practico_experiencial',
    name: 'Aprendizaje práctico y experiencial',
    shortName: 'Práctico y Experiencial',
    tagline: 'Aprender haciendo, experimentación directa, casos reales y aplicación activa',
    summary: 'Necesitas experimentar la teoría en acción para que cobre sentido. Aprendes interactuando con herramientas reales, resolviendo problemas empíricos y probando por ensayo y error.',
    coreStrength: 'Excelente transferencia de conocimientos a situaciones de la vida real y resolución de retos tangibles.',
    techniques: [
      'Proyectos prácticos y desarrollo de prototipos mínimos',
      'Resolución de casos de estudio reales desde el primer día',
      'Simulaciones interactivas y ejercicios aplicados'
    ],
    vulnerabilities: [
      'Frustración y desmotivación en etapas teóricas o metodológicas sin aplicación inmediata',
      'Tendencia a saltarse los fundamentos conceptuales por el impulso de pasar a la acción'
    ],
    practicalAdvice: 'Inicia cada nuevo tema planteándote una pregunta práctica: "¿Para qué sirve esto y qué problema real resuelve?"',
    idealEnvironment: 'Entorno de trabajo dinámico, con herramientas de experimentación y libertad de movimiento.'
  },
  analitico_estructurado: {
    key: 'analitico_estructurado',
    name: 'Razonamiento analítico y estructurado',
    shortName: 'Analítico y Estructurado',
    tagline: 'Lógica rigurosa, descomposición metódica, causas y secuencias paso a paso',
    summary: 'Abordas el aprendizaje con rigor sistemático. Descompones temas complejos en partes elementales, buscas las causas primeras y necesitas que las instrucciones y metas sean lógicas y secuenciales.',
    coreStrength: 'Pensamiento crítico agudo, orden deductivo y detección inmediata de inconsistencias o falacias.',
    techniques: [
      'Descomposición de problemas complejos en algoritmos o pasos lógicos',
      'Tablas comparativas y análisis de relaciones causa-efecto',
      'Listas de verificación jerárquicas y estudio secuencial exhaustivo'
    ],
    vulnerabilities: [
      'Bloqueo por análisis ante información ambigua, creativa o poco estructurada',
      'Perfeccionismo excesivo que puede ralentizar el avance general'
    ],
    practicalAdvice: 'Estructura tus sesiones con un índice de trabajo predeterminado y objetivos medibles antes de comenzar.',
    idealEnvironment: 'Entorno metódico, predecible y sin interrupciones que rompan el hilo de razonamiento.'
  },
  social_colaborativo: {
    key: 'social_colaborativo',
    name: 'Aprendizaje social y colaborativo',
    shortName: 'Social y Colaborativo',
    tagline: 'Construcción conjunta, debate, contraste de perspectivas y co-creación',
    summary: 'Tu energía cognitiva y tu comprensión crecen en interacción con otros. El debate, la co-enseñanza, la retroalimentación mutua y el trabajo en equipo activan tu curiosidad.',
    coreStrength: 'Empatía intelectual, capacidad de trabajo en equipo y asimilación de múltiples puntos de vista.',
    techniques: [
      'Grupos de estudio focalizados con asignación de roles temáticos',
      'Debates estructurados y sesiones de preguntas cruzadas',
      'Revisión por pares y retroalimentación iterativa'
    ],
    vulnerabilities: [
      'Pérdida de motivación y concentración cuando se requiere estudio prolongado en total aislamiento',
      'Riesgo de que el grupo disperse el foco hacia charlas sociales no productivas'
    ],
    practicalAdvice: 'Organiza sesiones de estudio en parejas de 45 minutos con objetivos delimitados y 10 minutos de debate final.',
    idealEnvironment: 'Espacios compartidos, salas de co-working o foros interactivos donde intercambiar ideas.'
  },
  autorregulacion_metacognicion: {
    key: 'autorregulacion_metacognicion',
    name: 'Autorregulación y metacognición',
    shortName: 'Autorregulación y Metacognición',
    tagline: 'Planificación autónoma, monitoreo del propio proceso y autoevaluación continua',
    summary: 'Eres consciente de cómo funciona tu mente al aprender. Planificas con claridad, monitoreas si la estrategia empleada está dando resultados y ajustas tus métodos de forma autónoma.',
    coreStrength: 'Gran autonomía, disciplina metacognitiva, autogestión del tiempo y adaptabilidad metodológica.',
    techniques: [
      'Diarios de aprendizaje y registro de efectividad de técnicas',
      'Técnica Pomodoro adaptada con autoevaluación al final de cada bloque',
      'Tarjetas de autocomprobación (Active Recall) y autoevaluaciones periódicas'
    ],
    vulnerabilities: [
      'Sobreplanificación mental que puede restar tiempo a la absorción directa de contenido',
      'Autoexigencia elevada al evaluar el propio rendimiento'
    ],
    practicalAdvice: 'Dedica 5 minutos al cierre de cada jornada a anotar qué estrategia te funcionó mejor y qué ajustarás mañana.',
    idealEnvironment: 'Espacio personal libre de distractores, con un temporizador y un cuaderno de seguimiento.'
  }
};

export const QUESTIONS: Question[] = [
  // 1-4: PROCESAMIENTO VISUAL Y ESPACIAL
  {
    id: 1,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Procesamiento visual y espacial',
    text: 'Comprendo mejor conceptos abstractos o complejos cuando los veo representados en diagramas, esquemas, mapas conceptuales o gráficos.',
    subtext: 'Preferencia por sintetizar la información a través de elementos visuales organizados.'
  },
  {
    id: 2,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Procesamiento visual y espacial',
    text: 'Tiendo a recordar con facilidad la disposición espacial, imágenes, colores o ubicaciones de la información que estudio.',
    subtext: 'Capacidad de anclaje de datos mediante memoria visual y espacial.'
  },
  {
    id: 3,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Procesamiento visual y espacial',
    text: 'Prefiero recurrir a vídeos explicativos, infografías o animaciones visuales antes que a textos continuos o grabaciones de audio.',
    subtext: 'Atracción por soportes dinámicos o visualmente estructurados.'
  },
  {
    id: 4,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Procesamiento visual y espacial',
    text: 'Suelo utilizar colores, subrayados estructurados o bocetos en mis notas para organizar mis ideas en el papel o la pantalla.',
    subtext: 'Uso activo de recursos visuales durante la toma y repaso de notas.'
  },

  // 5-8: PROCESAMIENTO VERBAL Y EXPLICATIVO
  {
    id: 5,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Procesamiento verbal y explicativo',
    text: 'Asimilo la información con mayor claridad cuando la explico con mis propias palabras o se la cuento a otra persona.',
    subtext: 'Reformulación lingüística activa como mecanismo de comprensión y retención.'
  },
  {
    id: 6,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Procesamiento verbal y explicativo',
    text: 'Disfruto leyendo textos detallados, artículos o libros, y redactando resúmenes y notas narrativas para consolidar lo aprendido.',
    subtext: 'Preferencia por el formato escrito y la redacción analítica como vía de estudio.'
  },
  {
    id: 7,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Procesamiento verbal y explicativo',
    text: 'Prestar atención a debates, ponencias orales o podcasts explicativos me resulta una forma muy eficaz y cómoda de incorporar conocimientos.',
    subtext: 'Aprovechamiento del discurso verbal auditivo y el diálogo reflexivo.'
  },
  {
    id: 8,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Procesamiento verbal y explicativo',
    text: 'Cuando me enfrento a un problema, me ayuda verbalizar o razonar internamente en forma de diálogo con palabras precisas.',
    subtext: 'Uso del lenguaje interior estructurado para guiar el pensamiento.'
  },

  // 9-12: APRENDIZAJE PRÁCTICO Y EXPERIENCIAL
  {
    id: 9,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Aprendizaje práctico y experiencial',
    text: 'Aprendo mucho más rápido y con mayor retención cuando puedo «aprender haciendo» o manipular herramientas reales desde el primer momento.',
    subtext: 'Involucramiento directo y táctil como motor de aprendizaje.'
  },
  {
    id: 10,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Aprendizaje práctico y experiencial',
    text: 'Prefiero comenzar con pruebas, ensayos prácticos o simulaciones antes de memorizar largas explicaciones teóricas.',
    subtext: 'Prioridad de la acción y la experimentación por encima de la teoría pasiva.'
  },
  {
    id: 11,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Aprendizaje práctico y experiencial',
    text: 'Los ejemplos tomados del mundo real y las aplicaciones prácticas son lo que realmente me permite retener un concepto a largo plazo.',
    subtext: 'Necesidad de anclar el conocimiento a situaciones funcionales y concretas.'
  },
  {
    id: 12,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Aprendizaje práctico y experiencial',
    text: 'Necesito realizar pausas activas o involucrar el movimiento físico y la experimentación cuando me dedico a estudiar o trabajar intensamente.',
    subtext: 'Relevancia de la energía corporal y la alternancia de dinámicas en la concentración.'
  },

  // 13-16: RAZONAMIENTO ANALÍTICO Y ESTRUCTURADO
  {
    id: 13,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Razonamiento analítico y estructurado',
    text: 'Me resulta imprescindible entender la lógica de fondo, las causas y los principios estructurados que sustentan cada tema.',
    subtext: 'Búsqueda del marco explicativo subyacente y de la coherencia lógica.'
  },
  {
    id: 14,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Razonamiento analítico y estructurado',
    text: 'Organizo mi proceso de estudio siguiendo un orden secuencial paso a paso, asegurándome de dominar una fase antes de pasar a la siguiente.',
    subtext: 'Metodología estructurada y progresión ordenada sin saltos imprevistos.'
  },
  {
    id: 15,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Razonamiento analítico y estructurado',
    text: 'Me gusta clasificar, comparar datos sistemáticamente y encontrar patrones o inconsistencias lógicas en el material que estudio.',
    subtext: 'Análisis crítico riguroso y clasificación sistemática de información.'
  },
  {
    id: 16,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Razonamiento analítico y estructurado',
    text: 'Me siento más cómodo/a cuando las instrucciones, rúbricas de evaluación o metas de aprendizaje son precisas y no dejan cabida a ambigüedades.',
    subtext: 'Apreciación de la claridad formal y de las pautas explícitas.'
  },

  // 17-20: APRENDIZAJE SOCIAL Y COLABORATIVO
  {
    id: 17,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Aprendizaje social y colaborativo',
    text: 'Rindo y me concentro mejor cuando participo en grupos de estudio, foros de discusión o proyectos en equipo.',
    subtext: 'Estímulo cognitivo derivado de la interacción con pares.'
  },
  {
    id: 18,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Aprendizaje social y colaborativo',
    text: 'Me motiva intercambiar perspectivas, contrastar dudas y recibir retroalimentación constante de compañeros o mentores.',
    subtext: 'Valoración del diálogo y la co-construcción de respuestas.'
  },
  {
    id: 19,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Aprendizaje social y colaborativo',
    text: 'Retengo mejor los conceptos complejos cuando formo parte de dinámicas de debate o resolución conjunta de casos.',
    subtext: 'Afianzamiento conceptual a través de la deliberación compartida.'
  },
  {
    id: 20,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Aprendizaje social y colaborativo',
    text: 'Aprender en soledad por periodos prolongados disminuye mi energía; la interacción social me reactiva el interés cognitivo.',
    subtext: 'Regulación del compromiso intelectual mediante la conexión interpersonal.'
  },

  // 21-24: AUTORREGULACIÓN Y METACOGNICIÓN
  {
    id: 21,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y metacognición',
    text: 'Planifico con antelación mis sesiones de estudio, estableciendo objetivos diarios claros y gestionando conscientemente mis distractores.',
    subtext: 'Autonomía y organización anticipada del tiempo y del entorno.'
  },
  {
    id: 22,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y metacognición',
    text: 'Evalúo con frecuencia si la estrategia de estudio que estoy utilizando está funcionando o si necesito cambiar de enfoque.',
    subtext: 'Monitoreo metacognitivo continuo sobre la efectividad del propio método.'
  },
  {
    id: 23,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y metacognición',
    text: 'Soy capaz de mantener un ritmo de estudio constante de manera autónoma, gestionando mi tiempo y mi motivación sin necesidad de supervisión externa.',
    subtext: 'Autodisciplina, proactividad y persistencia individual.'
  },
  {
    id: 24,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y metacognición',
    text: 'Al terminar de estudiar un tema, dedico tiempo a reflexionar sobre qué aprendí con solidez y qué puntos específicos debo reforzar.',
    subtext: 'Autoevaluación formativa y consolidación de brechas de conocimiento.'
  }
];

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo', shortLabel: '1 - Total desacuerdo' },
  { value: 2, label: 'En desacuerdo', shortLabel: '2 - Desacuerdo' },
  { value: 3, label: 'Neutral o indiferente', shortLabel: '3 - Neutral' },
  { value: 4, label: 'De acuerdo', shortLabel: '4 - De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo', shortLabel: '5 - Total acuerdo' }
];

export const HYBRID_TIE_DESCRIPTIONS: Record<string, { title: string; desc: string }> = {
  'visual_espacial-analitico_estructurado': {
    title: 'Perfil Arquitecto Lógico',
    desc: 'Combinas la visión espacial y los mapas conceptuales con un razonamiento lógico y secuencial riguroso. Destacas al estructurar sistemas complejos mediante diagramas analíticos.'
  },
  'analitico_estructurado-visual_espacial': {
    title: 'Perfil Arquitecto Lógico',
    desc: 'Combinas la visión espacial y los mapas conceptuales con un razonamiento lógico y secuencial riguroso. Destacas al estructurar sistemas complejos mediante diagramas analíticos.'
  },
  'verbal_explicativo-social_colaborativo': {
    title: 'Perfil Comunicador Dialógico',
    desc: 'Tu aprendizaje brilla en la interacción verbal: debates, grupos de estudio y explicaciones recíprocas. Consolidar el conocimiento dialogando te resulta altamente productivo.'
  },
  'social_colaborativo-verbal_explicativo': {
    title: 'Perfil Comunicador Dialógico',
    desc: 'Tu aprendizaje brilla en la interacción verbal: debates, grupos de estudio y explicaciones recíprocas. Consolidar el conocimiento dialogando te resulta altamente productivo.'
  },
  'practico_experiencial-visual_espacial': {
    title: 'Perfil Creador y Diseñador Empírico',
    desc: 'Asimilas conceptos conectando la manipulación práctica directa con modelos visuales y espaciales. Prefieres prototipar, construir y ver resultados tangibles de inmediato.'
  },
  'visual_espacial-practico_experiencial': {
    title: 'Perfil Creador y Diseñador Empírico',
    desc: 'Asimilas conceptos conectando la manipulación práctica directa con modelos visuales y espaciales. Prefieres prototipar, construir y ver resultados tangibles de inmediato.'
  },
  'practico_experiencial-social_colaborativo': {
    title: 'Perfil Colaborador de Campo',
    desc: 'Te desenvuelves con maestría en dinámicas de resolución conjunta de problemas prácticos, talleres y proyectos aplicados en equipo.'
  },
  'social_colaborativo-practico_experiencial': {
    title: 'Perfil Colaborador de Campo',
    desc: 'Te desenvuelves con maestría en dinámicas de resolución conjunta de problemas prácticos, talleres y proyectos aplicados en equipo.'
  },
  'analitico_estructurado-autorregulacion_metacognicion': {
    title: 'Perfil Estratega Metódico',
    desc: 'Máxima eficiencia a través de la planificación rigurosa, el análisis paso a paso y la autoevaluación constante de tus métodos de estudio.'
  },
  'autorregulacion_metacognicion-analitico_estructurado': {
    title: 'Perfil Estratega Metódico',
    desc: 'Máxima eficiencia a través de la planificación rigurosa, el análisis paso a paso y la autoevaluación constante de tus métodos de estudio.'
  },
  'verbal_explicativo-autorregulacion_metacognicion': {
    title: 'Perfil Investigador Autónomo',
    desc: 'Excelente capacidad de estudio independiente a través de lecturas profundas, síntesis escritas minuciosas y autogestión eficaz del tiempo.'
  },
  'autorregulacion_metacognicion-verbal_explicativo': {
    title: 'Perfil Investigador Autónomo',
    desc: 'Excelente capacidad de estudio independiente a través de lecturas profundas, síntesis escritas minuciosas y autogestión eficaz del tiempo.'
  }
};
