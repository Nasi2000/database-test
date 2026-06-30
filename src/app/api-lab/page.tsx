'use client';

import { useState } from 'react';
import { ApiClient } from '@/components/ApiClient';

const EXAMPLES = [
  { label: 'Список товаров', method: 'GET', path: '/api/v1/products', body: '' },
  { label: 'Ноутбуки', method: 'GET', path: '/api/v1/products?category=Ноутбуки', body: '' },
  { label: 'Товар #4', method: 'GET', path: '/api/v1/products/4', body: '' },
  { label: 'Заказы клиента', method: 'GET', path: '/api/v1/customers/1/orders', body: '' },
  {
    label: 'Создать заказ',
    method: 'POST',
    path: '/api/v1/orders',
    body: JSON.stringify({ customer_id: 3, items: [{ product_id: 10, quantity: 1 }] }, null, 2),
  },
];

export default function ApiLabPage() {
  const [example, setExample] = useState(0);
  const ex = EXAMPLES[example];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">API-песочница</h1>
      <p className="text-[var(--text-muted)] mb-4">
        Отправляйте HTTP-запросы к учебному REST API TechStore. Спецификация OpenAPI:{' '}
        <a href="/api/v1/openapi" className="text-[var(--accent)] hover:underline" target="_blank">
          /api/v1/openapi
        </a>
        {' · '}
        <a href="/swagger" className="text-[var(--accent)] hover:underline">
          Swagger UI
        </a>
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {EXAMPLES.map((e, i) => (
          <button
            key={e.label}
            type="button"
            onClick={() => setExample(i)}
            className={`btn text-xs ${i === example ? 'btn-primary' : 'btn-secondary'}`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <ApiClient
        key={`${ex.method}-${ex.path}`}
        initialMethod={ex.method}
        initialPath={ex.path}
        initialBody={ex.body}
      />

      <div className="mt-8 card p-5">
        <h2 className="font-semibold mb-3">Доступные endpoints</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">Метод</th>
              <th className="py-2 pr-4">Путь</th>
              <th className="py-2">Описание</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-muted)]">
            <tr className="border-b border-[var(--border)]"><td className="py-2 font-mono text-green-400">GET</td><td className="py-2 font-mono">/api/v1/products</td><td>Список товаров</td></tr>
            <tr className="border-b border-[var(--border)]"><td className="py-2 font-mono text-green-400">GET</td><td className="py-2 font-mono">/api/v1/products/:id</td><td>Товар по ID</td></tr>
            <tr className="border-b border-[var(--border)]"><td className="py-2 font-mono text-green-400">GET</td><td className="py-2 font-mono">/api/v1/customers/:id</td><td>Клиент</td></tr>
            <tr className="border-b border-[var(--border)]"><td className="py-2 font-mono text-green-400">GET</td><td className="py-2 font-mono">/api/v1/customers/:id/orders</td><td>Заказы клиента</td></tr>
            <tr className="border-b border-[var(--border)]"><td className="py-2 font-mono text-yellow-400">POST</td><td className="py-2 font-mono">/api/v1/orders</td><td>Создать заказ</td></tr>
            <tr><td className="py-2 font-mono text-green-400">GET</td><td className="py-2 font-mono">/api/v1/orders/:id</td><td>Заказ с позициями</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
