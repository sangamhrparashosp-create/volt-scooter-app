import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import ScooterCard from '../components/ScooterCard.jsx'
import ChargeRing from '../components/ChargeRing.jsx'
import ScooterIllustration from '../components/ScooterIllustration.jsx'
import EarningsPotential from '../components/EarningsPotential.jsx'
import ScooterMap from '../components/ScooterMap.jsx'
import NextStepCard from '../components/NextStepCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { listAvailableScooters, getActivePass, PASS_DURATION_DAYS } from '../lib/firestore.js'
import { getOnboarding, onboardingComplete } from '../lib/pilot.js'

export default function Home() {
  const { user, profile } = useAuth()
  const [scooters, setScooters] = useState([])
  const [pass, setPass] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [pilotReady, setPilotReady] = useState(true)
  const [view, setView] = useState('list')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const list = await listAvailableScooters()
        if (cancelled) return
        setScooters(list)
        if (profile?.activePassId) {
          const p = await getActivePass(profile.activePassId)
          if (!cancelled) setPass(p)
        }
        if (user) {
          const onboarding = await getOnboarding(user.uid)
          if (!cancelled) setPilotReady(onboardingComplete(onboarding))
        }
      } catch (err) {
        console.error('Failed to load scooters', err)
        if (!cancelled) setLoadError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [profile, user])

  const daysLeft = pass?.expiresAt
    ? Math.max(0, Math.ceil((pass.expiresAt.toDate?.() ?? new Date(pass.expiresAt) - new Date()) / 86400000))
    : 0
  const passPercent = pass ? Math.round((daysLeft / PASS_DURATION_DAYS) * 100) : 0

  return (
    <div className="max-w-md mx-auto pb-24 min-h-screen">
      <div className="bg-gradient-to-br from-teal to-teal-700 rounded-b-[32px] pb-6">
        <Header
          title={`Hey, ${profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'}`}
          className="text-white"
          action={<span className="text-volt text-2xl">⚡</span>}
        />
        <div className="px-5">
          <NextStepCard pilotReady={pilotReady} depositHeld={!!profile?.depositHeld} hasPass={!!pass} />

          {!pilotReady && (
            <div className="mb-3">
              <EarningsPotential />
            </div>
          )}

          {profile?.depositHeld && pass && (
            <div className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-card p-4 flex items-center gap-4">
              <ChargeRing percent={passPercent} label={daysLeft} sublabel="days left" tone="volt" />
              <div>
                <p className="font-display font-semibold text-white">Pass active</p>
                <p className="text-sm text-white/70">Ride any Volt scooter, no extra charge.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-ink">Scooters nearby</h2>
          <div className="flex bg-slate-200/50 rounded-full p-1 text-xs font-medium">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-full transition-colors ${view === 'list' ? 'bg-white text-ink shadow-sm' : 'text-slate'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 py-1 rounded-full transition-colors ${view === 'map' ? 'bg-white text-ink shadow-sm' : 'text-slate'}`}
            >
              Map
            </button>
          </div>
        </div>

        {view === 'map' && !loading && !loadError && (
          <div className="mb-4">
            <ScooterMap scooters={scooters} />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-200/60 rounded-card animate-pulse" />
            ))}
          </div>
        ) : loadError ? (
          <div className="text-center py-10">
            <p className="text-rust text-sm">Couldn't load scooters. Check your connection and try again.</p>
          </div>
        ) : scooters.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10 bg-white border border-dashed border-slate-200 rounded-card">
            <ScooterIllustration size={80} />
            <p className="font-display font-semibold text-ink mt-3">No scooters here yet</p>
            <p className="text-sm text-slate mt-1 max-w-[240px]">
              Once scooters are added nearby, they'll show up here ready to unlock.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {scooters.map((s, i) => (
              <div key={s.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <ScooterCard scooter={s} />
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
