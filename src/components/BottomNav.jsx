import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/earnings', label: 'Earn', icon: '₹' },
  { to: '/passes', label: 'Pass', icon: '◎' },
  { to: '/profile', label: 'Profile', icon: '☺' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around py-2 pb-safe max-w-md mx-auto">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium ${
              isActive ? 'text-teal' : 'text-slate'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
