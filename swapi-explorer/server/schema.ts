import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const favorites = sqliteTable(
  'favorites',
  {
    category: text('category').notNull(),
    id: text('id').notNull(),
    title: text('title').notNull(),
  },
  (table) => [primaryKey({ columns: [table.category, table.id] })],
)
