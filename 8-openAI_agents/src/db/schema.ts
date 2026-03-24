// src/db/schema.ts

export const CREATE_SCHEMA = /* sql */ `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode  = WAL;

  CREATE TABLE IF NOT EXISTS customers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    phone      TEXT,
    tier       TEXT    NOT NULL DEFAULT 'bronze'
                 CHECK (tier IN ('bronze', 'silver', 'gold')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    sku               TEXT    NOT NULL UNIQUE,
    name              TEXT    NOT NULL,
    category_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price             REAL    NOT NULL CHECK (price >= 0),
    stock_qty         INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    restock_threshold INTEGER NOT NULL DEFAULT 5,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id      INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status           TEXT    NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
    total            REAL    NOT NULL DEFAULT 0 CHECK (total >= 0),
    shipping_address TEXT,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    qty        INTEGER NOT NULL CHECK (qty > 0),
    unit_price REAL    NOT NULL CHECK (unit_price >= 0)
  );

  CREATE TABLE IF NOT EXISTS refunds (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    reason      TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
    amount      REAL    NOT NULL CHECK (amount > 0),
    resolved_at TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    agent      TEXT    NOT NULL,
    action     TEXT    NOT NULL,
    entity     TEXT,
    entity_id  INTEGER,
    note       TEXT,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_orders_customer     ON orders(customer_id);
  CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
  CREATE INDEX IF NOT EXISTS idx_refunds_order       ON refunds(order_id);
  CREATE INDEX IF NOT EXISTS idx_refunds_status      ON refunds(status);
  CREATE INDEX IF NOT EXISTS idx_audit_agent         ON audit_log(agent);
`;

// ── row types ─────────────────────────────────────────────────

export type CustomerTier = "bronze" | "silver" | "gold";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
export type RefundStatus = "pending" | "approved" | "rejected";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  tier: CustomerTier;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  price: number;
  stock_qty: number;
  restock_threshold: number;
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  status: OrderStatus;
  total: number;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  qty: number;
  unit_price: number;
}

export interface Refund {
  id: number;
  order_id: number;
  reason: string;
  status: RefundStatus;
  amount: number;
  resolved_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: number;
  agent: string;
  action: string;
  entity: string | null;
  entity_id: number | null;
  note: string | null;
  created_at: string;
}
