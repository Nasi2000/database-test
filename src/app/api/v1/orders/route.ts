import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createOrder } from '@/lib/techstore-api';

export async function POST(request: NextRequest) {
  try {
    let body: { customer_id?: number; items?: { product_id: number; quantity: number }[] };
    try {
      body = await request.json();
    } catch {
      return apiError('Невалидный JSON в теле запроса', 400, 'INVALID_JSON');
    }

    if (!body.customer_id || typeof body.customer_id !== 'number') {
      return apiError('Поле customer_id обязательно и должно быть числом', 400, 'VALIDATION_ERROR');
    }

    if (!Array.isArray(body.items)) {
      return apiError('Поле items должно быть массивом', 400, 'VALIDATION_ERROR');
    }

    const result = await createOrder({
      customer_id: body.customer_id,
      items: body.items,
    });

    if ('error' in result) {
      return apiError(result.error, result.status, result.code);
    }

    return apiSuccess(result.order, result.status);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Ошибка сервера', 500);
  }
}
