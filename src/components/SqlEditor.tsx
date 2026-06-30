'use client';

import { useState } from 'react';

interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  durationMs: number;
  error?: string;
}

interface Props {
  initialSql?: string;
  onSqlChange?: (sql: string) => void;
  onRun?: (sql: string) => Promise<QueryResult | null>;
  checkMode?: boolean;
}

export function SqlEditor({ initialSql = '', onSqlChange, onRun, checkMode }: Props) {
  const [sql, setSql] = useState(initialSql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string) => {
    setSql(value);
    onSqlChange?.(value);
  };

  const runQuery = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (onRun) {
        const custom = await onRun(sql);
        if (custom) setResult(custom);
      } else {
        const res = await fetch('/api/sql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sql }),
        });
        const data = await res.json();
        setResult(data);
      }
    } catch {
      setResult({ columns: [], rows: [], rowCount: 0, durationMs: 0, error: 'Ошибка сети' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <textarea
          value={sql}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full min-h-[160px] p-4 bg-transparent text-sm font-mono text-[var(--text)] resize-y focus:outline-none"
          placeholder="SELECT * FROM customers LIMIT 10;"
          spellCheck={false}
        />
      </div>

      <button type="button" onClick={runQuery} disabled={loading} className="btn btn-primary">
        {loading ? 'Выполняется...' : checkMode ? 'Проверить' : 'Выполнить (Ctrl+Enter)'}
      </button>

      {result?.error && (
        <div className="card p-4 border-red-800 bg-red-950/30 text-red-400 text-sm font-mono">
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="card overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
            {result.rowCount} строк · {result.durationMs} мс
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-hover)]">
                  {result.columns.map((col) => (
                    <th key={col} className="px-4 py-2 text-left font-medium text-[var(--text)]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.length === 0 ? (
                  <tr>
                    <td colSpan={result.columns.length || 1} className="px-4 py-6 text-center text-[var(--text-muted)]">
                      Нет данных
                    </td>
                  </tr>
                ) : (
                  result.rows.map((row, i) => (
                    <tr key={i} className="border-t border-[var(--border)]">
                      {result.columns.map((col) => (
                        <td key={col} className="px-4 py-2 font-mono text-xs text-[var(--text-muted)]">
                          {row[col] === null ? 'NULL' : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
