---
title: "SQL: SELECT и фильтрация"
description: Выборка данных, условия, сортировка
order: 4
---

## Базовый SELECT

```sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1 DESC
LIMIT 10;
```

## Операторы сравнения и логики

```sql
WHERE price >= 1000
  AND city = 'Москва'
  AND status IN ('new', 'paid')
  AND email IS NOT NULL
```

## Полезные функции

| Функция | Пример |
|---------|--------|
| `COUNT(*)` | Количество строк |
| `SUM(amount)` | Сумма |
| `AVG(price)` | Среднее |
| `MIN` / `MAX` | Минимум / максимум |
| `COALESCE(phone, 'нет')` | Замена NULL |

## GROUP BY и HAVING

```sql
SELECT city, COUNT(*) AS customer_count
FROM customers
GROUP BY city
HAVING COUNT(*) > 1;
```

- `WHERE` фильтрует **строки до** группировки
- `HAVING` фильтрует **группы после** агрегации

## Примеры на TechStore

```sql
-- Все заказы со статусом new
SELECT id, customer_id, total_amount, created_at
FROM orders
WHERE status = 'new';

-- Товары дороже 50000 руб.
SELECT name, price FROM products
WHERE price > 50000
ORDER BY price;
```

## Практика

Выполните задания **SQL-01** и **SQL-02** в разделе Практика.
