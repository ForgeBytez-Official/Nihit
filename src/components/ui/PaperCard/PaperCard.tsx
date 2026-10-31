import { Link } from 'react-router-dom'
import { FileText, ArrowUpRight, Building2, Calendar, Tag } from 'lucide-react'
import type { Paper } from '../../../lib/paperTypes'
import './PaperCard.css'

export function PaperCard({ paper, compact = false }: { paper: Paper; compact?: boolean }) {
  const authors = paper.authors.slice(0, 2).map(a => a.name).join(', ')
  const extra = paper.authors.length > 2 ? ` +${paper.authors.length - 2}` : ''
  const primaryInst = paper.institutions?.[0]?.name

  return (
    <Link to={`/library/${paper.id}`} className={`paper-card ${compact ? 'paper-card--compact' : ''} group`}>
      <div className="paper-card__header">
        <span className="paper-card__genre">
          <Tag size={10} className="inline mr-1" />
          {paper.genre}
        </span>
        <span className="paper-card__year">
          <Calendar size={11} className="inline mr-1" />
          {paper.year}
        </span>
      </div>

      <h3 className="paper-card__title" title={paper.title}>{paper.title}</h3>
      <p className="paper-card__authors">{authors}{extra}</p>

      {primaryInst && (
        <div className="paper-card__institution" title={primaryInst}>
          <Building2 size={11} className="flex-shrink-0" />
          <span className="truncate">{primaryInst}</span>
        </div>
      )}

      {!compact && paper.abstract && (
        <p className="paper-card__abstract">
          {paper.abstract.slice(0, 110)}...
        </p>
      )}

      <div className="paper-card__footer">
        <div className="paper-card__footer-left">
          <FileText size={12} className="text-[var(--color-accent-1)]" />
          <code className="paper-card__code">{paper.paperCode}</code>
        </div>
        <span className="paper-card__action">
          <span>Read</span>
          <ArrowUpRight size={13} className="paper-card__arrow" />
        </span>
      </div>
    </Link>
  )
}

export default PaperCard