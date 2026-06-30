'use client';

import { useState } from 'react';
import type { SqlExercise } from '@/lib/exercises';
import { SqlEditor } from '@/components/SqlEditor';

interface Props {
  exercise: SqlExercise;
}

export function SqlExercisePanel({ exercise }: Props) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [checkResult, setCheckResult] = useState<{ passed: boolean; message: string } | null>(null);

  const handleCheck = async (sql: string) => {
    const res = await fetch('/api/sql/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, exerciseId: exercise.id }),
    });
    const data = await res.json();
    setCheckResult(data);
    return null;
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

      <div className="flex gap-2 mb-4">
        {exercise.hint && (
          <button type="button" onClick={() => setShowHint(!showHint)} className="btn btn-secondary text-xs">
            {showHint ? 'Скрыть подсказку' : 'Подсказка'}
          </button>
        )}
        <button type="button" onClick={() => setShowSolution(!showSolution)} className="btn btn-secondary text-xs">
          {showSolution ? 'Скрыть решение' : 'Показать решение'}
        </button>
      </div>

      {showHint && exercise.hint && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--accent-soft)] text-sm text-blue-300">
          💡 {exercise.hint}
        </div>
      )}

      {showSolution && (
        <pre className="mb-4 p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm font-mono overflow-x-auto">
          {exercise.solution}
        </pre>
      )}

      <SqlEditor
        initialSql={`-- ${exercise.title}\n`}
        checkMode
        onRun={handleCheck}
        key={exercise.id}
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
