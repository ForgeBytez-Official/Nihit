// Citation formatting for the niheet corpus.
//
// Produces plain-text citation strings in APA 7th and BibTeX for any Paper,
// derived automatically from the paper's source citation (or paper metadata fallback),
// so a reader can copy references without retyping.

import type { Paper } from '../../lib/paperTypes'

/**
 * Clean author string for APA / BibTeX by stripping trailing annotation symbols (*, ^).
 */
function cleanAuthorName(name: string): string {
  return name.replace(/[\^*]+$/, '').trim()
}

/**
 * Check if a token looks like author initials (e.g. "N.", "M.A.R.", "S. S.", "M. M. H.", "A.")
 */
function isInitials(str: string): boolean {
  if (!str) return false
  const parts = str.trim().split(/\s+/)
  return parts.every(p => /^[A-Za-z]\.?$/.test(p) || /^[A-Za-z](\.[A-Za-z])+\.?$/.test(p))
}

/**
 * Convert author list to BibTeX author format: "Last, First and Last, First"
 */
function bibtexAuthors(rawAuthors: string): string {
  const normalized = rawAuthors
    .replace(/\s+and\s+/gi, ', ')
    .replace(/\s*&\s*/g, ', ')
    .trim()

  const tokens = normalized.split(',').map(t => t.trim()).filter(Boolean)
  const authors: string[] = []

  let i = 0
  while (i < tokens.length) {
    const cur = tokens[i]
    const next = tokens[i + 1]

    if (next && isInitials(next)) {
      authors.push(`${cur}, ${next}`)
      i += 2
    } else {
      authors.push(cur)
      i += 1
    }
  }

  return authors.join(' and ')
}

/**
 * Parse an academic source citation string into bibliographic components.
 * e.g. "Laila, N., Sarkar, M.A.R., Paul, S.K. and Rahman, A. 2020. Yield performance of aromatic fine rice as influenced by integrated use of vermicompost and inorganic fertilizers. Journal of Bangladesh Agricultural University, 18(2): 260–265. https://doi.org/10.5455/JBAU.90309"
 */
export interface ParsedCitation {
  authors?: string
  year?: string
  title?: string
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  doi?: string
}

export function parseSourceCitation(sourceText: string): ParsedCitation {
  const trimmed = sourceText.trim()
  const result: ParsedCitation = {}

  // Match: Authors. Year (or (Year)). Title. Journal, Vol(Issue): Pages. DOI
  const match = trimmed.match(
    /^(.*?)[,\.]?\s*\(?((?:19|20)\d{2})\)?[\.:]\s*(.*?)\.\s*([A-Za-z0-9\s&,–\-\.]+?)(?:,\s*(\d+)\s*(?:\(([^)]+)\))?)?(?::\s*([\d–\-]+))?\.?\s*(https?:\/\/\S+|doi:\S+)?$/i
  )

  if (match) {
    result.authors = match[1]?.trim()
    result.year = match[2]?.trim()
    result.title = match[3]?.trim()
    result.journal = match[4]?.trim()
    result.volume = match[5]?.trim()
    result.issue = match[6]?.trim()
    result.pages = match[7]?.trim()
    result.doi = match[8]?.trim()
  } else {
    // Fallback: extract year and doi if general regex didn't capture all parts
    const yrMatch = trimmed.match(/\b((?:19|20)\d{2})\b/)
    if (yrMatch) result.year = yrMatch[1]
    const doiMatch = trimmed.match(/(https?:\/\/doi\.org\/\S+|doi:\S+)/i)
    if (doiMatch) result.doi = doiMatch[1]
  }

  return result
}

function authorList(paper: Paper): string {
  return paper.authors
    .map(a => {
      const clean = cleanAuthorName(a.name)
      const parts = clean.split(/\s+/)
      const last = parts[parts.length - 1]
      const initials = parts.slice(0, -1).map(p => p[0].toUpperCase() + '.').join('')
      return initials ? `${last}, ${initials}` : last
    })
    .join(', ')
}

function journalShort(paper: Paper): string {
  const j = paper.journal
  if (!j) return ''
  const parts = [j.name]
  if (j.volume) parts.push(String(j.volume))
  return parts.join(', ')
}

export function toAPA(paper: Paper): string {
  const source = paper.citations?.source || paper.citations?.sourceCitation
  if (source) {
    const parsed = parseSourceCitation(source)
    const rawAuthors = (parsed.authors || authorList(paper)).replace(/\s*\.?$/, '')
    const year = `(${parsed.year || paper.year}).`
    const title = (parsed.title || paper.title).replace(/\s*\.?$/, '')
    const journalName = parsed.journal || paper.journal?.name
    let journalPart = ''
    if (journalName) {
      let volIssuePages = ''
      if (parsed.volume) {
        volIssuePages += `, ${parsed.volume}`
        if (parsed.issue) volIssuePages += `(${parsed.issue})`
      }
      if (parsed.pages) {
        volIssuePages += `, ${parsed.pages}`
      }
      journalPart = ` *${journalName}*${volIssuePages}.`
    }
    const doiUrl = parsed.doi || (paper.doiCode ? `https://doi.org/${paper.doiCode}` : '')
    const doiPart = doiUrl ? ` ${doiUrl}` : ''

    return `${rawAuthors} ${year} ${title}.${journalPart}${doiPart}`
  }

  // Fallback using paper object directly
  const authors = authorList(paper)
  const year = `(${paper.year}).`
  const title = paper.title.replace(/\s*\.?$/, '')
  const journal = journalShort(paper)
  const journalPart = journal ? ` *${journal}*.` : ''
  const doi = paper.doi || (paper.doiCode ? `https://doi.org/${paper.doiCode}` : '')
  const doiPart = doi ? ` ${doi}` : ''
  return `${authors} ${year} ${title}.${journalPart}${doiPart}`
}

export function toBibTeX(paper: Paper): string {
  const source = paper.citations?.source || paper.citations?.sourceCitation
  const key = paper.id.replace(/[^a-zA-Z0-9]/g, '_')

  if (source) {
    const parsed = parseSourceCitation(source)
    const author = parsed.authors ? bibtexAuthors(parsed.authors) : paper.authors.map(a => cleanAuthorName(a.name)).join(' and ')
    const title = (parsed.title || paper.title).replace(/\s*\.?$/, '')
    const year = parsed.year || paper.year
    const journal = parsed.journal || paper.journal?.name
    const doi = parsed.doi ? parsed.doi.replace(/^https?:\/\/doi\.org\//i, '') : paper.doiCode

    const fields: string[] = [
      `  author   = {${author}}`,
      `  title    = {${title}}`,
    ]
    if (journal) fields.push(`  journal  = {${journal}}`)
    if (year) fields.push(`  year     = {${year}}`)
    if (parsed.volume) fields.push(`  volume   = {${parsed.volume}}`)
    if (parsed.issue) fields.push(`  number   = {${parsed.issue}}`)
    if (parsed.pages) fields.push(`  pages    = {${parsed.pages.replace(/[–—]/g, '--')}}`)
    if (doi) fields.push(`  doi      = {${doi}}`)

    return `@article{${key},\n${fields.join(',\n')}\n}`
  }

  // Fallback using paper object directly
  const author = paper.authors.map(a => cleanAuthorName(a.name)).join(' and ')
  const journalField = paper.journal?.name ? `\n  journal  = {${paper.journal.name}},` : ''
  return `@article{${key},
  author   = {${author}},
  title    = {${paper.title}},${journalField}
  year     = {${paper.year}},
  doi      = {${paper.doiCode}}
}`
}

export function toRIS(paper: Paper): string {
  const source = paper.citations?.source || paper.citations?.sourceCitation
  const parsed = source ? parseSourceCitation(source) : {}

  const authorLines = parsed.authors
    ? bibtexAuthors(parsed.authors).split(' and ').map(a => `AU  - ${a}`)
    : paper.authors.map(a => `AU  - ${cleanAuthorName(a.name)}`)

  const lines = [
    `TY  - JOUR`,
    ...authorLines,
    `TI  - ${parsed.title || paper.title}`,
  ]
  const journalName = parsed.journal || paper.journal?.name
  if (journalName) {
    lines.push(`JO  - ${journalName}`)
  }
  if (parsed.volume) lines.push(`VL  - ${parsed.volume}`)
  if (parsed.issue) lines.push(`IS  - ${parsed.issue}`)
  if (parsed.pages) lines.push(`SP  - ${parsed.pages}`)

  lines.push(
    `PY  - ${parsed.year || paper.year}`,
    `DO  - ${parsed.doi ? parsed.doi.replace(/^https?:\/\/doi\.org\//i, '') : paper.doiCode}`,
    `ER  - `,
  )
  return lines.join('\n')
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  return Promise.reject(new Error('Clipboard unavailable'))
}

export function citationFormats(paper: Paper) {
  const sourceCitation = paper.citations?.source || paper.citations?.sourceCitation || ''
  // If explicitly provided in JSON, respect it; otherwise auto-generate from sourceCitation / paper
  const explicitApa = paper.citations?.apa || paper.citations?.['APA 7th'] || paper.citations?.['APA'] || paper.citations?.['apa 7th']
  const explicitBibtex = paper.citations?.bibtex || paper.citations?.['BibTex'] || paper.citations?.['BibTeX'] || paper.citations?.['bibTeX']

  return {
    source: sourceCitation,
    apa: explicitApa || toAPA(paper),
    bibtex: explicitBibtex || toBibTeX(paper),
    ris: toRIS(paper),
  }
}

export default { toAPA, toBibTeX, toRIS, copyToClipboard, citationFormats, parseSourceCitation }
