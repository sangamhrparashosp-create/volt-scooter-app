import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import AddMoneyModal from '../components/AddMoneyModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getEarningsSummary, getLastPayout, MOCK_CHARGING_POINTS } from '../lib/pilot.js'

export default function Earnings() {
  const { user, profile, setProfile } = useAuth()
  const [summary, setSummary] = useState({ currentEarning: 0, totalEarning: 0 })
  const [payout, setPayout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addMoneyOpen, setAddMoneyOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    Promise.all([getEarningsSummary(user.uid), getLastPayout(user.uid)])
      .then(([s, p]) => {
        setSummary(s)
        setPayout(p)
      })
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="max-w-md mx-auto pb-24 min-h-screen">
      <Header title="Earnings" />

      <div className="px-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-teal text-white rounded-card p-4">
            <p className="text-xs text-teal-50/80">This week's earning</p>
            <p className="font-mono-tab text-2xl font-medium mt-1">
              ₹{loading ? '—' : summary.currentEarning.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-card p-4">
            <p className="text-xs text-slate">Wallet balance</p>
            <p className="font-mono-tab text-2xl font-medium text-ink mt-1">
              ₹{(profile?.walletBalance || 0).toLocaleString('en-IN')}
            </p>
            <button
              onClick={() => setAddMoneyOpen(true)}
              className="text-teal text-xs font-medium mt-2"
            >
              + Add money
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-card p-4">
          <p className="text-sm text-slate mb-1">Last payout</p>
          {payout ? (
            <p className="font-mono-tab text-ink">
              ₹{payout.amount?.toLocaleString('en-IN')} · {payout.status}
            </p>
          ) : (
            <p className="text-sm text-slate">No payouts yet — they'll show up here once processed.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/rate-card')}
            className="bg-white border border-slate-200 rounded-card p-4 text-left"
          >
            <span className="text-2xl">📋</span>
            <p className="text-sm font-medium text-ink mt-2">Rate card</p>
            <p className="text-xs text-slate">Per-delivery earning breakdown</p>
          </button>
          <button
            onClick={() => navigate('/charging-points')}
            className="bg-white border border-slate-200 rounded-card p-4 text-left"
          >
            <span className="text-2xl">🔌</span>
            <p className="text-sm font-medium text-ink mt-2">Charging points</p>
            <p className="text-xs text-slate">{MOCK_CHARGING_POINTS.length} nearby</p>
          </button>
        </div>

        <button
          onClick={() => navigate('/referral')}
          className="bg-volt text-ink rounded-card p-4 text-left"
        >
          <p className="font-display font-semibold">Refer & earn</p>
          <p className="text-sm text-ink/70 mt-1">Invite another pilot, earn ₹500 when they complete onboarding →</p>
        </button>

        <button
          onClick={() => navigate('/help')}
          className="text-slate text-sm text-center mt-2"
        >
          Need help with a payout? Contact support →
        </button>
      </div>

      <BottomNav />

      <AddMoneyModal
        userId={user?.uid}
        isOpen={addMoneyOpen}
        onClose={() => setAddMoneyOpen(false)}
        onSuccess={(amount) =>
          setProfile((prev) => ({ ...prev, walletBalance: (prev?.walletBalance || 0) + amount }))
        }
      />
    </div>
  )
}
