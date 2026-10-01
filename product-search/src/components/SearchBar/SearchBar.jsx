import './SearchBar.css'

// Kontrollierte Komponente: Wert kommt von oben, Änderungen gehen per Callback nach oben
export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Produkte suchen …"
        aria-label="Produkte suchen"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
  )
}
