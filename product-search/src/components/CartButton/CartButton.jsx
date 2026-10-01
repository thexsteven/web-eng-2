import { CartIcon, CartCheckIcon } from '../icons/CartIcons.jsx'
import './CartButton.css'

// Kein eigener State: ob das Produkt im Warenkorb ist, entscheidet App
export default function CartButton({ productName, inCart, onToggle }) {
  const label = inCart ? `${productName} aus dem Warenkorb entfernen` : `${productName} in den Warenkorb legen`

  return (
    <button
      type="button"
      className={`cart-button${inCart ? ' in-cart' : ''}`}
      onClick={onToggle}
      aria-pressed={inCart}
      aria-label={label}
      title={label}
    >
      {inCart ? <CartCheckIcon /> : <CartIcon />}
    </button>
  )
}
