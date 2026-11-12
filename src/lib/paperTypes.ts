// Canonical paper metadata shape. Every field the user asked to make
// interactable (authors, year, paper code, genre, publish date, institution,
// DOI, keywords) lives here as a typed object so pages can render it as
// links/buttons instead of plain text.

export interface Author {
  name: string
  role?: 'author' | 'editor' | 'translator'
  corresponding?: boolean
  orcid?: string
}

export interface Institution {
  name: string
  location?: string
  authors?: string[]
}

export interface Journal {
  name: string
  abbreviation?: string
  volume?: number | string
  issue?: number | string
  pages?: string
  issnPrint?: string
  issnOnline?: string
}

export interface PaperImage {
  type: 'image'
  src: string
  alt?: string
  caption?: string
  width?: string | number
}

export type SectionContentBlock = string | PaperImage

export interface PaperSection {
  id?: string
  number?: string | number
  title?: string
  subtitle?: string
  level?: number
  content?: string | SectionContentBlock[]
  subsections?: PaperSection[]
}

export interface PaperTable {
  id: string
  label: string
  title: string
  page?: number
}

export interface PaperCitations {
  source?: string
  sourceCitation?: string
  apa?: string
  bibtex?: string
  [key: string]: string | undefined
}

export interface Paper {
  id: string
  genre: string
  title: string
  authors: Author[]
  institutions: Institution[]
  year: number
  publishedDate?: string
  receivedDate?: string | null
  acceptedDate?: string | null
  journal?: Journal
  doi: string
  doiCode: string
  paperCode: string
  license?: string | null
  keywords: string[]
  abstract?: string
  citations?: PaperCitations
  study?: {
    location?: string
    period?: string
    sampleSize?: number
    method?: string
  }
  sections: PaperSection[]
  tables?: PaperTable[]
  acknowledgement?: string
  pdf: string
  source: 'pdf' | 'manual'
  verification: 'verified' | 'unverified'
}