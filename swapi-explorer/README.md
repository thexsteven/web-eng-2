# Galactic Archive

Eine React-SPA zur Erkundung der [Star Wars API](https://swapi.dev/documentation). Alle sechs SWAPI-Bereiche lassen sich durchsuchen, seitenweise ansehen und im Detail öffnen. Favoriten werden lokal in SQLite gespeichert.

## Start

Voraussetzung: Node.js 24 oder neuer.

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173 · Backend: http://localhost:3001

Die SQLite-Datei unter `data/favorites.db` wird beim ersten Serverstart angelegt. Das Backend führt die eingecheckte Drizzle-Migration automatisch aus.

## Prüfung und Produktionsstart

```bash
npm run lint
npm run build
npm start
```

Nach dem Build liefert das Backend die fertige SPA unter http://localhost:3001 aus. `npm run db:generate` erzeugt nach einer Schemaänderung eine neue Migration.

## Technik

- React, TypeScript und Vite für die SPA
- shadcn/ui-Komponenten und Tailwind CSS für die Oberfläche
- TypeScript-Backend mit Node.js-HTTP-Server
- Drizzle ORM mit lokaler SQLite-Datenbank über libSQL

Das Backend leitet nur erlaubte SWAPI-Ressourcen weiter. SWAPI ist eine externe Datenquelle; bei Nichterreichbarkeit zeigt die Oberfläche einen Fehlerzustand. Die Favoritendatenbank ist lokal und ohne Benutzerkonten für diese einzelne Installation gedacht.

Die Umsetzung des vorgegebenen Senior-Workflows ist in [SENIOR-WORKFLOW.md](SENIOR-WORKFLOW.md) dokumentiert.
