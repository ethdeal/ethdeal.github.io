interface ExternalLinkIconProps {
  className?: string
}

export function ExternalLinkIcon({
  className = '',
}: ExternalLinkIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M8 16 16 8M10.5 8H16v5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
