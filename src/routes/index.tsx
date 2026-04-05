import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Sun,
  Battery,
  Phone,
  Mail,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Zap,
  Leaf,
  Sparkles,
  Loader2,
  AlertCircle,
  MessageSquare,
  Send,
  Cpu,
  Brain,
  FileText,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: DNRTechnicsPage,
})

// ── helpers ──────────────────────────────────────────────────────────────────

async function callGeminiAPI(
  prompt: string,
  type: string,
): Promise<{ result?: string; error?: string }> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, type }),
  })
  return res.json() as Promise<{ result?: string; error?: string }>
}

// ── types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ── sub-components ────────────────────────────────────────────────────────────

function Navbar({ onChatOpen }: { onChatOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-green-500/10 border-b border-zinc-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Sun className="w-7 h-7 text-green-500" strokeWidth={2.5} />
              <span className="text-white font-black italic text-xl uppercase tracking-tight">
                DNR <span className="text-green-500">TECHNICS</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'SIMULATOR', id: 'simulator' },
                { label: 'AUTO-PILOT', id: 'auto-pilot' },
                { label: 'DIENSTEN', id: 'diensten' },
                { label: 'CONTACT', id: 'contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-zinc-300 hover:text-green-400 font-bold italic text-sm uppercase tracking-widest transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="tel:0474605779"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black italic uppercase text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                0474/605779
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu openen"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/98 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sun className="w-7 h-7 text-green-500" />
              <span className="text-white font-black italic text-xl uppercase">
                DNR <span className="text-green-500">TECHNICS</span>
              </span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {[
              { label: 'SIMULATOR', id: 'simulator' },
              { label: 'AUTO-PILOT', id: 'auto-pilot' },
              { label: 'DIENSTEN', id: 'diensten' },
              { label: 'CONTACT', id: 'contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-white hover:text-green-400 font-black italic text-3xl uppercase tracking-widest transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="tel:0474605779"
              className="flex items-center gap-2 bg-green-500 text-black font-black italic uppercase text-xl px-8 py-4 rounded-xl mt-4"
              onClick={() => setMenuOpen(false)}
            >
              <Phone className="w-6 h-6" />
              0474/605779
            </a>
            <button
              onClick={() => { setMenuOpen(false); onChatOpen() }}
              className="flex items-center gap-2 border border-green-500 text-green-400 font-black italic uppercase text-lg px-6 py-3 rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
              AI ADVIES
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function HeroSection({ onChatOpen }: { onChatOpen: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-12 bg-green-500" />
          <span className="text-green-400 font-bold italic uppercase text-sm tracking-widest">
            HASSELT — HOUTHALEN — BELGÏE
          </span>
          <div className="h-px w-12 bg-green-500" />
        </div>

        <h1 className="font-black italic uppercase text-white leading-none mb-6">
          <span
            className="block text-5xl sm:text-7xl lg:text-9xl"
            style={{ textShadow: '0 0 80px rgba(34,197,94,0.3)' }}
          >
            U BENT
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-9xl text-green-500">
            DE ZON
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-9xl text-white">
            WIJ DE MOTOR
          </span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mt-8 mb-12 leading-relaxed">
          Wij transformeren woningen in Hasselt en Houthalen naar{' '}
          <span className="text-green-400 font-bold">autonome energiemachines</span>{' '}
          — zonnepanelen en thuisbatterijen die voor u werken, dag en nacht.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black italic uppercase text-base px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
          >
            START PROJECT
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onChatOpen}
            className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-400 hover:bg-green-500/10 font-black italic uppercase text-base px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            AI ADVIES
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto">
          {[
            { value: '15+', label: 'JAAR ERVARING' },
            { value: '500+', label: 'INSTALLATIES' },
            { value: '100%', label: 'BELGISCH' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black italic text-green-500">{s.value}</div>
              <div className="text-xs text-zinc-500 font-bold italic uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-green-500" />
      </div>
    </section>
  )
}

function SimulatorSection() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult('')
    const data = await callGeminiAPI(input, 'simulator')
    setLoading(false)
    if (data.error) setError(data.error)
    else setResult(data.result ?? '')
  }

  return (
    <section id="simulator" className="py-24 bg-[#050505] relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-7 h-7 text-green-500" />
          <span className="text-green-400 font-bold italic uppercase text-sm tracking-widest">
            AI-POWERED
          </span>
        </div>
        <h2 className="font-black italic uppercase text-white text-4xl sm:text-5xl lg:text-6xl mb-4">
          ENERGIE<span className="text-green-500">SIMULATOR</span>
        </h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-2xl">
          Beschrijf uw woning en energieverbruik. Onze AI berekent de ideale zonneoplossing voor u.
        </p>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <label className="block text-zinc-300 font-bold italic uppercase text-sm tracking-wider mb-3">
            BESCHRIJF UW SITUATIE
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bijv: Ik heb een vrijstaande woning van 200m², 4 personen, gasverwarming, elektrische auto, gemiddeld verbruik van 5000 kWh per jaar. Het dak is op het zuiden gericht..."
            rows={5}
            className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-green-500 resize-none transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black italic uppercase px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            {loading ? 'ANALYSEREN...' : 'ANALYSEER MIJN SITUATIE'}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-zinc-900/80 border border-green-500/30 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-green-400 font-bold italic uppercase text-sm tracking-wider">
                UW PERSOONLIJK ADVIES
              </span>
            </div>
            <div className="text-zinc-200 leading-relaxed whitespace-pre-line">{result}</div>
          </div>
        )}
      </div>
    </section>
  )
}

function AutoPilotSection() {
  const [input, setInput] = useState('')
  const [schedule, setSchedule] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setSchedule([])
    setSummary('')

    const data = await callGeminiAPI(input, 'autopilot')
    setLoading(false)
    if (data.error) {
      setError(data.error)
      return
    }

    const text = data.result ?? ''
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    // Last line or lines without time prefix = summary
    const timeLines: string[] = []
    const otherLines: string[] = []
    lines.forEach((l) => {
      if (/^\d{1,2}:\d{2}/.test(l) || /^\d{1,2}[hH]\d{2}/.test(l)) {
        timeLines.push(l)
      } else {
        otherLines.push(l)
      }
    })
    setSchedule(timeLines.length > 0 ? timeLines : lines.slice(0, -1))
    setSummary(otherLines.join(' ') || lines[lines.length - 1] || '')
  }

  return (
    <section id="auto-pilot" className="py-24 bg-zinc-950/50 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-7 h-7 text-green-500" />
          <span className="text-green-400 font-bold italic uppercase text-sm tracking-widest">
            SMART PLANNING
          </span>
        </div>
        <h2 className="font-black italic uppercase text-white text-4xl sm:text-5xl lg:text-6xl mb-4">
          SMART ROUTINE<span className="text-green-500"> ARCHITECT</span>
        </h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-2xl">
          Beschrijf uw dagelijkse routine. Onze AI optimaliseert uw energieverbruik en minimaliseert uw netstroom.
        </p>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <label className="block text-zinc-300 font-bold italic uppercase text-sm tracking-wider mb-3">
            UW DAGELIJKSE ROUTINE
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bijv: Ik sta op om 7u, douche, maak ontbijt. Ik werk thuis van 9u tot 18u. 's Avonds kook ik om 18u30 elektrisch en laad mijn elektrische auto 's nachts op..."
            rows={5}
            className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-green-500 resize-none transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black italic uppercase px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
            {loading ? 'SCHEMA GENEREREN...' : 'GENEREER MIJN SCHEMA'}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {(schedule.length > 0 || summary) && (
          <div className="mt-6 bg-zinc-900/80 border border-green-500/30 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="text-green-400 font-bold italic uppercase text-sm tracking-wider">
                UW GEOPTIMALISEERD ENERGIESCHEMA
              </span>
            </div>
            {schedule.length > 0 && (
              <ul className="space-y-3 mb-6">
                {schedule.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    <span className="text-zinc-200">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {summary && (
              <div className="border-t border-zinc-700/50 pt-4 text-zinc-400 leading-relaxed">
                {summary}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function JargonBanner() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult('')
    const data = await callGeminiAPI(input, 'jargon')
    setLoading(false)
    if (data.error) setError(data.error)
    else setResult(data.result ?? '')
  }

  return (
    <section className="bg-green-500 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          className="w-full h-full"
        />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-black" />
          <span className="text-black font-black italic uppercase text-sm tracking-widest">
            JARGON CRACKER
          </span>
        </div>
        <h2 className="font-black italic uppercase text-black text-3xl sm:text-4xl mb-2">
          TECHNISCHE TERMEN? WIJ LEGGEN HET UIT.
        </h2>
        <p className="text-black/70 mb-6 font-bold">
          Plak technische begrippen hieronder — wij vertalen ze naar gewoon Nederlands.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Bijv: AC/DC-omvormer, Peak Shaving, Net Metering, SoC, MPPT..."
            className="flex-1 bg-black/10 border-2 border-black/20 rounded-xl px-4 py-3 text-black placeholder-black/50 focus:outline-none focus:border-black font-bold"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 bg-black hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 font-black italic uppercase px-6 py-3 rounded-xl transition-all hover:scale-105 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'VERTALEN...' : 'UITLEGGEN'}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-900 bg-red-100/50 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-black/10 rounded-xl p-5 text-black leading-relaxed whitespace-pre-line font-medium">
            {result}
          </div>
        )}
      </div>
    </section>
  )
}

function ServicesSection() {
  const services = [
    {
      icon: Sun,
      title: 'SOLAR ENGINEERING',
      desc: 'Van dakanalyse tot perfecte oriëntatie — wij ontwerpen het optimale zonnepaneelsysteem voor uw woning. Volledig op maat, maximale opbrengst.',
      points: [
        'Professionele dakanalyse',
        'Optimale paneelopstelling',
        '25 jaar productgarantie',
        'Volledige installatie & ingebruikname',
      ],
    },
    {
      icon: Battery,
      title: 'POWER STORAGE',
      desc: 'Sla uw zonne-energie op voor de avond en nacht. Onze thuisbatterijen maken u onafhankelijk van het net en beschermen u tegen stijgende energieprijzen.',
      points: [
        'Slimme energieopslag',
        'Nacht- & weekendautonomie',
        'Bescherming bij stroomonderbreking',
        'Integratie met slimme meter',
      ],
    },
  ]

  return (
    <section id="diensten" className="py-24 bg-[#050505] relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-green-500" />
            <span className="text-green-400 font-bold italic uppercase text-sm tracking-widest">
              WAT WIJ DOEN
            </span>
            <div className="h-px w-12 bg-green-500" />
          </div>
          <h2 className="font-black italic uppercase text-white text-4xl sm:text-5xl lg:text-6xl">
            ONZE <span className="text-green-500">DIENSTEN</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 rounded-2xl p-8 transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-green-500/5 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-green-500/10 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <service.icon className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-black italic uppercase text-white text-2xl mb-4">
                {service.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed mb-6">{service.desc}</p>
              <ul className="space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-zinc-300">
                    <Leaf className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm font-bold italic uppercase">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ naam: '', telefoon: '', email: '', bericht: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    try {
      const res = await fetch('https://formspree.io/f/mwvwbgkk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormState('success')
        setFormData({ naam: '', telefoon: '', email: '', bericht: '' })
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  return (
    <section id="contact" className="py-24 bg-zinc-950/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-green-500" />
              <span className="text-green-400 font-bold italic uppercase text-sm tracking-widest">
                NEEM CONTACT OP
              </span>
            </div>
            <h2 className="font-black italic uppercase text-white text-4xl sm:text-5xl lg:text-6xl mb-8">
              START UW <span className="text-green-500">PROJECT</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Klaar om uw woning te transformeren naar een autonome energiemachine? Neem contact op voor een gratis offerte.
            </p>

            <div className="space-y-6">
              <a
                href="tel:0474605779"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-green-500/10 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-zinc-500 text-xs font-bold italic uppercase tracking-wider">
                    TELEFOON
                  </div>
                  <div className="text-white font-black italic text-xl group-hover:text-green-400 transition-colors">
                    0474/605779
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-zinc-500 text-xs font-bold italic uppercase tracking-wider">
                    WERKGEBIED
                  </div>
                  <div className="text-white font-bold italic">
                    Hasselt & Houthalen-Helchteren
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-zinc-500 text-xs font-bold italic uppercase tracking-wider">
                    RESPONSTIJD
                  </div>
                  <div className="text-white font-bold italic">
                    Binnen 24 uur
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-black italic uppercase text-white text-2xl mb-3">
                  BERICHT VERZONDEN!
                </h3>
                <p className="text-zinc-400">
                  We nemen binnen 24 uur contact met u op. Tot dan!
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-6 text-green-400 font-bold italic uppercase text-sm hover:text-green-300 transition-colors"
                >
                  Nieuw bericht sturen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-black italic uppercase text-white text-xl mb-6">
                  GRATIS OFFERTE AANVRAGEN
                </h3>

                {[
                  { id: 'naam', label: 'NAAM', type: 'text', placeholder: 'Jan Janssen' },
                  { id: 'telefoon', label: 'TELEFOON', type: 'tel', placeholder: '04XX/XXX XXX' },
                  { id: 'email', label: 'E-MAIL', type: 'email', placeholder: 'jan@email.be' },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-zinc-400 font-bold italic uppercase text-xs tracking-wider mb-2"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="bericht"
                    className="block text-zinc-400 font-bold italic uppercase text-xs tracking-wider mb-2"
                  >
                    BERICHT
                  </label>
                  <textarea
                    id="bericht"
                    required
                    rows={4}
                    placeholder="Vertel ons over uw woning, dakoppervlak, huidig energieverbruik..."
                    value={formData.bericht}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bericht: e.target.value }))}
                    className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-green-500 resize-none transition-colors"
                  />
                </div>

                {formState === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Er is een fout opgetreden. Probeer opnieuw of bel ons.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black italic uppercase py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30"
                >
                  {formState === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {formState === 'loading' ? 'VERZENDEN...' : 'OFFERTE AANVRAGEN'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hallo! Ik ben de AI-assistent van DNR Technics. Ik help u graag met vragen over zonnepanelen en thuisbatterijen. Heeft u interesse in een gratis offerte? Bel ons op 0474/605779 of stel uw vraag hier!',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const data = await callGeminiAPI(userMsg, 'chat')
    setLoading(false)
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: data.result ?? 'Er is een fout opgetreden.' },
    ])
  }, [input, loading])

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-500">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-black" />
              <span className="text-black font-black italic uppercase text-sm">
                DNR TECHNICS AI
              </span>
            </div>
            <button onClick={() => setOpen(false)} className="text-black/70 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-black font-bold'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-2xl px-4 py-2.5">
                  <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-zinc-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Stel uw vraag..."
              className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 flex items-center justify-center bg-green-500 hover:bg-green-400 disabled:opacity-50 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full shadow-xl shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110"
        aria-label="Chat openen"
      >
        {open ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <MessageSquare className="w-6 h-6 text-black" />
        )}
      </button>
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Sun className="w-6 h-6 text-green-500" />
          <span className="text-white font-black italic uppercase">
            DNR <span className="text-green-500">TECHNICS</span>
          </span>
        </div>
        <p className="text-zinc-600 font-bold italic uppercase text-xs tracking-widest text-center">
          EST. 2008 — POWERED BY NATURE — OPTIMIZED BY AI
        </p>
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Hasselt &amp; Houthalen, België</span>
        </div>
      </div>
    </footer>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────

function DNRTechnicsPage() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="bg-[#050505] min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      <Navbar onChatOpen={() => setChatOpen(true)} />
      <HeroSection onChatOpen={() => setChatOpen(true)} />
      <SimulatorSection />
      <AutoPilotSection />
      <JargonBanner />
      <ServicesSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  )
}
