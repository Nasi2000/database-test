CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

// таблица roles
// таблица city
// таблица 

CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name        VARCHAR(200) NOT NULL,
    sku         VARCHAR(50) NOT NULL UNIQUE,
    price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_qty   INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_products_cat
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    longitude DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    CONSTRAINT cities_unique UNIQUE (city_name, longitude, latitude)
);

CREATE TABLE IF NOT EXISTS customers (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    full_name   VARCHAR(200) NOT NULL,
    phone       VARCHAR(20),
    city_id INTEGER NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_customer_city
    FOREIGN KEY (city_id)
    REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id           SERIAL PRIMARY KEY,
    customer_id  INTEGER NOT NULL,
    status       VARCHAR(30) NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new', 'paid', 'shipped', 'delivered', 'cancelled')),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    shipped_at   TIMESTAMP,

    CONSTRAINT fk_orders_cust
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    UNIQUE (order_id, product_id),

    CONSTRAINT fk_order_item_ord
    FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_prod
    FOREIGN KEY (product_id)
    REFERENCES products(id)

);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_code INTEGER NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employees (
    id         SERIAL PRIMARY KEY,
    full_name  VARCHAR(200) NOT NULL,
    role_id    INTEGER NOT NULL,
    department VARCHAR(100) NOT NULL,
    hired_at   DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_employees_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    employee_id INTEGER REFERENCES employees(id),
    subject     VARCHAR(300) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority    VARCHAR(10) NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
