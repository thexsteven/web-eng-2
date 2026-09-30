import { formatDate, sum } from './utils.js'
import logoUrl from './assets/logo.svg'

export function renderApp(root) {
  const numbers = [3, 7, 12]

  root.innerHTML = `
    <img src="${logoUrl}" alt="Logo" width="64" height="64" />
    <h1>Bundler-Demo</h1>
    <p>Heute ist ${formatDate(new Date())}.</p>
    <p>Summe von ${numbers.join(' + ')} = ${sum(numbers)}</p>
  `
}
