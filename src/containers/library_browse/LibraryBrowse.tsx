import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { animFadeUp } from '../../lib/animations'
import { getAllPapers, getGenres } from '../../data/research_papers/researchPapers'
import { PaperCard } from '../../components/ui/PaperCard/PaperCard'
import {
  Filter,
  X,
  Layers,
  Calendar,
  Building2,
  Tag,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import './LibraryBrowse.css'

export function LibraryBrowse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarHidden, setSidebarHidden] = useState(false)

  // Pagination / Expansion toggles for each filter section (Max 10 initially)
  const [showAllGenres, setShowAllGenres] = useState(false)
  const [showAllYears, setShowAllYears] = useState(false)
  const [showAllInstitutions, setShowAllInstitutions] = useState(false)
  const [showAllKeywords, setShowAllKeywords] = useState(false)

  const allPapers = useMemo(() => getAllPapers(), [])
  const genres = useMemo(() => getGenres(), [])

  // Safely parse URL query params without duplicate stacking bugs
  const getParam = useMemo(() => {
    return (key: string): string[] => {
      const raw = searchParams.get(key) || ''
      if (!raw) return []
      return Array.from(new Set(raw.split(',').map(s => decodeURIComponent(s.trim())).filter(Boolean)))
    }
  }, [searchParams])

  const genreQ = useMemo(() => getParam('genre'), [getParam])
  const yearQ = useMemo(() => getParam('year'), [getParam])
  const keywordQ = useMemo(() => getParam('keyword'), [getParam])
  const institutionQ = useMemo(() => getParam('institution'), [getParam])

  // Filtered dataset
  const filteredPapers = useMemo(() => {
    let list = allPapers
    if (genreQ.length) {
      const lowerG = genreQ.map(g => g.toLowerCase())
      list = list.filter(p => lowerG.includes(p.genre.toLowerCase()))
    }
    if (yearQ.length) {
      list = list.filter(p => yearQ.includes(String(p.year)))
    }
    if (keywordQ.length) {
      const lowerK = keywordQ.map(k => k.toLowerCase())
      list = list.filter(p => p.keywords.some(k => lowerK.includes(k.toLowerCase())))
    }
    if (institutionQ.length) {
      const lowerI = institutionQ.map(i => i.toLowerCase())
      list = list.filter(p => p.institutions.some(i => lowerI.includes(i.name.toLowerCase())))
    }
    return list
  }, [allPapers, genreQ, yearQ, keywordQ, institutionQ])

  // Distinct Filter Options
  const years = useMemo(
    () => Array.from(new Set(allPapers.map(p => p.year))).sort((a, b) => b - a),
    [allPapers],
  )

  const institutions = useMemo(
    () => Array.from(new Set(allPapers.flatMap(p => p.institutions.map(i => i.name)))).sort(),
    [allPapers],
  )

  const allKeywords = useMemo(
    () => Array.from(new Set(allPapers.flatMap(p => p.keywords))).sort((a, b) =>
      a.localeCompare(b),
    ),
    [allPapers],
  )

  const activeFilterCount = genreQ.length + yearQ.length + keywordQ.length + institutionQ.length

  const clearAll = () => {
    setSearchParams({}, { replace: true })
  }

  // Robust, bug-free toggle avoiding URL stacking/duplication
  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    const existing = getParam(key)
    const normalizedValue = value.trim()

    let updated: string[]
    if (existing.includes(normalizedValue)) {
      updated = existing.filter(v => v !== normalizedValue)
    } else {
      updated = [...existing, normalizedValue]
    }

    if (updated.length > 0) {
      params.set(key, updated.map(v => encodeURIComponent(v)).join(','))
    } else {
      params.delete(key)
    }

    setSearchParams(params, { replace: true })
  }

  // Group papers by genre for the row-by-row layout
  const papersByGenre = useMemo(() => {
    const map = new Map<string, typeof filteredPapers>()

    // Determine which genres to show
    const relevantGenres = genreQ.length ? genreQ : genres

    for (const g of relevantGenres) {
      const matched = filteredPapers.filter(p => p.genre.toLowerCase() === g.toLowerCase())
      if (matched.length > 0) {
        map.set(g, matched)
      }
    }
    return map
  }, [filteredPapers, genreQ, genres])

  // Truncation limits (max 10 by default)
  const visibleGenres = showAllGenres ? genres : genres.slice(0, 10)
  const visibleYears = showAllYears ? years : years.slice(0, 10)
  const visibleInstitutions = showAllInstitutions ? institutions : institutions.slice(0, 10)
  const visibleKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 10)

  return (
    <div className={`library-page ${sidebarHidden ? 'library-page--sidebar-hidden' : ''}`}>
      <div className="container">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animFadeUp}
          className="library-page__header"
        >
          <div className="library-page__header-meta flex items-center flex-wrap gap-3">
            <span className="library-page__badge inline-flex items-center gap-2">
              <Layers size={22} className="text-[var(--color-accent-1)]" />
              <span>Open Research Archive</span>
            </span>

            {/* Separator / Count text */}
            <span className="library-page__count-meta">
              2 of 2 Publications Cataloged
            </span>
          </div>

          <h1 className="library-page__title">Scholarly Corpus & Disciplines</h1>
          <p className="library-page__description">
            Organized across verified agricultural, ecological, and scientific disciplines. Use the filter drawer on the left to refine records by genre, year, institution, or keywords.
          </p>
        </motion.div>

        {/* 2-Column Layout: Left Sticky Filter Sidebar + Right Genre Rows */}
        <div className="library-layout">
          {/* ==============================================================
              LEFT SIDEBAR: Filters (Sticky on scroll, with Outset Toggle Tab)
              ============================================================== */}
          <aside className="library-sidebar">
            {/* Outset toggle button sticking to the right edge of the sidebar */}
            <button
              type="button"
              onClick={() => setSidebarHidden(v => !v)}
              className="library-sidebar__toggle-tab"
              title={sidebarHidden ? 'Show Filter Sidebar' : 'Hide Filter Sidebar'}
              aria-label={sidebarHidden ? 'Show Filter Sidebar' : 'Hide Filter Sidebar'}
            >
              <SlidersHorizontal size={14} />
              <span>{sidebarHidden ? 'Filter' : 'Hide'}</span>
            </button>

            <div className="library-sidebar__card">
              <div className="library-sidebar__header">
                <div className="library-sidebar__title-wrap">
                  <Filter size={15} className="text-[var(--color-accent-1)]" />
                  <h3 className="library-sidebar__title">Filter Archive</h3>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="library-sidebar__clear-btn"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Active Filter Pills Strip */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="library-sidebar__active-pills"
                  >
                    {genreQ.map(g => (
                      <span key={`active-genre-${g}`} className="library-active-pill" onClick={() => toggleFilter('genre', g)}>
                        <span>{g}</span>
                        <X size={11} />
                      </span>
                    ))}
                    {yearQ.map(y => (
                      <span key={`active-year-${y}`} className="library-active-pill" onClick={() => toggleFilter('year', y)}>
                        <span>{y}</span>
                        <X size={11} />
                      </span>
                    ))}
                    {institutionQ.map(i => (
                      <span key={`active-inst-${i}`} className="library-active-pill" title={i} onClick={() => toggleFilter('institution', i)}>
                        <span className="library-active-pill__text">{i}</span>
                        <X size={11} />
                      </span>
                    ))}
                    {keywordQ.map(k => (
                      <span key={`active-kw-${k}`} className="library-active-pill" onClick={() => toggleFilter('keyword', k)}>
                        <span>{k}</span>
                        <X size={11} />
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filter Group: Research Genre (Max 10 + View More) */}
              <div className="library-filter-group">
                <div className="library-filter-group__header">
                  <Layers size={13} className="text-[var(--color-accent-1)]" />
                  <span>Research Genres</span>
                  <span className="library-filter-group__total">({genres.length})</span>
                </div>
                <div className="library-filter-options">
                  {visibleGenres.map(g => {
                    const active = genreQ.some(val => val.toLowerCase() === g.toLowerCase())
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleFilter('genre', g)}
                        className={`library-filter-option ${active ? 'active' : ''}`}
                      >
                        <span className="library-filter-option__name">{g}</span>
                        <span className="library-filter-option__count">
                          {allPapers.filter(p => p.genre.toLowerCase() === g.toLowerCase()).length}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {genres.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowAllGenres(v => !v)}
                    className="library-filter-group__view-more-btn"
                  >
                    {showAllGenres ? (
                      <><span>Show Less</span><ChevronUp size={12} /></>
                    ) : (
                      <><span>View More ({genres.length - 10} more)</span><ChevronDown size={12} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Filter Group: Year (Max 10 + View More) */}
              <div className="library-filter-group">
                <div className="library-filter-group__header">
                  <Calendar size={13} className="text-[var(--color-accent-2)]" />
                  <span>Publication Year</span>
                  <span className="library-filter-group__total">({years.length})</span>
                </div>
                <div className="library-filter-options library-filter-options--pills">
                  {visibleYears.map(y => {
                    const strY = String(y)
                    const active = yearQ.includes(strY)
                    return (
                      <button
                        key={strY}
                        type="button"
                        onClick={() => toggleFilter('year', strY)}
                        className={`library-pill-option ${active ? 'active' : ''}`}
                      >
                        {strY}
                      </button>
                    )
                  })}
                </div>
                {years.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowAllYears(v => !v)}
                    className="library-filter-group__view-more-btn"
                  >
                    {showAllYears ? (
                      <><span>Show Less</span><ChevronUp size={12} /></>
                    ) : (
                      <><span>View More ({years.length - 10} more)</span><ChevronDown size={12} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Filter Group: Institutions (Max 10 + View More with multiline clamp & hover tooltip) */}
              <div className="library-filter-group">
                <div className="library-filter-group__header">
                  <Building2 size={13} className="text-[var(--color-accent-3)]" />
                  <span>Institution</span>
                  <span className="library-filter-group__total">({institutions.length})</span>
                </div>
                <div className="library-filter-options">
                  {visibleInstitutions.map(inst => {
                    const active = institutionQ.some(val => val.toLowerCase() === inst.toLowerCase())
                    return (
                      <button
                        key={inst}
                        type="button"
                        onClick={() => toggleFilter('institution', inst)}
                        className={`library-filter-option library-filter-option--institution ${active ? 'active' : ''}`}
                        title={inst}
                      >
                        <span className="library-filter-option__name library-filter-option__name--clamped">
                          {inst}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {institutions.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowAllInstitutions(v => !v)}
                    className="library-filter-group__view-more-btn"
                  >
                    {showAllInstitutions ? (
                      <><span>Show Less</span><ChevronUp size={12} /></>
                    ) : (
                      <><span>View More ({institutions.length - 10} more)</span><ChevronDown size={12} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Filter Group: Keywords / Methodologies (Max 10 + View More) */}
              <div className="library-filter-group">
                <div className="library-filter-group__header">
                  <Tag size={13} className="text-[var(--color-accent-1)]" />
                  <span>Keywords & Methods</span>
                  <span className="library-filter-group__total">({allKeywords.length})</span>
                </div>
                <div className="library-filter-options library-filter-options--pills">
                  {visibleKeywords.map(kw => {
                    const active = keywordQ.some(val => val.toLowerCase() === kw.toLowerCase())
                    return (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => toggleFilter('keyword', kw)}
                        className={`library-pill-option ${active ? 'active' : ''}`}
                        title={kw}
                      >
                        {kw}
                      </button>
                    )
                  })}
                </div>
                {allKeywords.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowAllKeywords(v => !v)}
                    className="library-filter-group__view-more-btn"
                  >
                    {showAllKeywords ? (
                      <><span>Show Less</span><ChevronUp size={12} /></>
                    ) : (
                      <><span>View More ({allKeywords.length - 10} more)</span><ChevronDown size={12} /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ==============================================================
              RIGHT AREA: Genre-by-Genre Rows
              ============================================================== */}
          <main className="library-main-content">
            {papersByGenre.size === 0 ? (
              <div className="library-empty">
                <h3>No Research Found</h3>
                <p>No publications match the active filters selected. Try clearing or expanding your filter criteria.</p>
                <button type="button" onClick={clearAll} className="library-empty__btn">
                  Reset All Filters
                </button>
              </div>
            ) : (
              Array.from(papersByGenre.entries()).map(([genreName, papersInGenre]) => (
                <section key={genreName} className="library-genre-section">
                  <div className="library-genre-section__header">
                    <div className="library-genre-section__title-wrap">
                      <h2 className="library-genre-section__title">{genreName}</h2>
                      <span className="library-genre-section__count">
                        {papersInGenre.length} {papersInGenre.length === 1 ? 'Publication' : 'Publications'}
                      </span>
                    </div>
                  </div>

                  <div className="library-genre-row">
                    {papersInGenre.map(paper => (
                      <div key={paper.id} className="library-genre-row__item">
                        <PaperCard paper={paper} compact />
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default LibraryBrowse
