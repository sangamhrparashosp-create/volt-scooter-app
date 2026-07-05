// A simple, brand-colored electric scooter illustration.
// Used consistently in scooter cards and empty states, instead of a stock photo.
export default function ScooterIllustration({ size = 96, tone = 'teal' }) {
  const body = tone === 'volt' ? '#C8FF3D' : '#0B3D3A'
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48" cy="48" r="48" fill={tone === 'volt' ? 'rgba(200,255,61,0.15)' : 'rgba(11,61,58,0.08)'} />
      {/* wheels */}
      <circle cx="30" cy="66" r="8" stroke={body} strokeWidth="3" fill="none" />
      <circle cx="70" cy="66" r="8" stroke={body} strokeWidth="3" fill="none" />
      {/* deck */}
      <path d="M22 66 H40" stroke={body} strokeWidth="3" strokeLinecap="round" />
      {/* stem + handlebar */}
      <path d="M40 66 L52 30" stroke={body} strokeWidth="3" strokeLinecap="round" />
      <path d="M46 34 H58" stroke={body} strokeWidth="3" strokeLinecap="round" />
      {/* rear support to back wheel */}
      <path d="M40 66 L70 66" stroke={body} strokeWidth="3" strokeLinecap="round" />
      <path d="M58 66 L60 46" stroke={body} strokeWidth="3" strokeLinecap="round" />
      {/* charge bolt on deck, ties to brand */}
      <path d="M33 58 L38 50 L35 50 L39 44 L34 52 L37 52 Z" fill={tone === 'volt' ? '#0B3D3A' : '#C8FF3D'} />
    </svg>
  )
}
