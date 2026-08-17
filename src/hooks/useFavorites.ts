import { useCallback, useState } from 'react'

const KEY = 'osomatsu:favorites'
const DEFAULT_FAVORITES = ['guacamole']

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return DEFAULT_FAVORITES
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(load)

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // storage unavailable — favorites just won't persist
      }
      return next
    })
  }, [])

  return { favorites, toggleFavorite }
}
