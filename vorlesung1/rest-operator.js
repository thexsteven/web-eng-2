// 1. Summe beliebig vieler Zahlen (sum() ergibt 0)
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

// 2. Erstes Element und Rest trennen
function headAndTail(array) {
  const [first, ...remaining] = array;
  return [first, remaining];
}

// 3. password per Objekt-Rest entfernen
const user = {
  name: "Anna",
  email: "anna@example.com",
  password: "geheim",
  role: "user",
};
const { password, ...publicUser } = user;

// 4. Alle Namen mit " und " verbinden
function introduce(greeting, ...names) {
  return names.length ? `${greeting}, ${names.join(" und ")}!` : `${greeting}!`;
}

// Tests
console.log("1.", sum(1, 2, 3, 4), sum(5), sum());

const [first, remaining] = headAndTail([10, 20, 30, 40]);
console.log("2.", first, remaining);

console.log("3.", publicUser);

console.log("4.", introduce("Hallo", "Anna", "Bob"));
console.log("  ", introduce("Hallo", "Anna"));
console.log("  ", introduce("Hallo"));
