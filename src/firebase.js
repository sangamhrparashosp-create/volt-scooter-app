import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBZGSBE6JbC0GlYTtSEeLVzrCXPG9MQIL4',
  authDomain: 'volt-scooter-app.firebaseapp.com',
  projectId: 'volt-scooter-app',
  storageBucket: 'volt-scooter-app.firebasestorage.app',
  messagingSenderId: '800715143348',
  appId: '1:800715143348:web:5fe653364c277ea04a7fe1',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app