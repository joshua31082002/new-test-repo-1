import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactInquiries = sqliteTable("contact_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 120 }).notNull(),
  email: text("email", { length: 254 }).notNull(),
  message: text("message", { length: 2000 }).notNull(),
  status: text("status", { enum: ["new", "read"] })
    .notNull()
    .default("new"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
