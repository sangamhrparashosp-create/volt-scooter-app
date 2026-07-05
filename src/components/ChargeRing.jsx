// Reused for two different meanings across the app:
//   - scooter battery percentage
//   - days remaining on a monthly pass
// Same visual language on purpose: both are "how much charge is left".
export default function ChargeRing({ percent, label, sublabel, size = 84, tone = 'teal' }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, percent))
  const offset = circumference - (clamped / 100) * circumference

  const strokeColor = tone === 'volt' ? '#C8FF3D' : '#0B3D3A'
  const trackColor = tone === 'volt' ? 'rgba(200,255,61,0.18)' : 'rgba(11,61,58,0.12)'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth="7" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono-tab text-sm font-medium text-ink leading-none">{label}</span>
        {sublabel && <span className="text-[10px] text-slate mt-1 leading-none">{sublabel}</span>}
      </div>
    </div>
  )
}
