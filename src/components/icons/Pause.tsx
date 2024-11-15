export default function PauseIcon({ width, height, size }: { width?: number, height?: number, size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size || width || 24} height={size || height || 24} fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
