import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase.js'

// ---------------------------------------------------------------------
// ONBOARDING / KYC
//
// Real Aadhaar/PAN/Driving Licence verification requires a paid KYC
// vendor (DigiLocker, Karza, IDfy) tied to a registered business.
// This stores documents as "submitted" (pending manual/vendor review)
// rather than falsely marking them "verified" — wire a real vendor's
// webhook into markDocumentVerified() once you have one.
// ---------------------------------------------------------------------

export const ONBOARDING_STEPS = [
  { key: 'personalInfo', label: 'Personal information', kind: 'form' },
  { key: 'aadhaar', label: 'Aadhaar card', kind: 'document' },
  { key: 'pan', label: 'PAN card', kind: 'document' },
  { key: 'bankDetails', label: 'Bank details', kind: 'form' },
  { key: 'drivingLicence', label: 'Driving licence', kind: 'document' },
  { key: 'selectTL', label: 'Select your TL', kind: 'choice' },
  { key: 'selectClient', label: 'Client selection', kind: 'choice' },
  { key: 'scooterToken', label: 'Book scooter token', kind: 'linked' },
]

// Mock hub leads / clients — replace with a real 'teamLeads' / 'clients'
// Firestore collection once you have actual operations data.
export const MOCK_TEAM_LEADS = [
  { id: 'tl1', name: 'Rohit Sharma — Whitefield Hub' },
  { id: 'tl2', name: 'Anjali Verma — Koramangala Hub' },
  { id: 'tl3', name: 'Imran Khan — HSR Layout Hub' },
]

export const MOCK_CLIENTS = [
  { id: 'c1', name: 'QuickCommerce Deliveries' },
  { id: 'c2', name: 'FoodExpress Partner' },
  { id: 'c3', name: 'Parcel Logistics Co.' },
]

export async function getOnboarding(userId) {
  const snap = await getDoc(doc(db, 'users', userId))
  return snap.exists() ? snap.data().onboarding || {} : {}
}

export async function saveOnboardingStep(userId, stepKey, data) {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    [`onboarding.${stepKey}`]: {
      ...data,
      submittedAt: serverTimestamp(),
    },
  })
}

export function onboardingComplete(onboarding) {
  return ONBOARDING_STEPS.every((step) => onboarding?.[step.key]?.status)
}

// ---------------------------------------------------------------------
// EARNINGS & WALLET
// ---------------------------------------------------------------------
export async function getEarningsSummary(userId) {
  const q = query(collection(db, 'earnings'), where('userId', '==', userId))
  const snap = await getDocs(q)
  const entries = snap.docs.map((d) => d.data())

  const now = new Date()
  const cycleStart = new Date(now)
  cycleStart.setDate(now.getDate() - now.getDay()) // rough weekly cycle

  const currentEarning = entries
    .filter((e) => e.date?.toDate?.() >= cycleStart)
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  const totalEarning = entries.reduce((sum, e) => sum + (e.amount || 0), 0)

  return { currentEarning, totalEarning, entryCount: entries.length }
}

export async function addEarningEntry(userId, amount, note) {
  return addDoc(collection(db, 'earnings'), {
    userId,
    amount,
    note,
    date: serverTimestamp(),
  })
}

export async function getLastPayout(userId) {
  const q = query(
    collection(db, 'payouts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ---------------------------------------------------------------------
// CHARGING POINTS — mock list; swap for a real 'chargingPoints' collection
// once you have actual station locations.
// ---------------------------------------------------------------------
export const MOCK_CHARGING_POINTS = [
  { id: 'cp1', name: 'Volt Hub — Whitefield', distanceKm: 1.2, slotsFree: 4 },
  { id: 'cp2', name: 'Volt Hub — Marathahalli', distanceKm: 3.5, slotsFree: 1 },
  { id: 'cp3', name: 'Volt Hub — Indiranagar', distanceKm: 5.8, slotsFree: 6 },
]

// ---------------------------------------------------------------------
// REFERRALS
// ---------------------------------------------------------------------
export function referralCodeFor(userId) {
  return `VOLT${userId.slice(0, 6).toUpperCase()}`
}

export async function getReferralStats(userId) {
  const q = query(collection(db, 'referrals'), where('referrerId', '==', userId))
  const snap = await getDocs(q)
  const count = snap.size
  const earned = snap.docs.reduce((sum, d) => sum + (d.data().rewardAmount || 0), 0)
  return { count, earned }
}

// ---------------------------------------------------------------------
// HELP / SUPPORT
// ---------------------------------------------------------------------
export const HELP_CATEGORIES = [
  'Scooter issue',
  'Earnings / payout issue',
  'Client issue',
  'TL issue',
  'Insurance issue',
  'App issue',
]

export async function submitHelpRequest(userId, category, message) {
  return addDoc(collection(db, 'helpRequests'), {
    userId,
    category,
    message,
    status: 'open',
    createdAt: serverTimestamp(),
  })
}
