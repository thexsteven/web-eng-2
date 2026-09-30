// 1. Mit if/else
function bewertungIf(punkte) {
  if (punkte >= 90) {
    return "Sehr gut";
  } else if (punkte >= 50) {
    return "Bestanden";
  } else {
    return "Durchgefallen";
  }
}

// 2. Mit Ternary Operator
const bewertung = (punkte) =>
  punkte >= 90 ? "Sehr gut" : punkte >= 50 ? "Bestanden" : "Durchgefallen";

// Tests
for (const p of [100, 90, 89, 50, 49, 0]) {
  console.log(p, bewertungIf(p), "|", bewertung(p));
}

// 3. Ab wann wird der verschachtelte Ternary unlesbar?
// Schon ab der zweiten Verschachtelung (wie oben) muss man genau hinschauen,
// welches ":" zu welchem "?" gehört. Bei drei oder mehr Stufen, komplexen
// Bedingungen oder langen Ausdrücken ist if/else (oder ein Lookup) lesbarer.
// Ein einfacher, einstufiger Ternary ist dagegen gut lesbar.
