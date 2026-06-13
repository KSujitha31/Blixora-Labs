import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getServerUser } from '../lib/auth'
import { useIdentity } from '../lib/identity-context'
import { Clock, CheckCircle2, PlayCircle, BookOpen, Loader, LogOut, User } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
  component: DashboardPage,
})

type Enrollment = {
  id: number
  simulationId: number
  status: string
  enrolledAt: string
  simulation: {
    id: number
    title: string
    category: string
    level: string
    duration: string
    description: string
  }
}

const STATUS_CONFIG = {
  enrolled: { label: 'Enrolled', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30' },
  in_progress: { label: 'In Progress', icon: PlayCircle, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
}

function DashboardPage() {
  const { user, logout } = useIdentity()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/enrollments')
      .then(r => r.json())
      .then(data => {
        setEnrollments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const updateStatus = async (enrollmentId: number, status: string) => {
    setUpdatingId(enrollmentId)
    const res = await fetch(`/api/enrollments/${enrollmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setEnrollments(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: updated.status } : e))
    }
    setUpdatingId(null)
  }

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter(e => e.status === 'in_progress').length,
    completed: enrollments.filter(e => e.status === 'completed').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors text-sm font-medium self-start"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard icon={BookOpen} label="Enrolled" value={stats.total} color="text-cyan-400" />
        <StatCard icon={PlayCircle} label="In Progress" value={stats.inProgress} color="text-amber-400" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="text-emerald-400" />
      </div>

      {/* Enrollments */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5">My Simulations</h2>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 font-medium">No simulations enrolled yet.</p>
            <a href="/simulations" className="inline-block mt-4 text-sm text-cyan-400 hover:text-cyan-300 font-medium">
              Browse Simulations →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => {
              const cfg = STATUS_CONFIG[enrollment.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.enrolled
              const StatusIcon = cfg.icon

              return (
                <div key={enrollment.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{enrollment.simulation.category}</span>
                        <span className="text-slate-700">•</span>
                        <span className="text-xs text-slate-500 capitalize">{enrollment.simulation.level}</span>
                      </div>
                      <h3 className="text-base font-bold text-white truncate">{enrollment.simulation.title}</h3>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {enrollment.simulation.duration}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>

                      {/* Status update controls */}
                      <div className="flex gap-2">
                        {enrollment.status === 'enrolled' && (
                          <button
                            onClick={() => updateStatus(enrollment.id, 'in_progress')}
                            disabled={updatingId === enrollment.id}
                            className="text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updatingId === enrollment.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Start'}
                          </button>
                        )}
                        {enrollment.status === 'in_progress' && (
                          <button
                            onClick={() => updateStatus(enrollment.id, 'completed')}
                            disabled={updatingId === enrollment.id}
                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updatingId === enrollment.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Complete'}
                          </button>
                        )}
                        {enrollment.status === 'completed' && (
                          <span className="text-xs text-slate-500">✓ Done</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}
