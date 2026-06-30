import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { queryOrderById, createOrder, parseId } from '@/lib/techstore-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseId(idStr);
    if (!id) return apiError('Некорректный ID заказа', 400);

    const order = await queryOrderById(id);
    if (!order) return apiError('Заказ не найден', 404, 'ORDER_NOT_FOUND');

    return apiSuccess(order);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Ошибка сервера', 500);
  }
}
