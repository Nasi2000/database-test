'use client';

import { useState } from 'react';
import { SqlEditor } from '@/components/SqlEditor';

const EXAMPLES = [
  { label: 'Все таблицы', sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" },
  { label: 'Клиенты', sql: 'SELECT id, full_name, email, city FROM customers ORDER BY id;' },
  { label: 'Товары с категориями', sql: `SELECT p.name, c.name AS category, p.price
FROM products p
JOIN categories c ON c.id = p.category_id
ORDER BY p.price DESC;` },
  { label: 'Заказы по статусам', sql: `SELECT status, COUNT(*) AS cnt, SUM(total_amount) AS total
FROM orders
GROUP BY status;` },
];

export default function SqlLabPage() {
  const [sql, setSql] = useState(EXAMPLES[0].sql);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">SQL-песочница</h1>
      <p className="text-[var(--text-muted)] mb-4">
        Выполняйте SELECT-запросы к учебной базе TechStore. По умолчанию разрешены только запросы на чтение.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => setSql(ex.sql)}
            className="btn btn-secondary text-xs"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <SqlEditor initialSql={sql} onSqlChange={setSql} key={sql.slice(0, 40)} />
    </div>
  );
}
