// Original
function getUserDisplay(user) {
  let displayName;
  if (user && user.nickname) {
    displayName = user.nickname;
  } else if (user && user.firstName) {
    displayName = user.firstName;
  } else {
    displayName = "Anonymer Nutzer";
  }
  return displayName;
}

// 1. In einer Zeile mit || und &&
const getUserDisplayShort = (user) =>
  (user && user.nickname) || (user && user.firstName) || "Anonymer Nutzer";

// 2. Tests
const tests = [
  { nickname: "CoolMax" },
  { firstName: "Max" },
  null,
  { nickname: "" },
];

for (const u of tests) {
  console.log(JSON.stringify(u), "->", getUserDisplay(u), "|", getUserDisplayShort(u));
}

// 3. { nickname: "" } liefert "Anonymer Nutzer".
// || prüft auf "falsy", nicht auf "nicht vorhanden". Ein leerer String
// (genauso 0 oder false) gilt als falsy und wird übersprungen. Ist ein leerer
// String ein gültiger Wert, geht er so verloren. Dann wäre ?? besser, das
// überspringt nur null und undefined:
//   user?.nickname ?? user?.firstName ?? "Anonymer Nutzer"
