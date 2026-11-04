import React, { useRef, useEffect } from 'react'
import {
  SEARCH_COMMAND_TAGS,
  type SearchCommandTag,
  type SearchScope,
} from './searchcommands'
import { Info, Sparkles } from 'lucide-react'
import './SearchTagsPicker.css'

interface SearchTagsPickerProps {
  activeScope: SearchScope
  selectedIndex: number
  onSelectTag: (tag: SearchCommandTag) => void
  onHoverIndex: (index: number) => void
}

export const SearchTagsPicker: React.FC<SearchTagsPickerProps> = ({
  activeScope,
  selectedIndex,
  onSelectTag,
  onHoverIndex,
}) => {
  const selectedTagRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (selectedTagRef.current) {
      selectedTagRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  const highlightedTag = SEARCH_COMMAND_TAGS[selectedIndex] || SEARCH_COMMAND_TAGS[0]

  return (
    <div className="search-tags-picker" role="listbox">
      <div className="search-tags-picker__header">
        <div className="search-tags-picker__title-wrap">
          <Sparkles size={14} className="text-[var(--color-accent-1)]" />
          <span className="search-tags-picker__title">Filter & Command Triggers</span>
        </div>
        <span className="search-tags-picker__hint">Use ↑ ↓ ← → to navigate • ↵ Select</span>
      </div>

      <div className="search-tags-picker__grid">
        {SEARCH_COMMAND_TAGS.map((tag, idx) => {
          const isSelected = selectedIndex === idx
          const isActive = activeScope === tag.scope

          return (
            <button
              key={tag.scope}
              ref={isSelected ? selectedTagRef : null}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`search-tag-chip ${isSelected ? 'search-tag-chip--selected' : ''} ${
                isActive ? 'search-tag-chip--active' : ''
              }`}
              onClick={() => onSelectTag(tag)}
              onMouseEnter={() => onHoverIndex(idx)}
            >
              <span className="search-tag-chip__symbol">{tag.symbol}</span>
              <div className="search-tag-chip__content">
                <span className="search-tag-chip__label">{tag.label}</span>
                <span className="search-tag-chip__desc">{tag.description}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Dynamic Command Information Banner */}
      {highlightedTag && (
        <div className="search-tags-picker__info-banner">
          <div className="search-tags-picker__info-icon">
            <Info size={14} className="text-[var(--color-accent-1)]" />
          </div>
          <div className="search-tags-picker__info-content">
            <div className="search-tags-picker__info-header">
              <span className="search-tags-picker__info-name">{highlightedTag.label} Trigger ({highlightedTag.symbol})</span>
              <span className="search-tags-picker__info-hint">{highlightedTag.usageHint}</span>
            </div>
            <code className="search-tags-picker__info-example">{highlightedTag.formatExample}</code>
          </div>
        </div>
      )}
    </div>
  )
}
