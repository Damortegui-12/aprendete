import { DimensionKey, DimensionMeta, Question } from '../types';

export const DIMENSIONS: Record<DimensionKey, DimensionMeta> = {
  visual_espacial: {
    key: 'visual_espacial',
    name: 'Procesamiento visual y espacial',
    shortName: 'Visual y espacial',
    friendlyName: 'Visual y espacial',
    tagline: 'Comprender mediante imágenes, mapas, esquemas y relaciones espaciales',
    summary: 'A ti te puede ayudar mucho ver las ideas. Cuando conviertes un tema en un dibujo, un mapa o un esquema, es mucho más fácil encontrarle sentido y recordar cómo encajan las piezas.',
    everydayDescription: 'Tiendes a pensar en imágenes. Si te explican una ruta o un concepto nuevo, primero creas una imagen mental para orientarte.',
    dailyLifeManifestation: 'Recuerdas la portada de un libro antes que su autor, o la ubicación exacta de una frase en una página antes de las palabras literales.',
    studyWorkExample: 'Crear un mapa mental en una pizarra o una infografía de una sola página antes de redactar un proyecto o estudiar para una presentación.',
    quickAction: 'Elige un tema confuso y dibuja tres círculos conectados con flechas que muestren cómo se relacionan entre sí.',
    techniques: [
      'Mapas conceptuales con flechas y conexiones',
      'Esquemas visuales y diagramas de flujo',
      'Código de colores para diferenciar categorías'
    ],
    theme: {
      bg: '#151224',
      badgeBg: 'rgba(139, 92, 246, 0.18)',
      badgeText: '#A78BFA',
      border: 'rgba(139, 92, 246, 0.4)',
      barColor: '#8B5CF6',
      accentText: '#A78BFA'
    }
  },
  verbal_explicativo: {
    key: 'verbal_explicativo',
    name: 'Procesamiento verbal y explicativo',
    shortName: 'Verbal y explicativa',
    friendlyName: 'Verbal y explicativa',
    tagline: 'Asimilar mediante palabras, lecturas, resúmenes y explicaciones propias',
    summary: 'A ti te funciona poner las ideas en palabras. Ya sea leyendo un buen texto, escribiendo un resumen con tus propias frases o contándoselo a alguien, el lenguaje es tu mejor aliado.',
    everydayDescription: 'Cuando algo no te queda claro, te ayuda formularlo en voz alta o escribir una nota rápida para ordenar tus pensamientos.',
    dailyLifeManifestation: 'Encuentras soluciones a dilemas cotidianos mientras se los explicas a un amigo o mientras redactas un mensaje.',
    studyWorkExample: 'Cerrar el documento tras leerlo y grabar una nota de voz de 2 minutos resumiendo los puntos clave con tus propias palabras.',
    quickAction: 'Explica en voz alta durante dos minutos el tema que estés aprendiendo hoy como si se lo contaras a un amigo que no sabe nada del tema.',
    techniques: [
      'Técnica de explicar con palabras propias',
      'Grabaciones breves de audio para repasar',
      'Resúmenes narrativos y glosarios personales'
    ],
    theme: {
      bg: '#1A1810',
      badgeBg: 'rgba(255, 228, 94, 0.18)',
      badgeText: '#FFE45E',
      border: 'rgba(255, 228, 94, 0.4)',
      barColor: '#FFE45E',
      accentText: '#FFE45E'
    }
  },
  practico_experiencial: {
    key: 'practico_experiencial',
    name: 'Aprendizaje práctico y experiencial',
    shortName: 'Práctica y experiencial',
    friendlyName: 'Práctica y experiencial',
    tagline: 'Aprender haciendo, tocando, experimentando y probando en el mundo real',
    summary: 'A ti te resulta más fácil aprender cuando puedes ponerte manos a la obra. Necesitas probar, ensayar y experimentar con ejemplos reales para que la teoría cobre vida de verdad.',
    everydayDescription: 'Prefieres montar un mueble o usar una herramienta mirando directamente las piezas antes de leerte las instrucciones completas.',
    dailyLifeManifestation: 'Recuerdas mucho mejor lo que has hecho tú mismo/a que lo que simplemente escuchaste o viste hacer a otros.',
    studyWorkExample: 'Construir un prototipo sencillo, resolver un caso práctico o programar un código mínimo antes de memorizar las fórmulas teóricas.',
    quickAction: 'Busca un ejercicio o problema real del tema que estudias e intenta resolverlo directamente, consultando la teoría solo cuando te atasques.',
    techniques: [
      'Aprender resolviendo retos reales',
      'Práctica directa y ensayo guiado',
      'Uso de casos prácticos y simulaciones'
    ],
    theme: {
      bg: '#1A0E17',
      badgeBg: 'rgba(255, 45, 149, 0.18)',
      badgeText: '#FF69C8',
      border: 'rgba(255, 45, 149, 0.4)',
      barColor: '#FF2D95',
      accentText: '#FF69C8'
    }
  },
  analitico_estructurado: {
    key: 'analitico_estructurado',
    name: 'Razonamiento analítico y estructurado',
    shortName: 'Analítica y estructurada',
    friendlyName: 'Analítica y estructurada',
    tagline: 'Lógica clara, descomposición metódica y comprensión paso a paso',
    summary: 'A ti te gusta entender por qué funcionan las cosas. Necesitas ver la lógica interna, las causas de fondo y seguir un orden metódico para tener la seguridad de dominar un tema.',
    everydayDescription: 'Buscas la coherencia y el orden. Te desconciertan las explicaciones caóticas y prefieres clasificar y secuenciar la información.',
    dailyLifeManifestation: 'Organizas listas lógicas antes de iniciar un proyecto y detectas con rapidez inconsistencias o vacíos en una explicación.',
    studyWorkExample: 'Descomponer un proyecto complejo en fases secuenciales con criterios de verificación claros para cada etapa.',
    quickAction: 'Haz una tabla de dos columnas comparando las diferencias y similitudes clave entre dos conceptos de tu materia.',
    techniques: [
      'Descomposición de problemas en pasos lógicos',
      'Tablas comparativas y análisis causa-efecto',
      'Listas de comprobación secuenciales'
    ],
    theme: {
      bg: '#0E1724',
      badgeBg: 'rgba(54, 207, 255, 0.18)',
      badgeText: '#36CFFF',
      border: 'rgba(54, 207, 255, 0.4)',
      barColor: '#36CFFF',
      accentText: '#36CFFF'
    }
  },
  social_colaborativo: {
    key: 'social_colaborativo',
    name: 'Aprendizaje social y colaborativo',
    shortName: 'Social y colaborativa',
    friendlyName: 'Social y colaborativa',
    tagline: 'Intercambiar puntos de vista, debatir, contrastar dudas y crear en equipo',
    summary: 'Tu mente se activa cuando compartes el aprendizaje con otras personas. Dialogar, contrastar opiniones, hacer preguntas y escuchar diferentes perspectivas te llena de energía cognitiva.',
    everydayDescription: 'Estudiar en soledad durante muchas horas puede apagar tu curiosidad; una breve charla sobre el tema te devuelve el entusiasmo.',
    dailyLifeManifestation: 'Aprendes con rapidez en reuniones o talleres cuando puedes hacer preguntas directas y comentar impresiones con tus compañeros.',
    studyWorkExample: 'Quedar con un colega o compañero de estudio durante 30 minutos para hacerse preguntas mutuas sobre los puntos más difíciles.',
    quickAction: 'Escribe a un compañero de clase o trabajo para contrastar una duda sobre lo que estás aprendiendo hoy.',
    techniques: [
      'Grupos de estudio focalizados con preguntas mutuas',
      'Debates breves para contrastar enfoques',
      'Revisión en parejas o con un mentor'
    ],
    theme: {
      bg: '#1A0E1A',
      badgeBg: 'rgba(255, 105, 200, 0.18)',
      badgeText: '#FF69C8',
      border: 'rgba(255, 105, 200, 0.4)',
      barColor: '#FF69C8',
      accentText: '#FF69C8'
    }
  },
  autorregulacion_metacognicion: {
    key: 'autorregulacion_metacognicion',
    name: 'Autorregulación y metacognición',
    shortName: 'Autorregulación y reflexión',
    friendlyName: 'Autorregulación y reflexión',
    tagline: 'Planificación autónoma, pausas conscientes y revisión honesta de cómo avanzas',
    summary: 'A ti te funciona observar cómo aprendes. Sabes planificar tus sesiones, comprobar de forma honesta si estás comprendiendo y ajustar tu método cuando algo no marcha como esperabas.',
    everydayDescription: 'Tienes una brújula interna despierta: notas con facilidad cuándo estás disperso/a y sabes cómo reconectar con tu ritmo.',
    dailyLifeManifestation: 'Fijas metas concretas antes de empezar una tarea y sueles reflexionar sobre cómo organizarte mejor la próxima vez.',
    studyWorkExample: 'Bloques de 25 minutos de estudio concentrado con una autoevaluación de 3 minutos al terminar cada bloque.',
    quickAction: 'Antes de ponerte a estudiar hoy, anota en un post-it la única meta que quieres haber conseguido al terminar la sesión.',
    techniques: [
      'Sesiones concentradas con metas definidas',
      'Autoevaluación periódica sin consultar notas',
      'Ajuste flexible de estrategias según el resultado'
    ],
    theme: {
      bg: '#0D1A14',
      badgeBg: 'rgba(16, 185, 129, 0.18)',
      badgeText: '#34D399',
      border: 'rgba(16, 185, 129, 0.4)',
      barColor: '#10B981',
      accentText: '#34D399'
    }
  }
};

export const QUESTIONS: Question[] = [
  // 1-4: PROCESAMIENTO VISUAL Y ESPACIAL
  {
    id: 1,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Visual y espacial',
    text: 'Comprendo mejor conceptos abstractos o complejos cuando los veo representados en diagramas, esquemas, mapas conceptuales o gráficos.',
    subtext: 'Te resulta natural transformar ideas abstractas en esquemas y elementos visuales.'
  },
  {
    id: 2,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Visual y espacial',
    text: 'Tiendo a recordar con facilidad la disposición espacial, imágenes, colores o ubicaciones de la información que estudio.',
    subtext: 'Tu memoria retiene con facilidad dónde estaban las cosas en la página o en la pantalla.'
  },
  {
    id: 3,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Visual y espacial',
    text: 'Prefiero recurrir a vídeos explicativos, infografías o animaciones visuales antes que a textos continuos o grabaciones de audio.',
    subtext: 'Los formatos visuales y dinámicos captan mejor tu atención y facilitan tu comprensión.'
  },
  {
    id: 4,
    dimensionKey: 'visual_espacial',
    dimensionName: 'Visual y espacial',
    text: 'Suelo utilizar colores, subrayados estructurados o bocetos en mis notas para organizar mis ideas en el papel o la pantalla.',
    subtext: 'Tus apuntes cobran vida cuando tienen estructura visual, espacio y toques de color.'
  },

  // 5-8: PROCESAMIENTO VERBAL Y EXPLICATIVO
  {
    id: 5,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Verbal y explicativa',
    text: 'Asimilo la información con mayor claridad cuando la explico con mis propias palabras o se la cuento a otra persona.',
    subtext: 'Traducir un concepto a tu propio lenguaje es tu mejor prueba de comprensión.'
  },
  {
    id: 6,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Verbal y explicativa',
    text: 'Disfruto leyendo textos detallados, artículos o libros, y redactando resúmenes y notas narrativas para consolidar lo aprendido.',
    subtext: 'La lectura pausada y la escritura te ayudan a darle forma sólida a las ideas.'
  },
  {
    id: 7,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Verbal y explicativa',
    text: 'Prestar atención a debates, ponencias orales o podcasts explicativos me resulta una forma muy eficaz y cómoda de incorporar conocimientos.',
    subtext: 'Escuchar argumentos bien explicados te permite absorber conceptos con fluidez.'
  },
  {
    id: 8,
    dimensionKey: 'verbal_explicativo',
    dimensionName: 'Verbal y explicativa',
    text: 'Cuando me enfrento a un problema, me ayuda verbalizar o razonar internamente en forma de diálogo con palabras precisas.',
    subtext: 'Conversar contigo mismo/a o formular preguntas claras te ayuda a desatascar dudas.'
  },

  // 9-12: APRENDIZAJE PRÁCTICO Y EXPERIENCIAL
  {
    id: 9,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Práctica y experiencial',
    text: 'Aprendo mucho más rápido y con mayor retención cuando puedo «aprender haciendo» o manipular herramientas reales desde el primer momento.',
    subtext: 'La práctica directa y la acción física te permiten consolidar lo que estás estudiando.'
  },
  {
    id: 10,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Práctica y experiencial',
    text: 'Prefiero comenzar con pruebas, ensayos prácticos o simulaciones antes de memorizar largas explicaciones teóricas.',
    subtext: 'Ensayar primero te ayuda a entender por qué la teoría existe y para qué sirve.'
  },
  {
    id: 11,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Práctica y experiencial',
    text: 'Los ejemplos tomados del mundo real y las aplicaciones prácticas son lo que realmente me permite retener un concepto a largo plazo.',
    subtext: 'Necesitas ver la utilidad concreta de lo que aprendes en la vida cotidiana.'
  },
  {
    id: 12,
    dimensionKey: 'practico_experiencial',
    dimensionName: 'Práctica y experiencial',
    text: 'Necesito realizar pausas activas o involucrar el movimiento físico y la experimentación cuando me dedico a estudiar o trabajar intensamente.',
    subtext: 'El dinamismo físico te ayuda a mantener la mente despierta y enfocada.'
  },

  // 13-16: RAZONAMIENTO ANALÍTICO Y ESTRUCTURADO
  {
    id: 13,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Analítica y estructurada',
    text: 'Me resulta imprescindible entender la lógica de fondo, las causas y los principios estructurados que sustentan cada tema.',
    subtext: 'Quieres saber el porqué de las cosas, no solo memorizar datos aislados.'
  },
  {
    id: 14,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Analítica y estructurada',
    text: 'Organizo mi proceso de estudio siguiendo un orden secuencial paso a paso, asegurándome de dominar una fase antes de pasar a la siguiente.',
    subtext: 'Avanzar con orden y sin saltos te da seguridad y solidez en el aprendizaje.'
  },
  {
    id: 15,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Analítica y estructurada',
    text: 'Me gusta clasificar, comparar datos sistemáticamente y encontrar patrones o inconsistencias lógicas en el material que estudio.',
    subtext: 'Disfrutas comparando información y encontrando la estructura detrás del caos.'
  },
  {
    id: 16,
    dimensionKey: 'analitico_estructurado',
    dimensionName: 'Analítica y estructurada',
    text: 'Me siento más cómodo/a cuando las instrucciones, rúbricas de evaluación o metas de aprendizaje son precisas y no dejan cabida a ambigüedades.',
    subtext: 'La claridad en las reglas del juego te permite enfocar tu esfuerzo con eficacia.'
  },

  // 17-20: APRENDIZAJE SOCIAL Y COLABORATIVO
  {
    id: 17,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Social y colaborativa',
    text: 'Rindo y me concentro mejor cuando participo en grupos de estudio, foros de discusión o proyectos en equipo.',
    subtext: 'Estar con otras personas que comparten tus metas te motiva a avanzar con ganas.'
  },
  {
    id: 18,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Social y colaborativa',
    text: 'Me motiva intercambiar perspectivas, contrastar dudas y recibir retroalimentación constante de compañeros o mentores.',
    subtext: 'Contrastar tus ideas con las de otros te abre caminos que no habías considerado.'
  },
  {
    id: 19,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Social y colaborativa',
    text: 'Retengo mejor los conceptos complejos cuando formo parte de dinámicas de debate o resolución conjunta de casos.',
    subtext: 'El intercambio de puntos de vista enriquece tu comprensión de los temas difíciles.'
  },
  {
    id: 20,
    dimensionKey: 'social_colaborativo',
    dimensionName: 'Social y colaborativa',
    text: 'Aprender en soledad por periodos prolongados disminuye mi energía; la interacción social me reactiva el interés cognitivo.',
    subtext: 'Una conversación enriquecedora puede reactivar tu curiosidad en pocos minutos.'
  },

  // 21-24: AUTORREGULACIÓN Y METACOGNICIÓN
  {
    id: 21,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y reflexión',
    text: 'Planifico con antelación mis sesiones de estudio, estableciendo objetivos diarios claros y gestionando conscientemente mis distractores.',
    subtext: 'Saber qué quieres conseguir antes de empezar te ahorra tiempo y frustración.'
  },
  {
    id: 22,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y reflexión',
    text: 'Evalúo con frecuencia si la estrategia de estudio que estoy utilizando está funcionando o si necesito cambiar de enfoque.',
    subtext: 'Si notas que un método no da resultado, tienes la flexibilidad de probar otro camino.'
  },
  {
    id: 23,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y reflexión',
    text: 'Soy capaz de mantener un ritmo de estudio constante de manera autónoma, gestionando mi tiempo y mi motivación sin necesidad de supervisión externa.',
    subtext: 'Cuentas con la disciplina para avanzar a tu propio ritmo con independencia.'
  },
  {
    id: 24,
    dimensionKey: 'autorregulacion_metacognicion',
    dimensionName: 'Autorregulación y reflexión',
    text: 'Al terminar de estudiar un tema, dedico tiempo a reflexionar sobre qué aprendí con solidez y qué puntos específicos debo reforzar.',
    subtext: 'Tomarte unos minutos para repasar lo aprendido asienta el conocimiento en tu memoria.'
  }
];

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Casi nunca me pasa', shortLabel: '1 · Rara vez' },
  { value: 2, label: 'Pocas veces me identifico', shortLabel: '2 · Poco' },
  { value: 3, label: 'A veces sí, a veces no', shortLabel: '3 · A veces' },
  { value: 4, label: 'Me ocurre con frecuencia', shortLabel: '4 · A menudo' },
  { value: 5, label: 'Me describe muy bien', shortLabel: '5 · Mucho' }
];
