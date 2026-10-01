const http = require('http')

const PORT = process.env.PORT || 3000

// In-Memory-"Datenbank": geht bei jedem Neustart verloren
const users = [
  { id: 1, name: 'Anna Schmidt', role: 'admin' },
  { id: 2, name: 'Max Müller', role: 'user' },
  { id: 3, name: 'Lena Weber', role: 'user' },
]
let nextId = users.length + 1

const routes = [
  { method: 'GET', path: '/', description: 'Diese Übersicht' },
  { method: 'GET', path: '/health', description: 'Status und Laufzeit des Servers' },
  { method: 'GET', path: '/users', description: 'Alle Benutzer' },
  { method: 'GET', path: '/users/:id', description: 'Einzelner Benutzer' },
  { method: 'POST', path: '/users', description: 'Neuen Benutzer anlegen (name, role)' },
]

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(html)
}

function renderOverview() {
  const rows = routes
    .map((r) => `<tr><td><code>${r.method}</code></td><td><code>${r.path}</code></td><td>${r.description}</td></tr>`)
    .join('')

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>HTTP-API</title>
  </head>
  <body>
    <h1>HTTP-API mit Node.js</h1>
    <table border="1" cellpadding="6">
      <thead><tr><th>Methode</th><th>Route</th><th>Beschreibung</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
</html>`
}

// Body kommt in Stücken (Chunks) an, erst bei 'end' ist er vollständig
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Ungültiges JSON'))
      }
    })
    req.on('error', reject)
  })
}

async function createUser(req, res) {
  let data
  try {
    data = await readJsonBody(req)
  } catch (error) {
    return sendJson(res, 400, { error: error.message })
  }

  // JSON.parse liefert auch Zahlen, Arrays oder null - nur Objekte sind gültig
  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data)
  const name = isObject && typeof data.name === 'string' ? data.name.trim() : ''
  const role = isObject && typeof data.role === 'string' ? data.role.trim() : ''

  if (!name || !role) {
    return sendJson(res, 400, { error: 'name und role sind Pflichtfelder' })
  }

  const user = { id: nextId++, name, role }
  users.push(user)
  sendJson(res, 201, user)
}

const server = http.createServer((req, res) => {
  // WHATWG-URL-API statt des veralteten url.parse()
  const { pathname } = new URL(req.url, `http://${req.headers.host}`)
  const { method } = req

  if (method === 'GET' && pathname === '/') {
    return sendHtml(res, 200, renderOverview())
  }

  if (method === 'GET' && pathname === '/health') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
  }

  if (method === 'GET' && pathname === '/users') {
    return sendJson(res, 200, users)
  }

  if (method === 'POST' && pathname === '/users') {
    return createUser(req, res)
  }

  const match = pathname.match(/^\/users\/(\d+)$/)
  if (method === 'GET' && match) {
    const id = Number(match[1])
    const user = users.find((u) => u.id === id)
    if (!user) {
      return sendJson(res, 404, { error: `Benutzer mit ID ${id} nicht gefunden` })
    }
    return sendJson(res, 200, user)
  }

  sendJson(res, 404, { error: `Route ${method} ${pathname} nicht gefunden` })
})

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
})
