import Link from 'next/link';
import { getSections } from '@/lib/content';
import { DbStatus } from '@/components/DbStatus';

export default function HomePage() {
  const sections = getSections();

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Тренажёр системного аналитика</h1>
        <p className="text-[var(--text-muted)] text-lg max-w-2xl">
          Теория и практика для системного аналитика: SQL, REST API, Swagger, BPMN, проектирование БД.
          Учебный кейс — интернет-магазин <strong className="text-[var(--text)]">TechStore</strong>.
        </p>
        <div className="mt-4">
          <DbStatus />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link href="/practice" className="card p-6 block">
          <div className="text-2xl mb-2">✏️</div>
          <h2 className="text-lg font-semibold mb-1">Практика</h2>
          <p className="text-sm text-[var(--text-muted)]">
            SQL, API, Swagger, BPMN и проектирование БД
          </p>
        </Link>
        <Link href="/api-lab" className="card p-6 block">
          <div className="text-2xl mb-2">🌐</div>
          <h2 className="text-lg font-semibold mb-1">API-песочница</h2>
          <p className="text-sm text-[var(--text-muted)]">
            HTTP-запросы к REST API TechStore
          </p>
        </Link>
        <Link href="/swagger" className="card p-6 block">
          <div className="text-2xl mb-2">📄</div>
          <h2 className="text-lg font-semibold mb-1">Swagger UI</h2>
          <p className="text-sm text-[var(--text-muted)]">
            OpenAPI-документация с Try it out
          </p>
        </Link>
        <Link href="/sql-lab" className="card p-6 block">
          <div className="text-2xl mb-2">💻</div>
          <h2 className="text-lg font-semibold mb-1">SQL-песочница</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Выполняйте запросы к тестовой базе TechStore
          </p>
        </Link>
        <Link href="/schema" className="card p-6 block">
          <div className="text-2xl mb-2">📊</div>
          <h2 className="text-lg font-semibold mb-1">Схема БД</h2>
          <p className="text-sm text-[var(--text-muted)]">
            ER-диаграмма и описание таблиц учебного магазина
          </p>
        </Link>
        <div className="card p-6">
          <div className="text-2xl mb-2">🚀</div>
          <h2 className="text-lg font-semibold mb-1">Быстрый старт</h2>
          <ol className="text-sm text-[var(--text-muted)] list-decimal list-inside space-y-1">
            <li><code>npm install</code></li>
            <li><code>npm run db:init</code></li>
            <li><code>npm run dev</code></li>
          </ol>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Модули обучения</h2>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="card p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{section.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{section.description}</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/theory/${section.id}/${item.slug}`}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
