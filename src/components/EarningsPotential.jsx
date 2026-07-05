import { motion } from 'framer-motion'
import RiderIllustration from './RiderIllustration.jsx'

export default function EarningsPotential() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-card p-4 flex items-center gap-4"
    >
      <RiderIllustration size={72} />
      <div>
        <p className="text-xs text-slate">Pilots typically earn</p>
        <p className="font-display text-lg font-semibold text-ink leading-tight">
          ₹25,000 – ₹75,000<span className="text-sm text-slate font-body font-normal">/month</span>
        </p>
        <p className="text-xs text-slate mt-1">Based on hours worked and deliveries completed</p>
      </div>
    </motion.div>
  )
}
