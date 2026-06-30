---
title: Аутентификация API
description: API Key, Bearer Token, OAuth 2.0 — обзор для аналитика
order: 5
---

## Зачем аналитику знать auth?

Вы описываете **кто** может вызывать endpoint и **что** происходит без авторизации.

## Основные схемы

### API Key
```
GET /api/v1/products
X-API-Key: sk_live_abc123
```
Просто, подходит для server-to-server.

### Bearer Token (JWT)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```
Стандарт для SPA и мобильных приложений. Токен содержит claims (user_id, roles).

### OAuth 2.0
Пользователь логинится через провайдера (Google, Keycloak). Используется в B2C и enterprise SSO.

## Что описать в требованиях

| Вопрос | Пример ответа |
|--------|---------------|
| Какие роли? | customer, admin, support |
| Кто может создать заказ? | Только авторизованный customer |
| Что при 401? | Редирект на login / JSON error |
| Время жизни токена? | Access 15 мин, refresh 7 дней |

## TechStore (учебный API)

Сейчас API **без авторизации** — для упрощения обучения. В реальном проекте добавьте:

```yaml
security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Практика

Дополните в **Практика → Swagger** задание: добавьте `securitySchemes` в OpenAPI-фрагмент.
