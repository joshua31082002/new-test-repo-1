import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const scoreboard = sqliteTable('scoreboard', {
  id: integer('id').primaryKey(),
  xWins: integer('x_wins').notNull().default(0),
  oWins: integer('o_wins').notNull().default(0),
  draws: integer('draws').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
