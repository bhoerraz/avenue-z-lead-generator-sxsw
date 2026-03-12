'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { sections } from '@/lib/questions'
import {
  TOTAL_MAX,
  getMaturityLevel,
  getSectionBenchmark,
  getSectionStatus,
} from '@/lib/scoring'
import Logo from '@/components/Logo'

const BRAND_GRADIENT = 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF, #39A0FF, #6034FF)'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  let total: number
  let sectionScores: number[]

  try {
    const rawTotal = searchParams.get('total')
    if (!rawTotal) throw new Error('missing total')
    total = parseInt(rawTotal, 10)
    if (isNaN(total)) throw new Error('invalid total')

    sectionScores = sections.map((_, i) => {
      const v = parseInt(searchParams.get(`s${i + 1}`) ?? '', 10)
      return isNaN(v) ? 0 : v
    })
  } catch {
    router.replace('/')
    return null
  }

  const email = searchParams.get('email') ?? ''
  const maturity = getMaturityLevel(total)
  const pct = Math.round((total / TOTAL_MAX) * 100)

  // Animated bar
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(pct), 80)
    return () => clearTimeout(t)
  }, [pct])

  // Lowest 2 sections
  const ranked = sections
    .map((sec, i) => ({ sec, i, score: sectionScores[i], benchmark: getSectionBenchmark(sec.id) }))
    .sort((a, b) => a.score - b.score)
  const priorities = ranked.slice(0, 2)

  const ctaUrl = process.env.NEXT_PUBLIC_AUDIT_CTA_URL ?? 'mailto:hello@avenuez.com'
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => fallbackCopy(url))
    } else {
      fallbackCopy(url)
    }
  }

  function fallbackCopy(url: string) {
    const el = document.createElement('textarea')
    el.value = url
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 flex items-center gap-4">
        <Logo height={22} />
        <p className="text-xs uppercase tracking-widest" style={{ color: '#8A8A8A' }}>
          Your AEO Readiness Report
        </p>
      </header>

      <main className="flex-1 px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-[700px] flex flex-col gap-8">

          {/* Score hero */}
          <div className="text-center flex flex-col items-center gap-4">
            <div aria-label={`Score: ${total} out of ${TOTAL_MAX}`}>
              <span
                className="text-7xl sm:text-8xl font-black"
                style={{
                  background: BRAND_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {total}
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold" style={{ color: '#8A8A8A' }}>
                {' '}/ {TOTAL_MAX}
              </span>
            </div>

            {/* Maturity badge */}
            <div
              className="inline-flex items-center px-5 py-2 text-sm font-extrabold uppercase tracking-widest rounded-pill"
              style={{
                background: 'transparent',
                border: '1.5px solid transparent',
                backgroundImage: `linear-gradient(#000, #000), ${BRAND_GRADIENT}`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <span
                style={{
                  background: BRAND_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {maturity.label}
              </span>
            </div>

            <p className="text-base max-w-sm" style={{ color: '#8A8A8A' }}>
              {maturity.description}
            </p>
            <p className="text-xs uppercase tracking-widest" style={{ color: '#555' }}>
              {maturity.percentile}
            </p>
          </div>

          {/* Animated progress bar */}
          <div>
            <div
              className="w-full rounded-pill overflow-hidden"
              style={{ height: 6, background: '#272727' }}
            >
              <div
                className="h-full rounded-pill"
                style={{
                  width: `${barWidth}%`,
                  background: BRAND_GRADIENT,
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: '#555' }}>0</span>
              <span className="text-xs font-bold" style={{ color: '#8A8A8A' }}>
                {pct}% readiness
              </span>
              <span className="text-xs" style={{ color: '#555' }}>{TOTAL_MAX}</span>
            </div>
          </div>

          {/* Section breakdown */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#272727',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-extrabold text-base text-white">Section Breakdown</h2>
            </div>

            {/* Table header */}
            <div
              className="hidden sm:grid grid-cols-4 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest"
              style={{
                color: '#555',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span className="col-span-2">Section</span>
              <span className="text-center">Your Score</span>
              <span className="text-center">Status</span>
            </div>

            {sections.map((sec, i) => {
              const score = sectionScores[i]
              const benchmark = getSectionBenchmark(sec.id)
              const status = getSectionStatus(score, benchmark)
              const statusColor =
                status === 'above' ? '#60FF80' : status === 'close' ? '#FFFC60' : '#FF6060'
              const statusLabel =
                status === 'above' ? 'On track' : status === 'close' ? 'Close' : 'Below'

              return (
                <div
                  key={sec.id}
                  className="px-6 py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  {/* Mobile layout: stacked */}
                  <div className="flex flex-col gap-2 sm:hidden">
                    <p className="text-sm font-bold text-white leading-snug">{sec.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#8A8A8A' }}>
                        Score: <strong className="text-white">{score}/{sec.maxScore}</strong>
                        {' · '}Benchmark: <strong className="text-white">{benchmark}</strong>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                        <span style={{ color: statusColor }}>{statusLabel}</span>
                      </span>
                    </div>
                  </div>

                  {/* Desktop layout: 4-column grid */}
                  <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-white leading-snug">{sec.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#8A8A8A' }}>
                        Benchmark: {benchmark} / {sec.maxScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-extrabold text-white">
                        {score}<span style={{ color: '#555' }}>/{sec.maxScore}</span>
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                        <span style={{ color: statusColor }}>{statusLabel}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Priority focus areas */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: '#1a1a1a',
              borderLeft: '3px solid #FFFC60',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeftColor: '#FFFC60',
            }}
          >
            <h2 className="font-extrabold text-base text-white">Priority Focus Areas</h2>
            <p className="text-sm" style={{ color: '#8A8A8A' }}>
              These two sections have the most room for improvement relative to benchmarks.
            </p>
            {priorities.map(({ sec, score, benchmark }) => (
              <div
                key={sec.id}
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,252,96,0.04)', border: '1px solid rgba(255,252,96,0.1)' }}
              >
                <p className="font-extrabold text-sm text-white mb-1">{sec.title}</p>
                <p className="text-xs" style={{ color: '#8A8A8A' }}>
                  You scored <strong className="text-white">{score}/{sec.maxScore}</strong> against a
                  benchmark of <strong className="text-white">{benchmark}</strong>.{' '}
                  {sec.description}
                </p>
              </div>
            ))}
          </div>

          {/* Thank you block */}
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4"
            style={{
              background: '#272727',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'rgba(96,255,128,0.1)', border: '1px solid rgba(96,255,128,0.2)' }}
            >
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-white">Thanks for taking the assessment!</h2>
            <p className="text-base max-w-md" style={{ color: '#8A8A8A' }}>
              We&apos;ve emailed you a link to your results. The Avenue Z team will be in touch
              to walk you through your score and how to improve your AI search presence.
            </p>
            <button
              type="button"
              onClick={handleShare}
              className="font-bold text-sm transition-colors"
              style={{
                background: copied ? '#1a1a1a' : '#3a3a3a',
                color: copied ? '#60FF80' : '#FFFFFF',
                border: copied ? '1px solid rgba(96,255,128,0.3)' : '1px solid transparent',
                borderRadius: 9999,
                padding: '12px 24px',
                cursor: 'pointer',
              }}
            >
              {copied ? '✓ Link Copied!' : 'Share My Score'}
            </button>
          </div>

          {/* Footer */}
          <footer className="text-center pb-8">
            <p className="text-sm" style={{ color: '#555' }}>
              © Avenue Z · avenuez.com
            </p>
          </footer>
        </div>
      </main>

      <div style={{ height: 1, background: BRAND_GRADIENT }} />
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <span style={{ color: '#8A8A8A' }}>Loading your results…</span>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
