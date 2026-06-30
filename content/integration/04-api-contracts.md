---
title: API-контракты в интеграциях
description: Версионирование, обратная совместимость, breaking changes
order: 4
---

## API как контракт

Между системами — **соглашение**. Изменение контракта без согласования ломает интеграции.

## Версионирование

| Подход | Пример |
|--------|--------|
| URL path | `/api/v1/orders`, `/api/v2/orders` |
| Header | `Accept: application/vnd.techstore.v2+json` |
| Query | `?api-version=2` (реже) |

**Рекомендация:** path versioning — проще для всех.

## Breaking vs Non-breaking

### Non-breaking (можно без новой версии)
- Добавить optional поле в ответ
- Добавить новый endpoint
- Добавить optional query-параметр

### Breaking (нужна v2)
- Удалить поле из ответа
- Переименовать поле
- Изменить тип (`price`: string → number)
- Сделать optional поле обязательным

## Deprecation policy

1. Объявить устаревание (header `Deprecation: true`)
2. Поддерживать v1 ещё N месяцев
3. Уведомить потребителей
4. Отключить v1

## Что фиксирует аналитик

- Changelog API по релизам
- Миграционный гайд v1 → v2
- SLA на поддержку старой версии

## Практика

Представьте, что в TechStore поле `sku` переименовали в `article`. Это breaking change? Как бы вы оформили миграцию?
