export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ApiExercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  hint?: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: string;
  expectedStatus: number;
  validateResponse?: (data: unknown) => string | null;
  solution: string;
}

export interface SwaggerExercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  hint?: string;
  starterYaml: string;
  requiredPatterns: string[];
  solution: string;
}

export interface BpmnExercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  context: string;
  requirements: string[];
  checklist: string[];
  hints: string[];
  solutionDiagram: string;
}

export const apiExercises: ApiExercise[] = [
  {
    id: 'api-01',
    title: 'Список всех товаров',
    difficulty: 'easy',
    description: 'Получите список активных товаров. Ответ должен содержать массив data и статус 200.',
    method: 'GET',
    path: '/api/v1/products',
    expectedStatus: 200,
    validateResponse: (data) => {
      const d = data as { data?: unknown[] };
      if (!Array.isArray(d?.data)) return 'В ответе должно быть поле data — массив';
      if (d.data.length < 1) return 'Массив data не должен быть пустым';
      return null;
    },
    solution: 'GET /api/v1/products',
  },
  {
    id: 'api-02',
    title: 'Товары категории «Ноутбуки»',
    difficulty: 'easy',
    description: 'Получите только товары из категории «Ноутбуки» через query-параметр category.',
    hint: 'Используйте ?category=Ноутбуки (кириллица, URL-кодирование выполнится автоматически)',
    method: 'GET',
    path: '/api/v1/products?category=Ноутбуки',
    expectedStatus: 200,
    validateResponse: (data) => {
      const d = data as { data?: { category?: string }[] };
      if (!Array.isArray(d?.data) || d.data.length === 0) return 'Ожидается непустой массив data';
      const allLaptops = d.data.every((p) => p.category === 'Ноутбуки');
      if (!allLaptops) return 'Все товары должны быть из категории «Ноутбуки»';
      return null;
    },
    solution: 'GET /api/v1/products?category=Ноутбуки',
  },
  {
    id: 'api-03',
    title: 'Товар по ID',
    difficulty: 'easy',
    description: 'Получите товар с id=4 (iPhone 15). Проверьте поле name в ответе.',
    method: 'GET',
    path: '/api/v1/products/4',
    expectedStatus: 200,
    validateResponse: (data) => {
      const d = data as { data?: { name?: string } };
      if (!d?.data?.name) return 'В data должно быть поле name';
      if (!d.data.name.includes('iPhone')) return 'Ожидается товар iPhone 15';
      return null;
    },
    solution: 'GET /api/v1/products/4',
  },
  {
    id: 'api-04',
    title: 'Доставленные заказы клиента',
    difficulty: 'medium',
    description: 'Получите заказы клиента id=1 со статусом delivered.',
    method: 'GET',
    path: '/api/v1/customers/1/orders?status=delivered',
    expectedStatus: 200,
    validateResponse: (data) => {
      const d = data as { data?: { status?: string }[] };
      if (!Array.isArray(d?.data)) return 'Ожидается массив data';
      if (d.data.length < 1) return 'У клиента 1 должны быть доставленные заказы';
      if (!d.data.every((o) => o.status === 'delivered')) return 'Все заказы должны иметь status=delivered';
      return null;
    },
    solution: 'GET /api/v1/customers/1/orders?status=delivered',
  },
  {
    id: 'api-05',
    title: 'Создать заказ (успех)',
    difficulty: 'medium',
    description: 'Создайте заказ для customer_id=3 с одной позицией: product_id=10 (USB-C кабель), quantity=1.',
    hint: 'POST с Content-Type: application/json и телом { customer_id, items }',
    method: 'POST',
    path: '/api/v1/orders',
    body: JSON.stringify({ customer_id: 3, items: [{ product_id: 10, quantity: 1 }] }, null, 2),
    expectedStatus: 201,
    validateResponse: (data) => {
      const d = data as { data?: { id?: number; status?: string } };
      if (!d?.data?.id) return 'В ответе должен быть созданный заказ с id';
      if (d.data.status !== 'new') return 'Статус нового заказа должен быть new';
      return null;
    },
    solution: `POST /api/v1/orders
Body: { "customer_id": 3, "items": [{ "product_id": 10, "quantity": 1 }] }`,
  },
  {
    id: 'api-06',
    title: 'Ошибка: нет товара на складе',
    difficulty: 'medium',
    description: 'Попробуйте заказать product_id=4 в количестве 999 штук. Ожидается статус 409 Conflict.',
    method: 'POST',
    path: '/api/v1/orders',
    body: JSON.stringify({ customer_id: 1, items: [{ product_id: 4, quantity: 999 }] }, null, 2),
    expectedStatus: 409,
    validateResponse: (data) => {
      const d = data as { error?: { message?: string } };
      if (!d?.error?.message) return 'Ожидается объект error с полем message';
      return null;
    },
    solution: 'POST с quantity: 999 → 409 INSUFFICIENT_STOCK',
  },
  {
    id: 'api-07',
    title: 'Ошибка: товар не найден',
    difficulty: 'easy',
    description: 'Запросите несуществующий товар id=9999. Ожидается 404.',
    method: 'GET',
    path: '/api/v1/products/9999',
    expectedStatus: 404,
    solution: 'GET /api/v1/products/9999 → 404',
  },
];

export const swaggerExercises: SwaggerExercise[] = [
  {
    id: 'sw-01',
    title: 'Описать GET /products',
    difficulty: 'easy',
    description: 'Дополните OpenAPI-фрагмент: опишите успешный ответ 200 для GET /products с массивом data.',
    starterYaml: `openapi: 3.0.3
info:
  title: TechStore API
  version: 1.0.0
paths:
  /products:
    get:
      summary: Список товаров
      responses:
        '200':
          description: TODO — опишите ответ`,
    requiredPatterns: ['200', 'description:', 'content:', 'application/json:', 'data:', 'type: array'],
    hint: 'Добавьте content → application/json → schema с properties.data типа array',
    solution: `responses:
  '200':
    description: Список товаров
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                type: object`,
  },
  {
    id: 'sw-02',
    title: 'POST /orders — requestBody',
    difficulty: 'medium',
    description: 'Допишите requestBody для POST /orders: обязательные поля customer_id (integer) и items (array).',
    starterYaml: `paths:
  /orders:
    post:
      summary: Создать заказ
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              # TODO: добавьте required и properties
      responses:
        '201':
          description: Заказ создан`,
    requiredPatterns: ['required:', 'customer_id', 'items', 'type: integer', 'type: array'],
    solution: `schema:
  type: object
  required: [customer_id, items]
  properties:
    customer_id:
      type: integer
    items:
      type: array
      items:
        type: object
        required: [product_id, quantity]
        properties:
          product_id:
            type: integer
          quantity:
            type: integer`,
  },
  {
    id: 'sw-03',
    title: 'Описать ошибку 404',
    difficulty: 'easy',
    description: 'Добавьте компонент Error и response NotFound для переиспользования.',
    starterYaml: `components:
  schemas:
    Error:
      type: object
      # TODO: опишите поле error с message и code
  responses:
    NotFound:
      description: TODO`,
    requiredPatterns: ['Error:', 'error:', 'message:', 'code:', 'NotFound:', 'application/json'],
    solution: `Error:
  type: object
  properties:
    error:
      type: object
      properties:
        message:
          type: string
        code:
          type: string`,
  },
  {
    id: 'sw-04',
    title: 'Query-параметр category',
    difficulty: 'medium',
    description: 'Добавьте query-параметр category (string) к GET /products.',
    starterYaml: `paths:
  /products:
    get:
      summary: Список товаров
      # TODO: parameters
      responses:
        '200':
          description: OK`,
    requiredPatterns: ['parameters:', 'name: category', 'in: query', 'type: string'],
    solution: `parameters:
  - name: category
    in: query
    schema:
      type: string
    description: Фильтр по категории`,
  },
];

export const bpmnExercises: BpmnExercise[] = [
  {
    id: 'bpmn-01',
    title: 'Обработка заказа в TechStore',
    difficulty: 'easy',
    description: 'Смоделируйте основной процесс обработки заказа от создания до доставки.',
    context: 'Покупатель оформил заказ в интернет-магазине TechStore. Система должна проверить оплату, зарезервировать товар и передать в доставку.',
    requirements: [
      'Старт: заказ создан',
      'Проверка: оплачен ли заказ?',
      'Если нет — отмена через 24 часа',
      'Если да — резерв на складе → отгрузка → доставка',
      'Конечные события: Доставлен / Отменён',
    ],
    checklist: ['Start Event', 'Exclusive Gateway (оплата)', 'Tasks с глаголами', 'End Events'],
    hints: [
      'Используйте XOR-шлюз для ветки «оплачен / не оплачен»',
      'Lane: Покупатель, Система, Склад',
    ],
    solutionDiagram: `flowchart TD
    Start([Заказ создан]) --> Check{Оплачен?}
    Check -->|Нет| Wait[Ожидание 24ч]
    Wait --> Cancel[Отмена заказа]
    Cancel --> EndCancel([Отменён])
    Check -->|Да| Reserve[Резерв товара]
    Reserve --> Ship[Передача в доставку]
    Ship --> Delivered([Доставлен])`,
  },
  {
    id: 'bpmn-02',
    title: 'Тикет поддержки',
    difficulty: 'medium',
    description: 'Процесс обработки обращения в службу поддержки TechStore.',
    context: 'Клиент создаёт тикет. Система назначает сотрудника по приоритету. Тикет проходит статусы open → in_progress → resolved → closed.',
    requirements: [
      'Создание тикета клиентом',
      'Автоназначение или ручное назначение сотрудника',
      'Эскалация при priority=high без ответа 2 часа',
      'Закрытие после подтверждения клиента',
    ],
    checklist: ['Lane: Клиент, Поддержка', 'Шлюз по приоритету', 'Таймер эскалации', '4 статуса'],
    hints: [
      'Timer boundary event для high-priority',
      'Параллельно может идти уведомление клиента',
    ],
    solutionDiagram: `flowchart TD
    Start([Тикет создан]) --> Priority{priority = high?}
    Priority -->|Да| AssignUrgent[Срочное назначение]
    Priority -->|Нет| Assign[Назначение в очередь]
    AssignUrgent --> Work[Обработка]
    Assign --> Work
    Work --> Resolved[Статус resolved]
    Resolved --> Confirm{Клиент подтвердил?}
    Confirm -->|Да| Closed([closed])
    Confirm -->|Нет| Work`,
  },
  {
    id: 'bpmn-03',
    title: 'Возврат товара',
    difficulty: 'hard',
    description: 'Процесс возврата товара после доставки.',
    context: 'Клиент хочет вернуть товар в течение 14 дней. Нужна проверка условий, одобрение, возврат денег и приёмка на складе.',
    requirements: [
      'Проверка срока 14 дней и статуса delivered',
      'Модерация менеджером при сумме > 50000',
      'Возврат средств через платёжный шлюз',
      'Обновление остатков на складе',
    ],
    checklist: ['Ветвление по сумме', 'Компенсация платежа', 'Обновление stock_qty', 'Уведомление клиента'],
    hints: [
      'Подпроцесс «Возврат платежа»',
      'При отказе — уведомление с причиной',
    ],
    solutionDiagram: `flowchart TD
    Start([Заявка на возврат]) --> CheckDays{До 14 дней?}
    CheckDays -->|Нет| Reject[Отказ]
    Reject --> EndReject([Отклонён])
    CheckDays -->|Да| CheckSum{Сумма > 50000?}
    CheckSum -->|Да| Manager[Одобрение менеджером]
    CheckSum -->|Нет| Auto[Авто-одобрение]
    Manager --> Approved{Одобрено?}
    Approved -->|Нет| Reject
    Approved -->|Да| Refund[Возврат средств]
    Auto --> Refund
    Refund --> Stock[Приёмка на склад]
    Stock --> EndOk([Возврат завершён])`,
  },
  {
    id: 'bpmn-04',
    title: 'Онбординг B2B-клиента',
    difficulty: 'medium',
    description: 'Подключение корпоративного клиента к SaaS-платформе.',
    context: 'Новая организация регистрируется, проходит проверку документов, выбирает тариф, подписывает договор и получает доступ.',
    requirements: [
      'Регистрация и загрузка документов',
      'Проверка compliance (юристы)',
      'Выбор тарифа и оплата',
      'Создание аккаунта администратора',
    ],
    checklist: ['Lane: Клиент, Sales, Юристы, Система', 'Шлюз одобрения compliance', 'Параллель: договор + оплата'],
    hints: ['Можно использовать AND-шлюз для параллельных веток'],
    solutionDiagram: `flowchart TD
    Start([Заявка]) --> Docs[Загрузка документов]
    Docs --> Compliance{Compliance OK?}
    Compliance -->|Нет| EndNo([Отказ])
    Compliance -->|Да| Tariff[Выбор тарифа]
    Tariff --> Pay[Оплата]
    Pay --> Contract[Подписание договора]
    Contract --> Create[Создание аккаунта]
    Create --> EndOk([Клиент подключён])`,
  },
];

export function validateSwaggerYaml(yaml: string, requiredPatterns: string[]): { passed: boolean; message: string } {
  const missing = requiredPatterns.filter((p) => !yaml.includes(p));
  if (missing.length > 0) {
    return {
      passed: false,
      message: `Не хватает элементов спецификации. Проверьте: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}`,
    };
  }
  return { passed: true, message: 'Спецификация содержит все обязательные элементы!' };
}
