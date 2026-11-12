import React from 'react'
import { Link } from 'react-router-dom'
import {
  Tag,
  Calendar,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Hash,
  Clock,
  Sparkles,
} from 'lucide-react'
import type { Paper } from '../../../../../lib/paperTypes'
import { FormattedAuthorName } from '../../../../../components/ui/AuthorMark/AuthorMark'
import '../../../../../components/ui/AuthorMark/AuthorMark.css'
import './InteractiveMetadataSidebar.css'

interface InteractiveMetadataSidebarProps {
  paper: Paper
  onCopyText?: (text: string, label: string) => void
}

export const InteractiveMetadataSidebar: React.FC<InteractiveMetadataSidebarProps> = ({
  paper,
  onCopyText,
}) => {
  return (
    <div className="focused-sidebar-card interactive-meta-card">
      <div className="focused-sidebar-card__header">
        <div className="focused-sidebar-card__title-wrap">
          <Sparkles size={15} className="text-[var(--color-accent-3)]" />
          <h3 className="focused-sidebar-card__title">Interactive Metadata</h3>
        </div>
        <span className="interactive-meta-tag">Filters</span>
      </div>

      <div className="interactive-meta-list">
        {/* Genre / Subject */}
        {paper.genre && (
          <div className="interactive-meta-row">
            <span className="interactive-meta-row__label">
              <Tag size={12} />
              <span>Genre</span>
            </span>
            <Link
              to={`/library?genre=${encodeURIComponent(paper.genre)}`}
              className="interactive-pill interactive-pill--genre"
              title={`Explore all papers in ${paper.genre}`}
            >
              <span>{paper.genre}</span>
              <ExternalLink size={11} className="pill-arrow" />
            </Link>
          </div>
        )}

        {/* Authors */}
        {paper.authors && paper.authors.length > 0 && (
          <div className="interactive-meta-row">
            <span className="interactive-meta-row__label">
              <Globe size={12} />
              <span>Authors ({paper.authors.length})</span>
            </span>
            <div className="interactive-meta-wrap">
              {paper.authors.map(author => (
                <Link
                  key={author.name}
                  to={`/library?author=${encodeURIComponent(author.name.replace(/[\^*]+$/, '').trim())}`}
                  className="interactive-pill"
                  title={`View all research by ${author.name}`}
                >
                  <FormattedAuthorName name={author.name} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Institutions */}
        {paper.institutions && paper.institutions.length > 0 && (
          <div className="interactive-meta-row">
            <span className="interactive-meta-row__label">
              <Building2 size={12} />
              <span>Institutions</span>
            </span>
            <div className="interactive-meta-wrap">
              {paper.institutions.map(inst => (
                <Link
                  key={inst.name}
                  to={`/library?institution=${encodeURIComponent(inst.name)}`}
                  className="interactive-pill"
                  title={`View papers from ${inst.name}`}
                >
                  <span className="truncate max-w-[210px]">{inst.name}</span>
                  {inst.location && <span className="pill-sub">({inst.location})</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Publication Year & Full Date */}
        <div className="interactive-meta-row">
          <span className="interactive-meta-row__label">
            <Calendar size={12} />
            <span>Publication Date</span>
          </span>
          <div className="interactive-meta-actions">
            <Link
              to={`/library?year=${encodeURIComponent(String(paper.year))}`}
              className="interactive-pill font-mono font-medium"
              title={`View papers published in ${paper.year}`}
            >
              <span>{paper.year}</span>
            </Link>
            {paper.publishedDate && (
              <span className="interactive-subtext">
                <Clock size={11} />
                <span>{paper.publishedDate}</span>
              </span>
            )}
          </div>
        </div>

        {/* DOI */}
        {paper.doi && (
          <div className="interactive-meta-row">
            <span className="interactive-meta-row__label">
              <Hash size={12} />
              <span>DOI Identifier</span>
            </span>
            <div className="interactive-meta-actions">
              <a
                href={paper.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-pill font-mono text-xs"
                title="Open DOI external resolver"
              >
                <span className="truncate max-w-[170px]">{paper.doiCode || paper.doi}</span>
                <ExternalLink size={11} />
              </a>
              {onCopyText && (
                <button
                  type="button"
                  onClick={() => onCopyText(paper.doiCode || paper.doi, 'DOI')}
                  className="interactive-mini-btn"
                  title="Copy DOI to clipboard"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        )}

        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="interactive-meta-row">
            <span className="interactive-meta-row__label">
              <Tag size={12} />
              <span>Keywords</span>
            </span>
            <div className="interactive-meta-wrap">
              {paper.keywords.map(kw => (
                <Link
                  key={kw}
                  to={`/library?keyword=${encodeURIComponent(kw)}`}
                  className="interactive-keyword-pill"
                  title={`View papers tagged with "${kw}"`}
                >
                  <span>#{kw}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Verification and License */}
        <div className="interactive-meta-footer">
          <div className="interactive-license-row">
            <ShieldCheck size={13} className="text-[var(--color-accent-2)]" />
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {paper.license || 'Creative Commons CC-BY 4.0'}
            </span>
          </div>
          {paper.verification === 'verified' && (
            <div className="interactive-verified-row">
              <CheckCircle2 size={12} className="text-[var(--color-accent-2)]" />
              <span className="text-xs font-medium text-[var(--color-accent-2)]">Verified Archive Record</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
