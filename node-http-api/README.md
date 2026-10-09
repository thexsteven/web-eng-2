# Node.js HTTP-API mit Swagger UI

Die API verwendet ausschließlich das native `http`-Modul von Node.js. Ihre OpenAPI-3.0-Spezifikation liegt in [`openapi.json`](openapi.json); die interaktive Dokumentation wird lokal mit Swagger UI ausgeliefert.

## Start

```bash
npm install
npm start
```

Danach sind folgende Seiten erreichbar:

- API-Übersicht: <http://localhost:3000/>
- Swagger UI: <http://localhost:3000/docs>
- OpenAPI-Spezifikation: <http://localhost:3000/openapi.json>

In der Swagger UI können alle dokumentierten Endpunkte über **Try it out** direkt getestet werden. Neu angelegte Benutzer werden nur im Arbeitsspeicher gehalten und gehen beim Neustart des Servers verloren.

## Dokumentierte Endpunkte

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `GET` | `/` | HTML-Übersicht anzeigen |
| `GET` | `/health` | Serverstatus und Laufzeit abrufen |
| `GET` | `/users` | Alle Benutzer abrufen |
| `POST` | `/users` | Neuen Benutzer anlegen |
| `GET` | `/users/{id}` | Benutzer anhand seiner ID abrufen |
