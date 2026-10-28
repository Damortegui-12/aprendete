/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ReportScreen } from './components/ReportScreen';
import { AuditModal } from './components/AuditModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { QuestionGridModal } from './components/QuestionGridModal';
import { Toast } from './components/Toast';
import { QUESTIONS } from './data/questions';
import {
  calculateDimensionResults,
  detectTieGroups,
  generate7DayPlan,
  AUDIT_PRESETS
} from './utils/calculator';
import { DimensionResult, StoredAnswers, TieGroup, DayPlanItem } from './types';

const STORAGE_ANSWERS_KEY = 'learning_profile_answers_v2';
const STORAGE_PLAN_KEY = 'learning_profile_plan_v2';

export default function App() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'report'>('welcome');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<StoredAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ANSWERS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [results, setResults] = useState<DimensionResult[]>([]);
  const [tieGroups, setTieGroups] = useState<TieGroup[]>([]);
  const [dayPlan, setDayPlan] = useState<DayPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PLAN_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & UI states
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  // Sync answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
    } catch {
      // Ignore
    }
  }, [answers]);

  // Sync day plan to localStorage
  useEffect(() => {
    try {
      if (dayPlan.length > 0) {
        localStorage.setItem(STORAGE_PLAN_KEY, JSON.stringify(dayPlan));
      }
    } catch {
      // Ignore
    }
  }, [dayPlan]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
  };

  const handleStart = () => {
    setCurrentIndex(0);
    setCurrentStep('quiz');
  };

  const handleResume = () => {
    const firstUnanswered = QUESTIONS.findIndex((q) => answers[q.id] === undefined);
    setCurrentIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
    setCurrentStep('quiz');
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentStep('welcome');
    }
  };

  const computeAndSetResults = (currentAnswers: StoredAnswers) => {
    const res = calculateDimensionResults(currentAnswers);
    const ties = detectTieGroups(res);
    setResults(res);
    setTieGroups(ties);

    const freshPlan = generate7DayPlan(res[0], res[1], res[res.length - 1]);
    const mergedPlan = freshPlan.map((day) => {
      const existing = dayPlan.find((p) => p.day === day.day);
      return existing ? { ...day, completed: existing.completed } : day;
    });

    setDayPlan(mergedPlan);
  };

  const handleFinish = () => {
    computeAndSetResults(answers);
    setCurrentStep('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDayPlan = (dayNumber: number) => {
    setDayPlan((prev) =>
      prev.map((item) =>
        item.day === dayNumber ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleResetDayPlan = () => {
    setDayPlan((prev) => prev.map((item) => ({ ...item, completed: false })));
  };

  const handleConfirmReset = () => {
    try {
      localStorage.removeItem(STORAGE_ANSWERS_KEY);
      localStorage.removeItem(STORAGE_PLAN_KEY);
    } catch {
      // Ignore
    }
    setAnswers({});
    setDayPlan([]);
    setResults([]);
    setTieGroups([]);
    setCurrentIndex(0);
    setIsResetModalOpen(false);
    setCurrentStep('welcome');
    showToast('Cuestionario reiniciado.');
  };

  const handleApplyPreset = (presetAnswers: StoredAnswers, directToReport: boolean) => {
    setAnswers(presetAnswers);
    if (directToReport) {
      computeAndSetResults(presetAnswers);
      setCurrentStep('report');
      showToast('Resultados calculados con éxito.');
    } else {
      setCurrentIndex(0);
      setCurrentStep('quiz');
      showToast('Respuestas cargadas en el cuestionario.');
    }
  };

  const handleGenerateRandom = (directToReport: boolean) => {
    const randomAnswers: StoredAnswers = {};
    QUESTIONS.forEach((q) => {
      randomAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
    });

    setAnswers(randomAnswers);
    if (directToReport) {
      computeAndSetResults(randomAnswers);
      setCurrentStep('report');
      showToast('24 respuestas generadas.');
    } else {
      setCurrentIndex(0);
      setCurrentStep('quiz');
      showToast('24 respuestas cargadas en el cuestionario.');
    }
  };

  const handleSimulateTie = () => {
    handleApplyPreset(AUDIT_PRESETS.EXACT_TIE_VISUAL_PRACTICAL.answers, true);
    showToast('Escenario de empate cargado: Visual y Práctico en 5.00.');
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#08070B] text-[#FFF8FC] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF2D95] selection:text-white flex flex-col justify-between relative bg-grid-lights">
      <div>
        <Header
          currentStep={currentStep}
          answeredCount={answeredCount}
          totalQuestions={QUESTIONS.length}
          onOpenAudit={() => setIsAuditModalOpen(true)}
          onRequestReset={() => setIsResetModalOpen(true)}
        />

        <main>
          {currentStep === 'welcome' && (
            <WelcomeScreen
              onStart={handleStart}
              onOpenAudit={() => setIsAuditModalOpen(true)}
              hasSavedProgress={answeredCount > 0}
              savedAnswersCount={answeredCount}
              onResume={handleResume}
            />
          )}

          {currentStep === 'quiz' && (
            <QuizScreen
              currentIndex={currentIndex}
              answers={answers}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrev={handlePrev}
              onJumpToQuestion={(idx) => setCurrentIndex(idx)}
              onFinish={handleFinish}
              onOpenGrid={() => setIsGridModalOpen(true)}
            />
          )}

          {currentStep === 'report' && results.length > 0 && (
            <ReportScreen
              results={results}
              tieGroups={tieGroups}
              dayPlan={dayPlan}
              onToggleDayPlan={handleToggleDayPlan}
              onResetDayPlan={handleResetDayPlan}
              onRequestReset={() => setIsResetModalOpen(true)}
              onShowToast={showToast}
              onSimulateTie={handleSimulateTie}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#252030] py-6 px-4 text-center text-xs text-[#B8ADBF] bg-[#08070B]/90 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>Learning Profile • Descubre cómo aprendes mejor.</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D95] shadow-[0_0_8px_#FF2D95]" />
            <span className="text-[#FFF8FC] font-semibold">Black + Neon Pink Visual Experience</span>
          </div>
        </div>
      </footer>

      {/* Modals & Toast */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onApplyPreset={handleApplyPreset}
        onGenerateRandom={handleGenerateRandom}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />

      <QuestionGridModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        currentIndex={currentIndex}
        answers={answers}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
      />

      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        onClose={() => setIsToastOpen(false)}
      />
    </div>
  );
}
