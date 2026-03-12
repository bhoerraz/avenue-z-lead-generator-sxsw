'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

const BRAND_GRADIENT = 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF, #39A0FF, #6034FF)'

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score: null, sections: null }),
      })
    } catch {
      // Best-effort lead capture — don't block the user on failure
    }
    router.push('/assess?email=' + encodeURIComponent(email))
  }

  return (
    <main
      className="relative min-h-screen bg-black flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse 60% 40% at 90% 100%, rgba(0,60,60,0.5) 0%, transparent 70%), #000000',
      }}
    >
      {/* Top bar */}
      <header className="px-6 pt-6 flex items-center">
        <Logo height={22} />
      </header>

      {/* Hero content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[560px] flex flex-col gap-8">
          {/* Badge */}
          <div className="flex">
            <span
              className="text-xs font-800 tracking-widest uppercase px-4 py-1.5 rounded-pill"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#8A8A8A',
                letterSpacing: '0.14em',
              }}
            >
              AEO Readiness
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
              Is Your Brand Ready for
            </h1>
            <h1
              className="text-4xl sm:text-5xl font-extrabold leading-tight"
              style={{
                background: BRAND_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI Search?
            </h1>
          </div>

          {/* Subhead */}
          <p className="text-lg leading-relaxed" style={{ color: '#8A8A8A' }}>
            Take our 2-minute, 10-section assessment and get an instant readiness
            score — plus a personalized breakdown of where your brand stands in
            the AI search era.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none transition-all"
                style={{
                  background: '#272727',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '14px 18px',
                  color: '#FFFFFF',
                  fontSize: 16,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#60FDFF'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(96,253,255,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: '#FF6060' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-extrabold text-sm tracking-widest uppercase transition-opacity"
              style={{
                background: loading
                  ? '#3a3a3a'
                  : 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF)',
                color: loading ? '#8A8A8A' : '#000000',
                border: 'none',
                borderRadius: 9999,
                padding: '14px 32px',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {loading ? 'Starting…' : 'Start Your Assessment →'}
            </button>

            <p className="text-center text-sm" style={{ color: '#8A8A8A' }}>
              Your results are instant. No spam.
            </p>
          </form>
        </div>
      </div>

      {/* Bottom gradient divider */}
      <div style={{ height: 1, background: BRAND_GRADIENT }} />
    </main>
  )
}
