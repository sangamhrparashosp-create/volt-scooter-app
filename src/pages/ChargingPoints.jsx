import { useNavigate } from 'react-router-dom'
import { MOCK_CHARGING_POINTS } from '../lib/pilot.js'

export default function ChargingPoints() {
  const navigate = useNavigate()
  return (
    <div className="max-w-md mx-auto min-h-screen px-6 pt-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-6">
        ← Back
      </button>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Charging points</h1>
      <p className="text-slate mb-6">Swap or charge your scooter's battery nearby.</p>

      <div className="flex flex-col gap-2">
        {MOCK_CHARGING_POINTS.map((cp) => (
          <div key={cp.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-ink text-sm">{cp.name}</p>
              <p className="text-xs text-slate mt-0.5">{cp.distanceKm} km away</p>
            </div>
            <span
              className={`text-xs font-mono-tab px-2 py-1 rounded-full ${
                cp.slotsFree > 2 ? 'bg-teal-50 text-teal' : 'bg-rust/10 text-rust'
              }`}
            >
              {cp.slotsFree} slots free
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate text-center mt-6">
        Sample data — connect a real 'chargingPoints' collection once you have actual station locations.
      </p>
    </div>
  )
}
