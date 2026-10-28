export type DimensionKey =
  | 'visual_espacial'
  | 'verbal_explicativo'
  | 'practico_experiencial'
  | 'analitico_estructurado'
  | 'social_colaborativo'
  | 'autorregulacion_metacognicion';

export interface DimensionMeta {
  key: DimensionKey;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  coreStrength: string;
  techniques: string[];
  vulnerabilities: string[];
  practicalAdvice: string;
  idealEnvironment: string;
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
  tagline: string;
  mean: number; // 1.00 to 5.00
  sum: number; // 4 to 20
  percentage: number; // 0 to 100%
  rank: number; // 1 to 6
  isTied: boolean;
  tiedKeys: DimensionKey[];
  meta: DimensionMeta;
}

export interface TieGroup {
  mean: number;
  dimensions: DimensionResult[];
  isDominant: boolean; // if rank is 1
  hybridName?: string;
  hybridDescription?: string;
}

export interface DayPlanItem {
  day: number;
  title: string;
  theme: string;
  dimensionKey: DimensionKey;
  objective: string;
  actionTask: string;
  reflectionPrompt: string;
  completed: boolean;
}

export interface StoredAnswers {
  [questionId: number]: number; // 1 to 5
}
