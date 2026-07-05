import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ScooterIllustration from '../components/ScooterIllustration.jsx'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <div className="bg-gradient-to-br from-teal to-teal-700 rounded-b-[32px] px-6 pt-14 pb-10 flex flex-col items-center text-center">
        <ScooterIllustration size={100} tone="volt" />
        <h1 className="font-display text-3xl font-semibold text-white mt-3">Volt</h1>
        <p className="text-white/70 mt-1">Monthly scooter rental, no daily hassle.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-6 mt-8 flex-1">
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-slate-200 rounded-xl px-4 py-3 focus:border-teal"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-slate-200 rounded-xl px-4 py-3 focus:border-teal"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border border-slate-200 rounded-xl px-4 py-3 focus:border-teal"
        />

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="bg-teal text-white font-medium rounded-xl py-3 mt-2 disabled:opacity-60"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
        className="text-teal text-sm mt-5 mb-10 text-center px-6"
      >
        {mode === 'signup' ? 'Already have an account? Log in' : "New here? Create an account"}
      </button>
    </div>
  )
}
