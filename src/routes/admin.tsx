import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getServerUser } from '../lib/auth'
import { Plus, Pencil, Trash2, X, Loader, Shield } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    if (!user.roles?.includes('admin')) throw redirect({ to: '/' })
    return { user }
  },
  component: AdminPage,
})

type Simulation = {
  id: number
  title: string
  category: string
  level: string
  duration: string
  description: string
}

const EMPTY_FORM = { title: '', category: 'cybersecurity', level: 'beginner', duration: '1h', description: '' }

function AdminPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editSim, setEditSim] = useState<Simulation | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const fetchSims = async () => {
    const res = await fetch('/api/simulations')
    if (res.ok) setSimulations(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchSims() }, [])

  const openCreate = () => {
    setEditSim(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  const openEdit = (sim: Simulation) => {
    setEditSim(sim)
    setForm({ title: sim.title, category: sim.category, level: sim.level, duration: sim.duration, description: sim.description })
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const url = editSim ? `/api/simulations/${editSim.id}` : '/api/simulations'
    const method = editSim ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      await fetchSims()
      setShowForm(false)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Failed to save. Please try again.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this simulation? Enrollments will also be removed.')) return
    setDeletingId(id)
    await fetch(`/api/simulations/${id}`, { method: 'DELETE' })
    setSimulations(prev => prev.filter(s => s.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-violet-400" />
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-wider">Admin Panel</span>
          </div>
          <h1 className="text-3xl font-black text-white">Manage Simulations</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Simulation
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {simulations.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p>No simulations yet. Click "Add Simulation" to create the first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="text-left px-6 py-4 font-semibold">Title</th>
                    <th className="text-left px-4 py-4 font-semibold">Category</th>
                    <th className="text-left px-4 py-4 font-semibold">Level</th>
                    <th className="text-left px-4 py-4 font-semibold">Duration</th>
                    <th className="text-right px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.map((sim) => (
                    <tr key={sim.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{sim.title}</td>
                      <td className="px-4 py-4 text-slate-400 capitalize">{sim.category}</td>
                      <td className="px-4 py-4 text-slate-400 capitalize">{sim.level}</td>
                      <td className="px-4 py-4 text-slate-400">{sim.duration}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(sim)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sim.id)}
                            disabled={deletingId === sim.id}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === sim.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editSim ? 'Edit Simulation' : 'Add Simulation'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Title" required>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. SQL Injection Lab" className={INPUT_CLS} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category" required>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={INPUT_CLS}>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="ai">AI</option>
                    <option value="cloud">Cloud</option>
                  </select>
                </FormField>

                <FormField label="Level" required>
                  <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className={INPUT_CLS}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Duration" required>
                <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} required placeholder="e.g. 2h 30m" className={INPUT_CLS} />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of what students will do…"
                  rows={3}
                  className={INPUT_CLS + ' resize-none'}
                />
              </FormField>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  {saving && <Loader className="w-4 h-4 animate-spin" />}
                  {editSim ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT_CLS = 'w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500 text-sm'
