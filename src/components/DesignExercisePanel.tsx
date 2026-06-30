'use client';

import { useState } from 'react';
import type { DesignExercise } from '@/lib/exercises';
import { MarkdownContent } from '@/components/MarkdownContent';

interface Props {
  exercise: DesignExercise;
}

export function DesignExercisePanel({ exercise }: Props) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`badge badge-${exercise.difficulty}`}>
          {exercise.difficulty === 'easy' ? 'легко' : exercise.difficulty === 'medium' ? 'средне' : 'сложно'}
        </span>
        <h2 className="text-xl font-semibold">{exercise.title}</h2>
      </div>

      <p className="text-[var(--text-muted)] mb-4">{exercise.description}</p>

      <h3 className="font-semibold mb-2">Требования</h3>
      <ul className="list-disc list-inside text-[var(--text-muted)] mb-4 space-y-1">
        {exercise.requirements.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>

      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setShowHints(!showHints)} className="btn btn-secondary text-xs">
          {showHints ? 'Скрыть подсказки' : 'Подсказки'}
        </button>
        <button type="button" onClick={() => setShowSolution(!showSolution)} className="btn btn-secondary text-xs">
          {showSolution ? 'Скрыть образец решения' : 'Образец решения'}
        </button>
      </div>

      {showHints && (
        <ul className="mb-4 p-4 rounded-lg bg-[var(--accent-soft)] text-sm text-blue-300 space-y-2 list-disc list-inside">
          {exercise.hints.map((hint, i) => (
            <li key={i}>{hint}</li>
          ))}
        </ul>
      )}

      {showSolution && (
        <div className="mt-4 p-4 rounded-lg border border-[var(--border)]">
          <MarkdownContent content={exercise.solutionOutline} />
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-[var(--bg)] border border-dashed border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">
          <strong className="text-[var(--text)]">Задание:</strong> нарисуйте ER-диаграмму (draw.io, dbdiagram.io
          или на бумаге), опишите таблицы с типами полей и связями. Сверьтесь с образцом решения.
        </p>
      </div>
    </div>
  );
}
