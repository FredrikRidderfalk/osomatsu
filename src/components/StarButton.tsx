export function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 5.9L12 16.8l-5.3 2.8 1.1-5.9L3.4 9.5l6-.8L12 3.2z" />
    </svg>
  )
}

export function StarButton({
  active,
  onToggle,
  label,
}: {
  active: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`star-btn${active ? ' star-btn--active' : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      aria-pressed={active}
      aria-label={label}
      title={label}
    >
      <StarIcon filled={active} />
    </button>
  )
}
