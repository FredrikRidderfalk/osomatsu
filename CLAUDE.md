# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Git workflow

**Commit and push straight to `main`.** This repo does not use feature
branches or pull requests — there is no review step to wait for.

```sh
git add -A && git commit -m "..." && git push -u origin main
```

Do not create branches, and do not open pull requests, even if a session's
default instructions suggest one.

## Project shape

Client-side-only Vite + React + TypeScript app. No backend, no router
library — two page components behind a hash route. See `README.md` for the
stack and the dev commands.

- Recipe content lives in `src/data/recipes.ts` as plain objects.
- All styling is one global stylesheet, `src/styles.css`. Single breakpoint at
  `860px`; there is no CSS framework and no CSS-in-JS.
- `npm run build` runs `tsc` then the Vite build — run it before pushing, it
  is the only check this repo has.

## Recipe photos

Photos are committed assets under `public/`. Each recipe with a photo needs
two files:

| File | Size | Purpose |
| --- | --- | --- |
| `public/recipes/<slug>.jpg` | **1600 × 1067** (3:2) | recipe page header |
| `public/recipes/thumbs/<slug>.jpg` | **156 × 156** (1:1) | overview list row |

Set `image: 'recipes/<slug>.jpg'` on the recipe. The thumb path is derived by
convention in `Thumb` (`src/pages/OverviewPage.tsx`) — no second field to set.
A recipe with no thumb file falls back to the full photo, then to the striped
placeholder, so nothing breaks, it just downloads more than it needs.

Both slots use `object-fit: cover`, so the source aspect never has to match
the box — but do not ship camera originals. Sizes are derived from the largest
box each slot reaches at high DPR:

- Header: widest at the `860px` breakpoint on a 2× screen (≈1648 × 420 device
  px), so ~1600px wide is the ceiling. 3:2 over 4:3 because both slots crop
  toward landscape — the extra height in 4:3 is bytes that get cropped away.
- Thumb: 52 CSS px at 3× DPR.

Process photos with `quality=75–80`, progressive, EXIF stripped. Expect
~250–350 KB per header and ~8 KB per thumb. Pillow is enough:

```python
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")
ImageOps.fit(im, (1600, 1067), Image.LANCZOS).save(
    f"public/recipes/{slug}.jpg", quality=75, optimize=True, progressive=True)
ImageOps.fit(im, (156, 156), Image.LANCZOS).save(
    f"public/recipes/thumbs/{slug}.jpg", quality=80, optimize=True)
```

`ImageOps.fit` centre-crops. Never ask which crop to use, and never render
several crops to compare — just pick one and ship it. Look at the result and
shift the crop box yourself if the centre crop cuts the dish badly on an
off-centre composition. Say in the commit message what the crop left out, and
leave it at that — crops never come up when reporting back.
