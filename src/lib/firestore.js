import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../firebase.js'

// ---- Config: business rules kept in one place so they're easy to tune ----
export const PASS_PRICE = 1499 // ₹ per month
export const DEPOSIT_AMOUNT = 2000 // ₹ refundable security deposit
export const PASS_DURATION_DAYS = 30

// ---------------------------------------------------------------------
// SCOOTERS
// ---------------------------------------------------------------------
export async function listAvailableScooters() {
  const q = query(collection(db, 'scooters'), where('status', '==', 'available'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getScooter(scooterId) {
  const snap = await getDoc(doc(db, 'scooters', scooterId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ---------------------------------------------------------------------
// DEPOSIT
// One deposit per user is held at a time. Refund logic subtracts any
// open damage/late-fee charges before returning the balance.
// ---------------------------------------------------------------------
export async function payDeposit(userId, paymentRef) {
  const userRef = doc(db, 'users', userId)
  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef)
    if (!userSnap.exists()) throw new Error('User not found')
    if (userSnap.data().depositHeld > 0) throw new Error('Deposit already held')

    tx.update(userRef, { depositHeld: DEPOSIT_AMOUNT })
    const paymentDoc = doc(collection(db, 'payments'))
    tx.set(paymentDoc, {
      userId,
      type: 'deposit',
      amount: DEPOSIT_AMOUNT,
      status: 'success',
      gatewayRef: paymentRef,
      createdAt: serverTimestamp(),
    })
  })
}

export async function refundDeposit(userId, deductions = 0) {
  const userRef = doc(db, 'users', userId)
  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef)
    const held = userSnap.data().depositHeld || 0
    const refundAmount = Math.max(held - deductions, 0)
    tx.update(userRef, { depositHeld: 0 })
    const paymentDoc = doc(collection(db, 'payments'))
    tx.set(paymentDoc, {
      userId,
      type: 'deposit_refund',
      amount: refundAmount,
      deductions,
      status: 'success',
      createdAt: serverTimestamp(),
    })
  })
}

// ---------------------------------------------------------------------
// MONTHLY PASS
// A pass can only be purchased once a deposit is on file.
// ---------------------------------------------------------------------
export async function purchasePass(userId, paymentRef) {
  const userRef = doc(db, 'users', userId)
  const passRef = doc(collection(db, 'passes'))
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setDate(expiresAt.getDate() + PASS_DURATION_DAYS)

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef)
    if (!userSnap.exists()) throw new Error('User not found')
    if (!userSnap.data().depositHeld) {
      throw new Error('Deposit required before purchasing a pass')
    }

    tx.set(passRef, {
      userId,
      status: 'active',
      startedAt: serverTimestamp(),
      expiresAt,
      price: PASS_PRICE,
    })
    tx.update(userRef, { activePassId: passRef.id })

    const paymentDoc = doc(collection(db, 'payments'))
    tx.set(paymentDoc, {
      userId,
      type: 'pass_purchase',
      amount: PASS_PRICE,
      status: 'success',
      gatewayRef: paymentRef,
      createdAt: serverTimestamp(),
    })
  })

  return passRef.id
}

export async function getActivePass(passId) {
  if (!passId) return null
  const snap = await getDoc(doc(db, 'passes', passId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ---------------------------------------------------------------------
// RIDES
// ---------------------------------------------------------------------
export async function startRide(userId, scooterId) {
  const scooterRef = doc(db, 'scooters', scooterId)
  const rideRef = doc(collection(db, 'rides'))

  await runTransaction(db, async (tx) => {
    const scooterSnap = await tx.get(scooterRef)
    if (!scooterSnap.exists() || scooterSnap.data().status !== 'available') {
      throw new Error('Scooter is not available')
    }
    tx.update(scooterRef, { status: 'in_use' })
    tx.set(rideRef, {
      userId,
      scooterId,
      status: 'active',
      startedAt: serverTimestamp(),
      endedAt: null,
    })
  })

  return rideRef.id
}

export async function endRide(rideId, scooterId) {
  const scooterRef = doc(db, 'scooters', scooterId)
  const rideRef = doc(db, 'rides', rideId)

  await runTransaction(db, async (tx) => {
    tx.update(scooterRef, { status: 'available' })
    tx.update(rideRef, { status: 'completed', endedAt: serverTimestamp() })
  })
}

export async function getUserRideHistory(userId) {
  const q = query(
    collection(db, 'rides'),
    where('userId', '==', userId),
    orderBy('startedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ---------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------
export async function addScooter(scooter) {
  return addDoc(collection(db, 'scooters'), {
    ...scooter,
    status: 'available',
    createdAt: serverTimestamp(),
  })
}

export async function listAllUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function setScooterStatus(scooterId, status) {
  return updateDoc(doc(db, 'scooters', scooterId), { status })
}
