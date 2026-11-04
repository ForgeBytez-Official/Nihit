// parseReferences.ts
// Smart parser for raw reference blobs pasted from papers.
//
// Usage: drop raw text (or arrays of strings) into the "references" section
// content in a paper JSON — this module will cleanly split, sort, and return
// each citation as a separate string, ready for rendering.
//
// Supports all common formats:
//   - Single raw blob (PDF copy-paste)
//   - Multiple items already in an array
//   - Text separated by // (common manual separator)
//   - Numbered lists: "1. ...", "[1] ..."
//   - Mixed DOI and page-number endings

/**
 * Parse a raw references section content value (string or string[]) into
 * a clean sorted array of individual citation strings.
 */
export function parseReferences(rawContent: string | string[]): string[] {
  const rawList: string[] = Array.isArray(rawContent) ? rawContent : [rawContent]

  // Collect all strings, filtering out any image/object blocks
  const textParts: string[] = rawList.filter((x): x is string => typeof x === 'string')

  if (textParts.length === 0) return []

  // If multiple items in array AND each is already a separate entry (short lines),
  // check if they look like individual references before merging them.
  if (textParts.length > 1) {
    const looksAlreadySplit = textParts.every(p => p.length < 800)
    if (looksAlreadySplit) {
      // Still run through the splitter per item to handle any inline merged blobs
      const entries = textParts.flatMap(p => splitBlob(p))
      return sortEntries(entries)
    }
  }

  // Otherwise treat as a single large blob
  const entries = splitBlob(textParts.join('\n\n'))
  return sortEntries(entries)
}

function splitBlob(text: string): string[] {
  if (!text || text.trim().length < 5) return []

  let s = text

  // Step 1: Repair broken DOIs split across lines by a hyphen + space
  //   e.g. "https://doi.org/10.1016/S0065- 2113(04)85005-3" → joined
  s = s.replace(/(https?:\/\/[^\s]+-)\s+([\w()\-.]+)/g, '$1$2')

  // Step 2: Treat explicit double-slash separators as line breaks
  s = s.replace(/\/{2,}/g, '\n')

  // Step 3: Insert line breaks AFTER a full URL when followed by an uppercase author/org
  //   "...doi.org/10.26832/...030306 Ali, M.I. ..." → break before Ali
  s = s.replace(
    /(https?:\/\/[a-zA-Z0-9./\-_]+)\s+(?=(?:\[\d+\]\s*|\d+[.)]\s*)?[A-Z][a-zA-Z.,'\-]+(?:\s+[A-Z.]+|\s+and\b|\s*\(|\s+FAO|\s+BBS))/g,
    '$1\n'
  )

  // Step 4: Insert line breaks AFTER "pp. X-Y" / "pp X-Y" page indicators
  //   "...pp. 49-69. Benitez, E." → break before Benitez
  s = s.replace(
    /(\bpp?\.?\s*[\d\-]+(?:\.|(?=\s)))\s+(?=(?:\[\d+\]\s*|\d+[.)]\s*)?[A-Z][a-zA-Z.,'\-]+(?:\s+[A-Z.]+|\s+and\b|\s*\(|\s+FAO|\s+BBS))/g,
    '$1\n'
  )

  // Step 5: Insert line breaks AFTER volume:page citation endings
  //   "..., 104(1-3): 37-40. Meshenji, A." → break before Meshenji
  s = s.replace(
    /(\b\d+\s*(?:\([^)]+\))?\s*:\s*[\d\-]+(?:\.|(?=\s)))\s+(?=(?:\[\d+\]\s*|\d+[.)]\s*)?[A-Z][a-zA-Z.,'\-]+(?:\s+[A-Z.]+|\s+and\b|\s*\(|\s+FAO|\s+BBS))/g,
    '$1\n'
  )

  // Step 6: Insert line breaks before numbered citation patterns
  //   e.g. "...1-9. 1. Adhikari..." or "[2] Ali..."
  s = s.replace(/(?<=\S)\s+(?=(?:\[\d+\]|\b\d+[.)]) [A-Z])/g, '\n')

  // Split and clean
  return s
    .split(/\n+/)
    .map(l => l.trim())
    .filter(l => l.length > 8)
}

/**
 * Sort citation entries alphabetically by author surname / first word.
 * Strips leading "1. " or "[1] " numbering before comparing.
 */
function sortEntries(entries: string[]): string[] {
  return [...entries].sort((a, b) => {
    const ka = a.replace(/^(?:\[\d+\]|\d+[.)])\s*/, '').toLowerCase()
    const kb = b.replace(/^(?:\[\d+\]|\d+[.)])\s*/, '').toLowerCase()
    return ka.localeCompare(kb)
  })
}

