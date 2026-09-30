import { useEffect, useState } from 'react'
import './JokeLoader.css'

const API_URL = 'https://official-joke-api.appspot.com/random_joke'

function JokeLoader() {
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Jede Erhöhung löst den Effect erneut aus -> neuer Witz
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetch(API_URL, { signal: controller.signal })
      .then((response) => {
        // fetch wirft nur bei Netzwerkfehlern – HTTP-Fehler (404, 500) selbst prüfen
        if (!response.ok) {
          throw new Error(`HTTP-Fehler ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        setJoke(data)
        setError(null)
      })
      .catch((err) => {
        // Abbruch durch Cleanup ist kein echter Fehler
        if (err.name === 'AbortError') return
        setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    // Cleanup: laufende Anfrage abbrechen (Unmount oder neuer Durchlauf)
    return () => controller.abort()
  }, [reloadKey])

  const handleNewJoke = () => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="joke-loader">
      {loading && (
        <div className="joke-loader__status">
          <span className="joke-loader__spinner" aria-hidden="true"></span>
          Lade Witz…
        </div>
      )}

      {!loading && error && (
        <p className="joke-loader__error">
          Witz konnte nicht geladen werden: {error}
        </p>
      )}

      {!loading && !error && joke && (
        <div className="joke-loader__joke">
          <p className="joke-loader__setup">{joke.setup}</p>
          <p className="joke-loader__punchline">{joke.punchline}</p>
        </div>
      )}

      <button type="button" onClick={handleNewJoke} disabled={loading}>
        {error ? 'Erneut versuchen' : 'Neuer Witz'}
      </button>
    </section>
  )
}

export default JokeLoader
