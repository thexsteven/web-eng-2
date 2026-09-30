// 1. "06.02.2026" -> "2026-02-06"
function parseDate(dateString) {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}

// 2. Erstes Element und Rest
function head(arr) {
  const [first, ...remaining] = arr;
  return [first, remaining];
}

// 3. RGB-Array -> CSS-String
function toRgbString(rgb) {
  const [r, g, b] = rgb;
  return `rgb(${r}, ${g}, ${b})`;
}

// Tests
console.log("1.", parseDate("06.02.2026"));

const [first, remaining] = head([10, 20, 30, 40]);
console.log("2.", first, remaining);

console.log("3.", toRgbString([255, 128, 0]));
