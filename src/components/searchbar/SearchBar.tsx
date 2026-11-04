import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Command,
} from 'lucide-react'
import { getAllPapers } from '../../data/research_papers/researchPapers'
import {
  SEARCH_COMMAND_TAGS,
  NAVIGATION_PAGES,
  getQuickActions,
  parseSearchQuery,
  fuzzyScore,
  type SearchResultItem,
  type SearchCommandTag,
} from './subcomponents/searchcommands'
import { SearchResultsOverlay } from './subcomponents/SearchResultsOverlay'
import { SearchTagsPicker } from './subcomponents/SearchTagsPicker'
import './SearchBar.css'

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tagIndex, setTagIndex] = useState(0)
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const [forcedTag, setForcedTag] = useState<SearchCommandTag | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastScrollYRef = useRef(0)

  const navigate = useNavigate()

  // 1. Scroll listener: Smooth hide when scrolling down, revealing when scrolling up
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0
          const isDeepFocus = document.body.classList.contains('deep-focus-active')

          if (isDeepFocus) {
            setIsScrolledDown(true)
            ticking = false
            return
          }

          if (currentScrollY <= 25) {
            setIsScrolledDown(false)
          } else {
            const diff = currentScrollY - lastScrollYRef.current
            if (diff > 8 && currentScrollY > 70) {
              if (!isFocused) {
                setIsScrolledDown(true)
              }
            } else if (diff < -8) {
              setIsScrolledDown(false)
            }
          }

          lastScrollYRef.current = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFocused])

  // 2. Click outside detection to close overlays & blur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 3. Global keyboard shortcut (Ctrl+K or Cmd+K) to toggle searchbar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsFocused(prev => {
          const next = !prev
          if (next) {
            setTimeout(() => inputRef.current?.focus(), 60)
            setIsScrolledDown(false)
          } else {
            inputRef.current?.blur()
          }
          return next
        })
      }
      if (e.key === 'Escape' && isFocused) {
        e.preventDefault()
        setIsFocused(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isFocused])

  // 4. Parse scope and search term
  const { scope, cleanQuery, activeTag } = useMemo(() => {
    if (forcedTag) {
      return {
        scope: forcedTag.scope,
        cleanQuery: query.trim(),
        activeTag: forcedTag,
      }
    }
    return parseSearchQuery(query)
  }, [query, forcedTag])

  // 5. Gather all corpus papers
  const allPapers = useMemo(() => getAllPapers(), [])
  const quickActions = useMemo(() => getQuickActions(navigate), [navigate])

  // 6. Compute Categorized Results with Typo Resilience & Faded Similar Suggestions
  const results: SearchResultItem[] = useMemo(() => {
    if (!cleanQuery && !forcedTag) {
      return []
    }

    const paperMatches: { item: SearchResultItem; score: number }[] = []
    const authorMatches: { item: SearchResultItem; score: number }[] = []
    const doiMatches: { item: SearchResultItem; score: number }[] = []
    const archiveMatches: { item: SearchResultItem; score: number }[] = []
    const pageMatches: { item: SearchResultItem; score: number }[] = []
    const actionMatches: { item: SearchResultItem; score: number }[] = []

    // Category: Pages
    if (scope === 'navigate' || scope === 'all') {
      for (const page of NAVIGATION_PAGES) {
        const score = cleanQuery
          ? Math.max(fuzzyScore(page.title, cleanQuery), fuzzyScore(page.path, cleanQuery))
          : 60

        if (score > 0) {
          pageMatches.push({
            score,
            item: {
              id: page.id,
              type: 'page',
              categoryLabel: 'Site Navigation',
              title: page.title,
              subtitle: page.subtitle,
              metaBadge: page.badge,
              onSelect: () => {
                navigate(page.path)
                setIsFocused(false)
                setQuery('')
                setForcedTag(null)
              },
            },
          })
        }
      }
    }

    // Category: Actions
    if (scope === 'command' || scope === 'all') {
      for (const act of quickActions) {
        const score = cleanQuery
          ? Math.max(fuzzyScore(act.name, cleanQuery), fuzzyScore(act.command, cleanQuery))
          : 60

        if (score > 0) {
          actionMatches.push({
            score,
            item: {
              id: act.id,
              type: 'action',
              categoryLabel: 'Console Commands',
              title: act.name,
              subtitle: act.description,
              metaBadge: 'Action',
              doiOrCode: act.command,
              onSelect: () => {
                act.action()
                setIsFocused(false)
                setQuery('')
                setForcedTag(null)
              },
            },
          })
        }
      }
    }

    // Category: Corpus Papers & Specific Metadata Categories
    for (const paper of allPapers) {
      // 1. Title / General Paper Match
      if (scope === 'all') {
        const titleScore = fuzzyScore(paper.title, cleanQuery)
        const kwScore = Math.max(0, ...paper.keywords.map(k => fuzzyScore(k, cleanQuery)))
        const bestScore = Math.max(titleScore * 1.25, kwScore)

        if (bestScore > 0) {
          paperMatches.push({
            score: bestScore,
            item: {
              id: `paper-${paper.id}`,
              type: 'paper',
              categoryLabel: 'Research Papers',
              title: paper.title,
              subtitle: `${paper.authors.map(a => a.name).join(', ')} • ${paper.year}`,
              metaBadge: paper.genre,
              doiOrCode: paper.paperCode,
              payload: paper,
              onSelect: () => {
                navigate(`/library/${paper.id}`)
                setIsFocused(false)
                setQuery('')
                setForcedTag(null)
              },
            },
          })
        }
      }

      // 2. Authors
      if (scope === 'author' || scope === 'all') {
        for (const paper of allPapers) {
          for (const author of paper.authors) {
            const aScore = cleanQuery ? fuzzyScore(author.name, cleanQuery) : 50
            if (aScore > 0 || (scope === 'author' && !cleanQuery)) {
              authorMatches.push({
                score: aScore,
                item: {
                  id: `author-${paper.id}-${author.name}`,
                  type: 'author',
                  categoryLabel: 'Researchers & Authors',
                  title: author.name,
                  subtitle: `Author on: "${paper.title}" (${paper.year})`,
                  metaBadge: 'Author',
                  onSelect: () => {
                    navigate(`/library/${paper.id}`)
                    setIsFocused(false)
                    setQuery('')
                    setForcedTag(null)
                  },
                },
              })
            }
          }
        }
      }

      // 3. DOI
      if (scope === 'doi' || scope === 'all') {
        for (const paper of allPapers) {
          const doiText = paper.doiCode || paper.doi
          const doiScore = cleanQuery ? fuzzyScore(doiText, cleanQuery) : 50
          if (doiScore > 0 || (scope === 'doi' && !cleanQuery)) {
            doiMatches.push({
              score: doiScore,
              item: {
                id: `doi-${paper.id}`,
                type: 'doi',
                categoryLabel: 'Digital Object Identifiers (DOI)',
                title: doiText,
                subtitle: paper.title,
                metaBadge: 'DOI',
                doiOrCode: paper.doiCode,
                onSelect: () => {
                  navigate(`/library/${paper.id}`)
                  setIsFocused(false)
                  setQuery('')
                  setForcedTag(null)
                },
              },
            })
          }
        }
      }

      // 4. nihit Archive Accession Code
      if (scope === 'archive' || scope === 'all') {
        for (const paper of allPapers) {
          const codeScore = cleanQuery ? fuzzyScore(paper.paperCode, cleanQuery) : 50
          if (codeScore > 0 || (scope === 'archive' && !cleanQuery)) {
            archiveMatches.push({
              score: codeScore,
              item: {
                id: `archive-${paper.id}`,
                type: 'archive',
                categoryLabel: 'nihit Archive Codes',
                title: paper.paperCode,
                subtitle: paper.title,
                metaBadge: 'Archive',
                doiOrCode: paper.paperCode,
                onSelect: () => {
                  navigate(`/library/${paper.id}`)
                  setIsFocused(false)
                  setQuery('')
                  setForcedTag(null)
                },
              },
            })
          }
        }
      }
    }

    // Sort items inside each category by best score
    paperMatches.sort((a, b) => b.score - a.score)
    authorMatches.sort((a, b) => b.score - a.score)
    doiMatches.sort((a, b) => b.score - a.score)
    archiveMatches.sort((a, b) => b.score - a.score)
    pageMatches.sort((a, b) => b.score - a.score)
    actionMatches.sort((a, b) => b.score - a.score)

    // Deduplicate author matches
    const seenAuthors = new Set<string>()
    const uniqueAuthorMatches = authorMatches.filter(m => {
      if (seenAuthors.has(m.item.title)) return false
      seenAuthors.add(m.item.title)
      return true
    })

    // Combine in an orderly hierarchy
    let combined: SearchResultItem[] = [
      ...paperMatches.map(m => m.item),
      ...uniqueAuthorMatches.map(m => m.item),
      ...doiMatches.map(m => m.item),
      ...archiveMatches.map(m => m.item),
      ...pageMatches.map(m => m.item),
      ...actionMatches.map(m => m.item),
    ]

    // RESILIENCE FALLBACK: If user is typing wrong or no exact matches found,
    // rather than showing an empty box, provide close/related items as grayed out recommendations!
    if (combined.length === 0 && cleanQuery.length >= 1) {
      const fallbackList: SearchResultItem[] = []

      // If scope is specified (e.g. @ for author, # for DOI, | for archive), show all matching that scope first!
      if (scope === 'author') {
        for (const p of allPapers) {
          for (const a of p.authors) {
            fallbackList.push({
              id: `fallback-author-${p.id}-${a.name}`,
              type: 'author',
              categoryLabel: 'Cataloged Researchers & Authors',
              title: a.name,
              subtitle: `Author on: "${p.title}" (${p.year})`,
              metaBadge: 'Author',
              isFuzzyFaded: true,
              onSelect: () => {
                navigate(`/library/${p.id}`)
                setIsFocused(false)
                setQuery('')
                setForcedTag(null)
              },
            })
          }
        }
      } else if (scope === 'doi') {
        for (const p of allPapers) {
          fallbackList.push({
            id: `fallback-doi-${p.id}`,
            type: 'doi',
            categoryLabel: 'Available DOIs',
            title: p.doiCode || p.doi,
            subtitle: p.title,
            metaBadge: 'DOI',
            isFuzzyFaded: true,
            onSelect: () => {
              navigate(`/library/${p.id}`)
              setIsFocused(false)
              setQuery('')
              setForcedTag(null)
            },
          })
        }
      } else if (scope === 'archive') {
        for (const p of allPapers) {
          fallbackList.push({
            id: `fallback-arc-${p.id}`,
            type: 'archive',
            categoryLabel: 'Available nihit Archive Codes',
            title: p.paperCode,
            subtitle: p.title,
            metaBadge: 'Archive',
            isFuzzyFaded: true,
            onSelect: () => {
              navigate(`/library/${p.id}`)
              setIsFocused(false)
              setQuery('')
              setForcedTag(null)
            },
          })
        }
      } else {
        // Suggest all cataloged papers as faded recommendations
        for (const p of allPapers) {
          fallbackList.push({
            id: `fallback-${p.id}`,
            type: 'paper',
            categoryLabel: 'Recommended Archive Works',
            title: p.title,
            subtitle: `${p.authors.map(a => a.name).join(', ')} • ${p.year}`,
            metaBadge: p.genre,
            doiOrCode: p.paperCode,
            isFuzzyFaded: true,
            onSelect: () => {
              navigate(`/library/${p.id}`)
              setIsFocused(false)
              setQuery('')
              setForcedTag(null)
            },
          })
        }

        // Add navigation pages as fallback options
        for (const page of NAVIGATION_PAGES.slice(0, 3)) {
          fallbackList.push({
            id: `fallback-page-${page.id}`,
            type: 'page',
            categoryLabel: 'Suggested Pages',
            title: page.title,
            subtitle: page.subtitle,
            metaBadge: 'Route',
            isFuzzyFaded: true,
            onSelect: () => {
              navigate(page.path)
              setIsFocused(false)
              setQuery('')
              setForcedTag(null)
            },
          })
        }
      }

      combined = fallbackList
    }

    return combined.slice(0, 10)
  }, [cleanQuery, scope, forcedTag, allPapers, quickActions, navigate])

  // Auto-reset selected index when results change
  const [prevResults, setPrevResults] = useState(results)
  if (prevResults !== results) {
    setPrevResults(results)
    setSelectedIndex(0)
  }

  // 7. Arrow Key & Keyboard Navigation (Supports both Tag Picker & Results list)
  const isBrowsingTags = isFocused && !cleanQuery && !forcedTag

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isBrowsingTags) {
      const totalTags = SEARCH_COMMAND_TAGS.length // 5 tags arranged in 2 columns: [0, 1], [2, 3], [4]
      const cols = 2

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        // If not in the last column of the row and within bounds
        if (tagIndex % cols < cols - 1 && tagIndex + 1 < totalTags) {
          setTagIndex(prev => prev + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        // If not in the first column
        if (tagIndex % cols > 0) {
          setTagIndex(prev => prev - 1)
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        // Move one row down (+2) if in bounds
        if (tagIndex + cols < totalTags) {
          setTagIndex(prev => prev + cols)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        // Move one row up (-2) if in bounds
        if (tagIndex - cols >= 0) {
          setTagIndex(prev => prev - cols)
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const targetTag = SEARCH_COMMAND_TAGS[tagIndex]
        if (targetTag) {
          handleSelectTag(targetTag)
        }
      }
      return
    }

    // Results browsing
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (results.length > 0) {
        setSelectedIndex(prev => (prev + 1) % results.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (results.length > 0) {
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results.length > 0 && results[selectedIndex]) {
        results[selectedIndex].onSelect()
      }
    } else if (e.key === 'Backspace' && !query && forcedTag) {
      setForcedTag(null)
    }
  }

  const handleSelectTag = (tag: SearchCommandTag) => {
    setForcedTag(tag)
    setQuery('') // Reset typed text so the prefix is not left beside the action/tag
    inputRef.current?.focus()
  }

  const handleClear = () => {
    setQuery('')
    setForcedTag(null)
    inputRef.current?.focus()
  }

  const placeholderText = useMemo(() => {
    if (forcedTag) return forcedTag.placeholder
    if (activeTag) return activeTag.placeholder
    return 'Search papers, authors, DOIs (#), archive codes (|), pages (/)...'
  }, [forcedTag, activeTag])

  const isDeepFocus = typeof document !== 'undefined' && document.body.classList.contains('deep-focus-active')
  if (isDeepFocus) return null

  return (
    <div
      ref={containerRef}
      className={`searchbar-wrapper ${isScrolledDown ? 'searchbar-wrapper--scrolled-down' : ''} ${
        isFocused ? 'searchbar-wrapper--focused' : ''
      }`}
    >
      {/* Dynamic Popover Container: Smoothly emerges from & recedes into the SearchBar */}
      <AnimatePresence mode="wait">
        {isFocused && (cleanQuery || forcedTag) && (
          <motion.div
            key="search-results-popover"
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.93,
              y: 18,
              transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{
              type: 'spring',
              stiffness: 460,
              damping: 32,
              mass: 0.75,
            }}
            style={{ width: '100%', position: 'absolute', bottom: '100%' }}
          >
            <SearchResultsOverlay
              results={results}
              selectedIndex={selectedIndex}
              onSelectResult={res => res.onSelect()}
              onHoverIndex={idx => setSelectedIndex(idx)}
            />
          </motion.div>
        )}

        {isBrowsingTags && (
          <motion.div
            key="search-tags-popover"
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.93,
              y: 18,
              transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{
              type: 'spring',
              stiffness: 460,
              damping: 32,
              mass: 0.75,
            }}
            style={{ width: '100%', position: 'absolute', bottom: '100%' }}
          >
            <SearchTagsPicker
              activeScope={scope}
              selectedIndex={tagIndex}
              onSelectTag={handleSelectTag}
              onHoverIndex={idx => setTagIndex(idx)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The Pill Search Console at the bottom center */}
      <div
        className="searchbar-container"
        onClick={() => {
          setIsFocused(prev => !prev)
          if (!isFocused) {
            setTimeout(() => inputRef.current?.focus(), 50)
            setIsScrolledDown(false)
          }
        }}
      >
        {forcedTag ? (
          <span className="searchbar-tag-badge">
            <span className="searchbar-tag-badge__symbol">{forcedTag.symbol}</span>
            <span className="searchbar-tag-badge__label">{forcedTag.label}</span>
            <button
              type="button"
              className="searchbar-tag-badge__remove"
              onClick={e => {
                e.stopPropagation()
                setForcedTag(null)
              }}
              aria-label="Remove filter tag"
            >
              <X size={12} />
            </button>
          </span>
        ) : (
          <div className="searchbar-icon-wrap">
            <Search size={16} className="searchbar-icon" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onClick={e => e.stopPropagation()}
          onChange={e => {
            setQuery(e.target.value)
            if (!isFocused) setIsFocused(true)
          }}
          onFocus={() => {
            setIsFocused(true)
            setIsScrolledDown(false)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="searchbar-input"
          aria-label="Search nihit archive"
        />

        {query && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              handleClear()
            }}
            className="searchbar-clear-btn"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}

        <div
          className="searchbar-shortcut-badge"
          onClick={e => {
            e.stopPropagation()
            setIsFocused(prev => !prev)
            if (!isFocused) {
              setTimeout(() => inputRef.current?.focus(), 50)
              setIsScrolledDown(false)
            }
          }}
          title="Toggle search console (Ctrl+K or Cmd+K)"
        >
          <Command size={11} className="searchbar-shortcut-icon" />
          <span>K</span>
        </div>
      </div>
    </div>
  )
}
export default SearchBar
