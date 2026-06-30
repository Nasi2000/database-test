import { apiSuccess, apiError } from '@/lib/api-response';
import { queryProductById, parseId } from '@/lib/techstore-api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseId(idStr);
    if (!id) return apiError('Некорректный ID товара', 400);

    const product = await queryProductById(id);
    if (!product) return apiError('Товар не найден', 404, 'PRODUCT_NOT_FOUND');

    return apiSuccess(product);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Ошибка сервера', 500);
  }
}
