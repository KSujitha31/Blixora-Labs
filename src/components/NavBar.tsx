import { Link, useNavigate } from '@tanstack/react-router'
import { useIdentity } from '../lib/identity-context'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export function NavBar() {
  const { user, ready, logout } = useIdentity()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const isAdmin = user?.roles?.includes('admin')

  return (
    <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-cyan-400 hover:text-cyan-300 transition-colors">
            <Zap className="w-6 h-6" />
            Blixora Labs
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium [&.active]:text-cyan-400">Home</Link>
            <Link to="/simulations" className="text-slate-300 hover:text-white transition-colors text-sm font-medium [&.active]:text-cyan-400">Simulations</Link>
            {user && <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium [&.active]:text-cyan-400">Dashboard</Link>}
            {isAdmin && <Link to="/admin" className="text-slate-300 hover:text-white transition-colors text-sm font-medium [&.active]:text-cyan-400">Admin</Link>}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!ready ? null : user ? (
              <>
                <span className="text-sm text-slate-400">{user.name || user.email}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Home</Link>
          <Link to="/simulations" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Simulations</Link>
          {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Dashboard</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Admin</Link>}
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left text-slate-300 hover:text-white py-2 text-sm font-medium">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block text-cyan-400 hover:text-cyan-300 py-2 text-sm font-medium">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
