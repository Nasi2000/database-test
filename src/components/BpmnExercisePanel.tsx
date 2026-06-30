'use client';

import { useState } from 'react';
import type { BpmnExercise } from '@/lib/practice-exercises';
import { MarkdownContent } from '@/components/MarkdownContent';

interface Props {
  exercise: BpmnExercise;
}

export function BpmnExercisePanel({ exercise }: Props) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggleCheck = (i: number) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const allChecked = exercise.checklist.every((_, i) => checked[i]);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`badge badge-${exercise.difficulty}`}>
          {exercise.difficulty === 'easy' ? 'легко' : exercise.difficulty === 'medium' ? 'средне' : 'сложно'}
        </span>
        <h2 className="text-xl font-semibold">{exercise.title}</h2>
      </div>

      <p className="text-[var(--text-muted)] mb-2">{exercise.description}</p>
      <p className="text-sm text-[var(--text-muted)] mb-4 italic">{exercise.context}</p>

      <h3 className="font-semibold mb-2">Требования к диаграмме</h3>
      <ul className="list-disc list-inside text-[var(--text-muted)] mb-4 space-y-1">
        {exercise.requirements.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>

      <h3 className="font-semibold mb-2">Чек-лист самопроверки</h3>
      <ul className="space-y-2 mb-4">
        {exercise.checklist.map((item, i) => (
          <li key={i}>
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggleCheck(i)}
                className="rounded"
              />
              {item}
            </label>
          </li>
        ))}
      </ul>

      {allChecked && (
        <div className="mb-4 p-3 rounded-lg bg-green-900/30 text-green-400 text-sm border border-green-800">
          ✅ Все пункты чек-листа отмечены! Сверьте диаграмму с образцом.
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setShowHints(!showHints)} className="btn btn-secondary text-xs">
          {showHints ? 'Скрыть подсказки' : 'Подсказки'}
        </button>
        <button type="button" onClick={() => setShowSolution(!showSolution)} className="btn btn-secondary text-xs">
          {showSolution ? 'Скрыть образец' : 'Образец диаграммы'}
        </button>
      </div>

      {showHints && (
        <ul className="mb-4 p-4 rounded-lg bg-[var(--accent-soft)] text-sm text-blue-300 space-y-1 list-disc list-inside">
          {exercise.hints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {showSolution && (
        <div className="p-4 rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Образец в нотации Mermaid (можно отрисовать в draw.io или mermaid.live):
          </p>
          <MarkdownContent content={`\`\`\`mermaid\n${exercise.solutionDiagram}\n\`\`\``} />
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-[var(--bg)] border border-dashed border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">
          <strong className="text-[var(--text)]">Задание:</strong> нарисуйте BPMN-диаграмму в{' '}
          <a href="https://app.diagrams.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">
            draw.io
          </a>{' '}
          или{' '}
          <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">
            mermaid.live
          </a>
          . Отметьте пункты чек-листа и сравните с образцом.
        </p>
      </div>
    </div>
  );
}
