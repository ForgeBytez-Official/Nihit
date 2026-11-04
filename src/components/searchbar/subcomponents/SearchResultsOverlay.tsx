import React, { useRef, useEffect } from 'react'
import {
  FileText,
  Compass,
  Zap,
  ArrowUpRight,
  Hash,
  Binary,
  User,
} from 'lucide-react'
import type { SearchResultItem, ResultCategory } from './searchcommands'
import './SearchResultsOverlay.css'

interface SearchResultsOverlayProps {
  results: SearchResultItem[]
  selectedIndex: number
  onSelectResult: (result: SearchResultItem) => void
  onHoverIndex: (index: number) => void
}

export const SearchResultsOverlay: React.FC<SearchResultsOverlayProps> = ({
  results,
  selectedIndex,
  onSelectResult,
  onHoverIndex,
}) => {
  const selectedItemRef = useRef<HTMLDivElement | null>(null)

  // Auto scroll focused item into view smoothly
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  if (results.length === 0) {
    return (
      <div className="search-results-overlay search-results-overlay--empty">
        <span className="search-results-overlay__empty-text">No matching records found in archive</span>
      </div>
    )
  }

  const renderIcon = (type: ResultCategory) => {
    switch (type) {
      case 'author':
        return <User size={15} className="search-result-row__icon-svg text-[var(--color-accent-2)]" />
      case 'doi':
        return <Hash size={15} className="search-result-row__icon-svg text-[var(--color-accent-1)]" />
      case 'archive':
        return <Binary size={15} className="search-result-row__icon-svg text-[var(--color-accent-3)]" />
      case 'page':
        return <Compass size={15} className="search-result-row__icon-svg text-[var(--color-accent-2)]" />
      case 'action':
        return <Zap size={15} className="search-result-row__icon-svg text-[var(--color-accent-3)]" />
      case 'paper':
      default:
        return <FileText size={15} className="search-result-row__icon-svg text-[var(--color-accent-1)]" />
    }
  }

  return (
    <div className="search-results-overlay" role="listbox">
      <div className="search-results-overlay__header">
        <span className="search-results-overlay__label">Archive Corpus Matches ({results.length})</span>
        <span className="search-results-overlay__hint">↑ ↓ Navigate • ↵ Select • ESC Close</span>
      </div>

      <div className="search-results-overlay__scroll-area">
        {results.map((item, idx) => {
          const isSelected = selectedIndex === idx
          const showCategoryHeader = idx === 0 || item.categoryLabel !== results[idx - 1].categoryLabel

          return (
            <React.Fragment key={item.id}>
              {showCategoryHeader && (
                <div className="search-results-category-divider">
                  <span className="search-results-category-divider__name">
                    {item.categoryLabel}
                  </span>
                  {item.isFuzzyFaded && (
                    <span className="search-results-category-divider__hint">
                      (Approximate / Recommended)
                    </span>
                  )}
                </div>
              )}

              <div
                ref={isSelected ? selectedItemRef : null}
                role="option"
                aria-selected={isSelected}
                className={`search-result-row ${isSelected ? 'search-result-row--selected' : ''} ${
                  item.isFuzzyFaded ? 'search-result-row--faded' : ''
                }`}
                onClick={() => onSelectResult(item)}
                onMouseEnter={() => onHoverIndex(idx)}
              >
                <div className="search-result-row__icon">
                  {renderIcon(item.type)}
                </div>

                <div className="search-result-row__main">
                  <div className="search-result-row__title-wrap">
                    <span className="search-result-row__title">{item.title}</span>
                    {item.metaBadge && (
                      <span className="search-result-row__badge">{item.metaBadge}</span>
                    )}
                    {item.isFuzzyFaded && (
                      <span className="search-result-row__similar-tag">Related</span>
                    )}
                  </div>
                  <div className="search-result-row__sub-wrap">
                    <span className="search-result-row__subtitle">{item.subtitle}</span>
                    {item.doiOrCode && (
                      <span className="search-result-row__code">{item.doiOrCode}</span>
                    )}
                  </div>
                </div>

                <div className="search-result-row__action">
                  <ArrowUpRight size={14} className="search-result-row__arrow" />
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
