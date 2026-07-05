import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Vite doesn't resolve Leaflet's default marker image paths correctly,
// so we rebuild the default icon manually using CDN-hosted images.
const scooterIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const userIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#1F4E4A;border:3px solid white;box-shadow:0 0 0 2px #1F4E4A;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Default center: Bengaluru — used only if the user's location isn't available.
const DEFAULT_CENTER = [12.9716, 77.5946]

function RecenterOnUser({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, 14)
  }, [position, map])
  return null
}

export default function ScooterMap({ scooters }) {
  const [userPosition, setUserPosition] = useState(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setLocationDenied(true),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  const validScooters = scooters.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number')

  return (
    <div className="rounded-card overflow-hidden border border-slate-200" style={{ height: 320 }}>
      <MapContainer center={userPosition || DEFAULT_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPosition && (
          <>
            <Marker position={userPosition} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            <RecenterOnUser position={userPosition} />
          </>
        )}
        {validScooters.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={scooterIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-gray-500 mb-2">{s.location}</p>
                <button
                  onClick={() => navigate(`/scooter/${s.id}`)}
                  className="text-teal underline text-xs"
                >
                  View & unlock →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {locationDenied && (
        <p className="text-xs text-slate px-3 py-2 bg-white">
          Turn on location access to see scooters relative to you.
        </p>
      )}
    </div>
  )
}
