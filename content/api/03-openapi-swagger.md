---
title: OpenAPI и Swagger
description: Как читать и писать спецификацию API
order: 3
---

## OpenAPI (бывший Swagger)

**Машиночитаемый** стандарт описания REST API. Из одного файла:
- генерируется документация (Swagger UI)
- моки для фронтенда
- контрактные тесты

## Структура файла

```yaml
openapi: 3.0.3
info:
  title: TechStore API
  version: 1.0.0
paths:
  /products:
    get:
      summary: Список товаров
      responses:
        '200':
          description: OK
components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
```

## Что описывает аналитик

1. **paths** — все endpoint'ы
2. **parameters** — query, path, headers
3. **requestBody** — схема для POST/PATCH
4. **responses** — для каждого статус-кода (200, 400, 404…)
5. **components/schemas** — переиспользуемые модели

## Swagger UI

Интерактивная документация: можно **попробовать** запрос из браузера.

В тренажёре:
- Спецификация: `/api/v1/openapi`
- Страница **Swagger** — просмотр и Try it out

## Типичные ошибки в спецификациях

- Описан только 200, нет 400/404/409
- `required` не указан для обязательных полей
- Тип `price` — number в спеке, но string в реальном API (несогласованность!)

## Практика

1. Откройте страницу **Swagger** в тренажёре
2. Попробуйте GET `/products` через UI
3. Выполните задания в **Практика → Swagger**
