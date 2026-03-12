interface ProgressBarProps {
  current: number
  total: number
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #FFFC60, #60FF80, #60FDFF, #39A0FF, #6034FF)'

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full flex items-center gap-4">
      <div
        className="flex-1 rounded-pill overflow-hidden"
        style={{ height: 4, background: '#272727' }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Section ${current} of ${total}`}
      >
        <div
          className="h-full rounded-pill transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: BRAND_GRADIENT }}
        />
      </div>
      <span className="text-sm font-bold whitespace-nowrap" style={{ color: '#8A8A8A' }}>
        Section {current} of {total}
      </span>
    </div>
  )
}
