import { apiSuccess, apiError } from '@/lib/api-response';
import { queryCustomerById, parseId } from '@/lib/techstore-api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseId(idStr);
    if (!id) return apiError('Некорректный ID клиента', 400);

    const customer = await queryCustomerById(id);
    if (!customer) return apiError('Клиент не найден', 404, 'CUSTOMER_NOT_FOUND');

    return apiSuccess(customer);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Ошибка сервера', 500);
  }
}
