---
title: "SQL: JOIN"
description: Объединение таблиц и агрегирующие запросы
order: 5
---

## Зачем JOIN?

Данные разнесены по таблицам. JOIN соединяет их по ключам.

## Типы соединений

| Тип | Результат |
|-----|-----------|
| **INNER JOIN** | Только совпадающие строки с обеих сторон |
| **LEFT JOIN** | Все из левой + совпадения справа (NULL если нет) |
| **RIGHT JOIN** | Зеркало LEFT |
| **FULL JOIN** | Все с обеих сторон |

## INNER JOIN

```sql
SELECT p.name, c.name AS category
FROM products p
INNER JOIN categories c ON c.id = p.category_id;
```

## LEFT JOIN (важно для аналитика!)

```sql
-- Все клиенты, даже без заказов
SELECT c.full_name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

## Несколько JOIN

```sql
SELECT o.id, c.full_name, p.name AS product, oi.quantity
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.status = 'delivered';
```

## Подзапросы

```sql
SELECT * FROM products
WHERE category_id IN (
  SELECT id FROM categories WHERE name = 'Ноутбуки'
);
```

## Практика

Задания **SQL-03**, **SQL-04**, **SQL-06** в разделе Практика.
