import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { join, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { favorites } from './schema.ts'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const categories = new Set(['films', 'people', 'planets', 'species', 'starships', 'vehicles'])
const relation = /^\/api\/swapi\/(films|people|planets|species|starships|vehicles)(?:\/(\d+))?$/
const favorite = /^\/api\/favorites\/(films|people|planets|species|starships|vehicles)\/(\d+)$/
const port = Number(process.env.PORT ?? 3001)

await mkdir(join(root, 'data'), { recursive: true })
const client = createClient({ url: `file:${join(root, 'data', 'favorites.db')}` })
const db = drizzle(client)
await migrate(db, { migrationsFolder: join(root, 'drizzle') })

function json(response: import('node:http').ServerResponse, status: number, value: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(value))
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`)
    const resource = url.pathname.match(relation)
    const saved = url.pathname.match(favorite)

    if (request.method === 'GET' && resource) {
      const [, category, id] = resource
      const target = new URL(`https://swapi.dev/api/${category}/${id ? `${id}/` : ''}`)
      if (!id) {
        const search = url.searchParams.get('search')?.trim() ?? ''
        const page = url.searchParams.get('page') ?? '1'
        if (!/^\d+$/.test(page) || Number(page) < 1 || Number(page) > 100 || search.length > 100) {
          json(response, 400, { error: 'Ungültige Suchanfrage.' })
          return
        }
        target.searchParams.set('page', page)
        if (search) target.searchParams.set('search', search)
      }
      const upstream = await fetch(target, { signal: AbortSignal.timeout(10000) })
      if (!upstream.ok) {
        json(response, upstream.status === 404 ? 404 : 502, { error: 'SWAPI konnte die Daten nicht liefern.' })
        return
      }
      json(response, 200, await upstream.json())
      return
    }

    if (request.method === 'GET' && url.pathname === '/api/favorites') {
      json(response, 200, await db.select().from(favorites))
      return
    }

    if (request.method === 'PUT' && url.pathname === '/api/favorites') {
      let body: unknown
      try {
        const chunks: Buffer[] = []
        for await (const chunk of request) chunks.push(Buffer.from(chunk))
        body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      } catch {
        json(response, 400, { error: 'Ungültiges JSON.' })
        return
      }
      if (!body || typeof body !== 'object') {
        json(response, 400, { error: 'Ungültiger Favorit.' })
        return
      }
      const { category, id, title } = body as Record<string, unknown>
      if (typeof category !== 'string' || !categories.has(category) ||
          typeof id !== 'string' || !/^\d+$/.test(id) ||
          typeof title !== 'string' || !title.trim() || title.length > 200) {
        json(response, 400, { error: 'Ungültiger Favorit.' })
        return
      }
      await db.insert(favorites).values({ category, id, title: title.trim() }).onConflictDoNothing()
      json(response, 200, { category, id, title: title.trim() })
      return
    }

    if (request.method === 'DELETE' && saved) {
      const [, category, id] = saved
      await db.delete(favorites).where(and(eq(favorites.category, category), eq(favorites.id, id)))
      response.writeHead(204)
      response.end()
      return
    }

    if (url.pathname.startsWith('/api/')) {
      json(response, 404, { error: 'Unbekannter API-Endpunkt.' })
      return
    }

    const dist = join(root, 'dist')
    const path = url.pathname === '/' ? '/index.html' : url.pathname
    const file = resolve(dist, `.${path}`)
    if (!file.startsWith(dist)) {
      response.writeHead(404).end()
      return
    }
    try {
      const content = await readFile(file)
      const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }
      response.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' })
      response.end(content)
    } catch {
      response.writeHead(404).end()
    }
  } catch (error) {
    console.error(error)
    json(response, 500, { error: 'Interner Serverfehler.' })
  }
}).listen(port, () => console.log(`Server läuft auf http://localhost:${port}`))
