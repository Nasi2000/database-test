import { NextRequest, NextResponse } from 'next/server';
import { validateQuery, executeQuery } from '@/lib/db';
import { sqlExercises, compareResults } from '@/lib/exercises';

export async function POST(request: NextRequest) {
  try {
    const { sql, exerciseId } = await request.json();

    if (!sql || !exerciseId) {
      return NextResponse.json({ passed: false, message: 'Не передан запрос или ID задания' });
    }

    const exercise = sqlExercises.find((e) => e.id === exerciseId);
    if (!exercise) {
      return NextResponse.json({ passed: false, message: 'Задание не найдено' });
    }

    const validationError = validateQuery(sql, true);
    if (validationError) {
      return NextResponse.json({ passed: false, message: validationError });
    }

    const userResult = await executeQuery(sql.replace(/;+\s*$/, ''));
    const expectedResult = await executeQuery(exercise.checkQuery);

    const comparison = compareResults(
      userResult.rows,
      expectedResult.rows,
      exercise.expectedColumns
    );

    return NextResponse.json(comparison);
  } catch (err) {
    return NextResponse.json({
      passed: false,
      message: err instanceof Error ? err.message : 'Ошибка проверки',
    });
  }
}
