interface IconProps {
  width?: number
  height?: number
  className?: string
}

export function MountainIcon({ width = 13, height = 12, className }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 13 12" fill="currentColor" className={className}>
      <path d="M6.5 0L13 12H0L6.5 0Z" />
    </svg>
  )
}
