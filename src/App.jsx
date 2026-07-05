import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Deposit from './pages/Deposit.jsx'
import Passes from './pages/Passes.jsx'
import ScooterDetail from './pages/ScooterDetail.jsx'
import ActiveRide from './pages/ActiveRide.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Earnings from './pages/Earnings.jsx'
import RateCard from './pages/RateCard.jsx'
import ChargingPoints from './pages/ChargingPoints.jsx'
import Referral from './pages/Referral.jsx'
import Help from './pages/Help.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6 text-slate">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
      <Route path="/passes" element={<PrivateRoute><Passes /></PrivateRoute>} />
      <Route path="/scooter/:id" element={<PrivateRoute><ScooterDetail /></PrivateRoute>} />
      <Route path="/ride/:id" element={<PrivateRoute><ActiveRide /></PrivateRoute>} />
      <Route path="/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
      <Route path="/rate-card" element={<PrivateRoute><RateCard /></PrivateRoute>} />
      <Route path="/charging-points" element={<PrivateRoute><ChargingPoints /></PrivateRoute>} />
      <Route path="/referral" element={<PrivateRoute><Referral /></PrivateRoute>} />
      <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
    </Routes>
  )
}
