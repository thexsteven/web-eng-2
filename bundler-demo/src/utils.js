export function formatDate(date) {
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function sum(numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}

// Wird nirgends importiert -> sollte beim Build wegfallen (Tree Shaking)
export function unusedHelper() {
  return 'Diese Funktion taucht im Bundle nicht auf'
}
