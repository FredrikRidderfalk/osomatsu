import type { Tag } from '../types'

export function TagPill({ tag }: { tag: Tag }) {
  return <span className={`tag tag--${tag}`}>{tag}</span>
}
