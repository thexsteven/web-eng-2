import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, Database, Search, Sparkles } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const categories = [
  { key: 'films', label: 'Filme', singular: 'Film' },
  { key: 'people', label: 'Personen', singular: 'Person' },
  { key: 'planets', label: 'Planeten', singular: 'Planet' },
  { key: 'species', label: 'Spezies', singular: 'Spezies' },
  { key: 'starships', label: 'Raumschiffe', singular: 'Raumschiff' },
  { key: 'vehicles', label: 'Fahrzeuge', singular: 'Fahrzeug' },
] as const

type Category = (typeof categories)[number]['key']
type Resource = Record<string, unknown> & { url: string; name?: string; title?: string }
type Favorite = { category: Category; id: string; title: string }
type Page = { count: number; next: string | null; previous: string | null; results: Resource[] }
type Selection = Favorite

const categoryLabel = (key: Category) => categories.find((item) => item.key === key)!.singular
const resourceTitle = (item: Resource) => String(item.title ?? item.name ?? 'Unbekannt')
const resourceId = (url: string) => url.match(/\/(\d+)\/?$/)?.[1] ?? ''
const fieldLabels: Record<string, string> = {
  episode_id: 'Episode', release_date: 'Kinostart', opening_crawl: 'Einleitung',
  birth_year: 'Geburtsjahr', homeworld: 'Heimatplanet', eye_color: 'Augenfarbe',
  hair_color: 'Haarfarbe', skin_color: 'Hautfarbe', height: 'Größe (cm)',
  mass: 'Gewicht (kg)', rotation_period: 'Rotation (h)', orbital_period: 'Umlaufzeit (Tage)',
  population: 'Bevölkerung', diameter: 'Durchmesser (km)', climate: 'Klima',
  terrain: 'Gelände', model: 'Modell', manufacturer: 'Hersteller',
  starship_class: 'Klasse', vehicle_class: 'Klasse', cost_in_credits: 'Preis (Credits)',
  director: 'Regie', producer: 'Produktion', language: 'Sprache', designation: 'Bezeichnung',
}
const formatKey = (key: string) => fieldLabels[key] ?? key.replaceAll('_', ' ')

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Anfrage fehlgeschlagen (${response.status}).`)
  }
  return response.json() as Promise<T>
}

function CategoryNav({ active, onChange }: { active: Category; onChange: (category: Category) => void }) {
  return (
    <nav aria-label="SWAPI-Kategorien" className="flex flex-wrap gap-2">
      {categories.map((item) => (
        <Button key={item.key} type="button" variant={active === item.key ? 'default' : 'outline'}
          onClick={() => onChange(item.key)} aria-current={active === item.key ? 'page' : undefined}>
          {item.label}
        </Button>
      ))}
    </nav>
  )
}

function ResourceList({ items, selected, onSelect }: {
  items: Selection[]; selected: Selection | null; onSelect: (item: Selection) => void
}) {
  if (items.length === 0) return <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">Keine Einträge gefunden.</p>
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={`${item.category}-${item.id}`}>
          <button type="button" onClick={() => onSelect(item)}
            className="w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className={`h-full transition-colors hover:bg-accent/60 ${selected?.category === item.category && selected.id === item.id ? 'ring-primary' : ''}`}>
              <CardHeader>
                <CardDescription>{categoryLabel(item.category)} · #{item.id}</CardDescription>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
            </Card>
          </button>
        </li>
      ))}
    </ul>
  )
}

function ResourceDetails({ item, loading, error, favorite, onFavorite, busy }: {
  item: Resource | null; loading: boolean; error: string; favorite: boolean;
  onFavorite: () => void; busy: boolean
}) {
  if (loading) return <Card><CardContent className="space-y-4"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-24 w-full" /></CardContent></Card>
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
  if (!item) return <Card><CardContent className="py-10 text-center text-muted-foreground">Wähle einen Eintrag aus, um Details zu sehen.</CardContent></Card>

  const fields = Object.entries(item).filter(([key, value]) =>
    !['url', 'created', 'edited', 'name', 'title'].includes(key) && value != null && !Array.isArray(value),
  )
  const relations = Object.entries(item).filter(([, value]) => Array.isArray(value))

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div><CardDescription>Datensatz</CardDescription><CardTitle className="mt-1 text-xl">{resourceTitle(item)}</CardTitle></div>
          <Button type="button" variant={favorite ? 'default' : 'outline'} size="sm" onClick={onFavorite} disabled={busy} aria-label={favorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}>
            <Bookmark className={favorite ? 'fill-current' : ''} /> {favorite ? 'Gespeichert' : 'Merken'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {fields.map(([key, value]) => (
            <div key={key} className="border-t border-border pt-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{formatKey(key)}</dt>
              <dd className="mt-1 wrap-break-word text-sm">{typeof value === 'string' && value.startsWith('https://swapi.dev/api/') ? <a className="underline underline-offset-4" href={value} target="_blank" rel="noreferrer">SWAPI-Link öffnen</a> : String(value)}</dd>
            </div>
          ))}
        </dl>
        {relations.length > 0 && <div className="border-t border-border pt-4"><h3 className="mb-3 text-sm font-semibold">Verknüpfungen</h3><div className="flex flex-wrap gap-2">{relations.map(([key, value]) => <Badge key={key} variant="secondary">{formatKey(key)}: {(value as unknown[]).length}</Badge>)}</div></div>}
        <a href={item.url} target="_blank" rel="noreferrer" className="inline-block text-sm text-primary underline underline-offset-4">Originaldaten bei SWAPI ↗</a>
      </CardContent>
    </Card>
  )
}

export default function App() {
  const [category, setCategory] = useState<Category>('films')
  const [showFavorites, setShowFavorites] = useState(false)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [listResult, setListResult] = useState<{ key: string; data: Page | null; error: string }>({ key: '', data: null, error: '' })
  const [selected, setSelected] = useState<Selection | null>(null)
  const [detailResult, setDetailResult] = useState<{ key: string; data: Resource | null; error: string }>({ key: '', data: null, error: '' })
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [favoriteLoading, setFavoriteLoading] = useState(true)
  const [favoriteBusy, setFavoriteBusy] = useState(false)
  const [favoriteError, setFavoriteError] = useState('')
  const listKey = `${category}:${page}:${search}`
  const detailKey = selected ? `${selected.category}:${selected.id}` : ''
  const listLoading = listResult.key !== listKey
  const data = listLoading ? null : listResult.data
  const listError = listLoading ? '' : listResult.error
  const detailLoading = Boolean(selected) && detailResult.key !== detailKey
  const detail = detailKey === detailResult.key ? detailResult.data : null
  const detailError = detailKey === detailResult.key ? detailResult.error : ''

  useEffect(() => {
    const controller = new AbortController()
    getJson<Favorite[]>('/api/favorites', controller.signal).then(setFavorites).catch((error: Error) => {
      if (!controller.signal.aborted) setFavoriteError(error.message)
    }).finally(() => { if (!controller.signal.aborted) setFavoriteLoading(false) })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (showFavorites) return
    const controller = new AbortController()
    getJson<Page>(`/api/swapi/${category}?page=${page}&search=${encodeURIComponent(search)}`, controller.signal)
      .then((data) => setListResult({ key: listKey, data, error: '' }))
      .catch((error: Error) => {
        if (!controller.signal.aborted) setListResult({ key: listKey, data: null, error: error.message })
      })
    return () => controller.abort()
  }, [category, page, search, showFavorites, listKey])

  useEffect(() => {
    if (!selected) return
    const controller = new AbortController()
    getJson<Resource>(`/api/swapi/${selected.category}/${selected.id}`, controller.signal)
      .then((data) => setDetailResult({ key: detailKey, data, error: '' }))
      .catch((error: Error) => {
        if (!controller.signal.aborted) setDetailResult({ key: detailKey, data: null, error: error.message })
      })
    return () => controller.abort()
  }, [selected, detailKey])

  const items: Selection[] = showFavorites
    ? favorites.filter((item) => item.category === category)
    : (data?.results ?? []).map((item) => ({ category, id: resourceId(item.url), title: resourceTitle(item) }))
  const isFavorite = selected ? favorites.some((item) => item.category === selected.category && item.id === selected.id) : false

  async function toggleFavorite() {
    if (!selected || favoriteBusy) return
    setFavoriteBusy(true)
    setFavoriteError('')
    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites/${selected.category}/${selected.id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Favorit konnte nicht entfernt werden.')
        setFavorites((current) => current.filter((item) => item.category !== selected.category || item.id !== selected.id))
      } else {
        const response = await fetch('/api/favorites', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(selected) })
        if (!response.ok) throw new Error('Favorit konnte nicht gespeichert werden.')
        setFavorites((current) => [...current, selected])
      }
    } catch (error) { setFavoriteError((error as Error).message) }
    finally { setFavoriteBusy(false) }
  }

  function changeCategory(next: Category) {
    setCategory(next); setPage(1); setSearch(''); setInput(''); setSelected(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-8">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><div><p className="font-semibold leading-tight">Galactic Archive</p><p className="text-xs text-muted-foreground">Ein Explorer für die Star Wars API</p></div></div>
        <Button variant={showFavorites ? 'default' : 'outline'} onClick={() => { setShowFavorites((value) => !value); setSelected(null) }}><Bookmark /> Favoriten <Badge variant="secondary">{favorites.length}</Badge></Button>
      </div></header>
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
        <section className="max-w-2xl space-y-3"><Badge variant="secondary"><Database /> LIVE-DATEN AUS SWAPI</Badge><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Die Galaxis entdecken.</h1><p className="text-muted-foreground">Erkunde Filme, Figuren und Welten. Suche gezielt und speichere interessante Einträge für später.</p></section>
        <CategoryNav active={category} onChange={changeCategory} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
          <section className="space-y-5" aria-label="Suchergebnisse">
            <div><h2 className="text-2xl font-semibold">{showFavorites ? 'Deine Favoriten' : categories.find((item) => item.key === category)?.label}</h2><p className="text-sm text-muted-foreground">{showFavorites ? `${items.length} gespeicherte Einträge in dieser Kategorie` : data ? `${data.count} Einträge gefunden` : 'Daten werden geladen'}</p></div>
            {!showFavorites && <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(input.trim()); setSelected(null) }} className="flex gap-2"><Input aria-label="Suche" placeholder={`In ${categories.find((item) => item.key === category)?.label} suchen …`} value={input} onChange={(event) => setInput(event.target.value)} /><Button type="submit"><Search /> Suchen</Button></form>}
            {listError && !showFavorites ? <Alert variant="destructive"><AlertDescription>{listError}</AlertDescription></Alert> : (listLoading && !showFavorites) || (favoriteLoading && showFavorites) ? <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div> : <ResourceList items={items} selected={selected} onSelect={setSelected} />}
            {!showFavorites && !listError && !listLoading && <div className="flex items-center justify-between gap-3"><Button variant="outline" disabled={!data?.previous} onClick={() => { setPage((value) => value - 1); setSelected(null) }}><ArrowLeft /> Zurück</Button><span className="text-sm text-muted-foreground">Seite {page}</span><Button variant="outline" disabled={!data?.next} onClick={() => { setPage((value) => value + 1); setSelected(null) }}>Weiter <ArrowRight /></Button></div>}
          </section>
          <aside className="space-y-3 lg:sticky lg:top-8 lg:self-start" aria-label="Details">{favoriteError && <Alert variant="destructive"><AlertDescription>{favoriteError}</AlertDescription></Alert>}<ResourceDetails item={detail} loading={detailLoading} error={detailError} favorite={isFavorite} onFavorite={toggleFavorite} busy={favoriteBusy} /></aside>
        </div>
      </main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-muted-foreground sm:px-8">Datenquelle: <a className="underline" href="https://swapi.dev" target="_blank" rel="noreferrer">swapi.dev</a></footer>
    </div>
  )
}
