import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { HELP_CATEGORIES, submitHelpRequest } from '../lib/pilot.js'

async function getMyRequests(userId) {
  const q = query(collection(db, 'helpRequests'), where('userId', '==', userId))
  const snap = await getDocs(q)
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  // Sorted client-side to avoid requiring a Firestore composite index.
  return docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
}

const ALL_CATEGORIES = [...HELP_CATEGORIES, 'General feedback']

export default function Feedback() {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState(ALL_CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [justSent, setJustSent] = useState(false)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      getMyRequests(user.uid)
        .then(setHistory)
        .catch((err) => {
          console.error('Failed to load feedback history', err)
          setHistory([])
        })
        .finally(() => setLoadingHistory(false))
    }
  }, [user, justSent])

  async function handleSubmit(e) {
    e.preventDefault()
    const withRating = rating ? `${message} (Rating: ${rating}/5)` : message
    await submitHelpRequest(user.uid, category, withRating)
    setMessage('')
    setRating(0)
    setJustSent((v) => !v) // trigger history refresh
  }

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 pt-10 pb-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-6">
        ← Back
      </button>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Feedback & complaints</h1>
      <p className="text-slate mb-6">Facing an issue, or just want to tell us something? We're listening.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-ink mb-2">Rate your experience</p>
          <div className="flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={n <= rating ? 'text-volt' : 'text-slate-200'}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
        >
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="Tell us what happened…"
          className="border border-slate-200 rounded-xl px-4 py-3 text-sm"
        />

        <button type="submit" className="bg-teal text-white font-medium rounded-xl py-3">
          Submit
        </button>
      </form>

      <h2 className="font-display font-semibold text-ink mb-3">Your past requests</h2>
      <div className="flex flex-col gap-2">
        {loadingHistory && <p className="text-slate text-sm">Loading…</p>}
        {!loadingHistory && history.length === 0 && (
          <p className="text-slate text-sm">No requests yet — anything you submit will show up here.</p>
        )}
        {history.map((h) => (
          <div key={h.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-ink">{h.category}</span>
              <span className="text-slate capitalize">{h.status}</span>
            </div>
            <p className="text-xs text-slate mt-1">{h.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
