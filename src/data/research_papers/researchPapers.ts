// Lazy-loaded paper corpus barrel.
//
// JSON metadata lives at src/data/research_papers/<genre>/<paper-id>/<paper-id>.json
// and the matching PDF at <genre>/<paper-id>/paper.pdf. Both are loaded via
// import.meta.glob so the bundle never ships the full corpus eagerly.
//
// PDFs are pulled in as asset URLs (as: 'url') — Vite copies them to dist and
// returns a stable path — rather than inlined into JS, so a 200 KB paper stays
// a 200 KB paper.

import type { Paper } from '../../lib/paperTypes'

// Direct image imports for papers (e.g. NowshinLaila_2020_Yield-permformance-of_JBAU.90309)
// to guarantee production bundler asset URL resolution across all deployment environments
import nowshinTable1 from './agriculture/NowshinLaila_2020_Yield-permformance-of_JBAU.90309/table-1-total-amount-of-nutrient-applied.png'
import nowshinTable2 from './agriculture/NowshinLaila_2020_Yield-permformance-of_JBAU.90309/table-2-effect-of-variety-on-crop-characters.png'
import nowshinTable3 from './agriculture/NowshinLaila_2020_Yield-permformance-of_JBAU.90309/table-3-effect-of-nutrient-management.png'
import nowshinTable4 from './agriculture/NowshinLaila_2020_Yield-permformance-of_JBAU.90309/table-4-interaction-effects-of-variety.png'
import nowshinChart1 from './agriculture/NowshinLaila_2020_Yield-permformance-of_JBAU.90309/chart-1-Interaction-effect-of-variety.png'

const staticPaperImages: Record<string, string> = {
  'table-1-total-amount-of-nutrient-applied.png': nowshinTable1,
  'table-2-effect-of-variety-on-crop-characters.png': nowshinTable2,
  'table-3-effect-of-nutrient-management.png': nowshinTable3,
  'table-4-interaction-effects-of-variety.png': nowshinTable4,
  'chart-1-Interaction-effect-of-variety.png': nowshinChart1,
}

type JsonModule = { default: Paper }

const jsonGlob = import.meta.glob<JsonModule>('./**/*.json', { eager: true }) as Record<string, JsonModule>
const pdfGlob = import.meta.glob<string>('./**/*.pdf', { as: 'url', eager: true }) as Record<string, string>
const imgGlob = import.meta.glob<string>('./**/*.{png,jpg,jpeg,webp,svg}', { as: 'url', eager: true }) as Record<string, string>

function resolvePaperAssetUrl(paperDir: string, relativeOrAbsoluteSrc: string): string {
  // If it's already an http/https URL or starts with /, keep it
  if (/^(https?:\/\/|\/|data:)/i.test(relativeOrAbsoluteSrc)) {
    return relativeOrAbsoluteSrc
  }
  // Remove leading ./ if present
  const cleanName = relativeOrAbsoluteSrc.replace(/^\.\//, '')

  // 1. Check static direct imports first (guaranteed production resolution)
  if (staticPaperImages[cleanName]) {
    return staticPaperImages[cleanName]
  }

  // 2. Exact match with paperDir/cleanName or filename from glob
  const targetKey = `${paperDir}/${cleanName}`
  for (const [key, rawUrl] of Object.entries(imgGlob)) {
    if (key === targetKey || key.endsWith(`/${cleanName}`)) {
      if (typeof rawUrl === 'string') {
        return rawUrl
      }
      if (rawUrl && typeof rawUrl === 'object' && 'default' in rawUrl) {
        return String((rawUrl as { default: unknown }).default)
      }
      return String(rawUrl ?? relativeOrAbsoluteSrc)
    }
  }
  return relativeOrAbsoluteSrc
}

function idFromJsonPath(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1].replace(/\.json$/, '')
}

function genreFromPath(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 2]
}

function pdfUrlFor(id: string): string | undefined {
  // First match: any PDF inside a directory named after this paper ID
  for (const [path, url] of Object.entries(pdfGlob)) {
    const parts = path.split('/')
    if (parts[parts.length - 2] === id) return url
  }
  // Fallback: match by PDF basename matching ID
  for (const [path, url] of Object.entries(pdfGlob)) {
    const filename = path.split('/').pop()?.replace(/\.pdf$/i, '')
    if (filename === id) return url
  }
  return undefined
}

// Single source of truth: every paper found on disk, keyed by id.
const paperById = new Map<string, Paper>()
for (const [path, mod] of Object.entries(jsonGlob)) {
  const id = idFromJsonPath(path)
  const paper = mod.default
  const paperDir = path.substring(0, path.lastIndexOf('/'))

  // Transform sections to resolve local image assets cleanly
  const transformedSections = (paper.sections || []).map((sec) => {
    if (!sec.content || !Array.isArray(sec.content)) return sec
    const mappedContent = sec.content.map((item) => {
      if (typeof item === 'object' && item !== null && item.type === 'image' && item.src) {
        return {
          ...item,
          src: resolvePaperAssetUrl(paperDir, item.src),
        }
      }
      return item
    })
    return {
      ...sec,
      content: mappedContent,
    }
  })

  paperById.set(id, {
    ...paper,
    id: paper.id || id,
    genre: paper.genre || genreFromPath(path),
    pdf: pdfUrlFor(id) || paper.pdf,
    sections: transformedSections,
  })
}

const papers = Array.from(paperById.values())

export function getAllPapers(): Paper[] {
  return papers
}

export function getPaperById(id: string): Paper | undefined {
  return paperById.get(id)
}

export function getPaperPdfUrl(id: string): string | undefined {
  return paperById.get(id)?.pdf
}

export function getGenres(): string[] {
  return Array.from(new Set(papers.map(p => p.genre))).sort()
}

export function getPapersByGenre(genre: string): Paper[] {
  return papers.filter(p => p.genre === genre)
}

export function getPaperCount(): number {
  return papers.length
}

export function searchPapers(query: string): Paper[] {
  const q = query.trim().toLowerCase()
  if (!q) return papers
  return papers.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.authors.some(a => a.name.toLowerCase().includes(q)) ||
    p.keywords.some(k => k.toLowerCase().includes(q)) ||
    p.journal.name.toLowerCase().includes(q) ||
    p.doiCode.toLowerCase().includes(q),
  )
}