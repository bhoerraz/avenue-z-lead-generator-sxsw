import { Section } from '@/lib/questions'

interface SectionCardProps {
  section: Section
  sectionIndex: number
  answers: Record<string, number>
  onChange: (key: string, value: number) => void
}

const SCALE_LABELS = ['Not in place', 'Some early efforts', 'Mostly implemented', 'Fully implemented']
const BRAND_GRADIENT = 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF, #39A0FF, #6034FF)'

export default function SectionCard({
  section,
  sectionIndex,
  answers,
  onChange,
}: SectionCardProps) {
  return (
    <div
      className="w-full rounded-2xl"
      style={{
        background: '#272727',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 28px',
      }}
    >
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold mb-2">
          <span
            style={{
              background: BRAND_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {section.title}
          </span>
        </h2>
        <p className="text-sm leading-relaxed text-white opacity-60">
          {section.description}
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col">
        {section.questions.map((q, qIndex) => {
          const key = `s${sectionIndex}_q${qIndex}`
          const selected = answers[key]
          const isLast = qIndex === section.questions.length - 1

          return (
            <div
              key={q.id}
              style={{
                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
                paddingTop: qIndex === 0 ? 0 : 24,
                paddingBottom: isLast ? 0 : 24,
              }}
            >
              <fieldset className="border-none p-0 m-0">
                <legend className="text-base font-semibold text-white mb-4 leading-relaxed w-full">
                  {q.text}
                </legend>

                {/* Options: wrapping row on mobile, fixed row on desktop */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  {SCALE_LABELS.map((label, val) => {
                    const checked = selected === val
                    return (
                      <label
                        key={val}
                        className="flex-1 min-w-[calc(50%-4px)] sm:min-w-0 flex items-center gap-2 cursor-pointer rounded-xl px-3 py-3 transition-all"
                        style={{
                          background: checked ? 'rgba(255,255,255,0.09)' : '#1a1a1a',
                          border: checked
                            ? '1px solid rgba(255,255,255,0.25)'
                            : '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <input
                          type="radio"
                          name={key}
                          value={val}
                          checked={checked}
                          onChange={() => onChange(key, val)}
                          className="sr-only"
                        />
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{
                            border: checked
                              ? '1px solid rgba(255,255,255,0.7)'
                              : '1px solid rgba(255,255,255,0.2)',
                            background: checked ? '#fff' : 'transparent',
                          }}
                        >
                          {checked && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </span>
                        <span
                          className="text-xs font-semibold leading-tight"
                          style={{ color: checked ? '#fff' : 'rgba(255,255,255,0.5)' }}
                        >
                          {label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          )
        })}
      </div>
    </div>
  )
}
