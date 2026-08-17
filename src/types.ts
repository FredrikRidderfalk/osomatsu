export type Category =
  | 'dinner'
  | 'main'
  | 'side'
  | 'snack'
  | 'dessert'
  | 'drink'
  | 'condiment'

export type Tag = 'quick' | 'easy' | 'oven' | 'clean' | 'cheap'

/** qty: null means "to taste" / unmeasured. unit: '' for plain counts. */
export interface Quantity {
  qty: number | null
  unit: string
}

export interface Ingredient {
  name: string
  us: Quantity
  /** Omit when identical to the US quantity (counts, tsp/tbsp of dry spice, "to taste"). */
  metric?: Quantity
}

export interface Recipe {
  slug: string
  name: string
  category: Category
  tags: Tag[]
  /** Short highlight list shown on the overview page. */
  mainIngredients: string[]
  servings: number
  prepMin: number
  cookMin: number
  kcal: number
  ingredients: Ingredient[]
  method: string[]
  notes: string[]
  /** Path to a bundled photo under public/, e.g. 'recipes/guacamole.jpg'. */
  image?: string
}

export const CATEGORIES: Category[] = [
  'dinner',
  'main',
  'side',
  'snack',
  'dessert',
  'drink',
  'condiment',
]

export const TAGS: Tag[] = ['quick', 'easy', 'oven', 'clean', 'cheap']
