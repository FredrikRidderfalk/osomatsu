import type { Ingredient, Quantity } from '../types'

const FRACTIONS: Array<[number, string]> = [
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [3 / 8, '⅜'],
  [1 / 2, '½'],
  [5 / 8, '⅝'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [7 / 8, '⅞'],
]

/** Format a number as a mixed fraction using unicode glyphs, e.g. 1.5 → "1½". */
export function formatFraction(value: number): string {
  const whole = Math.floor(value + 1e-9)
  const frac = value - whole
  if (frac < 0.05) return String(whole)
  let best = FRACTIONS[0]
  for (const f of FRACTIONS) {
    if (Math.abs(f[0] - frac) < Math.abs(best[0] - frac)) best = f
  }
  if (Math.abs(best[0] - frac) > 0.04) {
    // no clean fraction — fall back to one decimal
    return String(Math.round(value * 10) / 10)
  }
  return whole > 0 ? `${whole}${best[1]}` : best[1]
}

/** Round metric amounts to kitchen-sensible numbers. */
function formatMetricNumber(value: number): string {
  if (value >= 100) return String(Math.round(value / 5) * 5)
  if (value >= 10) return String(Math.round(value))
  return String(Math.round(value * 10) / 10)
}

const METRIC_UNITS = new Set(['g', 'kg', 'ml', 'l'])

export function formatQuantity(q: Quantity, scale: number): string {
  if (q.qty === null) return 'to taste'
  const scaled = q.qty * scale
  const amount = METRIC_UNITS.has(q.unit)
    ? formatMetricNumber(scaled)
    : formatFraction(scaled)
  return q.unit ? `${amount} ${q.unit}` : amount
}

export function ingredientQuantity(
  ing: Ingredient,
  system: 'us' | 'metric',
  scale: number,
): string {
  const q = system === 'metric' && ing.metric ? ing.metric : ing.us
  return formatQuantity(q, scale)
}
