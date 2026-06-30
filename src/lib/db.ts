import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5434),
      database: process.env.DB_NAME || 'test',
      user: process.env.DB_USER || 'nasi',
      password: process.env.DB_PASSWORD || 'nasi',
      max: 5,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function checkConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT NOW() as now, current_database() as db');
      return {
        ok: true,
        message: `Подключено к ${result.rows[0].db}`,
      };
    } finally {
      client.release();
    }
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Ошибка подключения',
    };
  }
}

const FORBIDDEN_PATTERNS = [
  /\bDROP\b/i,
  /\bTRUNCATE\b/i,
  /\bALTER\b/i,
  /\bCREATE\b/i,
  /\bGRANT\b/i,
  /\bREVOKE\b/i,
  /\bDELETE\b/i,
  /\bUPDATE\b/i,
  /\bINSERT\b/i,
];

export function validateQuery(sql: string, readonly: boolean): string | null {
  const trimmed = sql.trim();
  if (!trimmed) return 'Запрос пустой';
  if (trimmed.includes(';') && trimmed.indexOf(';') < trimmed.length - 1) {
    return 'Разрешён только один SQL-запрос за раз';
  }
  if (readonly) {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(trimmed)) {
        return 'В режиме только чтения разрешены SELECT-запросы';
      }
    }
    if (!/^\s*SELECT\b/i.test(trimmed) && !/^\s*WITH\b/i.test(trimmed) && !/^\s*EXPLAIN\b/i.test(trimmed)) {
      return 'Разрешены только SELECT, WITH и EXPLAIN';
    }
  }
  return null;
}

export async function executeQuery(sql: string): Promise<{
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  durationMs: number;
}> {
  const start = Date.now();
  const client = await getPool().connect();
  try {
    const result = await client.query(sql);
    const durationMs = Date.now() - start;
    return {
      columns: result.fields?.map((f) => f.name) ?? [],
      rows: result.rows as Record<string, unknown>[],
      rowCount: result.rowCount ?? 0,
      durationMs,
    };
  } finally {
    client.release();
  }
}
