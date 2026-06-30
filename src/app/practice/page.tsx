'use client';

import { useState } from 'react';
import { sqlExercises, designExercises } from '@/lib/exercises';
import { apiExercises, swaggerExercises, bpmnExercises } from '@/lib/practice-exercises';
import { SqlExercisePanel } from '@/components/SqlExercisePanel';
import { DesignExercisePanel } from '@/components/DesignExercisePanel';
import { ApiExercisePanel } from '@/components/ApiExercisePanel';
import { SwaggerExercisePanel } from '@/components/SwaggerExercisePanel';
import { BpmnExercisePanel } from '@/components/BpmnExercisePanel';

type Tab = 'sql' | 'design' | 'api' | 'swagger' | 'bpmn';

const tabs: { id: Tab; label: string; count: number }[] = [
  { id: 'sql', label: 'SQL', count: sqlExercises.length },
  { id: 'api', label: 'API', count: apiExercises.length },
  { id: 'swagger', label: 'Swagger', count: swaggerExercises.length },
  { id: 'bpmn', label: 'BPMN', count: bpmnExercises.length },
  { id: 'design', label: 'Проектирование БД', count: designExercises.length },
];

function ExerciseSidebar<T extends { id: string; title: string; difficulty?: string }>({
  items,
  selectedIndex,
  onSelect,
  showDifficulty,
}: {
  items: T[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  showDifficulty?: boolean;
}) {
  return (
    <aside className="w-56 shrink-0 space-y-1">
      {items.map((ex, i) => (
        <button
          key={ex.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            i === selectedIndex
              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          {showDifficulty && ex.difficulty && (
            <span className={`badge badge-${ex.difficulty} mr-1 text-[10px]`}>
              {ex.difficulty === 'easy' ? 'легко' : ex.difficulty === 'medium' ? 'ср' : 'сл'}
            </span>
          )}
          {ex.title}
        </button>
      ))}
    </aside>
  );
}

export default function PracticePage() {
  const [tab, setTab] = useState<Tab>('sql');
  const [indices, setIndices] = useState({ sql: 0, design: 0, api: 0, swagger: 0, bpmn: 0 });

  const setIndex = (t: Tab, i: number) => setIndices((prev) => ({ ...prev, [t]: i }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Практика</h1>
      <p className="text-[var(--text-muted)] mb-6">
        SQL, REST API, OpenAPI/Swagger, BPMN-кейсы и проектирование БД на учебном проекте TechStore.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {tab === 'sql' && (
          <>
            <ExerciseSidebar
              items={sqlExercises}
              selectedIndex={indices.sql}
              onSelect={(i) => setIndex('sql', i)}
              showDifficulty
            />
            <div className="flex-1 min-w-0">
              <SqlExercisePanel exercise={sqlExercises[indices.sql]} />
            </div>
          </>
        )}
        {tab === 'api' && (
          <>
            <ExerciseSidebar
              items={apiExercises}
              selectedIndex={indices.api}
              onSelect={(i) => setIndex('api', i)}
              showDifficulty
            />
            <div className="flex-1 min-w-0">
              <ApiExercisePanel exercise={apiExercises[indices.api]} />
            </div>
          </>
        )}
        {tab === 'swagger' && (
          <>
            <ExerciseSidebar
              items={swaggerExercises}
              selectedIndex={indices.swagger}
              onSelect={(i) => setIndex('swagger', i)}
              showDifficulty
            />
            <div className="flex-1 min-w-0">
              <SwaggerExercisePanel exercise={swaggerExercises[indices.swagger]} />
            </div>
          </>
        )}
        {tab === 'bpmn' && (
          <>
            <ExerciseSidebar
              items={bpmnExercises}
              selectedIndex={indices.bpmn}
              onSelect={(i) => setIndex('bpmn', i)}
              showDifficulty
            />
            <div className="flex-1 min-w-0">
              <BpmnExercisePanel exercise={bpmnExercises[indices.bpmn]} />
            </div>
          </>
        )}
        {tab === 'design' && (
          <>
            <ExerciseSidebar
              items={designExercises}
              selectedIndex={indices.design}
              onSelect={(i) => setIndex('design', i)}
            />
            <div className="flex-1 min-w-0">
              <DesignExercisePanel exercise={designExercises[indices.design]} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
