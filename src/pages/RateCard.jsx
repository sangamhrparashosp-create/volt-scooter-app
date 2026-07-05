import { useNavigate } from 'react-router-dom'

const RATE_TIERS = [
  { label: 'Base delivery (0–3 km)', amount: 25 },
  { label: 'Extended delivery (3–7 km)', amount: 40 },
  { label: 'Peak hour bonus', amount: 15 },
  { label: 'Rainy day bonus', amount: 20 },
  { label: 'Weekly streak bonus (6+ days)', amount: 300 },
]

export default function RateCard() {
  const navigate = useNavigate()
  return (
    <div className="max-w-md mx-auto min-h-screen px-6 pt-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-6">
        ← Back
      </button>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Rate card</h1>
      <p className="text-slate mb-6">Illustrative rates — actual payouts depend on your client and city.</p>

      <div className="flex flex-col gap-2">
        {RATE_TIERS.map((tier) => (
          <div
            key={tier.label}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3"
          >
            <span className="text-sm text-ink">{tier.label}</span>
            <span className="font-mono-tab text-teal font-medium">₹{tier.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
