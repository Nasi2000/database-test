---
title: Проектирование API
description: REST, контракты и OpenAPI для аналитика
order: 6
---

## REST — основные принципы

| Принцип | Пример |
|---------|--------|
| Ресурсы — существительные | `/orders`, `/products/{id}` |
| HTTP-методы — действия | GET читать, POST создать, PATCH обновить |
| Статус-коды — результат | 200 OK, 201 Created, 400 Bad Request, 404 Not Found |
| Stateless | Каждый запрос содержит всё необходимое |

## Пример контракта: список заказов клиента

```
GET /api/v1/customers/{customerId}/orders?status=delivered&limit=20
```

**Ответ 200:**
```json
{
  "data": [
    {
      "id": 1,
      "status": "delivered",
      "total_amount": "138980.00",
      "created_at": "2024-07-01T10:30:00Z"
    }
  ],
  "meta": { "total": 1, "limit": 20, "offset": 0 }
}
```

## Что должен описать аналитик

1. **Endpoint** — URL, метод
2. **Параметры** — path, query, body с типами и обязательностью
3. **Ответы** — структура JSON для 200, 400, 404, 500
4. **Бизнес-правила** — кто может вызывать, лимиты, пагинация
5. **Примеры** — реальные request/response

## OpenAPI (Swagger)

Стандарт описания API в YAML/JSON. Разработчики генерируют код и документацию из одного файла.

```yaml
paths:
  /orders:
    post:
      summary: Создать заказ
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [customer_id, items]
      responses:
        '201':
          description: Заказ создан
        '400':
          description: Невалидные данные
```

## Типичные ошибки в спецификациях

- Не описаны ошибки (только happy path)
- Неясные типы (`amount` — строка или число?)
- Смешение форматов дат (ISO 8601 vs timestamp)

## Практика

Опишите endpoint `POST /orders` для TechStore: body, ответы 201/400/409 (нет товара на складе).
