import { useNavigate } from 'react-router-dom'
import ScooterIllustration from './ScooterIllustration.jsx'

export default function ScooterCard({ scooter }) {
  const navigate = useNavigate()
  const battery = scooter.battery ?? 80
  const batteryTone = battery < 25 ? 'text-rust' : 'text-teal'

  return (
    <button
      onClick={() => navigate(`/scooter/${scooter.id}`)}
      className="group w-full flex items-center gap-4 bg-white rounded-card p-4 text-left border border-slate-200 shadow-sm hover:shadow-md hover:border-teal hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        <ScooterIllustration size={64} tone="volt" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-ink truncate">{scooter.name || 'Volt Scooter'}</p>
        <p className="text-sm text-slate truncate flex items-center gap-1">
          <span aria-hidden="true">📍</span> {scooter.location || 'Nearby'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-xs font-mono-tab font-medium ${batteryTone}`}>{battery}%</span>
        <span className="text-[11px] font-mono-tab bg-teal-50 text-teal px-2 py-0.5 rounded-full whitespace-nowrap">
          {scooter.distanceKm ? `${scooter.distanceKm} km away` : 'Available now'}
        </span>
      </div>
    </button>
  )
}
