import { useState } from 'react'
import './Accordion.css'

const entries = [
  { id: 'html', title: 'Was ist HTML?', content: 'HTML beschreibt die Struktur einer Webseite.' },
  { id: 'css', title: 'Was ist CSS?', content: 'CSS gestaltet die Darstellung einer Webseite.' },
  { id: 'js', title: 'Was ist JavaScript?', content: 'JavaScript fügt einer Webseite Verhalten hinzu.' },
]

export default function Accordion() {
  // Einziger State: ID des geöffneten Bereichs, null = alle zu
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    // Gleicher Bereich erneut geklickt -> schließen, sonst diesen öffnen
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="accordion">
      {entries.map((entry) => {
        // Abgeleitet aus dem State, nicht selbst gespeichert
        const isOpen = entry.id === openId

        return (
          <div key={entry.id} className="accordion-item">
            <button
              type="button"
              className="accordion-header"
              aria-expanded={isOpen}
              onClick={() => toggle(entry.id)}
            >
              {entry.title}
            </button>

            {isOpen && (
              <div className="accordion-content">
                <p>{entry.content}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
