import { NextRequest } from 'next/server';
import { getPool } from '@/lib/db';

export async function queryProducts(category?: string | null, limit = 50) {
  const pool = getPool();
  let sql = `
    SELECT p.id, p.name, p.sku, p.price, p.stock_qty, p.is_active,
           c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = true
  `;
  const params: unknown[] = [];

  if (category) {
    params.push(category);
    sql += ` AND c.name = $${params.length}`;
  }

  params.push(limit);
  sql += ` ORDER BY p.name LIMIT $${params.length}`;

  const { rows } = await pool.query(sql, params);
  return rows.map((r) => ({
    ...r,
    price: String(r.price),
  }));
}

export async function queryProductById(id: number) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.sku, p.price, p.stock_qty, p.is_active, p.created_at,
            c.id AS category_id, c.name AS category
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id]
  );
  if (!rows[0]) return null;
  return { ...rows[0], price: String(rows[0].price) };
}

export async function queryCustomerById(id: number) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, email, full_name, phone, city, registered_at
     FROM customers WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function queryCustomerOrders(customerId: number, status?: string | null) {
  const pool = getPool();
  let sql = `
    SELECT id, status, total_amount, created_at, shipped_at
    FROM orders WHERE customer_id = $1
  `;
  const params: unknown[] = [customerId];

  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }

  sql += ' ORDER BY created_at DESC';

  const { rows } = await pool.query(sql, params);
  return rows.map((r) => ({ ...r, total_amount: String(r.total_amount) }));
}

export async function queryOrderById(id: number) {
  const pool = getPool();
  const orderResult = await pool.query(
    `SELECT o.id, o.customer_id, o.status, o.total_amount, o.created_at, o.shipped_at,
            c.full_name AS customer_name, c.email AS customer_email
     FROM orders o
     JOIN customers c ON c.id = o.customer_id
     WHERE o.id = $1`,
    [id]
  );
  if (!orderResult.rows[0]) return null;

  const itemsResult = await pool.query(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price,
            p.name AS product_name, p.sku
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [id]
  );

  const order = orderResult.rows[0];
  return {
    ...order,
    total_amount: String(order.total_amount),
    items: itemsResult.rows.map((i) => ({
      ...i,
      unit_price: String(i.unit_price),
    })),
  };
}

type CreateOrderResult =
  | { error: string; status: number; code?: string }
  | { order: NonNullable<Awaited<ReturnType<typeof queryOrderById>>>; status: 201 };

export async function createOrder(body: {
  customer_id: number;
  items: { product_id: number; quantity: number }[];
}): Promise<CreateOrderResult> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const customer = await client.query('SELECT id FROM customers WHERE id = $1', [body.customer_id]);
    if (!customer.rows[0]) {
      return { error: 'Клиент не найден', status: 404 };
    }

    if (!body.items?.length) {
      return { error: 'Список позиций пуст', status: 400 };
    }

    let total = 0;
    const lineItems: { product_id: number; quantity: number; unit_price: number }[] = [];

    for (const item of body.items) {
      const product = await client.query(
        'SELECT id, price, stock_qty, name FROM products WHERE id = $1 AND is_active = true',
        [item.product_id]
      );
      if (!product.rows[0]) {
        return { error: `Товар ${item.product_id} не найден`, status: 404 };
      }
      if (item.quantity <= 0) {
        return { error: 'Количество должно быть больше 0', status: 400 };
      }
      if (product.rows[0].stock_qty < item.quantity) {
        return {
          error: `Недостаточно товара «${product.rows[0].name}» на складе`,
          status: 409,
          code: 'INSUFFICIENT_STOCK',
        };
      }
      const unitPrice = Number(product.rows[0].price);
      total += unitPrice * item.quantity;
      lineItems.push({ product_id: item.product_id, quantity: item.quantity, unit_price: unitPrice });
    }

    const orderInsert = await client.query(
      `INSERT INTO orders (customer_id, status, total_amount)
       VALUES ($1, 'new', $2) RETURNING id, customer_id, status, total_amount, created_at`,
      [body.customer_id, total]
    );

    const orderId = orderInsert.rows[0].id;

    for (const item of lineItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.unit_price]
      );
      await client.query(
        'UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');

    const order = await queryOrderById(orderId);
    return { order, status: 201 };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function getQueryParam(request: NextRequest, name: string): string | null {
  return request.nextUrl.searchParams.get(name);
}
