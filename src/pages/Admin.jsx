import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import { addScooter, listAllUsers, listAvailableScooters, setScooterStatus } from '../lib/firestore.js'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [scooters, setScooters] = useState([])
  const [form, setForm] = useState({ name: '', location: '', battery: 100 })

  async function refresh() {
    setUsers(await listAllUsers())
    setScooters(await listAvailableScooters())
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAddScooter(e) {
    e.preventDefault()
    await addScooter({ name: form.name, location: form.location, battery: Number(form.battery) })
    setForm({ name: '', location: '', battery: 100 })
    refresh()
  }

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-6 pb-24">
      <Header title="Admin" />

      <section className="mb-10">
        <h2 className="font-display font-semibold text-ink mb-3">Add scooter</h2>
        <form onSubmit={handleAddScooter} className="flex flex-wrap gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border border-slate-200 rounded-xl px-4 py-2 flex-1 min-w-[150px]"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="border border-slate-200 rounded-xl px-4 py-2 flex-1 min-w-[150px]"
          />
          <input
            type="number"
            placeholder="Battery %"
            value={form.battery}
            onChange={(e) => setForm({ ...form, battery: e.target.value })}
            className="border border-slate-200 rounded-xl px-4 py-2 w-32"
          />
          <button type="submit" className="bg-teal text-white rounded-xl px-5 py-2">
            Add
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="font-display font-semibold text-ink mb-3">Scooters ({scooters.length})</h2>
        <div className="flex flex-col gap-2">
          {scooters.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
              <span>{s.name} · {s.location} · {s.battery}%</span>
              <button
                onClick={async () => {
                  await setScooterStatus(s.id, 'maintenance')
                  refresh()
                }}
                className="text-rust text-sm"
              >
                Mark maintenance
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-ink mb-3">Users ({users.length})</h2>
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm">
              <span>{u.name} · {u.email}</span>
              <span className="font-mono-tab text-slate">
                deposit ₹{u.depositHeld || 0} · pass {u.activePassId ? 'active' : 'none'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
