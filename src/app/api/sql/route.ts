import { NextRequest, NextResponse } from 'next/server';
import { validateQuery, executeQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json();
    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({
        columns: [],
        rows: [],
        rowCount: 0,
        durationMs: 0,
        error: 'Не передан SQL-запрос',
      });
    }

    const readonly = process.env.SQL_READONLY !== 'false';
    const validationError = validateQuery(sql, readonly);
    if (validationError) {
      return NextResponse.json({
        columns: [],
        rows: [],
        rowCount: 0,
        durationMs: 0,
        error: validationError,
      });
    }

    const result = await executeQuery(sql.replace(/;+\s*$/, ''));
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({
      columns: [],
      rows: [],
      rowCount: 0,
      durationMs: 0,
      error: err instanceof Error ? err.message : 'Ошибка выполнения запроса',
    });
  }
}
