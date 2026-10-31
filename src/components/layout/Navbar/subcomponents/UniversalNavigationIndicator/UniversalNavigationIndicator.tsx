import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Compass } from 'lucide-react'
import { getPaperById } from '../../../../../data/research_papers/researchPapers'
import './UniversalNavigationIndicator.css'

interface CrumbItem {
  label: string
  to: string
  isLast: boolean
  isPaper?: boolean
}

export function UniversalNavigationIndicator() {
  const location = useLocation()
  const pathname = location.pathname

  const crumbs = useMemo<CrumbItem[]>(() => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return []

    // If user is at a top navbar page root like /library or /about, don't show indicators
    // Indicators show navigation depth e.g. Library > Paper Title, About > Section, etc.
    const list: CrumbItem[] = []

    let currentPath = ''
    segments.forEach((seg, index) => {
      currentPath += `/${seg}`
      const isLast = index === segments.length - 1

      // Format display label
      let label: string
      let isPaper = false
      if (seg === 'library') {
        label = 'Library'
      } else if (seg === 'about') {
        label = 'About'
      } else if (seg === 'contact' || seg === 'contact-us') {
        label = 'Contact Us'
      } else if (index > 0 && segments[index - 1] === 'library') {
        // If it's a paper ID like /library/id
        const paper = getPaperById(seg)
        label = paper?.title ? paper.title.slice(0, 28) + (paper.title.length > 28 ? '…' : '') : seg
        isPaper = true
      } else {
        label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
      }

      list.push({
        label,
        to: currentPath,
        isLast,
        isPaper,
      })
    })

    return list
  }, [pathname])

  if (crumbs.length <= 1) {
    return null
  }

  return (
    <nav className="universal-nav-indicator" aria-label="Breadcrumb navigation">
      <div className="universal-nav-indicator__list">
        <span className="universal-nav-indicator__compass" aria-hidden>
          <Compass size={12} />
        </span>
        {crumbs.map((crumb, idx) => (
          <span key={crumb.to} className="universal-nav-indicator__node">
            {idx > 0 && (
              <ChevronRight size={11} className="universal-nav-indicator__sep" aria-hidden />
            )}
            {crumb.isLast ? (
              <span
                className={`universal-nav-indicator__crumb universal-nav-indicator__crumb--current ${
                  crumb.isPaper ? 'universal-nav-indicator__crumb--paper' : ''
                }`}
                aria-current="page"
                title={crumb.label}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="universal-nav-indicator__crumb"
                title={crumb.label}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}

export default UniversalNavigationIndicator
