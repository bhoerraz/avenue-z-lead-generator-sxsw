import { sections } from './questions'

export const TOTAL_MAX = 156

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
    max: 50,
    label: 'Early Awareness',
    tier: 'early',
    description: 'AI search readiness is minimal. Significant groundwork needed.',
    percentile: 'Bottom 40–50% of organizations',
  },
  {
    min: 51,
    max: 90,
    label: 'Foundational',
    tier: 'foundational',
    description: 'Some pieces are in place but execution is inconsistent.',
    percentile: 'Bottom 50–80% of organizations',
  },
  {
    min: 91,
    max: 125,
    label: 'Emerging AEO',
    tier: 'emerging',
    description: 'Your brand has meaningful visibility signals. Optimization opportunities remain.',
    percentile: 'Top 20–35% of organizations',
  },
  {
    min: 126,
    max: 150,
    label: 'Competitive',
    tier: 'competitive',
    description: 'Strong positioning across content, PR, and AI discovery channels.',
    percentile: 'Top 5–8% of organizations',
  },
  {
    min: 151,
    max: 156,
    label: 'AI Search Leader',
    tier: 'leader',
    description: 'Your organization is highly optimized for AI discovery and citations.',
    percentile: 'Top 2% of organizations',
  },
]

export const sectionBenchmarks: { sectionId: string; benchmark: number }[] = [
  { sectionId: 's1',  benchmark: 8  },
  { sectionId: 's2',  benchmark: 9  },
  { sectionId: 's3',  benchmark: 10 },
  { sectionId: 's4',  benchmark: 12 },
  { sectionId: 's5',  benchmark: 10 },
  { sectionId: 's6',  benchmark: 7  },
  { sectionId: 's7',  benchmark: 5  },
  { sectionId: 's8',  benchmark: 7  },
  { sectionId: 's9',  benchmark: 6  },
  { sectionId: 's10', benchmark: 4  },
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
