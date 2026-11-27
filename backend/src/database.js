import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import products from "./data/products.json" with { type: "json" };

const schema = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    category_id TEXT NOT NULL,
    image_key TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    pieces TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    fulfillment TEXT NOT NULL CHECK (fulfillment IN ('pickup', 'delivery')),
    street TEXT,
    address_number TEXT,
    neighborhood TEXT,
    complement TEXT,
    notes TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'cash', 'credit', 'debit')),
    cash_paid_cents INTEGER,
    subtotal_cents INTEGER NOT NULL,
    delivery_fee_cents INTEGER NOT NULL,
    discount_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
  );
`;

export function createDatabase(databasePath = process.env.DATABASE_PATH ?? "data/menu.sqlite") {
  const resolvedPath = databasePath === ":memory:" ? databasePath : resolve(databasePath);
  if (resolvedPath !== ":memory:") {
    mkdirSync(dirname(resolvedPath), { recursive: true });
  }

  const database = new Database(resolvedPath);
  database.pragma("foreign_keys = ON");
  if (resolvedPath !== ":memory:") database.pragma("journal_mode = WAL");
  database.exec(schema);

  const insertProduct = database.prepare(`
    INSERT OR IGNORE INTO products (
      id, sort_order, name, short_description, full_description, price_cents,
      category_id, image_key, image_alt, stock, pieces
    ) VALUES (
      @id, @sortOrder, @name, @shortDescription, @fullDescription, @priceCents,
      @categoryId, @imageKey, @imageAlt, @stock, @pieces
    )
  `);
  const seedProducts = database.transaction(() => {
    products.forEach((product, sortOrder) => {
      insertProduct.run({
        ...product,
        sortOrder,
        priceCents: Math.round(product.price * 100),
        pieces: product.pieces ?? null,
      });
    });
  });
  seedProducts();

  return database;
}

export function closeDatabase(database) {
  database.close();
}
