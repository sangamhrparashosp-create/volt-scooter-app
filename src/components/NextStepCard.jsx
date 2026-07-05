import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Returns exactly one next action — never more than one — so the person
// always knows the single next thing to do instead of scanning several banners.
function getNextStep({ pilotReady, depositHeld, hasPass }) {
  if (!pilotReady) {
    return {
      stepNumber: 1,
      total: 4,
      title: 'Complete your pilot onboarding',
      subtitle: 'Fill in your KYC details to unlock earning',
      cta: 'Continue onboarding',
      route: '/onboarding',
    }
  }
  if (!depositHeld) {
    return {
      stepNumber: 2,
      total: 4,
      title: 'Pay your refundable deposit',
      subtitle: 'One-time, fully refundable when you stop renting',
      cta: 'Pay deposit',
      route: '/deposit',
    }
  }
  if (!hasPass) {
    return {
      stepNumber: 3,
      total: 4,
      title: 'Buy your monthly pass',
      subtitle: 'Unlocks unlimited rides for 30 days',
      cta: 'Buy pass',
      route: '/passes',
    }
  }
  return {
    stepNumber: 4,
    total: 4,
    title: "You're all set!",
    subtitle: 'Pick a scooter below and unlock it to start riding',
    cta: null,
    route: null,
  }
}

export default function NextStepCard({ pilotReady, depositHeld, hasPass }) {
  const navigate = useNavigate()
  const step = getNextStep({ pilotReady, depositHeld, hasPass })
  const isDone = step.stepNumber === 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card p-4 mb-3 ${isDone ? 'bg-teal-50 border border-teal/20' : 'bg-white/10 backdrop-blur border border-white/20'}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${
              n <= step.stepNumber ? (isDone ? 'bg-teal' : 'bg-volt') : isDone ? 'bg-teal/15' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium mb-1 ${isDone ? 'text-teal' : 'text-white/70'}`}>
        {isDone ? 'All steps complete' : `Step ${step.stepNumber} of ${step.total}`}
      </p>
      <p className={`font-display font-semibold ${isDone ? 'text-ink' : 'text-white'}`}>{step.title}</p>
      <p className={`text-sm mt-1 ${isDone ? 'text-slate' : 'text-white/80'}`}>{step.subtitle}</p>
      {step.cta && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(step.route)}
          className={`mt-3 w-full rounded-xl py-2.5 font-medium text-sm ${
            isDone ? 'bg-teal text-white' : 'bg-volt text-ink'
          }`}
        >
          {step.cta} →
        </motion.button>
      )}
    </motion.div>
  )
}
