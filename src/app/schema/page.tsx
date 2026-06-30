import { MarkdownContent } from '@/components/MarkdownContent';

const schemaDoc = `
## ER-диаграмма TechStore

Учебная база интернет-магазина электроники с заказами и поддержкой.

### Таблицы

| Таблица | Описание |
|---------|----------|
| **categories** | Категории товаров (Ноутбуки, Смартфоны…) |
| **products** | Товары с ценой, SKU и остатком на складе |
| **customers** | Покупатели |
| **orders** | Заказы со статусом и суммой |
| **order_items** | Позиции заказа (товар, количество, цена на момент покупки) |
| **employees** | Сотрудники |
| **support_tickets** | Тикеты поддержки |

### Связи

- Customer **1 → N** Order
- Order **1 → N** OrderItem
- Product **1 → N** OrderItem
- Category **1 → N** Product
- Customer **1 → N** SupportTicket
- Employee **0..1 → N** SupportTicket

### Статусы заказа

\`new\` → \`paid\` → \`shipped\` → \`delivered\` (или \`cancelled\`)

### Полезные запросы для изучения схемы

\`\`\`sql
-- Структура таблицы products
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products';

-- Внешние ключи
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
\`\`\`

### Инициализация

Схема и тестовые данные лежат в папке \`sql/\`. Для загрузки:

\`\`\`bash
npm run db:init
\`\`\`

Сброс и пересоздание:

\`\`\`bash
npm run db:reset
\`\`\`
`;

export default function SchemaPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Схема базы данных</h1>
      <MarkdownContent content={schemaDoc} />
    </div>
  );
}
