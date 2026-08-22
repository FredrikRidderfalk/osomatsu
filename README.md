# 御粗末 OSOMATSU

A very simple, client-side-only recipe app. No backend, no router library —
just two page components and a hash-based route.

## Stack

- [Vite](https://vitejs.dev) + React + TypeScript
- One global stylesheet (`src/styles.css`)
- Favorites persist in `localStorage`

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
```

## Adding a recipe

Recipes live in `src/data/recipes.ts` as plain objects — add a new entry to
the `RECIPES` array and it appears in the overview, the category tabs, tag
filters and search automatically.

- `mainIngredients` is the short highlight list shown on the overview page.
- Each ingredient carries a US quantity and an optional metric one
  (omit `metric` when they're identical — counts, tsp/tbsp, "to taste").
- `qty: null` renders as "to taste".
- Quantities scale with the servings stepper on the recipe page.
- Photos come from committed assets only: drop the file in `public/recipes/`
  and set `image: 'recipes/<file>.jpg'` on the recipe. Without one (or if the
  file is missing), a striped placeholder is shown instead.
- Two sizes per photo: `recipes/<slug>.jpg` at 1600x1067 for the recipe page
  header, and `recipes/thumbs/<slug>.jpg` at 156x156 for the overview row.
  The thumb path is derived by convention, so only `image` needs setting.
  See `CLAUDE.md` for how the sizes are derived and how to generate them.

## Pages

- `#/` — overview: category tabs, tag + favorites filters, search, ledger list
- `#/recipe/<slug>` — recipe: servings stepper, US/metric toggle, method, notes
