// Mock payment layer.
//
// This simulates a gateway checkout (success after a short delay) so the
// whole deposit -> pass -> ride flow is testable with zero setup.
//
// To go live with real money, replace `openCheckout` below with a real
// Razorpay/Stripe checkout call. Razorpay in India requires a registered
// business + KYC before it can accept real payments, so keep this mock
// in place until that's done. The rest of the app only depends on
// `openCheckout` returning { success, reference }.

export function openCheckout({ amount, label }) {
  return new Promise((resolve) => {
    // Simulates network + user entering card/UPI details
    setTimeout(() => {
      resolve({
        success: true,
        reference: `MOCK_${label.toUpperCase()}_${Date.now()}`,
        amount,
      })
    }, 1200)
  })
}
