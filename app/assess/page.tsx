'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { sections } from '@/lib/questions'
import ProgressBar from '@/components/ProgressBar'
import SectionCard from '@/components/SectionCard'
import Logo from '@/components/Logo'

const BRAND_GRADIENT = 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF, #39A0FF, #6034FF)'

function AssessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [skippedSections, setSkippedSections] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  const section = sections[currentSection]
  const isLast = currentSection === sections.length - 1
  const isFirst = currentSection === 0

  function handleAnswer(key: string, value: number) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function handleBack() {
    if (!isFirst) setCurrentSection((s) => s - 1)
  }

  function advanceOrFinish() {
    if (isLast) {
      void submitResults()
    } else {
      setCurrentSection((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleSkip() {
    setSkippedSections((prev) => new Set(prev).add(currentSection))
    advanceOrFinish()
  }

  function sectionScore(sIdx: number): number {
    if (skippedSections.has(sIdx)) return 0
    const sec = sections[sIdx]
    return sec.questions.reduce((sum, _, qIdx) => {
      return sum + (answers[`s${sIdx}_q${qIdx}`] ?? 0)
    }, 0)
  }

  async function submitResults() {
    setSubmitting(true)
    const sectionScores = sections.map((_, i) => sectionScore(i))
    const totalScore = sectionScores.reduce((a, b) => a + b, 0)

    const params = new URLSearchParams({ email, total: totalScore.toString() })
    sectionScores.forEach((s, i) => params.set(`s${i + 1}`, s.toString()))
    const resultsUrl = `${window.location.origin}/results?${params.toString()}`

    try {
      await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score: totalScore, sections: sectionScores, resultsUrl }),
      })
    } catch {
      // Best-effort — don't block results
    }

    if (typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'assessment_completed', {
        total_score: totalScore,
        score_pct: Math.round((totalScore / 156) * 100),
      })
    }

    router.push('/results?' + params.toString())
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
      >
        <Logo height={20} />
        <div className="flex-1">
          <ProgressBar current={currentSection + 1} total={sections.length} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[680px] flex flex-col gap-6">
          <SectionCard
            section={section}
            sectionIndex={currentSection}
            answers={answers}
            onChange={handleAnswer}
          />

          {/* Skip link (section 9 only) */}
          {section.skipLabel && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm underline underline-offset-4 transition-colors"
                style={{ color: '#8A8A8A' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8A8A')}
              >
                {section.skipLabel}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={isFirst}
              style={{
                background: isFirst ? 'rgba(58,58,58,0.4)' : '#3a3a3a',
                color: isFirst ? '#555' : '#FFFFFF',
                border: 'none',
                borderRadius: 9999,
                padding: '12px 24px',
                cursor: isFirst ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={advanceOrFinish}
              disabled={submitting}
              style={{
                background: submitting ? '#3a3a3a' : BRAND_GRADIENT,
                color: submitting ? '#8A8A8A' : '#000000',
                border: 'none',
                borderRadius: 9999,
                padding: '14px 32px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {submitting ? 'Calculating…' : isLast ? 'Get My Score →' : 'Next Section →'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: BRAND_GRADIENT }} />
    </div>
  )
}

export default function AssessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <span style={{ color: '#8A8A8A' }}>Loading…</span>
        </div>
      }
    >
      <AssessContent />
    </Suspense>
  )
}
