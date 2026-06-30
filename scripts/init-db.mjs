import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const reset = process.argv.includes('--reset');

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function run() {
  const client = await pool.connect();
  try {
    if (reset) {
      console.log('Сброс схемы...');
      await client.query(`
        DROP TABLE IF EXISTS support_tickets, order_items, orders,
          products, customers, categories, employees CASCADE;
      `);
    }

    const schema = readFileSync(join(__dirname, '..', 'sql', '01_schema.sql'), 'utf-8');
    const seed = readFileSync(join(__dirname, '..', 'sql', '02_seed.sql'), 'utf-8');

    console.log('Применение схемы...');
    await client.query(schema);

    console.log('Загрузка тестовых данных...');
    await client.query(seed);

    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log('Таблицы:', rows.map((r) => r.table_name).join(', '));
    console.log('Готово!');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Ошибка:', err.message);
  process.exit(1);
});
