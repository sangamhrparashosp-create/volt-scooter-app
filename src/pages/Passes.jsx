import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { purchasePass, PASS_PRICE, PASS_DURATION_DAYS } from '../lib/firestore.js'
import { openCheckout } from '../lib/payments.js'

export default function Passes() {
  const { user, profile, setProfile } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleBuy() {
    if (!profile?.depositHeld) {
      navigate('/deposit')
      return
    }
    setBusy(true)
    setError('')
    try {
      const result = await openCheckout({ amount: PASS_PRICE, label: 'pass' })
      if (!result.success) throw new Error('Payment failed')
      const passId = await purchasePass(user.uid, result.reference)
      setProfile({ ...profile, activePassId: passId })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 px-6 pt-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">Monthly pass</h1>
      <p className="text-slate mb-8">Unlimited rides on any Volt scooter for {PASS_DURATION_DAYS} days.</p>

      <div className="bg-teal text-white rounded-card p-6 mb-6">
        <p className="text-sm text-teal-50/80 mb-1">Monthly pass</p>
        <p className="font-mono-tab text-4xl font-medium">₹{PASS_PRICE.toLocaleString('en-IN')}</p>
        <ul className="text-sm text-teal-50/90 mt-4 flex flex-col gap-1">
          <li>• Unlimited unlocks for {PASS_DURATION_DAYS} days</li>
          <li>• No per-ride charges</li>
          <li>• Cancel anytime, deposit stays refundable</li>
        </ul>
      </div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      <button
        onClick={handleBuy}
        disabled={busy}
        className="w-full bg-ink text-white font-medium rounded-xl py-3 disabled:opacity-60"
      >
        {busy ? 'Processing payment…' : `Buy pass — ₹${PASS_PRICE.toLocaleString('en-IN')}`}
      </button>

      <BottomNav />
    </div>
  )
}
