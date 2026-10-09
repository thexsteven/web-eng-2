import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: { url: 'file:./data/favorites.db' },
})
