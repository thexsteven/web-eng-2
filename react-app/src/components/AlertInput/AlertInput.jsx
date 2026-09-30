import { useState } from 'react'
import './AlertInput.css'

function AlertInput() {
  const [text, setText] = useState('')

  const showAlert = () => {
    alert(text)
  }

  // Erweitert: Enter im Input löst ebenfalls den Alert aus
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      showAlert()
    }
  }

  return (
    <section className="alert-input">
      <div className="alert-input__row">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Text eingeben…"
        />
        <button type="button" onClick={showAlert}>
          Anzeigen
        </button>
      </div>

      <p className="alert-input__preview">
        {text ? text : <em>Noch nichts eingegeben</em>}
      </p>
    </section>
  )
}

export default AlertInput
