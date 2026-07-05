import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { endRide } from '../lib/firestore.js'

export default function ActiveRide() {
  const { id } = useParams()
  const location = useLocation()
  const scooterId = location.state?.scooterId
  const [elapsed, setElapsed] = useState(0)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])

  async function handleEnd() {
    setBusy(true)
    try {
      await endRide(id, scooterId)
      navigate('/')
    } finally {
      setBusy(false)
    }
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center px-6 bg-ink text-white">
      <p className="text-white/60 mb-2">Ride in progress</p>
      <p className="font-mono-tab text-6xl font-medium mb-10">
        {mins}:{secs}
      </p>
      <button
        onClick={handleEnd}
        disabled={busy}
        className="w-full bg-rust text-white font-medium rounded-xl py-3 disabled:opacity-60"
      >
        {busy ? 'Ending ride…' : 'End ride'}
      </button>
    </div>
  )
}
