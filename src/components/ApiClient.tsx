'use client';

import { useState } from 'react';

interface Props {
  initialMethod?: string;
  initialPath?: string;
  initialBody?: string;
  onExecute?: (result: {
    status: number;
    body: unknown;
    durationMs: number;
  }) => void;
  checkMode?: boolean;
}

export function ApiClient({
  initialMethod = 'GET',
  initialPath = '/api/v1/products',
  initialBody = '',
  onExecute,
  checkMode,
}: Props) {
  const [method, setMethod] = useState(initialMethod);
  const [path, setPath] = useState(initialPath);
  const [body, setBody] = useState(initialBody);
  const [status, setStatus] = useState<number | null>(null);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [durationMs, setDurationMs] = useState(0);

  const execute = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const options: RequestInit = {
        method,
        headers: { Accept: 'application/json' },
      };
      if (method !== 'GET' && method !== 'DELETE' && body.trim()) {
        options.headers = { ...options.headers as Record<string, string>, 'Content-Type': 'application/json' };
        options.body = body;
      }

      const res = await fetch(path, options);
      const duration = Date.now() - start;
      setDurationMs(duration);
      setStatus(res.status);

      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
        setResponse(JSON.stringify(parsed, null, 2));
      } catch {
        parsed = text;
        setResponse(text);
      }

      onExecute?.({ status: res.status, body: parsed, durationMs: duration });
    } catch (err) {
      setStatus(0);
      setResponse(err instanceof Error ? err.message : 'Ошибка сети');
      onExecute?.({ status: 0, body: null, durationMs: Date.now() - start });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
        >
          {['GET', 'POST', 'PATCH', 'DELETE'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="flex-1 min-w-[200px] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono"
          placeholder="/api/v1/products"
        />
        <button type="button" onClick={execute} disabled={loading} className="btn btn-primary">
          {loading ? '...' : checkMode ? 'Проверить' : 'Отправить'}
        </button>
      </div>

      {method !== 'GET' && method !== 'DELETE' && (
        <div className="card overflow-hidden">
          <div className="px-3 py-1.5 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
            Request Body (JSON)
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full min-h-[100px] p-3 bg-transparent text-sm font-mono resize-y focus:outline-none"
            spellCheck={false}
          />
        </div>
      )}

      {(status !== null || response) && (
        <div className="card overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--border)] flex gap-4 text-xs">
            {status !== null && (
              <span className={status >= 200 && status < 300 ? 'text-green-400' : status >= 400 ? 'text-red-400' : 'text-[var(--text-muted)]'}>
                Status: {status || '—'}
              </span>
            )}
            <span className="text-[var(--text-muted)]">{durationMs} мс</span>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto text-[var(--text-muted)] max-h-[400px] overflow-y-auto">
            {response || 'Пустой ответ'}
          </pre>
        </div>
      )}
    </div>
  );
}
