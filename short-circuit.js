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

// Refactored mit Short-Circuit Evaluation (und Optional Chaining)
const getUserDisplayShort = (user) =>
  user?.nickname || user?.firstName || "Anonymer Nutzer";

// Ohne Optional Chaining, nur mit &&
const getUserDisplayAnd = (user) =>
  (user && user.nickname) || (user && user.firstName) || "Anonymer Nutzer";

// Tests
const users = [
  { nickname: "Neo", firstName: "Thomas" },
  { firstName: "Thomas" },
  { nickname: "", firstName: "Thomas" },
  {},
  null,
  undefined,
];

for (const u of users) {
  console.log(
    JSON.stringify(u),
    "->",
    getUserDisplay(u),
    "|",
    getUserDisplayShort(u),
    "|",
    getUserDisplayAnd(u)
  );
}
