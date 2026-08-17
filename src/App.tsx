import { useRoute } from './lib/router'
import { findRecipe } from './data/recipes'
import { OverviewPage } from './pages/OverviewPage'
import { RecipePage } from './pages/RecipePage'

export default function App() {
  const route = useRoute()

  if (route.page === 'recipe') {
    const recipe = findRecipe(route.slug)
    if (recipe) return <RecipePage key={recipe.slug} recipe={recipe} />
  }
  return <OverviewPage />
}
