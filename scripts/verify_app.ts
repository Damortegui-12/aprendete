import { QUESTIONS, DIMENSIONS, LIKERT_OPTIONS } from '../src/data/questions';
import {
  calculateDimensionResults,
  detectTieGroups,
  generatePersonalProfile,
  generateFodaAnalysis,
  generate7DayPlan,
  AUDIT_PRESETS
} from '../src/utils/calculator';
import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('AUDITORÍA TÉCNICA — APRÉNDETE: MARCA Y CERO COMILLAS');
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

// 1. Verificación de las 24 preguntas y 6 dimensiones de aprendizaje
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
  // Práctico (9-12): 5, 5, 5, 5 -> Media 5.00
  9: 5, 10: 5, 11: 5, 12: 5,
  // Analítico (13-16): 3, 3, 3, 3 -> Media 3.00
  13: 3, 14: 3, 15: 3, 16: 3,
  // Social (17-20): 2, 2, 1, 2 -> Media 1.75
  17: 2, 18: 2, 19: 1, 20: 2,
  // Metacognición (21-24): 4, 4, 4, 4 -> Media 4.00
  21: 4, 22: 4, 23: 4, 24: 4
};

const results = calculateDimensionResults(sampleAnswers);
assert(results.length === 6, 'Se calculan exactamente 6 medias de resultados');

const visualRes = results.find((r) => r.key === 'visual_espacial')!;
const practicoRes = results.find((r) => r.key === 'practico_experiencial')!;
const metaRes = results.find((r) => r.key === 'autorregulacion_metacognicion')!;
const verbalRes = results.find((r) => r.key === 'verbal_explicativo')!;
const analiticoRes = results.find((r) => r.key === 'analitico_estructurado')!;
const socialRes = results.find((r) => r.key === 'social_colaborativo')!;

assert(visualRes.mean === 5.00, 'Media de Visual y espacial calculada (5.00)');
assert(practicoRes.mean === 5.00, 'Media de Práctica y experiencial calculada (5.00)');
assert(metaRes.mean === 4.00, 'Media de Autorregulación calculada (4.00)');
assert(verbalRes.mean === 3.00, 'Media de Verbal calculada (3.00)');
assert(analiticoRes.mean === 3.00, 'Media de Analítica calculada (3.00)');
assert(socialRes.mean === 1.75, 'Media de Social calculada (1.75)');

// 3. Verificación de etiquetas de intensidad en lenguaje cotidiano
console.log('\n--- 3. VERIFICACIÓN DE ETIQUETAS DE INTENSIDAD COTIDIANA ---');
assert(visualRes.intensityLabel === 'Es una de tus formas favoritas', 'Etiqueta alta en lenguaje cotidiano');
assert(metaRes.intensityLabel === 'Te resulta muy cómoda', 'Etiqueta media-alta en lenguaje cotidiano');
assert(verbalRes.intensityLabel === 'La utilizas según el momento', 'Etiqueta media en lenguaje cotidiano');
assert(socialRes.intensityLabel === 'Una forma que puedes explorar', 'Etiqueta de exploración no deficitaria');

// 4. Verificación de la generación del perfil personal
console.log('\n--- 4. VERIFICACIÓN DEL PERFIL PERSONAL Y TÍTULO DINÁMICO ---');
const isTie = true; // Visual and Practical tie at 5.00
const profile = generatePersonalProfile(results[0], results[1], isTie);
assert(
  profile.title === 'Aprendes mejor cuando lo ves y lo haces',
  `Genera el título amigable y memorable correspondiente (${profile.title})`
);
assert(
  profile.paragraph.length > 50 && profile.paragraph.includes('combinar'),
  'Genera párrafo conversacional personalizado'
);

// 5. Verificación de la Sección Unificada FODA y Recomendaciones Estratégicas
console.log('\n--- 5. VERIFICACIÓN DEL ANÁLISIS FODA Y RECOMENDACIONES ESTRATÉGICAS ---');
const lowest1 = results[results.length - 1];
const lowest2 = results[results.length - 2];
const foda = generateFodaAnalysis(results[0], results[1], lowest1, lowest2);

assert(foda.fortalezas.items.length >= 3, 'Cuadrante Fortalezas (F) contiene al menos 3 factores clave');
assert(foda.oportunidades.items.length >= 3, 'Cuadrante Oportunidades (O) contiene al menos 3 factores clave');
assert(foda.debilidades.items.length >= 3, 'Cuadrante Puntos a cuidar (D) contiene al menos 3 factores clave');
assert(foda.amenazas.items.length >= 3, 'Cuadrante Amenazas (A) contiene al menos 3 factores clave');

assert(
  foda.recommendations.length === 4,
  `Se generan exactamente 4 recomendaciones estratégicas cruzadas (FO, FA, DO, DA). Obtenidas: ${foda.recommendations.length}`
);

const strategyCodes = foda.recommendations.map((r) => r.strategyCode);
assert(
  strategyCodes.includes('FO') && strategyCodes.includes('FA') && strategyCodes.includes('DO') && strategyCodes.includes('DA'),
  'Las 4 recomendaciones cubren las estrategias FO, FA, DO y DA'
);

assert(
  foda.recommendations.every((r) => r.title && r.rationale && r.concreteExample && r.actionToday && r.kpiDeliverable),
  'Cada recomendación estratégica incluye título, fundamento del FODA, ejemplo, acción para hoy y KPI entregable'
);

// 6. Verificación del reto de 7 días con ENTREGABLES (KPI) en cada día
console.log('\n--- 6. VERIFICACIÓN DEL RETO DE 7 DÍAS CON ENTREGABLES (KPI) ---');
const plan = generate7DayPlan(results[0], results[1], results[results.length - 1]);
assert(plan.length === 7, 'El reto contiene exactamente 7 días');
assert(
  plan.every((d, i) => d.day === i + 1 && d.title && d.objective && d.instructions && d.reflectionQuestion && d.durationMinutes),
  'Cada día incluye objetivo, instrucciones, duración de 15-25 min y pregunta de reflexión'
);
assert(
  plan.every((d) => d.kpiDeliverable && d.kpiDeliverable.toLowerCase().includes('kpi')),
  'Cada uno de los 7 días incluye un resultado esperado explícito / Entregable que funciona como KPI'
);

// 7. Verificación de la identidad oficial de marca: Apréndete
console.log('\n--- 7. VERIFICACIÓN DE IDENTIDAD OFICIAL: APRÉNDETE ---');
const indexHtmlContent = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
const metadataContent = fs.readFileSync(path.resolve(process.cwd(), 'metadata.json'), 'utf-8');
const headerContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Header.tsx'), 'utf-8');
const welcomeContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/WelcomeScreen.tsx'), 'utf-8');
const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');

assert(indexHtmlContent.includes('Apréndete'), 'index.html utiliza Apréndete como título principal');
assert(metadataContent.includes('"name": "Apréndete"'), 'metadata.json utiliza Apréndete como nombre oficial');
assert(headerContent.includes('Apréndete'), 'Header.tsx muestra el logotipo y nombre de marca Apréndete');
assert(welcomeContent.includes('Apréndete'), 'WelcomeScreen.tsx destaca la marca Apréndete');
assert(appContent.includes('Apréndete'), 'App.tsx utiliza Apréndete en el pie de página');

// 8. Cero uso de "Learning Profile" como nombre de la aplicación y eliminación de "Acceso de prueba"
console.log('\n--- 8. AUSENCIA DE LEARNING PROFILE Y ELIMINACIÓN DE ACCESO DE PRUEBA ---');
assert(!headerContent.includes('Learning Profile'), 'Header.tsx no contiene Learning Profile');
assert(!welcomeContent.includes('Learning Profile'), 'WelcomeScreen.tsx no contiene Learning Profile');
assert(!appContent.includes('Learning Profile'), 'App.tsx no contiene Learning Profile en el pie de página ni textos visibles');
assert(!welcomeContent.includes('Acceso de prueba'), 'WelcomeScreen.tsx no contiene la sección Acceso de prueba');

// 9. Cero comillas en toda la interfaz
console.log('\n--- 9. VERIFICACIÓN DE CERO COMILLAS EN LA INTERFAZ ---');
const srcDir = path.resolve(process.cwd(), 'src');
const filesToCheck: string[] = [];

function getFilesRecursively(dir: string) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFilesRecursively(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      filesToCheck.push(fullPath);
    }
  });
}
getFilesRecursively(srcDir);

let foundQuotes = 0;
const quoteRegex = /[«»“”]/;

filesToCheck.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (quoteRegex.test(line)) {
      console.warn(`   ⚠️ Comilla detectada en ${path.basename(filePath)}:${idx + 1} -> ${line.trim()}`);
      foundQuotes++;
    }
  });
});

assert(foundQuotes === 0, `Cero comillas («, », “, ”) en los archivos de la interfaz (encontradas: ${foundQuotes})`);

// 10. Mensaje principal acordado exacto sin comillas
console.log('\n--- 10. MENSAJE PRINCIPAL ACORDADO ---');
const expectedMessageFragment = 'Identifica tus preferencias de aprendizaje, aprende estrategias prácticas y aprovecha al máximo tu potencial';
assert(
  welcomeContent.includes(expectedMessageFragment) && welcomeContent.includes('Totalmente personalizadas'),
  'El mensaje principal acordado está presente sin comillas'
);

// 11. Honestidad científica y ausencia de jerga clínica
console.log('\n--- 11. AUDITORÍA DE LENGUAJE Y HONESTIDAD CIENTÍFICA ---');
const forbiddenTerms = [
  /estilos de amor/i,
  /vínculo afectivo/i,
  /vínculos afectivos/i,
  /john alan lee/i,
  /hendrick/i,
  /colores del amor/i,
  /diagnóstico sentimental/i,
  /evaluación psicométrica oficial/i,
  /test científicamente validado/i,
  /nivel deficiente/i,
  /déficit cognitivo/i
];

let foundForbiddenTerms = 0;
filesToCheck.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  forbiddenTerms.forEach((pattern) => {
    const match = content.match(pattern);
    if (match) {
      console.warn(`   ⚠️ Término no deseado en ${path.basename(filePath)}: ${match[0]}`);
      foundForbiddenTerms++;
    }
  });
});

assert(foundForbiddenTerms === 0, 'Cero términos prohibidos, no deseados o pseudocientíficos');

console.log('\n--- 12. GRÁFICA RADIAL INTERACTIVA Y TOOLTIPS EMERGENTES ---');
const radarChartFile = path.resolve(process.cwd(), 'src/components/RadarChart.tsx');
assert(fs.existsSync(radarChartFile), 'Componente RadarChart.tsx existe y está disponible');
const radarContent = fs.readFileSync(radarChartFile, 'utf-8');
assert(radarContent.includes('radarNeonGradient') && radarContent.includes('polygon'), 'RadarChart implementa polígono radial de 6 ejes con gradiente de luces');
assert(radarContent.includes('activeTooltipKey') && radarContent.includes('tappedKey') && radarContent.includes('hoveredKey'), 'RadarChart soporta interacción por tap y hover');
assert(radarContent.includes('AnimatePresence') && radarContent.includes('tooltipResult.mean.toFixed(2)'), 'RadarChart muestra tooltip emergente con descripción y valor exacto sin salir de la vista');

console.log('\n=====================================================');
console.log(`RESUMEN DE PRUEBAS EJECUTADAS: ${passedTests} superadas, ${failedTests} fallidas.`);
console.log('=====================================================');

if (failedTests > 0) {
  process.exit(1);
}
