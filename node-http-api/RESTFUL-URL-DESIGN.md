# Aufgabe: RESTful URL-Design

Quelle: [Fullstack Lecture – RESTful URL-Design](https://luc-debug.github.io/fullstack-lecture/api/tasks/01-restful-url-design/)

REST-URLs benennen Ressourcen mit Substantiven. Die Aktion wird durch die HTTP-Methode ausgedrückt. Pfade werden konsistent kleingeschrieben, Sammlungen stehen im Plural und Filter gehören in Query-Parameter.

## Lösungen

| Nr. | Vorgegebener Endpunkt | Verstoß | Korrigierter Endpunkt |
| ---: | --- | --- | --- |
| 1 | `GET /getAllBooks` | `getAll` ist ein Verb im Pfad. Außerdem fehlt die einheitliche Ressourcenbezeichnung. | `GET /books` |
| 2 | `POST /books/createNewBook` | `createNewBook` wiederholt die bereits durch `POST` ausgedrückte Aktion. | `POST /books` |
| 3 | `GET /books/5/delete` | `GET` darf keine Ressource löschen und `delete` gehört nicht in den Pfad. | `DELETE /books/5` |
| 4 | `GET /Books/5` | Die Großschreibung ist gegenüber den übrigen `/books`-Routen inkonsistent. URLs sind außerdem case-sensitive. | `GET /books/5` |
| 5 | `PUT /books/5/author/3` | `author` ist im Singular benannt und der Pfad macht nicht eindeutig, ob die Buchressource oder eine Beziehung ersetzt wird. | `PUT /books/5` mit `{"authorId": 3}` im Request-Body |
| 6 | `GET /books?id=5` | Die ID identifiziert genau eine Ressource und ist deshalb kein optionaler Filter der Sammlung. | `GET /books/5` |
| 7 | `DELETE /books/5/2024-01-01` | Das Datum ist ein unbenanntes Pfadsegment und erzeugt eine unklare Ressourcenhierarchie. Zum Löschen des Buches wird nur seine ID benötigt. | `DELETE /books/5` |
| 8 | `POST /books/5` | `POST` wird üblicherweise auf einer Sammlung zum Erstellen einer neuen Ressource verwendet. Eine bestehende Ressource wird mit `PUT` vollständig oder mit `PATCH` teilweise geändert. | `PATCH /books/5` mit den Änderungen im Request-Body |
| 9 | `GET /authors/3/books/getBooksByAuthor` | `getBooksByAuthor` ist eine redundante Aktion im Pfad. Die Hierarchie beschreibt bereits, welche Bücher angefordert werden. | `GET /authors/3/books` |
| 10 | `GET /books/active/true` | `active` und `true` beschreiben einen Filter, keine untergeordneten Ressourcen. | `GET /books?active=true` |

## Ergänzende Annahmen

Bei Nummer 5 wird angenommen, dass ein Buch genau einen Autorverweis besitzt und das Buch aktualisiert werden soll. Wenn Autorenbeziehungen dagegen als eigene Unterressourcen modelliert werden, wäre auch `PUT /books/5/authors/3` sinnvoll: Dieser Endpunkt legt die Beziehung zwischen Buch 5 und Autor 3 idempotent an.

Bei Nummer 7 wird angenommen, dass Buch 5 gelöscht werden soll. Falls das Datum beispielsweise eine Ausleihe bezeichnet, muss diese Ressource benannt und stabil identifiziert werden, etwa `DELETE /loans/17`. Ein Datum allein ist ohne Ressourcentyp und gegebenenfalls weitere Identifikatoren nicht eindeutig.

Bei Nummer 8 wird angenommen, dass einzelne Felder des Buches geändert werden. Für einen vollständigen Ersatz wäre stattdessen `PUT /books/5` korrekt.

## Bonusfrage zu Nummer 9

Es gibt zwei sinnvolle Modellierungen:

1. `GET /authors/3/books` stellt Autor 3 in den Vordergrund. Die Bücher werden als dem Autor untergeordnete Sammlung betrachtet.
2. `GET /books?authorId=3` stellt die Büchersammlung in den Vordergrund und filtert sie nach Autor 3.

Die erste Form eignet sich besonders für die Navigation innerhalb eines konkreten Autors. Die zweite ist flexibler, wenn `/books` auch nach weiteren Kriterien wie Titel, Erscheinungsjahr oder Aktivstatus gefiltert werden soll. Beide Varianten verwenden ausschließlich Ressourcenbezeichnungen und `GET` bleibt eine sichere, lesende Operation.

## Allgemeine Regeln

- Ressourcen mit Substantiven und Sammlungen im Plural benennen: `/books`, `/authors`.
- HTTP-Methoden für Aktionen verwenden: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Einzelne Ressourcen über Pfadparameter adressieren: `/books/5`.
- Filter über Query-Parameter ausdrücken: `/books?active=true`.
- Pfade konsistent kleinschreiben.
- Verschachtelungen nur verwenden, wenn sie eine echte Ressourcenbeziehung ausdrücken.
