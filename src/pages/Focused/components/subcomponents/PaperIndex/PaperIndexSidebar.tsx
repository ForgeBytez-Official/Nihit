import React from 'react'
import { ListOrdered, ChevronRight, Bookmark } from 'lucide-react'
import type { PaperSection } from '../../../../../lib/paperTypes'
import './PaperIndexSidebar.css'

interface PaperIndexSidebarProps {
  sections: PaperSection[]
  activeSectionId?: string
  onSectionClick: (id: string) => void
}

export const PaperIndexSidebar: React.FC<PaperIndexSidebarProps> = ({
  sections,
  activeSectionId,
  onSectionClick,
}) => {
  // Always include key landmarks: Abstract -> Custom Sections from JSON -> Citation
  const allSections: { id: string; title: string; level: number }[] = [
    { id: 'section-abstract', title: 'Abstract', level: 0 },
    ...sections.map(s => {
      const cleanId = s.id.startsWith('section-') ? s.id : `section-${s.id}`
      return {
        id: cleanId,
        title: s.title,
        level: s.level ?? 1,
      }
    }),
    { id: 'section-citation', title: 'Citation & Formats', level: 0 },
  ]

  // Deduplicate by id
  const uniqueSections = allSections.filter(
    (item, index, self) => index === self.findIndex(t => t.id === item.id)
  )

  return (
    <div className="focused-sidebar-card paper-index-card">
      <div className="focused-sidebar-card__header">
        <div className="focused-sidebar-card__title-wrap">
          <ListOrdered size={15} className="text-[var(--color-accent-2)]" />
          <h3 className="focused-sidebar-card__title">Paper Index</h3>
        </div>
        <span className="paper-index-badge">{uniqueSections.length} sections</span>
      </div>

      <nav className="paper-index-nav" aria-label="Paper Section Table of Contents">
        <ul className="paper-index-list">
          {uniqueSections.map((sec, idx) => {
            const isActive = activeSectionId === sec.id
            return (
              <li key={sec.id} className="paper-index-item">
                <button
                  type="button"
                  onClick={() => onSectionClick(sec.id)}
                  className={`paper-index-link ${isActive ? 'paper-index-link--active' : ''} ${
                    sec.level > 1 ? 'paper-index-link--nested' : ''
                  }`}
                >
                  <span className="paper-index-link__indicator">
                    {isActive ? (
                      <Bookmark size={11} className="fill-current" />
                    ) : (
                      <span className="paper-index-link__num">0{idx + 1}</span>
                    )}
                  </span>
                  <span className="paper-index-link__label">{sec.title}</span>
                  <ChevronRight size={12} className="paper-index-link__chevron" />
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
