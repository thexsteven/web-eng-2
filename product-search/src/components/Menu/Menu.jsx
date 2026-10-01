import { CartIcon } from '../icons/CartIcons.jsx'
import './Menu.css'

const links = [
  { href: '#', label: 'Start' },
  { href: '#', label: 'Produkte' },
  { href: '#', label: 'Über uns' },
  { href: '#', label: 'Kontakt' },
]

// Kennt nur die Anzahl, nicht welche Produkte im Warenkorb liegen
export default function Menu({ cartCount }) {
  return (
    <header className="menu">
      <span className="menu-logo">TechShop</span>
      <nav aria-label="Hauptmenü">
        <ul className="menu-links">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="menu-cart" aria-live="polite">
        <CartIcon />
        <span className="menu-cart-count">{cartCount}</span>
        <span className="visually-hidden">
          {cartCount === 1 ? 'Produkt' : 'Produkte'} im Warenkorb
        </span>
      </div>
    </header>
  )
}
