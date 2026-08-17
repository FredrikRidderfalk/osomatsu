import { useCallback, useState } from 'react'

const keyFor = (slug: string) => `osomatsu:photo:${slug}`

/** User-added recipe photo, persisted as a data URL in localStorage. */
export function usePhoto(slug: string) {
  const [photo, setPhotoState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(keyFor(slug))
    } catch {
      return null
    }
  })

  const setPhoto = useCallback(
    (dataUrl: string) => {
      setPhotoState(dataUrl)
      try {
        localStorage.setItem(keyFor(slug), dataUrl)
      } catch {
        // photo too large for storage — it will still show this session
      }
    },
    [slug],
  )

  return { photo, setPhoto }
}

export function storedPhoto(slug: string): string | null {
  try {
    return localStorage.getItem(keyFor(slug))
  } catch {
    return null
  }
}
