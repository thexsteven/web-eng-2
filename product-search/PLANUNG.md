# Abschlussaufgabe (1/2 + 2/2): Produktsuche – Planung

## 1. Komponentenraster

Jeder Kasten im Mockup ist eine Komponente. Gleiche Kästen (jedes Produkt)
sind **eine** Komponente, die mehrfach gerendert wird.

```text
┌─ App ──────────────────────────────────────────────────┐
│ ┌─ Menu ─────────────────────────────────────────────┐ │
│ │  TechShop   Start  Produkte  Über uns  Kontakt  🛒 2│ │
│ └────────────────────────────────────────────────────┘ │
│ ┌─ SearchBar ────────────────────────────────────────┐ │
│ │  [ Produkte suchen …                             ] │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌─ ProductList ──────────────────────────────────────┐ │
│ │ ┌─ ProductCard ──────────────────────────────────┐ │ │
│ │ │ ┌───────┐  Kopfhörer                           │ │ │
│ │ │ │ Bild  │  Kabellos, 30 h Akku …               │ │ │
│ │ │ └───────┘  ┌─ CopyButton ─┐ ┌─ CartButton ─┐   │ │ │
│ │ │            │  Kopieren    │ │      🛒      │   │ │ │
│ │ │            └──────────────┘ └──────────────┘   │ │ │
│ │ └────────────────────────────────────────────────┘ │ │
│ │ ┌─ ProductCard ──────────────────────────────────┐ │ │
│ │ │  …                                             │ │ │
│ │ └────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## 2. Komponentenbaum

```text
App                      state: query, cartIds   derived: filteredProducts, cartCount
├── Menu                 props: cartCount
├── SearchBar            props: query, onQueryChange
└── ProductList          props: products, cartIds, onToggleCart
    └── ProductCard (n×) props: product, inCart, onToggleCart
        ├── CopyButton   state: copied
        └── CartButton   props: productName, inCart, onToggle
```

| Komponente | Aufgabe (genau eine) |
|---|---|
| `App` | Hält Suchbegriff und Warenkorb, filtert die Produkte |
| `Menu` | Navigation und Anzahl im Warenkorb |
| `SearchBar` | Eingabefeld für die Suche |
| `ProductList` | Rendert die Produkte bzw. „Keine Treffer“ |
| `ProductCard` | Ein Produkt: Bild links, Text rechts |
| `CopyButton` | Kopiert den Link, zeigt 3 s „Kopiert!“ |
| `CartButton` | Warenkorb-Icon, zeigt an, ob das Produkt drin liegt |

## 3. Workflow pro Komponente

1. **UI in Komponenten zerlegen**: siehe Raster oben.
2. **Statische Version bauen**: nur Props, kein State, mit festen Daten.
3. **Minimalen State finden**: was ändert sich und lässt sich nicht berechnen?
4. **Ort des State festlegen**: der nächste gemeinsame Elternteil aller Nutzer.
5. **Inversen Datenfluss ergänzen**: Kind meldet Änderungen per Callback-Prop.

| Daten | State? | Begründung |
|---|---|---|
| Produktliste | nein | Ändert sich nie, ist eine Konstante |
| Suchbegriff | **ja**, in `App` (gespiegelt in `?q=`) | Wird von `SearchBar` **und** `ProductList` gebraucht |
| gefilterte Produkte | nein | Abgeleitet aus Produktliste + Suchbegriff |
| Warenkorb (`cartIds`) | **ja**, in `App` | Wird von `Menu` **und** jeder `ProductCard` gebraucht |
| Anzahl im Warenkorb | nein | `cartIds.length` |
| „liegt im Warenkorb“ pro Produkt | nein | `cartIds.includes(product.id)` |
| „Kopiert!“ ja/nein | **ja**, in `CopyButton` | Betrifft nur diesen einen Button |

## 4. Leitfragen zur Abgabe

### 1. Wo lebt der Warenkorb-State – und warum genau dort?

In **`App`**, als Array der Produkt-IDs (`cartIds`).

Zwei Stellen brauchen ihn: das **Menu** (Anzahl) und jede **ProductCard**
(welches Icon). Diese beiden liegen in getrennten Ästen des Baums; ihr
nächster gemeinsamer Elternteil ist `App`. Läge der State tiefer,
z. B. in `ProductCard`, wüsste das Menü nichts davon – Geschwister können
in React nicht direkt miteinander reden, Daten fließen nur von oben nach unten.

Gespeichert werden nur **IDs**, keine Produkt-Kopien: Die Produktdaten
existieren schon in `products`, eine zweite Kopie könnte veralten.
Der Warenkorb liegt außerdem bewusst **nicht** in `ProductList`: Sonst würde
er von der Suche abhängen, und herausgefilterte Produkte wären „vergessen“.

### 2. Welche Werte sind abgeleitet statt gespeichert?

- `filteredProducts` = `products` gefiltert nach `query`
- `cartCount` = `cartIds.length`
- `inCart` pro Produkt = `cartIds.includes(product.id)`
- Icon und Farbe des `CartButton` = aus `inCart`
- Beschriftung „Kopieren“ / „Kopiert!“ = aus `copied`

Alles davon lässt sich jederzeit aus dem State berechnen. Würde man es
zusätzlich speichern, gäbe es zwei Wahrheiten, die man synchron halten
müsste – genau dort entstehen Bugs (z. B. Zähler 3, aber nur 2 grüne Icons).

### 3. Wo würden Sie den Suchbegriff speichern, damit ein Link teilbar bleibt?

In der **URL als Query-Parameter**: `…/?q=monitor`.

React-State lebt nur im Arbeitsspeicher dieses einen Tabs; wer den Link
öffnet, bekommt eine leere Suche. Die URL dagegen wird mitkopiert.

Umsetzung in `App.jsx`:

- **Lesen:** `useState(readQueryFromUrl)` holt beim Start `?q=` aus der URL.
- **Schreiben:** ein `useEffect` schreibt bei jeder Änderung `?q=` zurück,
  mit `history.replaceState` statt `pushState`, damit nicht jeder
  Tastendruck einen Eintrag im Browserverlauf erzeugt.

Damit kopiert der „Kopieren“-Button automatisch einen Link inklusive Suche.
Den **Warenkorb** dagegen legt man nicht in die URL: Er ist persönlich und
soll beim Teilen nicht mitwandern (dafür wären `localStorage` oder ein
Backend der richtige Ort).
