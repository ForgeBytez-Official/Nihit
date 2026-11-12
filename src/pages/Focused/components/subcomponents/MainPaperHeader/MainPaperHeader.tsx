import React from 'react'
import type { Paper } from '../../../../../lib/paperTypes'
import { FormattedAuthorName } from '../../../../../components/ui/AuthorMark/AuthorMark'
import '../../../../../components/ui/AuthorMark/AuthorMark.css'
import './MainPaperHeader.css'

interface MainPaperHeaderProps {
  paper: Paper
}

export const MainPaperHeader: React.FC<MainPaperHeaderProps> = ({ paper }) => {
  return (
    <header className="main-paper-header">
      {/* 1. Paper Name */}
      <h1 className="main-paper-title">{paper.title}</h1>

      {/* 2. Authors (Clean, unobtrusive inline list) */}
      <div className="main-paper-authors">
        <span className="main-paper-label">Authors:</span>
        <div className="main-paper-authors__list">
          {paper.authors.map((author, idx) => (
            <span key={author.name} className="main-paper-author-item">
              <span className="main-paper-author-name">
                <FormattedAuthorName name={author.name} />
              </span>
              {idx < paper.authors.length - 1 && (
                <span className="main-paper-sep">,</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Metadata Wrapper */}
      <div className="main-paper-meta-container">
        {/* Top Row: Genre, Published Date, and Status (Evenly spaced) */}
        <div className="main-paper-meta-row">
          {/* Genre */}
          <div className="main-paper-meta-col">
            <span className="main-paper-label">Genre</span>
            <span className="main-paper-value main-paper-value--genre">{paper.genre}</span>
          </div>

          <span className="main-paper-meta-divider" aria-hidden />

          {/* Publication Date */}
          <div className="main-paper-meta-col">
            <span className="main-paper-label">Published</span>
            <span className="main-paper-value">
              {paper.publishedDate || paper.year}
            </span>
          </div>

          {/* Verified scholarly note */}
          <>
            <span className="main-paper-meta-divider" aria-hidden />
            <div className="main-paper-meta-col">
              <span className="main-paper-label">Status</span>
              <span className={`main-paper-value ${paper.verification === 'verified' ? 'main-paper-value--verified' : 'main-paper-value--unverified'}`}>
                {paper.verification === 'verified' ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </>
        </div>

        {/* Bottom Row: Institution */}
        {paper.institutions && paper.institutions.length > 0 && (
          <div className="main-paper-institution-row">
            <span className="main-paper-label">Institution</span>
            <span className="main-paper-value">
              {paper.institutions.map(inst => inst.name).join(' · ')}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}