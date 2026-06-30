---
title: Тестирование API
description: Postman, curl, контрактное тестирование
order: 6
---

## Инструменты

| Инструмент | Для чего |
|------------|----------|
| **curl** | Быстрая проверка из терминала |
| **Postman / Insomnia** | Коллекции запросов, окружения |
| **Swagger UI** | Try it out по спецификации |
| **API-песочница** (тренажёр) | Обучение на TechStore |

## Что проверять

### Функциональность
- Happy path возвращает ожидаемый JSON
- Негативные кейсы → правильный статус и error.code

### Контракт
- Ответ соответствует OpenAPI-схеме
- Обязательные поля присутствуют
- Типы данных совпадают

### Нефункциональные
- Время ответа < SLA
- Rate limiting (429 Too Many Requests)

## Коллекция Postman (логика)

```
TechStore/
├── Products/
│   ├── GET list
│   └── GET by id
├── Customers/
│   └── GET orders
└── Orders/
    ├── POST create (success)
    ├── POST create (no stock) → 409
    └── GET by id
```

## Контрактное тестирование

Автоматически сравнивает реальный ответ с OpenAPI:
- Schemathesis, Dredd, Pact (для consumer-driven)

## Практика

1. **API-песочница** — ручные запросы
2. **Практика → API** — задания с проверкой статуса и тела
3. Скачайте OpenAPI: `GET /api/v1/openapi`
