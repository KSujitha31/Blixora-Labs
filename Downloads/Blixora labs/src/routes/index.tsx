import { createFileRoute, Link } from '@tanstack/react-router'
import { Shield, Brain, Cloud, ChevronRight, Zap, Users, Award } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

const features = [
  {
    icon: Shield,
    title: 'Cybersecurity Puzzles',
    description: 'Crack codes, find vulnerabilities, and defend systems against simulated attacks.',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  {
    icon: Brain,
    title: 'AI Mini Projects',
    description: 'Build intelligent models and explore machine learning concepts hands-on.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  {
    icon: Cloud,
    title: 'Cloud Deployments',
    description: 'Deploy real infrastructure, configure services, and master cloud platforms.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
]

const stats = [
  { icon: Zap, label: 'Active Simulations', value: '50+' },
  { icon: Users, label: 'Students Enrolled', value: '1,200+' },
  { icon: Award, label: 'Completions', value: '3,500+' },
]

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-slate-950 to-violet-900/20 pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            Now open for enrollment
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Blixora Labs
          </h1>

          <p className="text-xl md:text-2xl text-cyan-400 font-semibold mb-4 tracking-wide">
            Simulate. Solve. Succeed.
          </p>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Blixora Labs is a futuristic digital R&D lab offering interactive learning simulations for tech students and early-career developers. Master cybersecurity, AI, and cloud through real challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/simulations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 text-lg"
            >
              Explore Simulations
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700 hover:border-slate-600 text-lg"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">What You'll Simulate</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Three challenge categories designed to give you real-world experience from day one.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-600 transition-all group">
                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-slate-700 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to start your simulation?</h2>
          <p className="text-slate-400 text-lg mb-8">Join thousands of developers who are leveling up with Blixora Labs.</p>
          <Link
            to="/simulations"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 text-lg"
          >
            Browse Simulations
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-400">
            <Zap className="w-4 h-4 text-cyan-400" />
            Blixora Labs
          </div>
          <div>Hours: Mon–Fri, 11:00 AM – 8:00 PM</div>
          <div>support@blixoralabs.dev</div>
          <div>© 2026 Blixora Labs. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
