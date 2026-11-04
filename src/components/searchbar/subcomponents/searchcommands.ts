export type SearchScope = 'all' | 'doi' | 'archive' | 'navigate' | 'command' | 'author'

export type ResultCategory = 'paper' | 'author' | 'doi' | 'archive' | 'page' | 'action'

export interface SearchCommandTag {
  prefix: string
  scope: SearchScope
  label: string
  placeholder: string
  description: string
  symbol: string
  formatExample: string
  usageHint: string
}

export const SEARCH_COMMAND_TAGS: SearchCommandTag[] = [
  {
    prefix: '#',
    scope: 'doi',
    label: 'DOI Code',
    placeholder: 'Search by DOI (e.g. 10.5455/JBAU...)',
    description: 'Find papers directly with their Digital Object Identifier',
    symbol: '#',
    formatExample: '#10.5455/JBAU.90309 or #10.3329/bvet...',
    usageHint: 'Enter full or partial DOI prefix / registrant code',
  },
  {
    prefix: '|',
    scope: 'archive',
    label: 'Archive Code',
    placeholder: 'Search nihit archive code (e.g. JBAU.90309)',
    description: "Search using nihit's verified paper archive accession code",
    symbol: '|',
    formatExample: '|JBAU.90309 or |bvet.v38i1...',
    usageHint: 'Format: |JOURNAL.CODE as registered in nihit catalog',
  },
  {
    prefix: '@',
    scope: 'author',
    label: 'Author',
    placeholder: "Search author's name (e.g. Nowshin, Sarkar)",
    description: 'Find papers authored by specific researchers',
    symbol: '@',
    formatExample: '@Nowshin Laila or @Rahman',
    usageHint: 'Search by first name, last name, or corresponding author',
  },
  {
    prefix: '/',
    scope: 'navigate',
    label: 'Pages',
    placeholder: 'Jump to page (e.g. /home, /library, /about, /terms)',
    description: 'Quickly navigate to any top-level or legal page',
    symbol: '/',
    formatExample: '/library, /about, /contact, /terms, /privacy',
    usageHint: 'Type / followed by the destination route name',
  },
  {
    prefix: '\\',
    scope: 'command',
    label: 'Action',
    placeholder: 'Run action (e.g. \\top, \\refresh, \\library)',
    description: 'Execute instant actions like Scroll to Top',
    symbol: '\\',
    formatExample: '\\top (scroll to top) or \\library (open archive)',
    usageHint: 'Type \\ followed by the action verb',
  },
]

export interface NavigationRouteItem {
  id: string
  title: string
  path: string
  subtitle: string
  badge: string
}

export const NAVIGATION_PAGES: NavigationRouteItem[] = [
  { id: 'page-home', title: 'Home', path: '/', subtitle: 'Archive overview & featured works', badge: 'Route' },
  { id: 'page-library', title: 'Corpus Library', path: '/library', subtitle: 'Disciplines, papers and filters', badge: 'Route' },
  { id: 'page-about', title: 'About nihit', path: '/about', subtitle: 'Principles, methodology & studio team', badge: 'Route' },
  { id: 'page-contact', title: 'Contact Us', path: '/contact', subtitle: 'Scholarly correspondence & inquiries', badge: 'Route' },
  { id: 'page-terms', title: 'Terms of Access', path: '/terms', subtitle: 'Open access licensing & distribution', badge: 'Legal' },
  { id: 'page-privacy', title: 'Privacy Policy', path: '/privacy', subtitle: 'Data ethics & reader anonymity', badge: 'Legal' },
]

export interface QuickActionItem {
  id: string
  name: string
  command: string
  description: string
  action: () => void
}

export const getQuickActions = (navigate: (path: string) => void): QuickActionItem[] => [
  {
    id: 'act-top',
    name: 'Scroll to Top',
    command: '\\top',
    description: 'Smoothly glide to the top of the current page',
    action: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
  {
    id: 'act-library',
    name: 'Open Archive Library',
    command: '\\library',
    description: 'Browse all papers & scientific disciplines',
    action: () => navigate('/library'),
  },
  {
    id: 'act-random',
    name: 'Jump to Top of Page',
    command: '\\up',
    description: 'Instant viewport scroll to top',
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
]

// Fuzzy search scoring function
export function fuzzyScore(target: string, query: string): number {
  if (!target || !query) return 0
  const t = target.toLowerCase()
  const q = query.toLowerCase()

  if (t === q) return 100
  if (t.startsWith(q)) return 85
  if (t.includes(q)) return 65

  // Character fuzzy alignment
  let tIdx = 0
  let qIdx = 0
  let score = 0
  let consecutive = 0

  while (tIdx < t.length && qIdx < q.length) {
    if (t[tIdx] === q[qIdx]) {
      score += 6 + consecutive * 5
      consecutive++
      qIdx++
    } else {
      consecutive = 0
    }
    tIdx++
  }

  return qIdx === q.length ? score : 0
}

export interface SearchResultItem {
  id: string
  type: ResultCategory
  categoryLabel: string
  title: string
  subtitle: string
  metaBadge?: string
  doiOrCode?: string
  payload?: unknown
  isFuzzyFaded?: boolean
  onSelect: () => void
}

export function parseSearchQuery(rawInput: string): {
  scope: SearchScope
  cleanQuery: string
  activeTag: SearchCommandTag | null
} {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return { scope: 'all', cleanQuery: '', activeTag: null }
  }

  const firstChar = trimmed[0]
  const matchedTag = SEARCH_COMMAND_TAGS.find(t => t.prefix === firstChar)

  if (matchedTag) {
    return {
      scope: matchedTag.scope,
      cleanQuery: trimmed.slice(1).trim(),
      activeTag: matchedTag,
    }
  }

  return { scope: 'all', cleanQuery: trimmed, activeTag: null }
}
