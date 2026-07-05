import { motion } from 'framer-motion'

export default function RiderIllustration({ size = 88 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48" cy="48" r="48" fill="#FCEFD9" />
      {/* scooter */}
      <circle cx="32" cy="70" r="7" stroke="#1F4E4A" strokeWidth="3" fill="none" />
      <circle cx="66" cy="70" r="7" stroke="#1F4E4A" strokeWidth="3" fill="none" />
      <path d="M25 70 H40" stroke="#1F4E4A" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 70 L50 40" stroke="#1F4E4A" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 70 L66 70" stroke="#1F4E4A" strokeWidth="3" strokeLinecap="round" />
      <path d="M56 70 L58 52" stroke="#1F4E4A" strokeWidth="3" strokeLinecap="round" />
      {/* rider body */}
      <circle cx="52" cy="30" r="6" fill="#1F4E4A" />
      <path d="M52 36 L50 40 M50 40 L45 44 M50 40 L58 44" stroke="#1F4E4A" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* floating rupee coin, animated */}
      <motion.g
        initial={{ y: 0, opacity: 0.9 }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        <circle cx="72" cy="26" r="10" fill="#F2A93B" />
        <text x="72" y="31" textAnchor="middle" fontSize="12" fontWeight="700" fill="#221F1D">
          ₹
        </text>
      </motion.g>
    </svg>
  )
}
