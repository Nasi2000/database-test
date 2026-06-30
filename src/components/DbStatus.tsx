'use client';

import { useEffect, useState } from 'react';

export function DbStatus() {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/db-status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ ok: false, message: 'Не удалось проверить подключение' }));
  }, []);

  if (!status) {
    return (
      <span className="text-sm text-[var(--text-muted)]">Проверка подключения к БД...</span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
        status.ok ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${status.ok ? 'bg-green-400' : 'bg-red-400'}`} />
      {status.message}
    </span>
  );
}
