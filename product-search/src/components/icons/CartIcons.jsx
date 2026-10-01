// Inline-SVGs statt Icon-Bibliothek; currentColor übernimmt die Textfarbe
const svgProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const CartOutline = () => (
  <>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
  </>
)

export function CartIcon() {
  return (
    <svg {...svgProps}>
      <CartOutline />
    </svg>
  )
}

// Gleicher Wagen mit Haken: "liegt im Warenkorb"
export function CartCheckIcon() {
  return (
    <svg {...svgProps}>
      <CartOutline />
      <path d="M10 11l2 2 4-4" />
    </svg>
  )
}
