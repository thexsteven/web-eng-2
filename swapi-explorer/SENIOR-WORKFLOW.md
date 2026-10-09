# Umsetzung nach dem Senior-Workflow

Quelle: `senior-workflow.pdf`, Kapitel 4.1–4.6 (vom Aufgabensteller bereitgestellt). Die Vorlesung verlangt die Reihenfolge **Komponentenstruktur → HTML-Struktur → Datenfluss → Funktionalität → Styling**. Die folgenden Entscheidungen wurden in dieser Reihenfolge getroffen.

## 1. Komponentenstruktur

Die Startansicht besteht aus Kopfbereich mit Favoritenumschalter, Kategorienavigation, Ergebnisbereich und Detailbereich. Ein Wireframe vor der Implementierung:

```text
App
├─ Header + Favoritenumschalter
├─ CategoryNav
└─ Hauptbereich
   ├─ Suche + ResourceList
   │  └─ Eintragskarte (mehrfach)
   └─ ResourceDetails
```

`CategoryNav`, `ResourceList` und `ResourceDetails` sind eigene React-Komponenten. Die shadcn/ui-Bausteine `Button`, `Input`, `Card`, `Badge`, `Alert` und `Skeleton` liefern die wiederverwendbaren UI-Grundelemente.

## 2. HTML-Struktur

- `header` enthält Produktname und Favoritenumschalter.
- `main` enthält Einleitung, `nav`, Ergebnis-`section` und Detail-`aside`.
- Die Suche ist ein `form`; Enter startet dieselbe Aktion wie der Suchbutton.
- Die Treffer sind eine `ul` mit `li`-Einträgen und fokussierbaren `button`-Elementen.
- Detailfelder stehen in einer `dl` mit `dt` und `dd`.
- Fehler erscheinen als `Alert`, Ladezustände als `Skeleton`.

## 3. Datenfluss

Der veränderliche Zustand liegt in `App`, weil Kategorie, Ergebnisliste, Details und Favoriten mehrere Teilbereiche betreffen. Die Komponenten erhalten Daten und Ereignisfunktionen über Props.

| Essenzieller State | Grund |
| --- | --- |
| Kategorie, Suchtext, bestätigte Suche, Seite | Ändern sich durch Nutzeraktionen |
| Favoritenansicht und ausgewählter Eintrag | Steuern die sichtbaren Bereiche |
| API-Ergebnis, Detaildatensatz, Favoriten | Kommen von Server und Datenbank |
| Lade-, Fehler- und Speicherzustand | Repräsentieren asynchrone Vorgänge |

`items` (sichtbare Liste), `isFavorite` und die angezeigten Zähler werden aus diesem State berechnet und nicht ein zweites Mal gespeichert. Bei Kategorie- oder Seitenwechsel wird die Auswahl gelöscht, damit keine Details zu einer anderen Ergebnisliste stehen bleiben.

## 4. Funktionalität

Die Liste wird über `GET /api/swapi/:category` geladen. Die Suche verwendet den `search`-Parameter von SWAPI; Vor und Zurück verwenden deren `next`- und `previous`-Werte. Die Detailansicht lädt `GET /api/swapi/:category/:id`. Laufende Abrufe werden beim Wechsel per `AbortController` abgebrochen.

Favoriten werden über `GET /api/favorites`, `PUT /api/favorites` und `DELETE /api/favorites/:category/:id` verwaltet. Das Backend validiert Kategorie, ID und Suchparameter. Drizzle schreibt in eine Tabelle mit zusammengesetztem Primärschlüssel aus Kategorie und ID; die Migration wird beim Serverstart ausgeführt.

Für Listen, Details und Favoriten sind Lade- und Fehlerzustände vorgesehen. Die Favoritenansicht filtert gespeicherte Einträge nach der gewählten Kategorie.

## 5. Styling

Erst nach der Struktur und den Datenflüssen wurden Layout und Erscheinungsbild ergänzt: zweispaltige Ansicht auf großen Bildschirmen, einspaltiges Layout auf kleineren, konsistente Abstände und Farben aus dem shadcn/ui-Theme sowie sichtbare Fokuszustände. Die Oberfläche bleibt ohne Animationen übersichtlich.

## Verifikation

`npm run build` prüft Frontend- und Backend-TypeScript und erzeugt das Produktionsbundle. `npm run lint` prüft die Regeln. Zusätzlich wurden die HTTP-Endpunkte für Liste, Detail, Favorit anlegen, lesen und entfernen manuell aufgerufen.
