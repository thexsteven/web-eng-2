import { useState } from 'react'
import './Counter.css'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((prev) => prev + 1)
  // Erweitert: nie unter 0 fallen
  const decrement = () => setCount((prev) => Math.max(prev - 1, 0))
  const reset = () => setCount(0)

  return (
    <section className="counter-box">
      <p className="counter-box__value">{count}</p>

      <div className="counter-box__buttons">
        <button type="button" onClick={decrement} disabled={count === 0}>
          −1
        </button>
        <button type="button" onClick={reset} disabled={count === 0}>
          Reset
        </button>
        <button type="button" onClick={increment}>
          +1
        </button>
      </div>
    </section>
  )
}

export default Counter
