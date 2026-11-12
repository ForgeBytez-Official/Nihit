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
  // Flatten sections and subsections for the index navigation
  const flattenedSections: { id: string; title: string; numLabel?: string; isSub?: boolean }[] = []
  sections.forEach((s, sIdx) => {
    const sId = s.id || ''
    const cleanId = sId.startsWith('section-') ? sId : `section-${sId}`
    const sNum = s.number !== undefined && s.number !== null && s.number !== '' ? String(s.number) : undefined

    flattenedSections.push({
      id: cleanId,
      title: s.title || s.subtitle || '',
      numLabel: sNum,
      isSub: false,
    })
    if (s.subsections && s.subsections.length > 0) {
      s.subsections.forEach((sub, subIdx) => {
        const subId = sub.id || ''
        const cleanSubId = subId.startsWith('section-') ? subId : `section-${subId}`
        const subNum = sub.number !== undefined && sub.number !== null && sub.number !== ''
          ? String(sub.number)
          : (sNum ? `${sNum}.${subIdx + 1}` : `${sIdx + 1}.${subIdx + 1}`)

        flattenedSections.push({
          id: cleanSubId,
          title: sub.subtitle || sub.title || '',
          numLabel: subNum,
          isSub: true,
        })
      })
    }
  })

  // Always include key landmarks: Abstract -> Custom Sections from JSON -> Citation
  const allSections: { id: string; title: string; numLabel?: string; isSub?: boolean }[] = [
    { id: 'section-abstract', title: 'Abstract', isSub: false },
    ...flattenedSections,
    { id: 'section-citation', title: 'Citation & Formats', isSub: false },
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
          {uniqueSections.map((sec) => {
            const isActive = activeSectionId === sec.id
            return (
              <li key={sec.id} className="paper-index-item">
                <button
                  type="button"
                  onClick={() => onSectionClick(sec.id)}
                  className={`paper-index-link ${isActive ? 'paper-index-link--active' : ''} ${
                    sec.isSub ? 'paper-index-link--nested' : ''
                  }`}
                >
                  <span className="paper-index-link__indicator">
                    {isActive ? (
                      <Bookmark size={11} className="fill-current" />
                    ) : sec.numLabel ? (
                      <span className="paper-index-link__num font-mono">{sec.numLabel}</span>
                    ) : (
                      <span className="paper-index-link__dot" />
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
