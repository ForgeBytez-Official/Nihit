// Citation formatting for the niheet corpus.
//
// Produces plain-text citation strings in APA 7th and BibTeX for any Paper,
// so a reader can copy a reference without retyping. Output is plain text —
// no DOM dependency — so it can be used by a "copy citation" button or a
// print view.

import type { Paper } from '../../lib/paperTypes'

function authorList(paper: Paper): string {
  return paper.authors
    .map(a => {
      const parts = a.name.split(/\s+/)
      const last = parts[parts.length - 1]
      const initials = parts.slice(0, -1).map(p => p[0].toUpperCase() + '.').join('')
      return `${last}, ${initials}`
    })
    .join(', ')
}

function journalShort(paper: Paper): string {
  const j = paper.journal
  const parts = [j.name]
  if (j.volume) parts.push(String(j.volume))
  return parts.join(', ')
}

export function toAPA(paper: Paper): string {
  const authors = authorList(paper)
  const year = `(${paper.year}).`
  const title = paper.title
  const journal = journalShort(paper)
  const doi = `doi:${paper.doiCode}`
  return `${authors} ${year} ${title} *${journal}*. ${doi}`
}

export function toBibTeX(paper: Paper): string {
  const key = paper.id.replace(/[^a-zA-Z0-9]/g, '_')
  const author = paper.authors.map(a => a.name).join(' and ')
  return `@article{${key},
  author  = {${author}},
  title   = {${paper.title}},
  journal = {${paper.journal.name}},
  year    = {${paper.year}},
  doi     = {${paper.doiCode}}
}`
}

export function toRIS(paper: Paper): string {
  return [
    `TY  - JOUR`,
    `AU  - ${paper.authors.map(a => a.name).join('\nAU  - ')}`,
    `TI  - ${paper.title}`,
    `JO  - ${paper.journal.name}`,
    `PY  - ${paper.year}`,
    `DO  - ${paper.doiCode}`,
    `ER  - `,
  ].join('\n')
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  return Promise.reject(new Error('Clipboard unavailable'))
}

export function citationFormats(paper: Paper) {
  // If the paper JSON specifies explicit citations (e.g. "APA 7th" / "apa" and "BibTex" / "bibtex"),
  // use those directly; otherwise fallback to dynamic generation.
  const explicitApa = paper.citations?.apa || paper.citations?.['APA 7th'] || paper.citations?.['APA'] || paper.citations?.['apa 7th']
  const explicitBibtex = paper.citations?.bibtex || paper.citations?.['BibTex'] || paper.citations?.['BibTeX'] || paper.citations?.['bibTeX']

  return {
    apa: explicitApa || toAPA(paper),
    bibtex: explicitBibtex || toBibTeX(paper),
    ris: toRIS(paper),
  }
}

export default { toAPA, toBibTeX, toRIS, copyToClipboard, citationFormats }