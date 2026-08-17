import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { usePhoto } from '../hooks/usePhoto'

export function RecipePhoto({ slug, image, name }: { slug: string; image?: string; name: string }) {
  const { photo, setPhoto } = usePhoto(slug)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const src = photo ?? image ?? null

  const readFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    readFile(e.dataTransfer.files[0])
  }

  const onPick = (e: ChangeEvent<HTMLInputElement>) => readFile(e.target.files?.[0])

  return (
    <div
      className={`photo${src ? ' photo--filled' : ''}${dragging ? ' photo--dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      aria-label={src ? `Replace photo for ${name}` : `Add a photo for ${name}`}
    >
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <div className="photo__empty">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2.5" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="M3.5 17.5l5-4.5 4 3.5 3.5-3 4.5 4" />
          </svg>
          <strong>recipe photo</strong>
          <span>
            or <u>browse files</u>
          </span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
    </div>
  )
}
