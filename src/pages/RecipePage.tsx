import { useState } from 'react'
import type { Recipe } from '../types'
import { TagPill } from '../components/TagPill'
import { StarButton } from '../components/StarButton'
import { RecipePhoto } from '../components/RecipePhoto'
import { useFavorites } from '../hooks/useFavorites'
import { ingredientQuantity } from '../lib/quantity'

export function RecipePage({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite } = useFavorites()
  const [servings, setServings] = useState(recipe.servings)
  const [system, setSystem] = useState<'us' | 'metric'>('metric')
  // strike-off state while cooking — deliberately not persisted, resets on reload
  const [usedIngredients, setUsedIngredients] = useState<number[]>([])
  const [doneSteps, setDoneSteps] = useState<number[]>([])

  const toggleIn = (list: number[], i: number) =>
    list.includes(i) ? list.filter((x) => x !== i) : [...list, i]

  const scale = servings / recipe.servings
  const isFavorite = favorites.includes(recipe.slug)

  // rendered twice: standalone above the photo on mobile, inside the intro column on desktop
  const topbarContent = (
    <>
      <span className="label">
        recipe · {recipe.category} · {recipe.prepMin + recipe.cookMin} min total
      </span>
      <div className="recipe__topbar-actions">
        <StarButton
          active={isFavorite}
          onToggle={() => toggleFavorite(recipe.slug)}
          label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        />
        <a className="close-btn" href="#/" aria-label="Back to all recipes">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </a>
      </div>
    </>
  )

  return (
    <div className="panel">
      <article className="card recipe">
        <header className="recipe__topbar recipe__topbar--mobile">{topbarContent}</header>

        <div className="recipe__hero">
          <div className="recipe__intro">
            <header className="recipe__topbar recipe__topbar--desktop">{topbarContent}</header>
            <h1 className="recipe__title">{recipe.name}</h1>
            <div className="recipe__meta-row">
              {recipe.tags.map((t) => (
                <TagPill key={t} tag={t} />
              ))}
              <span className="recipe__meta">
                prep {recipe.prepMin} min · cook {recipe.cookMin} min · {recipe.kcal} kcal / srv
              </span>
            </div>
            <dl className="stats">
              <div className="stats__cell">
                <dt className="label">prep</dt>
                <dd>{recipe.prepMin} min</dd>
              </div>
              <div className="stats__cell">
                <dt className="label">cook</dt>
                <dd>{recipe.cookMin} min</dd>
              </div>
              <div className="stats__cell">
                <dt className="label">energy</dt>
                <dd>{recipe.kcal} kcal</dd>
              </div>
            </dl>
          </div>
          <div className="recipe__photo">
            <RecipePhoto image={recipe.image} name={recipe.name} />
          </div>
        </div>

        <div className="recipe__body">
          <section className="recipe__ingredients">
            <h2 className="label">ingredients</h2>
            <div className="controls">
              <div className="stepper">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  aria-label="Fewer servings"
                >
                  −
                </button>
                <span>
                  {servings} <small>srv</small>
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(24, s + 1))}
                  aria-label="More servings"
                >
                  +
                </button>
              </div>
              <div className="segmented" role="group" aria-label="Units">
                <button
                  type="button"
                  className={system === 'us' ? 'segmented--active' : ''}
                  onClick={() => setSystem('us')}
                >
                  us
                </button>
                <button
                  type="button"
                  className={system === 'metric' ? 'segmented--active' : ''}
                  onClick={() => setSystem('metric')}
                >
                  metric
                </button>
              </div>
            </div>
            <ul className="ingredients">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={ing.name}
                  className={usedIngredients.includes(i) ? 'struck' : ''}
                  role="button"
                  tabIndex={0}
                  aria-pressed={usedIngredients.includes(i)}
                  onClick={() => setUsedIngredients((prev) => toggleIn(prev, i))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setUsedIngredients((prev) => toggleIn(prev, i))
                    }
                  }}
                >
                  <span className="ingredients__qty">
                    {ingredientQuantity(ing, system, scale)}
                  </span>
                  <span>{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe__method">
            <h2 className="label">method</h2>
            <ol className="method">
              {recipe.method.map((step, i) => (
                <li
                  key={i}
                  className={doneSteps.includes(i) ? 'struck' : ''}
                  role="button"
                  tabIndex={0}
                  aria-pressed={doneSteps.includes(i)}
                  onClick={() => setDoneSteps((prev) => toggleIn(prev, i))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setDoneSteps((prev) => toggleIn(prev, i))
                    }
                  }}
                >
                  <span className="method__num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {recipe.notes.length > 0 && (
            <section className="recipe__notes">
              <h2 className="label">notes</h2>
              <ul className="notes">
                {recipe.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </div>
  )
}
