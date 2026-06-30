'use client';

import { useState } from 'react';
import type { SwaggerExercise } from '@/lib/practice-exercises';
import { validateSwaggerYaml } from '@/lib/practice-exercises';

interface Props {
  exercise: SwaggerExercise;
}

export function SwaggerExercisePanel({ exercise }: Props) {
  const [yaml, setYaml] = useState(exercise.starterYaml);
  const [checkResult, setCheckResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const check = () => {
    setCheckResult(validateSwaggerYaml(yaml, exercise.requiredPatterns));
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
          {showSolution ? 'Скрыть решение' : 'Решение'}
        </button>
      </div>

      {showHint && exercise.hint && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--accent-soft)] text-sm text-blue-300">💡 {exercise.hint}</div>
      )}

      {showSolution && (
        <pre className="mb-4 p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm font-mono overflow-x-auto">
          {exercise.solution}
        </pre>
      )}

      <div className="card overflow-hidden mb-4">
        <div className="px-3 py-1.5 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
          OpenAPI YAML
        </div>
        <textarea
          value={yaml}
          onChange={(e) => setYaml(e.target.value)}
          className="w-full min-h-[220px] p-4 bg-transparent text-sm font-mono resize-y focus:outline-none"
          spellCheck={false}
        />
      </div>

      <button type="button" onClick={check} className="btn btn-primary">
        Проверить спецификацию
      </button>

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
