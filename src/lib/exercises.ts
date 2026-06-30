export interface SqlExercise {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  hint?: string;
  solution: string;
  checkQuery: string;
  expectedColumns: string[];
}

export interface DesignExercise {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  requirements: string[];
  hints: string[];
  solutionOutline: string;
}

export const sqlExercises: SqlExercise[] = [
  {
    id: 'sql-01',
    title: 'Все активные товары',
    difficulty: 'easy',
    description: 'Выведите название, артикул (sku) и цену всех активных товаров, отсортированных по цене по убыванию.',
    hint: 'Используйте таблицу products и фильтр is_active = true',
    solution: `SELECT name, sku, price
FROM products
WHERE is_active = true
ORDER BY price DESC;`,
    checkQuery: `SELECT name, sku, price FROM products WHERE is_active = true ORDER BY price DESC`,
    expectedColumns: ['name', 'sku', 'price'],
  },
  {
    id: 'sql-02',
    title: 'Клиенты из Москвы',
    difficulty: 'easy',
    description: 'Найдите email и полное имя всех клиентов из города «Москва».',
    solution: `SELECT email, full_name
FROM customers
WHERE city = 'Москва';`,
    checkQuery: `SELECT email, full_name FROM customers WHERE city = 'Москва'`,
    expectedColumns: ['email', 'full_name'],
  },
  {
    id: 'sql-03',
    title: 'Товары с категориями',
    difficulty: 'medium',
    description: 'Выведите название товара, название категории и цену для всех товаров.',
    hint: 'Соедините products и categories через category_id',
    solution: `SELECT p.name AS product_name, c.name AS category_name, p.price
FROM products p
JOIN categories c ON c.id = p.category_id
ORDER BY c.name, p.name;`,
    checkQuery: `SELECT p.name AS product_name, c.name AS category_name, p.price FROM products p JOIN categories c ON c.id = p.category_id ORDER BY c.name, p.name`,
    expectedColumns: ['product_name', 'category_name', 'price'],
  },
  {
    id: 'sql-04',
    title: 'Сумма заказов по клиентам',
    difficulty: 'medium',
    description: 'Посчитайте общую сумму заказов (total_amount) для каждого клиента. Покажите имя клиента и сумму. Только доставленные заказы (status = \'delivered\').',
    solution: `SELECT c.full_name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.full_name
ORDER BY total_spent DESC;`,
    checkQuery: `SELECT c.full_name, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.status = 'delivered' GROUP BY c.id, c.full_name ORDER BY total_spent DESC`,
    expectedColumns: ['full_name', 'total_spent'],
  },
  {
    id: 'sql-05',
    title: 'Топ-3 категории по выручке',
    difficulty: 'hard',
    description: 'Определите 3 категории с наибольшей выручкой. Выручка = сумма (quantity * unit_price) по позициям заказов. Покажите название категории и выручку.',
    hint: 'Цепочка: order_items → products → categories',
    solution: `SELECT c.name AS category_name,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY revenue DESC
LIMIT 3;`,
    checkQuery: `SELECT c.name AS category_name, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN categories c ON c.id = p.category_id GROUP BY c.id, c.name ORDER BY revenue DESC LIMIT 3`,
    expectedColumns: ['category_name', 'revenue'],
  },
  {
    id: 'sql-06',
    title: 'Открытые тикеты поддержки',
    difficulty: 'medium',
    description: 'Выведите тему тикета, имя клиента, приоритет и имя назначенного сотрудника (если есть) для тикетов со статусом open или in_progress.',
    solution: `SELECT t.subject, c.full_name AS customer_name, t.priority,
       e.full_name AS assigned_to
FROM support_tickets t
JOIN customers c ON c.id = t.customer_id
LEFT JOIN employees e ON e.id = t.employee_id
WHERE t.status IN ('open', 'in_progress')
ORDER BY t.priority DESC, t.created_at;`,
    checkQuery: `SELECT t.subject, c.full_name AS customer_name, t.priority, e.full_name AS assigned_to FROM support_tickets t JOIN customers c ON c.id = t.customer_id LEFT JOIN employees e ON e.id = t.employee_id WHERE t.status IN ('open', 'in_progress') ORDER BY t.priority DESC, t.created_at`,
    expectedColumns: ['subject', 'customer_name', 'priority', 'assigned_to'],
  },
];

export const designExercises: DesignExercise[] = [
  {
    id: 'design-01',
    title: 'Система бронирования переговорных',
    difficulty: 'easy',
    description: 'Компания хочет систему бронирования переговорных комнат. Сотрудники бронируют комнату на определённый слот времени.',
    requirements: [
      'Список переговорных с вместимостью и оборудованием',
      'Сотрудники могут создавать бронирования',
      'Нельзя забронировать одну комнату на пересекающееся время',
      'История отменённых бронирований',
    ],
    hints: [
      'Выделите сущности: Room, Employee, Booking',
      'Время — пара started_at / ended_at или date + time_slot',
      'Уникальный индекс или CHECK на пересечение интервалов',
    ],
    solutionOutline: `**Сущности:**
- rooms (id, name, capacity, equipment)
- employees (id, full_name, department)
- bookings (id, room_id, employee_id, started_at, ended_at, status)

**Связи:** Booking M:1 Room, Booking M:1 Employee
**Ограничения:** status IN ('active','cancelled'); ended_at > started_at
**Индекс:** (room_id, started_at, ended_at) для проверки пересечений`,
  },
  {
    id: 'design-02',
    title: 'Подписка на SaaS-сервис',
    difficulty: 'medium',
    description: 'Нужно спроектировать БД для SaaS с тарифными планами, подписками и ежемесячной оплатой.',
    requirements: [
      'Несколько тарифных планов (Free, Pro, Enterprise)',
      'У организации одна активная подписка',
      'История смены тарифов',
      'Учёт платежей и статусов (pending, paid, failed)',
    ],
    hints: [
      'Organization, Plan, Subscription, Payment',
      'Подписка имеет период valid_from / valid_to',
      'Платёж привязан к подписке и периоду',
    ],
    solutionOutline: `**Сущности:**
- organizations, plans, subscriptions, payments
- subscriptions: organization_id, plan_id, status, valid_from, valid_to
- payments: subscription_id, amount, period_start, period_end, status

**Бизнес-правило:** одна active-подписка на организацию (partial unique index)`,
  },
  {
    id: 'design-03',
    title: 'Маркетплейс с продавцами',
    difficulty: 'hard',
    description: 'Платформа, где несколько продавцов выставляют товары. Покупатель оформляет заказ, который может содержать товары от разных продавцов.',
    requirements: [
      'Продавцы и их товары',
      'Корзина и заказ с позициями',
      'Разбивка заказа на посылки по продавцам',
      'Комиссия платформы с каждой продажи',
    ],
    hints: [
      'Order vs Shipment (посылка от одного продавца)',
      'order_items хранит seller_id или выводится из product',
      'commission_rate на уровне категории или продавца',
    ],
    solutionOutline: `**Ключевые таблицы:**
sellers, products(seller_id), orders, order_items, shipments, shipment_items

**Логика:** при оплате заказ разбивается на shipments по seller_id;
каждая shipment_items ссылается на order_items`,
  },
];

export function normalizeRows(rows: Record<string, unknown>[]): string {
  return JSON.stringify(
    rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [
          k,
          v === null ? null : typeof v === 'object' && 'toString' in (v as object) ? String(v) : v,
        ])
      )
    )
  );
}

export function compareResults(
  userRows: Record<string, unknown>[],
  expectedRows: Record<string, unknown>[],
  expectedColumns: string[]
): { passed: boolean; message: string } {
  const userCols = userRows.length > 0 ? Object.keys(userRows[0]) : expectedColumns;
  const colsMatch =
    expectedColumns.every((c) => userCols.includes(c)) && userCols.length === expectedColumns.length;

  if (!colsMatch) {
    return {
      passed: false,
      message: `Ожидались столбцы: ${expectedColumns.join(', ')}. Получено: ${userCols.join(', ')}`,
    };
  }

  const normalizedUser = normalizeRows(
    userRows.map((r) => {
      const ordered: Record<string, unknown> = {};
      for (const col of expectedColumns) ordered[col] = r[col];
      return ordered;
    })
  );
  const normalizedExpected = normalizeRows(
    expectedRows.map((r) => {
      const ordered: Record<string, unknown> = {};
      for (const col of expectedColumns) ordered[col] = r[col];
      return ordered;
    })
  );

  if (normalizedUser === normalizedExpected) {
    return { passed: true, message: 'Верно! Результат совпадает с эталоном.' };
  }

  return {
    passed: false,
    message: `Результат не совпадает. Получено ${userRows.length} строк, ожидалось ${expectedRows.length}.`,
  };
}
