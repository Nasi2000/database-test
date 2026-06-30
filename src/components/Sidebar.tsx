import Link from 'next/link';
import { getSections } from '@/lib/content';

const navItems = [
  { href: '/', label: 'Главная', icon: '🏠' },
  { href: '/practice', label: 'Практика', icon: '✏️' },
  { href: '/sql-lab', label: 'SQL-песочница', icon: '💻' },
  { href: '/api-lab', label: 'API-песочница', icon: '🌐' },
  { href: '/swagger', label: 'Swagger UI', icon: '📄' },
  { href: '/schema', label: 'Схема БД', icon: '📊' },
];

export function Sidebar() {
  const sections = getSections();

  return (
    <aside className="w-72 shrink-0 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-[var(--border)]">
        <Link href="/" className="block">
          <h1 className="text-lg font-bold text-[var(--text)]">SA Trainer</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Системный аналитик</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-2">
            Разделы
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)] transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {sections.map((section) => (
          <div key={section.id}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-2">
              {section.icon} {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/theory/${section.id}/${item.slug}`}
                    className="block px-3 py-1.5 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)] transition-colors truncate"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
