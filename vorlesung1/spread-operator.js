const user = {
  id: 1,
  name: "Lisa",
  email: "lisa@example.com",
  role: "user",
  createdAt: "2026-01-01",
};

// 1. publicUser: alle Eigenschaften außer id und createdAt
// (Rest-Pattern; id und createdAt werden nur zum Herausnehmen benannt)
const { id, createdAt, ...publicUser } = user;
console.log("1.", publicUser);

// 2. adminUser: basiert auf user, aber role = "admin"
// (role muss NACH dem Spread stehen, sonst wird es überschrieben)
const adminUser = { ...user, role: "admin" };
console.log("2.", adminUser);
console.log("   user unverändert:", user.role);

// 3. Zwei Einstellungsobjekte zusammenführen
const defaults = { theme: "light", notifications: true };
const overrides = { theme: "dark" };
const settings = { ...defaults, ...overrides };
console.log("3.", settings);
// Verwendet wird theme: "dark". Bei gleichen Schlüsseln gewinnt das Objekt,
// das im Spread weiter hinten steht.
