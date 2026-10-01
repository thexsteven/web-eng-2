import { useEffect, useState } from 'react'
import './CopyButton.css'

const RESET_DELAY_MS = 3000

export default function CopyButton() {
  // Eigener State pro Button: nur dieser zeigt "Kopiert!"
  const [copied, setCopied] = useState(false)

  // Timer startet, sobald copied true wird; Cleanup verhindert setState nach Unmount
  useEffect(() => {
    if (!copied) return
    const timerId = setTimeout(() => setCopied(false), RESET_DELAY_MS)
    return () => clearTimeout(timerId)
  }, [copied])

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      // Clipboard-API braucht HTTPS oder localhost und die Erlaubnis des Browsers
      alert('Link konnte nicht kopiert werden.')
    }
  }

  return (
    <button type="button" className="copy-button" onClick={handleClick} disabled={copied}>
      {copied ? 'Kopiert!' : 'Kopieren'}
    </button>
  )
}
