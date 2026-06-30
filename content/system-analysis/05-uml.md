---
title: UML для аналитика
description: Диаграммы, которые чаще всего нужны SA
order: 5
---

## Какие диаграммы реально нужны

Аналитику редко нужны все 14 типов UML. Чаще всего:

1. **Диаграмма классов** — структура данных и связи
2. **Диаграмма последовательностей** — порядок вызовов при сценарии
3. **Диаграмма состояний** — жизненный цикл сущности (заказ, тикет)
4. **Диаграмма use case** — акторы и границы системы

## Диаграмма классов (фрагмент TechStore)

```mermaid
classDiagram
    Customer "1" --> "*" Order : places
    Order "1" --> "*" OrderItem : contains
    Product "1" --> "*" OrderItem
    Product "*" --> "1" Category
    Customer "1" --> "*" SupportTicket
    Employee "0..1" --> "*" SupportTicket : handles
```

## Диаграмма состояний: заказ

```mermaid
stateDiagram-v2
    [*] --> new
    new --> paid : оплата
    new --> cancelled : отмена
    paid --> shipped : отгрузка
    shipped --> delivered : доставка
    paid --> cancelled : возврат до отгрузки
    delivered --> [*]
    cancelled --> [*]
```

## Диаграмма последовательностей: оформление заказа

```mermaid
sequenceDiagram
    participant U as Покупатель
    participant API as Backend
    participant DB as PostgreSQL
    participant Pay as Платёжный шлюз

    U->>API: POST /orders
    API->>DB: проверка остатков
    DB-->>API: OK
    API->>Pay: создать платёж
    Pay-->>API: payment_id
    API->>DB: INSERT order
    API-->>U: 201 Created
```

## Советы

- Не перегружайте диаграмму — 5–9 элементов оптимально
- Подписывайте кратности связей (1..*, 0..1)
- Для API-сценариев sequence diagram особенно полезна на ревью с разработчиками
