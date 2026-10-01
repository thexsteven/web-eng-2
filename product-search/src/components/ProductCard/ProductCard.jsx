import CopyButton from '../CopyButton/CopyButton.jsx'
import CartButton from '../CartButton/CartButton.jsx'
import './ProductCard.css'

// Bild links, Text rechts, Buttons unter dem Text
export default function ProductCard({ product, inCart, onToggleCart }) {
  return (
    <article className="product-card">
      <img className="product-card-image" src={product.imageUrl} alt={product.name} />
      <div className="product-card-body">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="product-card-actions">
          <CopyButton />
          <CartButton productName={product.name} inCart={inCart} onToggle={onToggleCart} />
        </div>
      </div>
    </article>
  )
}
