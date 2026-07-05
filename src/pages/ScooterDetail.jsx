import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChargeRing from '../components/ChargeRing.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getScooter, startRide } from '../lib/firestore.js'

export default function ScooterDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [scooter, setScooter] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getScooter(id).then(setScooter)
  }, [id])

  async function handleUnlock() {
    if (!profile?.activePassId) {
      navigate('/passes')
      return
    }
    setBusy(true)
    setError('')
    try {
      const rideId = await startRide(profile.uid, id)
      navigate(`/ride/${rideId}`, { state: { scooterId: id } })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!scooter) return <div className="p-6 text-slate">Loading…</div>

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 pt-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-8">
        ← Back
      </button>

      <div className="flex items-center gap-4 mb-6">
        <ChargeRing percent={scooter.battery ?? 80} label={`${scooter.battery ?? 80}%`} sublabel="charge" tone="volt" size={96} />
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{scooter.name}</h1>
          <p className="text-slate">{scooter.location}</p>
        </div>
      </div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      <button
        onClick={handleUnlock}
        disabled={busy}
        className="w-full bg-volt text-ink font-semibold rounded-xl py-3 disabled:opacity-60"
      >
        {busy ? 'Unlocking…' : 'Unlock scooter'}
      </button>
      <p className="text-xs text-slate text-center mt-3">
        Simulated unlock — hardware/IoT integration connects here.
      </p>
    </div>
  )
}
