import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { payDeposit, DEPOSIT_AMOUNT } from '../lib/firestore.js'
import { openCheckout } from '../lib/payments.js'

export default function Deposit() {
  const { user, setProfile, profile } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handlePay() {
    setBusy(true)
    setError('')
    try {
      const result = await openCheckout({ amount: DEPOSIT_AMOUNT, label: 'deposit' })
      if (!result.success) throw new Error('Payment failed')
      await payDeposit(user.uid, result.reference)
      setProfile({ ...profile, depositHeld: DEPOSIT_AMOUNT })
      navigate('/passes')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col px-6 pt-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-8 self-start">
        ← Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink mb-2">Refundable deposit</h1>
      <p className="text-slate mb-8">
        Held against damage or unpaid fees. Refunded in full when you end your rental, minus any
        outstanding charges.
      </p>

      <div className="bg-white border border-slate-200 rounded-card p-6 mb-6">
        <p className="text-sm text-slate mb-1">Amount due today</p>
        <p className="font-mono-tab text-4xl font-medium text-ink">₹{DEPOSIT_AMOUNT.toLocaleString('en-IN')}</p>
      </div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      <button
        onClick={handlePay}
        disabled={busy}
        className="bg-teal text-white font-medium rounded-xl py-3 disabled:opacity-60"
      >
        {busy ? 'Processing payment…' : `Pay ₹${DEPOSIT_AMOUNT.toLocaleString('en-IN')}`}
      </button>
      <p className="text-xs text-slate text-center mt-3">
        Test mode — no real payment is charged.
      </p>
    </div>
  )
}
