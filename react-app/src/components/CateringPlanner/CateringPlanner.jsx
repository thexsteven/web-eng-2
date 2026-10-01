import { useState } from 'react'
import './CateringPlanner.css'

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

// Auf ganze Cent runden, wie auf einer echten Rechnung
const roundToCent = (value) => Math.round(value * 100) / 100

export default function CateringPlanner() {
  // Essenzieller State: nur was der Nutzer direkt eingibt
  const [guests, setGuests] = useState(50)
  const [portionsPerGuest, setPortionsPerGuest] = useState(1.5)
  const [pricePerPortion, setPricePerPortion] = useState(4.5)
  const [vatRate, setVatRate] = useState(7)
  const [budget, setBudget] = useState(500)

  // Abgeleiteter State: wird bei jedem Render neu berechnet, nie gespeichert
  const totalPortions = guests * portionsPerGuest
  const netCost = totalPortions * pricePerPortion
  const grossCost = roundToCent(netCost * (1 + vatRate / 100))
  const budgetDiff = roundToCent(budget - grossCost)
  const isOverBudget = budgetDiff < 0

  // Leeres Feld ergibt 0 statt NaN
  const handleNumber = (setter) => (event) => setter(Number(event.target.value))

  return (
    <form className="catering" onSubmit={(event) => event.preventDefault()}>
      <label className="catering-row">
        Gästeanzahl
        <input type="number" min="0" step="1" value={guests} onChange={handleNumber(setGuests)} />
      </label>
      <label className="catering-row">
        Portionen pro Gast
        <input
          type="number"
          min="0"
          step="0.1"
          value={portionsPerGuest}
          onChange={handleNumber(setPortionsPerGuest)}
        />
      </label>
      <div className="catering-row">
        Gesamtportionen
        <output>{totalPortions.toLocaleString('de-DE')}</output>
      </div>

      <label className="catering-row">
        Preis pro Portion (€)
        <input
          type="number"
          min="0"
          step="0.01"
          value={pricePerPortion}
          onChange={handleNumber(setPricePerPortion)}
        />
      </label>
      <div className="catering-row">
        Essenskosten (Netto)
        <output>{euro.format(netCost)}</output>
      </div>
      <label className="catering-row">
        MwSt.-Satz (%)
        <input type="number" min="0" step="1" value={vatRate} onChange={handleNumber(setVatRate)} />
      </label>
      <div className="catering-row">
        Gesamtkosten (Brutto)
        <output>{euro.format(grossCost)}</output>
      </div>

      <label className="catering-row">
        Budget-Limit (€)
        <input type="number" min="0" step="0.01" value={budget} onChange={handleNumber(setBudget)} />
      </label>
      <div className="catering-row">
        Budget-Status
        <output className={isOverBudget ? 'over' : 'under'}>
          {isOverBudget ? '' : '+'}
          {euro.format(budgetDiff)}
        </output>
      </div>
    </form>
  )
}
