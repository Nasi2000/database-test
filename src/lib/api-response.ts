import { NextResponse } from 'next/server';

export function apiError(message: string, status: number, code?: string) {
  return NextResponse.json(
    { error: { message, code: code ?? `ERR_${status}` } },
    { status }
  );
}

export function apiSuccess<T>(data: T, status = 200, meta?: Record<string, unknown>) {
  return NextResponse.json(meta ? { data, meta } : { data }, { status });
}
