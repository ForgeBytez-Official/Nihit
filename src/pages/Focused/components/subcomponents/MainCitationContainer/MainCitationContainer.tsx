import React from 'react'
import { Quote, Copy, Check } from 'lucide-react'
import './MainCitationContainer.css'

export type CitationTab = 'source' | 'apa' | 'bibtex'

interface MainCitationContainerProps {
  currentCitation: string
  activeTab: CitationTab
  copied: boolean
  onTabChange: (tab: CitationTab) => void
  onCopy: () => void
  hasSourceCitation?: boolean
}

export const MainCitationContainer: React.FC<MainCitationContainerProps> = ({
  currentCitation,
  activeTab,
  copied,
  onTabChange,
  onCopy,
  hasSourceCitation = true,
}) => {
  const getTabLabel = (tab: CitationTab) => {
    switch (tab) {
      case 'source':
        return 'Source Citation'
      case 'apa':
        return 'APA 7th'
      case 'bibtex':
        return 'BibTeX'
    }
  }

  return (
    <section
      id="section-citation"
      data-section-id="section-citation"
      className="main-citation-box"
    >
      <div className="main-citation-box__header">
        <div className="main-citation-box__title-wrap">
          <Quote size={18} className="text-[var(--color-accent-1)]" />
          <h2 className="main-citation-box__title">Citation</h2>
        </div>
        <div className="main-citation-tabs">
          {hasSourceCitation && (
            <button
              type="button"
              onClick={() => onTabChange('source')}
              className={`main-citation-tab ${activeTab === 'source' ? 'main-citation-tab--active' : ''}`}
            >
              Source Citation
            </button>
          )}
          <button
            type="button"
            onClick={() => onTabChange('apa')}
            className={`main-citation-tab ${activeTab === 'apa' ? 'main-citation-tab--active' : ''}`}
          >
            APA 7th
          </button>
          <button
            type="button"
            onClick={() => onTabChange('bibtex')}
            className={`main-citation-tab ${activeTab === 'bibtex' ? 'main-citation-tab--active' : ''}`}
          >
            BibTeX
          </button>
        </div>
      </div>

      <div className="main-citation-box__body">
        <pre className="main-citation-code">
          <code>{currentCitation}</code>
        </pre>
        <div className="main-citation-footer">
          <button
            type="button"
            onClick={onCopy}
            className="main-citation-copy-btn"
            title="Copy formatted citation"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard' : `Copy ${getTabLabel(activeTab)}`}</span>
          </button>
          <span className="main-citation-info">
            {activeTab === 'source' ? 'Publisher / Source Citation' : 'Academic Citation Format'}
          </span>
        </div>
      </div>
    </section>
  )
}
