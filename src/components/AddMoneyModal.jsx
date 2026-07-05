import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { openCheckout } from '../lib/payments.js'
import { topUpWallet } from '../lib/firestore.js'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

const METHODS = [
  { id: 'upi', label: 'UPI', hint: 'Google Pay, PhonePe, Paytm & more', icon: '📱' },
  { id: 'card', label: 'Credit / Debit card', hint: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'netbanking', label: 'Net banking', hint: 'All major banks', icon: '🏦' },
  { id: 'wallet', label: 'Other wallets', hint: 'Amazon Pay, Mobikwik & more', icon: '👛' },
]

export default function AddMoneyModal({ userId, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState(1000)
  const [method, setMethod] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    if (!method || amount <= 0) return
    setBusy(true)
    setError('')
    try {
      const result = await openCheckout({ amount, label: `wallet_${method}` })
      if (!result.success) throw new Error('Payment failed')
      await topUpWallet(userId, amount, method, result.reference)
      onSuccess(amount)
      onClose()
      setMethod(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface w-full max-w-md rounded-t-[28px] p-6 max-h-[85vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Add money to wallet</h2>

            <div className="flex gap-2 mb-4 flex-wrap">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`px-4 py-2 rounded-full text-sm font-mono-tab border transition-colors ${
                    amount === a ? 'bg-teal text-white border-teal' : 'border-slate-200 text-ink'
                  }`}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-5 font-mono-tab"
            />

            <p className="text-sm font-medium text-ink mb-2">Choose payment method</p>
            <div className="flex flex-col gap-2 mb-5">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-colors ${
                    method === m.id ? 'border-teal bg-teal-50' : 'border-slate-200'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{m.label}</p>
                    <p className="text-xs text-slate">{m.hint}</p>
                  </div>
                  {method === m.id && <span className="text-teal font-medium">✓</span>}
                </button>
              ))}
            </div>

            {error && <p className="text-rust text-sm mb-3">{error}</p>}

            <button
              onClick={handlePay}
              disabled={!method || busy || amount <= 0}
              className="w-full bg-teal text-white font-medium rounded-xl py-3 disabled:opacity-50"
            >
              {busy ? 'Processing…' : `Add ₹${amount}`}
            </button>
            <p className="text-xs text-slate text-center mt-3">Test mode — no real payment is charged.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
