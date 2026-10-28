import { QUESTIONS, DIMENSIONS, LIKERT_OPTIONS } from '../src/data/questions';
import {
  calculateDimensionResults,
  detectTieGroups,
  generate7DayPlan,
  AUDIT_PRESETS
} from '../src/utils/calculator';
import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('AUDITORÍA TÉCNICA DEL PROYECTO: LEARNING PROFILE');
console.log('=====================================================\n');

let failedTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Detalle: ${details}`);
    failedTests++;
  }
}

// 1. Verificación de las 24 preguntas y 6 dimensiones de Learning Profile
console.log('--- 1. VERIFICACIÓN DE LAS 24 PREGUNTAS Y 6 DIMENSIONES ---');
assert(QUESTIONS.length === 24, 'Total de preguntas es exactamente 24', `Obtenido: ${QUESTIONS.length}`);

const dimCounts: Record<string, number> = {};
QUESTIONS.forEach((q) => {
  dimCounts[q.dimensionKey] = (dimCounts[q.dimensionKey] || 0) + 1;
});

const expectedKeys = [
  'visual_espacial',
  'verbal_explicativo',
  'practico_experiencial',
  'analitico_estructurado',
  'social_colaborativo',
  'autorregulacion_metacognicion'
];

assert(
  expectedKeys.every((k) => dimCounts[k] === 4),
  'Cada una de las 6 dimensiones de aprendizaje tiene exactamente 4 preguntas (4 × 6 = 24)',
  JSON.stringify(dimCounts)
);

// Escala Likert 1 a 5
assert(LIKERT_OPTIONS.length === 5, 'Escala Likert contiene exactamente 5 puntos (1 a 5)');

// 2. Verificación del cálculo de las seis medias aritméticas
console.log('\n--- 2. VERIFICACIÓN DE LAS SEIS MEDIAS ARITMÉTICAS ---');
const sampleAnswers: Record<number, number> = {
  // Visual (1-4): 5, 5, 5, 5 -> Media 5.00
  1: 5, 2: 5, 3: 5, 4: 5,
  // Verbal (5-8): 3, 3, 3, 3 -> Media 3.00
  5: 3, 6: 3, 7: 3, 8: 3,
  // Práctico (9-12): 2, 2, 3, 2 -> Media 2.25
  9: 2, 10: 2, 11: 3, 12: 2,
  // Analítico (13-16): 5, 5, 5, 5 -> Media 5.00
  13: 5, 14: 5, 15: 5, 16: 5,
  // Social (17-20): 2, 2, 1, 2 -> Media 1.75
  17: 2, 18: 2, 19: 1, 20: 2,
  // Metacognición (21-24): 4, 4, 4, 4 -> Media 4.00
  21: 4, 22: 4, 23: 4, 24: 4
};

const results = calculateDimensionResults(sampleAnswers);
assert(results.length === 6, 'Se calculan exactamente 6 medias de resultados');

const visualRes = results.find((r) => r.key === 'visual_espacial')!;
const verbalRes = results.find((r) => r.key === 'verbal_explicativo')!;
const practicoRes = results.find((r) => r.key === 'practico_experiencial')!;
const analiticoRes = results.find((r) => r.key === 'analitico_estructurado')!;
const socialRes = results.find((r) => r.key === 'social_colaborativo')!;
const metaRes = results.find((r) => r.key === 'autorregulacion_metacognicion')!;

assert(visualRes.mean === 5.00, 'Media de Procesamiento visual y espacial calculada (5.00)');
assert(analiticoRes.mean === 5.00, 'Media de Razonamiento analítico y estructurado calculada (5.00)');
assert(metaRes.mean === 4.00, 'Media de Autorregulación y metacognición calculada (4.00)');
assert(verbalRes.mean === 3.00, 'Media de Procesamiento verbal y explicativo calculada (3.00)');
assert(practicoRes.mean === 2.25, 'Media de Aprendizaje práctico y experiencial calculada (2.25)');
assert(socialRes.mean === 1.75, 'Media de Aprendizaje social y colaborativo calculada (1.75)');

// 3. Verificación de la ordenación de resultados (mayor a menor)
console.log('\n--- 3. VERIFICACIÓN DE LA ORDENACIÓN DE RESULTADOS ---');
let isStrictlySorted = true;
for (let i = 0; i < results.length - 1; i++) {
  if (results[i].mean < results[i + 1].mean) {
    isStrictlySorted = false;
  }
}
assert(isStrictlySorted, 'Resultados ordenados estrictamente de mayor a menor puntuación');

// 4. Verificación de las dos dimensiones más altas
console.log('\n--- 4. VERIFICACIÓN DE LAS DOS DIMENSIONES MÁS ALTAS ---');
const top1 = results[0];
const top2 = results[1];
assert(top1.mean >= results[2].mean && top2.mean >= results[2].mean, 'Las dos dimensiones más altas se identifican con precisión');

// 5. Verificación de la gestión de empates
console.log('\n--- 5. VERIFICACIÓN DE LA GESTIÓN DE EMPATES ---');
const tieGroups = detectTieGroups(results);
assert(tieGroups.length === 1, 'Se detecta exactamente 1 grupo de empate (Visual y Analítico)');
assert(tieGroups[0].isDominant === true, 'El grupo empatado está en el puesto #1 (Empate dominante)');
assert(
  tieGroups[0].dimensions.map((d) => d.key).sort().join(',') === 'analitico_estructurado,visual_espacial',
  'Las dimensiones empatadas en #1 son Visual y Analítico'
);
assert(
  tieGroups[0].hybridName === 'Perfil Arquitecto Lógico',
  'Se genera el perfil híbrido correspondiente para el empate Visual-Analítico'
);

// 6. Verificación del caso límite: empate hexagonal
console.log('\n--- 6. VERIFICACIÓN CASO LÍMITE: EMPATE HEXAGONAL ---');
const hexResults = calculateDimensionResults(AUDIT_PRESETS.ALL_NEUTRAL_TIE.answers);
const hexTies = detectTieGroups(hexResults);
assert(hexTies.length === 1, 'Detecta el empate global de las 6 dimensiones');
assert(hexTies[0].dimensions.length === 6, 'Las 6 dimensiones están agrupadas en el empate hexagonal');

// 7. Verificación del plan de aprendizaje de siete días
console.log('\n--- 7. VERIFICACIÓN DEL PLAN DE APRENDIZAJE DE SIETE DÍAS ---');
const plan = generate7DayPlan(results[0], results[1], results[results.length - 1]);
assert(plan.length === 7, 'El plan contiene exactamente 7 días');
assert(
  plan.every((d, i) => d.day === i + 1 && d.title && d.objective && d.actionTask && d.reflectionPrompt),
  'Cada día cuenta con día correlativo, título, objetivo, micro-ejercicio práctico y reflexión metacognitiva'
);

// 8. Verificación de honestidad científica y ausencia de términos erróneos
console.log('\n--- 8. AUDITORÍA DE CONTENIDO Y HONESTIDAD CIENTÍFICA ---');
const srcDir = path.resolve(process.cwd(), 'src');
const filesToCheck: string[] = [];

function getFilesRecursively(dir: string) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFilesRecursively(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html')) {
      filesToCheck.push(fullPath);
    }
  });
}
getFilesRecursively(srcDir);
filesToCheck.push(path.resolve(process.cwd(), 'index.html'));
filesToCheck.push(path.resolve(process.cwd(), 'metadata.json'));

const forbiddenTerms = [
  /estilos de amor/i,
  /vínculo afectivo/i,
  /vínculos afectivos/i,
  /john alan lee/i,
  /hendrick/i,
  /colores del amor/i,
  /diagnóstico sentimental/i,
  /evaluación psicométrica oficial/i,
  /test científicamente validado/i
];

let foundForbiddenTerms = 0;
filesToCheck.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  forbiddenTerms.forEach((pattern) => {
    const match = content.match(pattern);
    if (match) {
      console.warn(`   ⚠️ Término prohibido encontrado en ${path.basename(filePath)}: ${match[0]}`);
      foundForbiddenTerms++;
    }
  });
});

assert(foundForbiddenTerms === 0, 'No existe ningún término de amor, sentimental o afirmación pseudocientífica');

// 9. Auditoría de la paleta de colores (Solo negro profundo y rosa encendido)
console.log('\n--- 9. AUDITORÍA ESTRICTA DE LA PALETA DE COLORES ---');
const forbiddenColors = [
  /text-blue-/i, /bg-blue-/i, /border-blue-/i,
  /text-green-/i, /bg-green-/i, /border-green-/i,
  /text-emerald-/i, /bg-emerald-/i, /border-emerald-/i,
  /text-yellow-/i, /bg-yellow-/i, /border-yellow-/i,
  /text-amber-/i, /bg-amber-/i, /border-amber-/i,
  /text-purple-/i, /bg-purple-/i, /border-purple-/i,
  /text-indigo-/i, /bg-indigo-/i, /border-indigo-/i,
  /text-cyan-/i, /bg-cyan-/i, /border-cyan-/i,
  /text-orange-/i, /bg-orange-/i, /border-orange-/i
];

let foundForbiddenColors = 0;
filesToCheck.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  forbiddenColors.forEach((pattern) => {
    const match = content.match(pattern);
    if (match) {
      console.warn(`   ⚠️ Color no permitido en ${path.basename(filePath)}: ${match[0]}`);
      foundForbiddenColors++;
    }
  });
});

assert(foundForbiddenColors === 0, 'Paleta estricta: 0 colores de acento no permitidos detectados');

console.log('\n=====================================================');
console.log(`RESUMEN DE PRUEBAS EJECUTADAS: ${passedTests} superadas, ${failedTests} fallidas.`);
console.log('=====================================================');

if (failedTests > 0) {
  process.exit(1);
}
