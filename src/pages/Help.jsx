import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { HELP_CATEGORIES, submitHelpRequest } from '../lib/pilot.js'

export default function Help() {
  const { user } = useAuth()
  const [category, setCategory] = useState(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    await submitHelpRequest(user.uid, category, message)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-4xl mb-3">✓</p>
        <h1 className="font-display text-xl font-semibold text-ink mb-2">Request sent</h1>
        <p className="text-slate mb-6">Our support team will get back to you shortly.</p>
        <button onClick={() => navigate(-1)} className="text-teal font-medium">
          ← Back
        </button>
      </div>
    )
  }

  if (category) {
    return (
      <div className="max-w-md mx-auto min-h-screen px-6 pt-10">
        <button onClick={() => setCategory(null)} className="text-slate text-sm mb-6">
          ← Back
        </button>
        <h1 className="font-display text-xl font-semibold text-ink mb-1">{category}</h1>
        <p className="text-slate mb-6">Describe what's going on, and we'll follow up.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="Tell us more…"
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm"
          />
          <button type="submit" className="bg-teal text-white font-medium rounded-xl py-3">
            Send request
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 pt-10">
      <button onClick={() => navigate(-1)} className="text-slate text-sm mb-6">
        ← Back
      </button>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Need assistance?</h1>
      <div className="flex flex-col gap-2">
        {HELP_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-left"
          >
            <span className="text-sm text-ink">{c}</span>
            <span className="text-slate">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
