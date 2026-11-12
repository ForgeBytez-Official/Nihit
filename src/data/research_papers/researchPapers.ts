// Lazy-loaded paper corpus barrel.
//
// JSON metadata lives at src/data/research_papers/<genre>/<paper-id>/<paper-id>.json
// and matching assets (PDFs, PNGs, etc.) live inside each paper's directory.
//
// All paper assets are automatically discovered and resolved via Vite glob imports:
// no manual import statements or hardcoded registries required!

import type { Paper, PaperSection, SectionContentBlock } from '../../lib/paperTypes'

type JsonModule = { default: Paper }

// Automatically discover all paper JSON files located in genre subdirectories:
// ./<genre>/<paper-id>/<paper-id>.json (ignores root-level sample.json)
const jsonGlob = import.meta.glob<JsonModule>('./*/*/*.json', { eager: true })

// Automatically discover all paper PDFs as hashed static asset URLs
const pdfGlob = import.meta.glob<string>('./**/*.pdf', {
  query: '?url',
  import: 'default',
  eager: true,
})

// Automatically discover all paper figures and images as hashed static asset URLs
const imgGlob = import.meta.glob<string>('./**/*.{png,jpg,jpeg,webp,svg,gif}', {
  query: '?url',
  import: 'default',
  eager: true,
})

/**
 * Resolve a relative image path (e.g. "./table-1.png" or "figure.png")
 * against the paper's directory using Vite's eager asset glob.
 */
function resolvePaperAssetUrl(paperDir: string, relativeOrAbsoluteSrc: string): string {
  // If already an absolute / external URL or data URI, keep as is
  if (/^(https?:\/\/|\/|data:)/i.test(relativeOrAbsoluteSrc)) {
    return relativeOrAbsoluteSrc
  }

  const cleanName = relativeOrAbsoluteSrc.replace(/^\.\//, '')
  const targetKey = `${paperDir}/${cleanName}`

  // 1. Exact match with paperDir/filename in glob
  if (imgGlob[targetKey]) {
    return imgGlob[targetKey]
  }

  // 2. Fallback: match by matching directory ending and filename
  for (const [key, url] of Object.entries(imgGlob)) {
    if (key.endsWith(`/${cleanName}`) && key.includes(paperDir.replace(/^\.\//, ''))) {
      return url
    }
  }

  // 3. Fallback: match by filename
  for (const [key, url] of Object.entries(imgGlob)) {
    if (key.endsWith(`/${cleanName}`)) {
      return url
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
  for (const [path, url] of Object.entries(pdfGlob)) {
    const parts = path.split('/')
    if (parts[parts.length - 2] === id) return url
  }
  for (const [path, url] of Object.entries(pdfGlob)) {
    const filename = path.split('/').pop()?.replace(/\.pdf$/i, '')
    if (filename === id) return url
  }
  return undefined
}

function generateSectionId(titleOrSubtitle: string): string {
  return titleOrSubtitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeSection(sec: PaperSection, paperDir: string): PaperSection {
  const displayTitle = sec.title || sec.subtitle || ''
  const autoId = sec.id || generateSectionId(displayTitle || 'section')

  // Transform content to resolve local image assets
  let mappedContent = sec.content
  if (Array.isArray(sec.content)) {
    mappedContent = sec.content.map((item: SectionContentBlock) => {
      if (typeof item === 'object' && item !== null && item.type === 'image' && item.src) {
        return {
          ...item,
          src: resolvePaperAssetUrl(paperDir, item.src),
        }
      }
      return item
    })
  }

  const mappedSubsections = (sec.subsections || []).map((sub: PaperSection) =>
    normalizeSection(sub, paperDir)
  )

  return {
    ...sec,
    id: autoId,
    number: sec.number,
    title: sec.title || (sec.subtitle ? sec.subtitle : displayTitle),
    subtitle: sec.subtitle,
    content: mappedContent,
    subsections: mappedSubsections.length > 0 ? mappedSubsections : undefined,
  }
}

// Single source of truth: every paper found on disk, keyed by id.
const paperById = new Map<string, Paper>()
for (const [path, mod] of Object.entries(jsonGlob)) {
  const id = idFromJsonPath(path)
  // Ignore template/sample files
  if (id === 'sample') continue

  const paper = mod.default
  const paperDir = path.substring(0, path.lastIndexOf('/'))

  // Transform and normalize sections
  const transformedSections = (paper.sections || []).map((sec) => normalizeSection(sec, paperDir))

  paperById.set(id, {
    ...paper,
    id: paper.id || id,
    genre: paper.genre || genreFromPath(path),
    pdf: pdfUrlFor(id) || paper.pdf,
    sections: transformedSections,
  })
}

export const papers: Paper[] = Array.from(paperById.values())

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
  return papers.filter(p => p.genre.toLowerCase() === genre.toLowerCase())
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
    (p.journal?.name && p.journal.name.toLowerCase().includes(q)) ||
    p.doiCode.toLowerCase().includes(q),
  )
}
