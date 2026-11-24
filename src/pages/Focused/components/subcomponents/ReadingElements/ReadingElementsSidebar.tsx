import React from 'react'
import {
  Download,
  Share2,
  Maximize2,
  Printer,
  Copy,
  BookOpen,
  Eye,
  Check,
  Compass,
} from 'lucide-react'
import type { Paper } from '../../../../../lib/paperTypes'
import './ReadingElementsSidebar.css'

interface ReadingElementsSidebarProps {
  paper?: Paper
  isFocusedMode: boolean
  isDeepFocus: boolean
  onToggleFocusMode: () => void
  onToggleDeepFocus: () => void
  onDownload: () => void
  onShare: () => void
  onPrint: () => void
  onPreviewPdf: () => void
  onCopyCitation: () => void
}

export const ReadingElementsSidebar: React.FC<ReadingElementsSidebarProps> = ({
  isFocusedMode,
  isDeepFocus,
  onToggleFocusMode,
  onToggleDeepFocus,
  onDownload,
  onShare,
  onPrint,
  onPreviewPdf,
  onCopyCitation,
}) => {
  return (
    <div className="focused-sidebar-card reading-elements-card">
      {/* Vertically stacked floating tabs attached to the LEFT outer edge of the container */}
      <div className="reading-elements-tabs-stack">
        {/* Tab 1: Focus Mode */}
        {(!isDeepFocus || isFocusedMode) && (
          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`reading-elements-outset-tab reading-elements-outset-tab--focus ${
              isFocusedMode ? 'reading-elements-outset-tab--active' : ''
            }`}
            title={isFocusedMode ? 'Exit Focused Mode' : 'Enter Focused Mode (Hide Sidebars)'}
            aria-label={isFocusedMode ? 'Exit Focused Mode' : 'Enter Focused Mode'}
          >
            <span className="reading-elements-outset-tab__icon">
              {isFocusedMode ? <Check size={14} /> : <Eye size={14} />}
            </span>
            <span className="reading-elements-outset-tab__label">
              {isFocusedMode ? 'Exit Focus' : 'Focus Mode'}
            </span>
          </button>
        )}

        {/* Tab 2: Deep Focus Mode */}
        {(!isFocusedMode || isDeepFocus) && (
          <button
            type="button"
            onClick={onToggleDeepFocus}
            className={`reading-elements-outset-tab reading-elements-outset-tab--deep ${
              isDeepFocus ? 'reading-elements-outset-tab--active' : ''
            }`}
            title={isDeepFocus ? 'Exit Deep Focus (ESC)' : 'Enter Deep Focus (Full Screen)'}
            aria-label={isDeepFocus ? 'Exit Deep Focus' : 'Enter Deep Focus'}
          >
            <span className="reading-elements-outset-tab__icon">
              {isDeepFocus ? <Check size={14} /> : <Maximize2 size={14} />}
            </span>
            <span className="reading-elements-outset-tab__label">
              {isDeepFocus ? 'Exit Deep' : 'Deep Focus'}
            </span>
          </button>
        )}
      </div>

      <div className="focused-sidebar-card__header">
        <div className="focused-sidebar-card__title-wrap">
          <Compass size={15} className="text-[var(--color-accent-1)]" />
          <h3 className="focused-sidebar-card__title">Reading Elements</h3>
        </div>
      </div>

      {/* Reading Modes Section (Active on mobile/tablet) */}
      <div className="reading-elements-section reading-elements-section--modes">
        <span className="reading-elements-label">Reading Modes</span>
        <div className="reading-action-row">
          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`reading-action-btn ${
              isFocusedMode ? 'reading-action-btn--mode-active' : 'reading-action-btn--subtle'
            }`}
            title={isFocusedMode ? 'Exit Focused Mode' : 'Enter Focused Mode'}
          >
            {isFocusedMode ? <Check size={14} /> : <Eye size={14} />}
            <span>{isFocusedMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleDeepFocus}
            className={`reading-action-btn ${
              isDeepFocus ? 'reading-action-btn--deep-active' : 'reading-action-btn--subtle'
            }`}
            title={isDeepFocus ? 'Exit Deep Focus' : 'Deep Focus'}
          >
            {isDeepFocus ? <Check size={14} /> : <Maximize2 size={14} />}
            <span>{isDeepFocus ? 'Exit Deep' : 'Deep Focus'}</span>
          </button>
        </div>
      </div>

      {/* Document Operations */}
      <div className="reading-elements-section">
        <span className="reading-elements-label">Paper Operations</span>
        <div className="reading-elements-actions">
          {/* Read Original PDF */}
          <button
            type="button"
            onClick={onPreviewPdf}
            className="reading-action-btn reading-action-btn--primary"
            title="Open paper PDF directly"
          >
            <BookOpen size={14} />
            <span>Read Original PDF</span>
          </button>

          {/* Download Original PDF */}
          <button
            type="button"
            onClick={onDownload}
            className="reading-action-btn reading-action-btn--secondary"
            title="Download PDF file"
          >
            <Download size={14} />
            <span>Download Paper</span>
          </button>

          {/* Share & Print row */}
          <div className="reading-action-row">
            <button
              type="button"
              onClick={onShare}
              className="reading-action-btn reading-action-btn--subtle"
              title="Share research paper link"
            >
              <Share2 size={13} />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="reading-action-btn reading-action-btn--subtle"
              title="Print document"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
          </div>

          {/* Copy citation */}
          <button
            type="button"
            onClick={onCopyCitation}
            className="reading-action-btn reading-action-btn--subtle"
            title="Copy paper APA citation"
          >
            <Copy size={13} />
            <span>Copy APA Citation</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReadingElementsSidebar
