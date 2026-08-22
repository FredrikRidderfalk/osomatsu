import { useMemo, useRef, useState } from 'react'
import { RECIPES } from '../data/recipes'
import { CATEGORIES, TAGS } from '../types'
import type { Category, Recipe, Tag } from '../types'
import { TagPill } from '../components/TagPill'
import { StarButton, StarIcon } from '../components/StarButton'
import { useFavorites } from '../hooks/useFavorites'

/* The list only ever shows a 52px square, so it loads the small thumb asset
   that sits in recipes/thumbs/ beside the photo. Recipes without one fall back
   to the full photo, and only then to the striped placeholder. */
function Thumb({ recipe }: { recipe: Recipe }) {
  const [stage, setStage] = useState<'thumb' | 'photo' | 'failed'>('thumb')

  if (!recipe.image || stage === 'failed') {
    return <div className="thumb thumb--empty" aria-hidden="true" />
  }

  const src =
    stage === 'thumb' ? recipe.image.replace(/([^/]+)$/, 'thumbs/$1') : recipe.image

  return (
    <img
      className="thumb"
      src={import.meta.env.BASE_URL + src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setStage(stage === 'thumb' ? 'photo' : 'failed')}
    />
  )
}

export function OverviewPage() {
  const { favorites, toggleFavorite } = useFavorites()
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [activeTags, setActiveTags] = useState<Tag[]>([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const counts = useMemo(() => {
    const map = new Map<Category, number>()
    for (const r of RECIPES) map.set(r.category, (map.get(r.category) ?? 0) + 1)
    return map
  }, [])

  const visible = RECIPES.filter((r) => {
    if (category !== 'all' && r.category !== category) return false
    if (favoritesOnly && !favorites.includes(r.slug)) return false
    if (!activeTags.every((t) => r.tags.includes(t))) return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      const haystack = [r.name, ...r.mainIngredients, ...r.ingredients.map((i) => i.name)]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const toggleTag = (tag: Tag) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )

  return (
    <div className="panel">
      <main className="card overview">
        <header className="overview__header">
          <div className="overview__brand">
            <h1 className="overview__title">御粗末 OSOMATSU</h1>
            <span className="badge">100% plant-based</span>
          </div>
          {searchOpen ? (
            <input
              ref={searchRef}
              className="search-input"
              type="search"
              placeholder="search recipes…"
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query.trim()) setSearchOpen(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setQuery('')
                  setSearchOpen(false)
                }
              }}
            />
          ) : (
            <button type="button" className="search-btn" onClick={() => setSearchOpen(true)}>
              サーチ search
            </button>
          )}
        </header>

        <nav className="tabs" aria-label="Categories">
          <button
            type="button"
            className={`tab${category === 'all' ? ' tab--active' : ''}`}
            onClick={() => setCategory('all')}
          >
            all <em>{RECIPES.length}</em>
          </button>
          {CATEGORIES.filter((c) => counts.get(c)).map((c) => (
            <button
              key={c}
              type="button"
              className={`tab${category === c ? ' tab--active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c} <em>{counts.get(c)}</em>
            </button>
          ))}
        </nav>

        <div className="filters">
          <span className="label">tag</span>
          <button
            type="button"
            className={`tag tag--favorites${favoritesOnly ? ' tag--on' : ''}`}
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
          >
            <StarIcon filled /> favorites <em>{favorites.length}</em>
          </button>
          {TAGS.map((t) => (
            <button
              key={t}
              type="button"
              className={`tag tag--${t}${activeTags.includes(t) ? ' tag--on' : ''}`}
              onClick={() => toggleTag(t)}
              aria-pressed={activeTags.includes(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ledger">
          <div className="ledger__head" aria-hidden="true">
            <span />
            <span className="label">recipe</span>
            <span className="label">main ingredients</span>
            <span className="label">tags</span>
            <span className="label ledger__count-head">ingr.</span>
            <span />
          </div>

          {visible.map((r) => (
            <a key={r.slug} className="row" href={`#/recipe/${r.slug}`}>
              <Thumb recipe={r} />
              <div className="row__name">
                <h2>
                  {r.name}
                  {favorites.includes(r.slug) && (
                    <span className="row__fav-mark" aria-label="favorite">
                      <StarIcon filled />
                    </span>
                  )}
                </h2>
                <span className="label">
                  {r.category}
                  <span className="row__meta-count"> · {r.ingredients.length} ingredients</span>
                </span>
              </div>
              <div className="row__ingredients">{r.mainIngredients.join(' · ')}</div>
              <div className="row__tags">
                {r.tags.map((t) => (
                  <TagPill key={t} tag={t} />
                ))}
              </div>
              <div className="row__count">{r.ingredients.length}</div>
              <div className="row__star">
                <StarButton
                  active={favorites.includes(r.slug)}
                  onToggle={() => toggleFavorite(r.slug)}
                  label={
                    favorites.includes(r.slug)
                      ? `Remove ${r.name} from favorites`
                      : `Add ${r.name} to favorites`
                  }
                />
              </div>
            </a>
          ))}

          {visible.length === 0 && (
            <p className="ledger__empty">no recipes match — loosen the filters.</p>
          )}
        </div>
      </main>
    </div>
  )
}
