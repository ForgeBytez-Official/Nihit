import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { animFadeUp, animStaggerContainer } from '../../lib/animations'
import { getPaperById } from '../../data/research_papers/researchPapers'
import { downloadFile, paperDownloadUrl, paperDownloadName } from '../../functions/download/download'
import { openPdfInTab } from '../../functions/pdf_preview/pdfPreview'
import { citationFormats } from '../../functions/citation/citation'
import { printPaper } from '../../functions/print/print'
import { isLocalhost, copyToClipboard } from '../../functions/share/share'
import { useToast } from '../../components/ui/Toast'

// Subcomponents modularly organized in components/subcomponents/
import {
  MainPaperHeader,
  MainAbstractContainer,
  MainPaperSections,
  MainCitationContainer,
  type CitationTab,
  ReadingElementsSidebar,
  PaperIndexSidebar,
  InteractiveMetadataSidebar,
} from './components'

import './FocusedPaper.css'

export default function FocusedPaper() {
  const { id = '' } = useParams()
  const paper = useMemo(() => getPaperById(id), [id])

  // UI state
  const [activeCitationTab, setActiveCitationTab] = useState<CitationTab>('source')
  const [citationCopied, setCitationCopied] = useState(false)
  const [isFocusedMode, setIsFocusedMode] = useState(false)
  const [isDeepFocus, setIsDeepFocus] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string>('section-abstract')

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    setIsFocusedMode(false)
    setIsDeepFocus(false)
    document.body.classList.remove('deep-focus-active')
    document.body.classList.remove('deep-focus-scrolled-down')
    window.scrollTo(0, 0)
  }, [id])

  // Toast feedback helper via global Toast context
  const { addToast } = useToast()

  const showNotification = useCallback((title: string, urgency: 'mode' | 'success' | 'info' | 'urgent' = 'info', subtitle?: string) => {
    addToast({
      title,
      message: subtitle,
      urgency,
      durationMs: 3200,
    })
  }, [addToast])

  // Cleanup classes when navigating away or unmounting
  useEffect(() => {
    return () => {
      document.body.classList.remove('deep-focus-active')
      document.body.classList.remove('deep-focus-scrolled-down')
    }
  }, [])

  // In Deep Focus mode, track scroll down so navbar smoothly glides away and never re-appears
  // until user exits Deep Focus mode
  useEffect(() => {
    if (!isDeepFocus) {
      document.body.classList.remove('deep-focus-scrolled-down')
      return
    }

    const handleDeepScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0
      if (scrollY > 50) {
        document.body.classList.add('deep-focus-scrolled-down')
      }
    }

    window.addEventListener('scroll', handleDeepScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleDeepScroll)
    }
  }, [isDeepFocus])

  // Fullscreen management for Deep Focus
  const toggleDeepFocus = useCallback(async () => {
    if (!isDeepFocus) {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen?.()
        }
      } catch {
        // Fallback gracefully if fullscreen request is blocked
      }
      setIsDeepFocus(true)
      setIsFocusedMode(false)
      document.body.classList.add('deep-focus-active')
      showNotification('Deep Focus Mode enabled', 'mode')
    } else {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen?.()
        } catch {
          // ignore
        }
      }
      setIsDeepFocus(false)
      document.body.classList.remove('deep-focus-active')
      document.body.classList.remove('deep-focus-scrolled-down')
      showNotification('Exited Deep Focus Mode', 'info')
    }
  }, [isDeepFocus, showNotification])

  // Toggle Focused Mode
  const toggleFocusedMode = useCallback(() => {
    if (isDeepFocus) {
      if (document.fullscreenElement) {
        try {
          document.exitFullscreen?.()
        } catch {
          // ignore
        }
      }
      setIsDeepFocus(false)
      document.body.classList.remove('deep-focus-active')
      document.body.classList.remove('deep-focus-scrolled-down')
    }
    setIsFocusedMode(prev => {
      const next = !prev
      if (next) {
        showNotification('Focus Mode enabled', 'mode')
      } else {
        showNotification('Focus Mode disabled', 'info')
      }
      return next
    })
  }, [isDeepFocus, showNotification])

  // Listen for native ESC or fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isDeepFocus) {
        setIsDeepFocus(false)
        document.body.classList.remove('deep-focus-active')
        document.body.classList.remove('deep-focus-scrolled-down')
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDeepFocus) {
        toggleDeepFocus()
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('deep-focus-active')
      document.body.classList.remove('deep-focus-scrolled-down')
    }
  }, [isDeepFocus, toggleDeepFocus])

  // Intersection observer for section tracking
  useEffect(() => {
    const sectionElements = document.querySelectorAll<HTMLElement>('[data-section-id]')
    if (sectionElements.length === 0) return

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const secId = entry.target.getAttribute('data-section-id')
            if (secId) {
              setActiveSectionId(secId)
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '-15% 0px -60% 0px',
        threshold: 0,
      }
    )

    sectionElements.forEach(el => observerRef.current?.observe(el))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [paper, isFocusedMode, isDeepFocus])

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      const navOffset = isDeepFocus ? 25 : 85
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveSectionId(sectionId)
    }
  }

  if (!paper) {
    return (
      <main className="focused-page">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={animFadeUp} className="focused-404">
            <span className="focused-404__code">404</span>
            <h1 className="focused-404__title">Paper Not Found</h1>
            <p className="focused-404__text">
              We couldn't locate any research paper with identifier <code className="focused-404__mono">{id}</code> in the nihit archive.
            </p>
            <div className="focused-404__actions">
              <Link to="/library" className="focused-btn focused-btn--primary">
                <BookOpen size={16} />
                <span>Browse Entire Library</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  const handleDownload = () => {
    downloadFile(paperDownloadUrl(paper), { filename: paperDownloadName(paper) })
    showNotification('Download started')
  }

  const handlePreview = () => {
    openPdfInTab(paper.pdf)
  }

  const handleShare = async () => {
    // On localhost the Web Share API is unreliable, so the button is degraded:
    // it copies the exact address-bar URL and reports that in the toast.
    // On the live site it copies the current page URL and reports it nicely.
    const shareUrl = window.location.href

    try {
      const copied = await copyToClipboard(shareUrl)
      if (!copied) {
        showNotification('Unable to copy link', 'urgent')
        return
      }
      if (isLocalhost()) {
        showNotification('Link copied to clipboard', 'info', shareUrl)
      } else {
        showNotification('Link copied to clipboard', 'success', shareUrl)
      }
    } catch {
      showNotification('Unable to copy link', 'urgent')
    }
  }

  const handlePrint = async () => {
    try {
      await printPaper(paper.pdf)
      showNotification('Opening print dialog...', 'info')
    } catch {
      showNotification('Unable to launch print window', 'urgent')
    }
  }

  const handleCopyCitation = async (fmt: CitationTab = activeCitationTab) => {
    const { [fmt]: text } = citationFormats(paper)
    const label = fmt === 'source' ? 'Source' : fmt.toUpperCase()
    try {
      await navigator.clipboard.writeText(text || '')
      setCitationCopied(true)
      showNotification(`${label} citation copied to clipboard!`, 'success')
      setTimeout(() => setCitationCopied(false), 2200)
    } catch {
      showNotification('Unable to copy citation', 'urgent')
    }
  }

  const handleCopyArbitrary = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showNotification(`${label} copied to clipboard!`, 'success')
    } catch {
      showNotification(`Failed to copy ${label}`, 'urgent')
    }
  }

  const currentCitation = citationFormats(paper)[activeCitationTab]

  return (
    <main
      className={`focused-page ${isFocusedMode ? 'focused-page--focus-mode' : ''} ${
        isDeepFocus ? 'focused-page--deep-focus' : ''
      }`}
    >
      <div className="container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animStaggerContainer}
          className={`focused-layout ${isFocusedMode || isDeepFocus ? 'focused-layout--focus-mode' : ''}`}
        >
          {/* =================================================================
              MAIN CONTENT AREA
              ================================================================= */}
          <article className="focused-main-area">
            {/* 1-5. Header: Paper Name, Authors, Genre, Institution, Publication Date */}
            <motion.div variants={animFadeUp}>
              <MainPaperHeader paper={paper} />
            </motion.div>

            {/* 6. Abstract Area */}
            {paper.abstract && (
              <motion.div variants={animFadeUp}>
                <MainAbstractContainer abstract={paper.abstract} />
              </motion.div>
            )}

            {/* 7. Main Paper Sections */}
            <motion.div variants={animFadeUp}>
              <MainPaperSections paper={paper} sections={paper.sections || []} />
            </motion.div>

            {/* 8. Citation Container (Hidden in Deep Focus mode) */}
            <AnimatePresence>
              {!isDeepFocus && (
                <motion.div
                  key="main-citation-block"
                  variants={animFadeUp}
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MainCitationContainer
                    currentCitation={currentCitation || ''}
                    activeTab={activeCitationTab}
                    copied={citationCopied}
                    onTabChange={setActiveCitationTab}
                    onCopy={() => handleCopyCitation(activeCitationTab)}
                    hasSourceCitation={Boolean(paper.citations?.source || paper.citations?.sourceCitation)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </article>

          {/* =================================================================
              SIDEBAR AREA
              All 3 containers scroll naturally with CSS sticky:
              1. Reading Elements (Top - includes outset sticky Focus/Deep buttons)
              2. Paper Index (Middle - Centered in viewport height, stops at top/bottom)
              3. Interactive Metadata (Bottom)
              ================================================================= */}
          <aside className="focused-sidebars">
            <div className="focused-sidebars__column">
              {/* 1. Reading Elements (Top) */}
              <div className="focused-sidebar-item">
                <ReadingElementsSidebar
                  paper={paper}
                  isFocusedMode={isFocusedMode}
                  isDeepFocus={isDeepFocus}
                  onToggleFocusMode={toggleFocusedMode}
                  onToggleDeepFocus={toggleDeepFocus}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onPrint={handlePrint}
                  onPreviewPdf={handlePreview}
                  onCopyCitation={() => handleCopyCitation('apa')}
                />
              </div>

              {/* 2. Paper Index (Middle - Pure CSS sticky centered on viewport height) */}
              <div className="focused-sidebar-item focused-sidebar-item--index">
                <PaperIndexSidebar
                  sections={paper.sections || []}
                  activeSectionId={activeSectionId}
                  onSectionClick={scrollToSection}
                />
              </div>

              {/* 3. Interactive Metadata (Bottom) */}
              <div className="focused-sidebar-item">
                <InteractiveMetadataSidebar
                  paper={paper}
                  onCopyText={handleCopyArbitrary}
                />
              </div>
            </div>
          </aside>
        </motion.div>
      </div>
    </main>
  )
}
