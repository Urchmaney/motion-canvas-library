
export default function GoodScoreIcon({ width, height, size }: { width?: number, height?: number, size?: number }) {
  return (
    <svg width={size || width || 32} height={size || height || 32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984" stroke="#000000" stroke-width="2" />
      {/* <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#000000" stroke-width="2" /> */}
    </svg>
  )
}