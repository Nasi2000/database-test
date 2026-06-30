import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { queryCustomerOrders, parseId, getQueryParam } from '@/lib/techstore-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseId(idStr);
    if (!id) return apiError('Некорректный ID клиента', 400);

    const status = getQueryParam(request, 'status');
    const orders = await queryCustomerOrders(id, status);
    return apiSuccess(orders, 200, { total: orders.length, customer_id: id });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Ошибка сервера', 500);
  }
}
