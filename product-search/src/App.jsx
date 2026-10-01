import { useEffect, useState } from 'react'
import Menu from './components/Menu/Menu.jsx'
import SearchBar from './components/SearchBar/SearchBar.jsx'
import ProductList from './components/ProductList/ProductList.jsx'
import { products } from './data/products.js'
import './App.css'

const SEARCH_PARAM = 'q'

// Startwert aus der URL, damit ein geteilter Link die Suche wiederherstellt
const readQueryFromUrl = () => new URLSearchParams(window.location.search).get(SEARCH_PARAM) ?? ''

export default function App() {
  // State liegt hier, weil SearchBar UND ProductList ihn brauchen
  const [query, setQuery] = useState(readQueryFromUrl)
  // State liegt hier, weil Menu (Anzahl) UND ProductCard (Icon) ihn brauchen
  const [cartIds, setCartIds] = useState([])

  // Suchbegriff in die URL spiegeln; replaceState statt pushState,
  // sonst erzeugt jeder Tastendruck einen Eintrag im Browserverlauf
  useEffect(() => {
    const url = new URL(window.location.href)
    if (query) {
      url.searchParams.set(SEARCH_PARAM, query)
    } else {
      url.searchParams.delete(SEARCH_PARAM)
    }
    window.history.replaceState(null, '', url)
  }, [query])

  const toggleCart = (productId) => {
    setCartIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    )
  }

  // Abgeleitet: leere Suche -> includes('') ist immer true -> alle Produkte
  const normalizedQuery = query.trim().toLowerCase()
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery),
  )
  // Abgeleitet: Anzahl wird nie separat gespeichert
  const cartCount = cartIds.length

  return (
    <>
      <Menu cartCount={cartCount} />
      <main className="app">
        <SearchBar query={query} onQueryChange={setQuery} />
        <ProductList products={filteredProducts} cartIds={cartIds} onToggleCart={toggleCart} />
      </main>
    </>
  )
}
