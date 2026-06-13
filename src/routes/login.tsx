import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { login, signup, AuthError } from '@netlify/identity'
import { useIdentity } from '../lib/identity-context'
import { useState, useEffect } from 'react'
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type Mode = 'login' | 'signup'

function LoginPage() {
  const { user, ready } = useIdentity()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (ready && user) navigate({ to: '/dashboard' })
  }, [ready, user, navigate])

  if (!ready) return <LoadingScreen />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
        navigate({ to: '/dashboard' })
      } else {
        const newUser = await signup(email, password, { full_name: name })
        if (newUser.emailVerified) {
          navigate({ to: '/dashboard' })
        } else {
          setSuccessMsg(`Confirmation email sent to ${email}. Click the link to activate your account.`)
        }
      }
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.status) {
          case 401: setError('Invalid email or password.'); break
          case 403: setError('Signups are not allowed on this site.'); break
          case 422: setError('Invalid input. Check your email and password format.'); break
          default: setError(err.message || 'An error occurred.')
        }
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 font-bold text-2xl mb-2">
            <Zap className="w-7 h-7" />
            Blixora Labs
          </Link>
          <p className="text-slate-400 text-sm mt-2">Simulate. Solve. Succeed.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-800 p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-cyan-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'signup' ? 'bg-cyan-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          {successMsg && (
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-4 mb-6 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {successMsg}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ada Lovelace"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-xl transition-all text-sm"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          By signing up you agree to our{' '}
          <span className="text-slate-400 cursor-pointer hover:text-white">Terms of Service</span>
        </p>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  )
}
