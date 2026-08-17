import { useEffect, useState } from 'react'

export type Route = { page: 'overview' } | { page: 'recipe'; slug: string }

function parseHash(hash: string): Route {
  const match = hash.match(/^#\/recipe\/([\w-]+)/)
  if (match) return { page: 'recipe', slug: match[1] }
  return { page: 'overview' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
