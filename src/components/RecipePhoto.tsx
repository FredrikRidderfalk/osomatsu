import { useState } from 'react'

/** Recipe photo from bundled assets; striped placeholder when missing. */
export function RecipePhoto({ image, name }: { image?: string; name: string }) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return <div className="photo photo--empty" aria-hidden="true" />
  }
  return (
    <div className="photo">
      <img
        src={import.meta.env.BASE_URL + image}
        alt={name}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
