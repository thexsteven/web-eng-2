import ProductCard from '../ProductCard/ProductCard.jsx'
import './ProductList.css'

export default function ProductList({ products, cartIds, onToggleCart }) {
  if (products.length === 0) {
    return <p className="product-list-empty">Keine Produkte gefunden.</p>
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            inCart={cartIds.includes(product.id)}
            onToggleCart={() => onToggleCart(product.id)}
          />
        </li>
      ))}
    </ul>
  )
}
