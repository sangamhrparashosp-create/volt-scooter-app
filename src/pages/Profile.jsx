import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getUserRideHistory, refundDeposit } from '../lib/firestore.js'

export default function Profile() {
  const { user, profile, setProfile, logout } = useAuth()
  const [rides, setRides] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (user) getUserRideHistory(user.uid).then(setRides)
  }, [user])

  async function handleRefund() {
    await refundDeposit(user.uid, 0)
    setProfile({ ...profile, depositHeld: 0 })
  }

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24">
      <Header title="Profile" />
      <div className="px-5">
        <div className="bg-white border border-slate-200 rounded-card p-5 mb-4">
          <p className="font-display font-semibold text-ink">{profile?.name}</p>
          <p className="text-sm text-slate">{profile?.email}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-card p-5 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate">Deposit on file</p>
            <p className="font-mono-tab text-xl text-ink">₹{(profile?.depositHeld || 0).toLocaleString('en-IN')}</p>
          </div>
          {profile?.depositHeld > 0 && (
            <button onClick={handleRefund} className="text-teal text-sm font-medium">
              Refund
            </button>
          )}
        </div>

        <h2 className="font-display font-semibold text-ink mb-3">Ride history</h2>
        <div className="flex flex-col gap-2 mb-6">
          {rides.length === 0 && <p className="text-slate text-sm">No rides yet.</p>}
          {rides.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex justify-between text-sm">
              <span className="text-ink">Scooter {r.scooterId.slice(0, 6)}</span>
              <span className="text-slate capitalize">{r.status}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/feedback')}
          className="w-full border border-slate-200 text-ink font-medium rounded-xl py-3 mb-3 text-left px-4"
        >
          💬 Feedback & complaints
        </button>

        <button
          onClick={async () => {
            await logout()
            navigate('/login')
          }}
          className="w-full border border-slate-200 text-ink font-medium rounded-xl py-3"
        >
          Log out
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
