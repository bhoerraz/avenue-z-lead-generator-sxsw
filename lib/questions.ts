export interface Question {
  id: string
  text: string
}

export interface Section {
  id: string
  title: string
  description: string
  questions: Question[]
  maxScore: number
  skipLabel?: string
}

export const sections: Section[] = [
  {
    id: 's3',
    title: 'On-Page Answer Content',
    description: 'How well is your content structured for AI extraction and citation?',
    maxScore: 18,
    questions: [
      { id: 's3q1', text: 'Priority pages include a clear 1–3 sentence answer block near the top.' },
      { id: 's3q2', text: 'Our headings often follow question-based formats (e.g., "What is…?" "How does…?").' },
      { id: 's3q3', text: 'Each section focuses on one core idea with short paragraphs or bullets.' },
      { id: 's3q4', text: 'Key information is written in plain language rather than dense industry jargon.' },
      { id: 's3q5', text: 'Our high-value pages include FAQ sections answering common questions clearly.' },
      { id: 's3q6', text: 'Our content library includes AI-friendly formats like guides, listicles, and comparisons.' },
    ],
  },
  {
    id: 's4',
    title: 'Technical & Structural Optimization',
    description: 'Can AI crawlers easily access and interpret your content?',
    maxScore: 18,
    questions: [
      { id: 's4q1', text: 'Our website is fully crawlable and indexable, without major technical issues.' },
      { id: 's4q2', text: 'Each page has one clear H1 aligned with the primary topic.' },
      { id: 's4q3', text: 'Title tags and meta descriptions are unique and written in natural language.' },
      { id: 's4q4', text: 'We use structured data schema such as FAQ, HowTo, Product, or Article.' },
      { id: 's4q5', text: 'Internal links point directly to final URLs, avoiding redirect chains.' },
      { id: 's4q6', text: 'We maintain clear policies on how AI systems may access our content (e.g., llms.txt).' },
    ],
  },
  {
    id: 's5',
    title: 'Owned Content & Topic Coverage',
    description: 'Does your content fully cover your category and audience needs?',
    maxScore: 15,
    questions: [
      { id: 's5q1', text: 'We have cornerstone pages for our most important topics.' },
      { id: 's5q2', text: 'Our content strategy follows topic clusters (pillar pages + supporting articles).' },
      { id: 's5q3', text: 'Our content supports the full funnel (education → comparison → decision).' },
      { id: 's5q4', text: 'We refresh older content regularly to avoid outdated information.' },
      { id: 's5q5', text: 'High-value pages clearly explain who the content is for, what problem it solves, and how it differs from alternatives.' },
    ],
  },
  {
    id: 's6',
    title: 'PR, Editorial & Listicle Presence',
    description: 'Is your brand present in trusted third-party coverage?',
    maxScore: 15,
    questions: [
      { id: 's6q1', text: 'Our brand appears in credible editorial articles comparing providers in our category.' },
      { id: 's6q2', text: 'These articles accurately describe our positioning and product capabilities.' },
      { id: 's6q3', text: 'We appear in affiliate listicles or comparison hubs where buyers research solutions.' },
      { id: 's6q4', text: 'Our PR efforts support trust and differentiation themes important to AI training data.' },
      { id: 's6q5', text: 'We track which media placements are actually cited by AI answers.' },
    ],
  },
  {
    id: 's7',
    title: 'Reference Authority',
    description: 'Do authoritative reference sources explain your brand or category?',
    maxScore: 12,
    questions: [
      { id: 's7q1', text: 'Our brand or flagship product appears in neutral reference sources (e.g., Wikipedia).' },
      { id: 's7q2', text: 'These references include credible citations from reputable publications.' },
      { id: 's7q3', text: 'The page clearly explains what we do, who we serve, and what differentiates us.' },
      { id: 's7q4', text: 'Our product category or methodology has strong neutral reference coverage online.' },
    ],
  },
  {
    id: 's9',
    title: 'Commerce & Product Discoverability',
    description: 'How discoverable are your products to AI shopping assistants?',
    maxScore: 15,
    skipLabel: 'Skip — we do not sell products online',
    questions: [
      { id: 's9q1', text: 'Our ecommerce platform supports modern discovery and AI integrations.' },
      { id: 's9q2', text: 'Product feeds include clean, structured attributes and specifications.' },
      { id: 's9q3', text: 'Our products appear in trusted buying guides and "best product" roundups.' },
      { id: 's9q4', text: 'Product pages include rich attributes such as use cases, audiences, and benefits.' },
      { id: 's9q5', text: 'We experiment with AI-powered shopping or in-assistant purchase experiences.' },
    ],
  },
]
