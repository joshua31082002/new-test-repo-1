import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull(),
    description: text("description").notNull(),
    unit: text("unit").notNull(),
    price: integer("price").notNull(),
    originalPrice: integer("original_price"),
    imageUrl: text("image_url").notNull(),
    badge: text("badge"),
    available: integer("available", { mode: "boolean" })
      .notNull()
      .default(true),
  },
  (table) => ({
    categoryIdx: index("products_category_idx").on(table.categoryId),
  }),
);

export const shoppers = sqliteTable("shoppers", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export const carts = sqliteTable("carts", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  shopperId: text("shopper_id").references(() => shoppers.id),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey(),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  substituteProductId: text("substitute_product_id").references(
    () => products.id,
  ),
});
export const verificationChallenges = sqliteTable("verification_challenges", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),
});
export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    shopperId: text("shopper_id")
      .notNull()
      .references(() => shoppers.id),
    sessionId: text("session_id").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    area: text("area").notNull(),
    postalCode: text("postal_code").notNull(),
    subtotal: integer("subtotal").notNull(),
    deliveryFee: integer("delivery_fee").notNull(),
    total: integer("total").notNull(),
    status: text("status").notNull().default("placed"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({ shopperIdx: index("orders_shopper_idx").on(table.shopperId) }),
);
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  substituteName: text("substitute_name"),
});
