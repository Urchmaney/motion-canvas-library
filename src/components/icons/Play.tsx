export default function PlayIcon({ width, height, size }: { width?: number, height?: number, size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size || width || 24} height={size || height || 24} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
