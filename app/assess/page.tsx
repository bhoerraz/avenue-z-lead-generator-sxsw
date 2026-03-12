'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { sections } from '@/lib/questions'
import Logo from '@/components/Logo'

const BRAND_GRADIENT = 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF, #39A0FF, #6034FF)'

function AssessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)

  function handleAnswer(key: string, value: number) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function sectionScore(sIdx: number): number {
    const sec = sections[sIdx]
    return sec.questions.reduce((sum, _, qIdx) => {
      return sum + (answers[`s${sIdx}_q${qIdx}`] ?? 0)
    }, 0)
  }

  async function handleSubmit() {
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

  // Count answered questions for progress
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0)
  const answeredCount = Object.keys(answers).length
  const progressPct = Math.round((answeredCount / totalQuestions) * 100)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex flex-col gap-2"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-between">
          <Logo height={20} />
          <span style={{ color: '#8A8A8A', fontSize: 13 }}>
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: '#272727', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: BRAND_GRADIENT,
              borderRadius: 9999,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 pt-8 pb-4 flex justify-center">
        <div className="w-full max-w-[680px]">
          <p style={{ color: '#8A8A8A', fontSize: 14 }}>
            Answer each question honestly based on where your brand stands today.
          </p>
        </div>
      </div>

      {/* All sections */}
      <div className="flex-1 flex flex-col items-center px-4 pb-8 gap-8">
        {sections.map((section, sIdx) => (
          <div
            key={section.id}
            className="w-full max-w-[680px]"
            style={{
              background: '#111',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Section header */}
            <div
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#8A8A8A',
                  }}
                >
                  {String(sIdx + 1).padStart(2, '0')}
                </span>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              <p style={{ fontSize: 13, color: '#8A8A8A', margin: 0 }}>{section.description}</p>
            </div>

            {/* Questions */}
            <div style={{ padding: '8px 0' }}>
              {section.questions.map((question, qIdx) => {
                const key = `s${sIdx}_q${qIdx}`
                const val = answers[key]
                const isYes = val === 3
                const isNo = val === 0

                return (
                  <div
                    key={question.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '14px 24px',
                      borderBottom:
                        qIdx < section.questions.length - 1
                          ? '1px solid rgba(255,255,255,0.04)'
                          : 'none',
                    }}
                  >
                    <p
                      style={{
                        flex: 1,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: val !== undefined ? '#FFFFFF' : '#C0C0C0',
                        margin: 0,
                        transition: 'color 0.15s',
                      }}
                    >
                      {question.text}
                    </p>

                    {/* Yes / No toggle */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleAnswer(key, 3)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 9999,
                          border: isYes ? 'none' : '1px solid rgba(255,255,255,0.15)',
                          background: isYes ? BRAND_GRADIENT : 'transparent',
                          color: isYes ? '#000' : '#8A8A8A',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          minWidth: 52,
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnswer(key, 0)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 9999,
                          border: isNo ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
                          background: isNo ? '#272727' : 'transparent',
                          color: isNo ? '#FFFFFF' : '#8A8A8A',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          minWidth: 52,
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Skip option for section 9 */}
              {section.skipLabel && (
                <div style={{ padding: '12px 24px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      section.questions.forEach((_, qIdx) => {
                        handleAnswer(`s${sIdx}_q${qIdx}`, 0)
                      })
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8A8A8A',
                      fontSize: 13,
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {section.skipLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Submit CTA */}
        <div className="w-full max-w-[680px] flex flex-col items-center gap-3 pt-2 pb-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              background: submitting ? '#3a3a3a' : BRAND_GRADIENT,
              color: submitting ? '#8A8A8A' : '#000000',
              border: 'none',
              borderRadius: 9999,
              padding: '16px 32px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {submitting ? 'Calculating your score…' : 'Get My Score →'}
          </button>
          {answeredCount < totalQuestions && !submitting && (
            <p style={{ fontSize: 12, color: '#8A8A8A', margin: 0 }}>
              {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''} left — unanswered questions count as No.
            </p>
          )}
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
