import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database(
  process.env.DATABASE_URL?.replace("file:", "") ?? "dev.db",
);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
sqlite.exec(`
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, emoji TEXT NOT NULL, sort_order INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id), name TEXT NOT NULL, description TEXT NOT NULL, unit TEXT NOT NULL, price INTEGER NOT NULL, original_price INTEGER, image_url TEXT NOT NULL, badge TEXT, available INTEGER NOT NULL DEFAULT 1);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE TABLE IF NOT EXISTS shoppers (id TEXT PRIMARY KEY, phone TEXT NOT NULL UNIQUE, name TEXT, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS carts (id TEXT PRIMARY KEY, session_id TEXT NOT NULL UNIQUE, shopper_id TEXT REFERENCES shoppers(id), updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS cart_items (id TEXT PRIMARY KEY, cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE, product_id TEXT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, substitute_product_id TEXT REFERENCES products(id));
CREATE TABLE IF NOT EXISTS verification_challenges (id TEXT PRIMARY KEY, phone TEXT NOT NULL, code TEXT NOT NULL, expires_at INTEGER NOT NULL, verified_at INTEGER);
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, order_number TEXT NOT NULL UNIQUE, shopper_id TEXT NOT NULL REFERENCES shoppers(id), session_id TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, area TEXT NOT NULL, postal_code TEXT NOT NULL, subtotal INTEGER NOT NULL, delivery_fee INTEGER NOT NULL, total INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'placed', created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS orders_shopper_idx ON orders(shopper_id);
CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders(phone);
CREATE TABLE IF NOT EXISTS order_items (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id TEXT NOT NULL, name TEXT NOT NULL, unit TEXT NOT NULL, price INTEGER NOT NULL, quantity INTEGER NOT NULL, substitute_name TEXT);
`);

export const db = drizzle(sqlite, { schema });
export { sqlite };
