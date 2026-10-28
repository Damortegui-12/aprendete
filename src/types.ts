export type DimensionKey =
  | 'visual_espacial'
  | 'verbal_explicativo'
  | 'practico_experiencial'
  | 'analitico_estructurado'
  | 'social_colaborativo'
  | 'autorregulacion_metacognicion';

export interface SkillColorTheme {
  bg: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  barColor: string;
  accentText: string;
}

export interface DimensionMeta {
  key: DimensionKey;
  name: string;
  shortName: string;
  friendlyName: string;
  tagline: string;
  summary: string;
  everydayDescription: string;
  dailyLifeManifestation: string;
  studyWorkExample: string;
  quickAction: string;
  techniques: string[];
  theme: SkillColorTheme;
}

export interface Question {
  id: number;
  dimensionKey: DimensionKey;
  dimensionName: string;
  text: string;
  subtext: string;
}

export interface DimensionResult {
  key: DimensionKey;
  name: string;
  shortName: string;
  friendlyName: string;
  tagline: string;
  mean: number; // 1.00 to 5.00
  sum: number; // 4 to 20
  percentage: number; // 0 to 100%
  rank: number; // 1 to 6
  isTied: boolean;
  tiedKeys: DimensionKey[];
  meta: DimensionMeta;
  intensityLabel: string;
}

export interface UserPersonalProfile {
  title: string;
  paragraph: string;
  topSkill1: DimensionResult;
  topSkill2: DimensionResult;
  isTie: boolean;
}

export interface FodaItem {
  title: string;
  description: string;
  tag?: string;
}

export interface FodaQuadrant {
  code: 'F' | 'O' | 'D' | 'A';
  title: string;
  badge: string;
  subtitle: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glowColor: string;
  items: FodaItem[];
}

export interface FodaStrategicRecommendation {
  id: string;
  strategyCode: 'FO' | 'FA' | 'DO' | 'DA';
  typeLabel: string; // e.g. "Estrategia FO: Potenciar", "Estrategia FA: Proteger"
  title: string;
  rationale: string;
  concreteExample: string;
  actionToday: string;
  kpiDeliverable: string; // KPI / Entregable esperado de la recomendación
  accentColor: string;
}

export interface FodaAnalysis {
  fortalezas: FodaQuadrant;
  oportunidades: FodaQuadrant;
  debilidades: FodaQuadrant;
  amenazas: FodaQuadrant;
  recommendations: FodaStrategicRecommendation[];
}

// Kept for backward compatibility if needed by older imports
export interface SectionARecommendation {
  id: string;
  title: string;
  explanation: string;
  example: string;
  actionToday: string;
  skillKey: DimensionKey;
}

export interface SectionBRecommendation {
  id: string;
  skillName: string;
  skillKey: DimensionKey;
  whatItOffers: string;
  everydaySituation: string;
  smallExercise: string;
  pairingSuggestion: string;
}

export interface TieGroup {
  mean: number;
  dimensions: DimensionResult[];
  isDominant: boolean;
  hybridName?: string;
  hybridDescription?: string;
}

export interface DayPlanItem {
  day: number;
  title: string;
  theme: string;
  dimensionKey: DimensionKey;
  durationMinutes: string; // e.g. "15-20 min"
  objective: string;
  instructions: string;
  reflectionQuestion: string;
  kpiDeliverable: string; // Entregable tangible que funciona como KPI
  completed: boolean;
}

export interface StoredAnswers {
  [questionId: number]: number; // 1 to 5
}
