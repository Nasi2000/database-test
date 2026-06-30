---
title: REST-запросы на практике
description: URL, query-параметры, body, headers
order: 2
---

## Анатомия REST-запроса

### Path-параметры
Идентифицируют ресурс: `/api/v1/products/4`

### Query-параметры
Фильтрация и настройка: `/api/v1/products?category=Смартфоны&limit=10`

### Request Body (POST/PATCH)
```json
{
  "customer_id": 1,
  "items": [
    { "product_id": 10, "quantity": 2 }
  ]
}
```

### Headers
| Header | Зачем |
|--------|-------|
| `Content-Type: application/json` | Формат тела запроса |
| `Accept: application/json` | Ожидаемый формат ответа |
| `Authorization: Bearer <token>` | Аутентификация |

## Примеры TechStore API

### Получить товары категории «Ноутбуки»
```
GET /api/v1/products?category=Ноутбуки
```

### Получить заказы клиента со статусом delivered
```
GET /api/v1/customers/1/orders?status=delivered
```

### Создать заказ
```
POST /api/v1/orders
Content-Type: application/json

{
  "customer_id": 1,
  "items": [{ "product_id": 10, "quantity": 1 }]
}
```

## curl для аналитика

```bash
curl -s http://localhost:3000/api/v1/products?limit=3

curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"product_id":10,"quantity":1}]}'
```

## Практика

В **API-песочнице** выполните все три примера выше. В **Практика → API** — задания с автопроверкой.
