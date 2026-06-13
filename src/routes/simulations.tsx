import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Filter, Clock, BarChart2, Tag, ChevronRight, Loader } from 'lucide-react'
import { useIdentity } from '../lib/identity-context'

export const Route = createFileRoute('/simulations')({
  component: SimulationsPage,
})

type Simulation = {
  id: number
  title: string
  category: string
  level: string
  duration: string
  description: string
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
}

const CATEGORY_ICONS: Record<string, string> = {
  cybersecurity: '🛡️',
  ai: '🧠',
  cloud: '☁️',
}

function SimCard({ sim, onEnroll, enrolled, enrolling }: {
  sim: Simulation
  onEnroll: (id: number) => void
  enrolled: boolean
  enrolling: boolean
}) {
  const { user } = useIdentity()

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all group flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CATEGORY_ICONS[sim.category] || '💡'}</span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{sim.category}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${LEVEL_COLORS[sim.level] || 'text-slate-400 bg-slate-400/10 border-slate-400/30'}`}>
          {sim.level}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{sim.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">{sim.description || 'Explore this simulation and build real skills.'}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Clock className="w-3.5 h-3.5" />
          {sim.duration}
        </div>

        {!user ? (
          <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
            Sign in to enroll <ChevronRight className="w-4 h-4" />
          </Link>
        ) : enrolled ? (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-full">
            ✓ Enrolled
          </span>
        ) : (
          <button
            onClick={() => onEnroll(sim.id)}
            disabled={enrolling}
            className="text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {enrolling ? <Loader className="w-4 h-4 animate-spin" /> : null}
            Enroll
          </button>
        )}
      </div>
    </div>
  )
}

function SimulationsPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set())
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useIdentity()

  const fetchSims = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (level) params.set('level', level)
    const res = await fetch(`/api/simulations?${params}`)
    if (res.ok) setSimulations(await res.json())
    setLoading(false)
  }

  const fetchEnrollments = async () => {
    if (!user) return
    const res = await fetch('/api/enrollments')
    if (res.ok) {
      const data = await res.json()
      setEnrolledIds(new Set(data.map((e: any) => e.simulationId)))
    }
  }

  useEffect(() => { fetchSims() }, [search, level])
  useEffect(() => { fetchEnrollments() }, [user])

  const handleEnroll = async (id: number) => {
    setEnrollingId(id)
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulationId: id }),
    })
    if (res.ok || res.status === 409) {
      setEnrolledIds(prev => new Set([...prev, id]))
    }
    setEnrollingId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">Simulations</h1>
        <p className="text-slate-400 text-lg">Browse and enroll in hands-on learning simulations.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search simulations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 placeholder-slate-500 text-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-8 py-3 focus:outline-none focus:border-cyan-500 text-sm appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : simulations.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No simulations found.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim) => (
            <SimCard
              key={sim.id}
              sim={sim}
              onEnroll={handleEnroll}
              enrolled={enrolledIds.has(sim.id)}
              enrolling={enrollingId === sim.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
