import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { queryProducts, getQueryParam } from '@/lib/techstore-api';

export async function GET(request: NextRequest) {
  try {
    const category = getQueryParam(request, 'category');
    const limitParam = getQueryParam(request, 'limit');
    const limit = limitParam ? Math.min(Number(limitParam) || 50, 100) : 50;

    const products = await queryProducts(category, limit);
    return apiSuccess(products, 200, { total: products.length, limit });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Ошибка сервера', 500);
  }
}
