import { sections } from './questions'

// 6 sections: s3(18) + s4(18) + s5(15) + s6(15) + s7(12) + s9(15) = 93
export const TOTAL_MAX = 93

export interface ScoreRange {
  min: number
  max: number
  label: string
  tier: 'early' | 'foundational' | 'emerging' | 'competitive' | 'leader'
  description: string
  percentile: string
}

export const scoreRanges: ScoreRange[] = [
  {
    min: 0,
    max: 29,
    label: 'Early Awareness',
    tier: 'early',
    description: 'AI search readiness is minimal. Significant groundwork needed.',
    percentile: 'Bottom 40–50% of organizations',
  },
  {
    min: 30,
    max: 54,
    label: 'Foundational',
    tier: 'foundational',
    description: 'Some pieces are in place but execution is inconsistent.',
    percentile: 'Bottom 50–80% of organizations',
  },
  {
    min: 55,
    max: 75,
    label: 'Emerging AEO',
    tier: 'emerging',
    description: 'Your brand has meaningful visibility signals. Optimization opportunities remain.',
    percentile: 'Top 20–35% of organizations',
  },
  {
    min: 76,
    max: 90,
    label: 'Competitive',
    tier: 'competitive',
    description: 'Strong positioning across content, PR, and AI discovery channels.',
    percentile: 'Top 5–8% of organizations',
  },
  {
    min: 91,
    max: 93,
    label: 'AI Search Leader',
    tier: 'leader',
    description: 'Your organization is highly optimized for AI discovery and citations.',
    percentile: 'Top 2% of organizations',
  },
]

export const sectionBenchmarks: { sectionId: string; benchmark: number }[] = [
  { sectionId: 's3', benchmark: 10 },
  { sectionId: 's4', benchmark: 12 },
  { sectionId: 's5', benchmark: 10 },
  { sectionId: 's6', benchmark: 7  },
  { sectionId: 's7', benchmark: 5  },
  { sectionId: 's9', benchmark: 6  },
]

export function getMaturityLevel(score: number): ScoreRange {
  return scoreRanges.find((r) => score >= r.min && score <= r.max) ?? scoreRanges[0]
}

export function getSectionBenchmark(sectionId: string): number {
  return sectionBenchmarks.find((b) => b.sectionId === sectionId)?.benchmark ?? 0
}

export function getSectionMax(sectionId: string): number {
  return sections.find((s) => s.id === sectionId)?.maxScore ?? 0
}

export function getSectionStatus(score: number, benchmark: number): 'above' | 'close' | 'below' {
  if (score >= benchmark) return 'above'
  if (score >= benchmark * 0.8) return 'close'
  return 'below'
}
