export default function LeftArrowIcon({ width, height, size }: { width?: number, height?: number, size?: number }) {
  return (
    <svg width={size || width || 24} height={size || height || 24} strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 8L13 11.5L16.5 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 8L7 11.5L10.5 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  )
}