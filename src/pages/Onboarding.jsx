import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ScooterIllustration from '../components/ScooterIllustration.jsx'
import EarningsPotential from '../components/EarningsPotential.jsx'
import {
  ONBOARDING_STEPS,
  MOCK_TEAM_LEADS,
  MOCK_CLIENTS,
  getOnboarding,
  saveOnboardingStep,
  onboardingComplete,
} from '../lib/pilot.js'

function StatusBadge({ status }) {
  if (status === 'done') {
    return <span className="text-xs font-medium text-teal bg-teal-50 px-2 py-1 rounded-full">Done</span>
  }
  if (status === 'submitted') {
    return <span className="text-xs font-medium text-rust bg-rust/10 px-2 py-1 rounded-full">Pending review</span>
  }
  return <span className="text-xs font-medium text-slate bg-slate-200/60 px-2 py-1 rounded-full">Start now</span>
}

export default function Onboarding() {
  const { user, profile } = useAuth()
  const [onboarding, setOnboarding] = useState({})
  const [openStep, setOpenStep] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) getOnboarding(user.uid).then((data) => {
      setOnboarding(data)
      setLoading(false)
    })
  }, [user])

  function statusFor(step) {
    return onboarding?.[step.key]?.status
  }

  async function handleFormSubmit(step, formData) {
    const status = step.kind === 'document' ? 'submitted' : 'done'
    await saveOnboardingStep(user.uid, step.key, { ...formData, status })
    setOnboarding((prev) => ({ ...prev, [step.key]: { ...formData, status } }))
    setOpenStep(null)
  }

  const complete = onboardingComplete(onboarding)

  return (
    <div className="max-w-md mx-auto min-h-screen pb-10">
      <div className="bg-gradient-to-br from-teal to-teal-700 px-6 pt-12 pb-8 rounded-b-[32px] text-center">
        <ScooterIllustration size={72} tone="volt" />
        <h1 className="font-display text-2xl font-semibold text-white mt-3">Become a Volt Pilot</h1>
        <p className="text-white/70 mt-1">Complete these steps to start earning.</p>
      </div>

      <div className="px-5 mt-4">
        <EarningsPotential />
      </div>

      <div className="px-5 mt-6 flex flex-col gap-2">
        {loading ? (
          <p className="text-slate text-sm text-center py-6">Loading your progress…</p>
        ) : (
          ONBOARDING_STEPS.map((step) => {
            const status = statusFor(step)
            const isOpen = openStep === step.key
            return (
              <div key={step.key} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    if (step.key === 'scooterToken') {
                      navigate('/deposit')
                      return
                    }
                    setOpenStep(isOpen ? null : step.key)
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="font-medium text-ink text-sm">{step.label}</span>
                  <StatusBadge status={status} />
                </button>

                {isOpen && step.kind === 'form' && step.key === 'personalInfo' && (
                  <PersonalInfoForm onSubmit={(data) => handleFormSubmit(step, data)} />
                )}
                {isOpen && step.kind === 'form' && step.key === 'bankDetails' && (
                  <BankDetailsForm onSubmit={(data) => handleFormSubmit(step, data)} />
                )}
                {isOpen && step.kind === 'document' && (
                  <DocumentForm label={step.label} onSubmit={(data) => handleFormSubmit(step, data)} />
                )}
                {isOpen && step.key === 'selectTL' && (
                  <ChoiceForm options={MOCK_TEAM_LEADS} onSubmit={(data) => handleFormSubmit(step, data)} />
                )}
                {isOpen && step.key === 'selectClient' && (
                  <ChoiceForm options={MOCK_CLIENTS} onSubmit={(data) => handleFormSubmit(step, data)} />
                )}
              </div>
            )
          })
        )}
      </div>

      {complete && (
        <div className="px-5 mt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-teal text-white font-medium rounded-xl py-3"
          >
            Go to dashboard
          </button>
        </div>
      )}
    </div>
  )
}

function PersonalInfoForm({ onSubmit }) {
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ phone, address })
      }}
      className="px-4 pb-4 flex flex-col gap-2 border-t border-slate-100 pt-3"
    >
      <input
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <button type="submit" className="bg-teal text-white text-sm rounded-lg py-2 mt-1">
        Save
      </button>
    </form>
  )
}

function BankDetailsForm({ onSubmit }) {
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ accountNumber, ifsc })
      }}
      className="px-4 pb-4 flex flex-col gap-2 border-t border-slate-100 pt-3"
    >
      <input
        placeholder="Account number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <input
        placeholder="IFSC code"
        value={ifsc}
        onChange={(e) => setIfsc(e.target.value)}
        required
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <button type="submit" className="bg-teal text-white text-sm rounded-lg py-2 mt-1">
        Save
      </button>
    </form>
  )
}

function DocumentForm({ label, onSubmit }) {
  const [number, setNumber] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ number })
      }}
      className="px-4 pb-4 flex flex-col gap-2 border-t border-slate-100 pt-3"
    >
      <input
        placeholder={`${label} number`}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        required
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <p className="text-xs text-slate">
        This submits your document number for review. Real ID verification isn't wired up yet — see the README.
      </p>
      <button type="submit" className="bg-teal text-white text-sm rounded-lg py-2 mt-1">
        Submit for review
      </button>
    </form>
  )
}

function ChoiceForm({ options, onSubmit }) {
  const [selected, setSelected] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const chosen = options.find((o) => o.id === selected)
        onSubmit({ id: selected, name: chosen?.name })
      }}
      className="px-4 pb-4 flex flex-col gap-2 border-t border-slate-100 pt-3"
    >
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        required
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Choose an option
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-teal text-white text-sm rounded-lg py-2 mt-1">
        Confirm
      </button>
    </form>
  )
}
