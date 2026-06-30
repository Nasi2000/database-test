'use client';

import { useState } from 'react';
import type { ApiExercise } from '@/lib/practice-exercises';
import { ApiClient } from '@/components/ApiClient';

interface Props {
  exercise: ApiExercise;
}

export function ApiExercisePanel({ exercise }: Props) {
  const [checkResult, setCheckResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleExecute = (result: { status: number; body: unknown }) => {
    if (result.status !== exercise.expectedStatus) {
      setCheckResult({
        passed: false,
        message: `Ожидался статус ${exercise.expectedStatus}, получен ${result.status || 'ошибка сети'}`,
      });
      return;
    }

    if (exercise.validateResponse) {
      const validationError = exercise.validateResponse(result.body);
      if (validationError) {
        setCheckResult({ passed: false, message: validationError });
        return;
      }
    }

    setCheckResult({ passed: true, message: 'Верно! Запрос выполнен корректно.' });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`badge badge-${exercise.difficulty}`}>
          {exercise.difficulty === 'easy' ? 'легко' : exercise.difficulty === 'medium' ? 'средне' : 'сложно'}
        </span>
        <h2 className="text-xl font-semibold">{exercise.title}</h2>
      </div>

      <p className="text-[var(--text-muted)] mb-4">{exercise.description}</p>

      {exercise.hint && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--accent-soft)] text-sm text-blue-300">
          💡 {exercise.hint}
        </div>
      )}

      <button type="button" onClick={() => setShowSolution(!showSolution)} className="btn btn-secondary text-xs mb-4">
        {showSolution ? 'Скрыть решение' : 'Показать решение'}
      </button>

      {showSolution && (
        <pre className="mb-4 p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm font-mono whitespace-pre-wrap">
          {exercise.solution}
        </pre>
      )}

      <ApiClient
        key={exercise.id}
        initialMethod={exercise.method}
        initialPath={exercise.path}
        initialBody={exercise.body ?? ''}
        checkMode
        onExecute={handleExecute}
      />

      {checkResult && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${
            checkResult.passed
              ? 'bg-green-900/30 text-green-400 border border-green-800'
              : 'bg-amber-900/30 text-amber-300 border border-amber-800'
          }`}
        >
          {checkResult.passed ? '✅ ' : '❌ '}
          {checkResult.message}
        </div>
      )}
    </div>
  );
}
