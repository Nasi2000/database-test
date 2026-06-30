---
title: Пагинация и ошибки API
description: limit/offset, единый формат ошибок
order: 4
---

## Пагинация

Большие списки нельзя отдавать целиком. Стандартные подходы:

### Offset-based
```
GET /products?limit=20&offset=40
```
Просто, но медленно на больших offset.

### Cursor-based
```
GET /products?limit=20&cursor=eyJpZCI6MTAwfQ==
```
Стабильнее при частых вставках.

## Meta в ответе TechStore

```json
{
  "data": [ ... ],
  "meta": {
    "total": 12,
    "limit": 50
  }
}
```

Аналитик должен описать: дефолтный limit, максимум, поведение при пустом результате.

## Единый формат ошибок

```json
{
  "error": {
    "message": "Недостаточно товара «iPhone 15» на складе",
    "code": "INSUFFICIENT_STOCK"
  }
}
```

| Поле | Назначение |
|------|-----------|
| message | Человекочитаемое описание |
| code | Машинный код для клиента/логов |

## Матрица ошибок (пример для POST /orders)

| Условие | HTTP | code |
|---------|------|------|
| Невалидный JSON | 400 | INVALID_JSON |
| Нет customer_id | 400 | VALIDATION_ERROR |
| Клиент не найден | 404 | — |
| Нет товара на складе | 409 | INSUFFICIENT_STOCK |

## Практика

В API-песочнице вызовите POST `/orders` с пустым `items` — получите 400. Затем с `quantity: 999` для товара — 409.
