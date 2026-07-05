import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { referralCodeFor, getReferralStats } from '../lib/pilot.js'

export default function Referral() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ count: 0, earned: 0 })
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const code = user ? referralCodeFor(user.uid) : ''

  useEffect(() => {
    if (user) getReferralStats(user.uid).then(setStats)
  }, [user])

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 pt-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-6">
        ← Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Refer & earn</h1>
      <p className="text-slate mb-6">Share your code. Earn ₹500 when a friend completes onboarding.</p>

      <div className="bg-teal text-white rounded-card p-6 text-center mb-4">
        <p className="text-sm text-teal-50/80 mb-2">Your referral code</p>
        <p className="font-mono-tab text-3xl font-semibold tracking-wide">{code}</p>
        <button
          onClick={handleCopy}
          className="mt-4 bg-white/15 text-white text-sm rounded-lg px-4 py-2"
        >
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-card p-4">
          <p className="text-xs text-slate">Friends referred</p>
          <p className="font-mono-tab text-2xl text-ink mt-1">{stats.count}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-card p-4">
          <p className="text-xs text-slate">Total earned</p>
          <p className="font-mono-tab text-2xl text-ink mt-1">₹{stats.earned.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}
