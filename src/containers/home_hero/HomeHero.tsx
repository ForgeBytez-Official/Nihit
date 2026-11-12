import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Library as LibraryIcon,
  ArrowRight,
  Building2,
  ChevronRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'
import { animFadeUp, animStaggerContainer } from '../../lib/animations'
import { getAllPapers, getPaperCount, getGenres } from '../../data/research_papers/researchPapers'
import { FormattedAuthorName } from '../../components/ui/AuthorMark/AuthorMark'
import '../../components/ui/AuthorMark/AuthorMark.css'
import './HomeHero.css'

export function HomeHero() {
  const papers = getAllPapers()
  const count = getPaperCount()
  const genres = getGenres()

  return (
    <section className="home-hero">
      <div className="container">
        <div className="home-hero__inner">
          <motion.div initial="hidden" animate="visible" variants={animFadeUp} className="home-hero__content">
            <h1 className="home-hero__title">
              Bangladesh's scholarship, <span className="home-hero__accent">freely accessible</span> to the world.
            </h1>

            <p className="home-hero__description">
              Nihit is an open digital research repository dedicated to scientific literature, veterinary sciences,
              agronomy, and ecological advancements. Sourced with full DOI fidelity, metadata extraction, and open licensing.
            </p>

            {/* Quick links & CTA buttons */}
            <div className="home-hero__cta-group">
              <Link to="/library" className="home-hero__cta home-hero__cta--primary">
                <BookOpen size={18} />
                <span>Explore Catalog ({count} Papers)</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="home-hero__cta home-hero__cta--secondary">
                <LibraryIcon size={18} />
                <span>About Our Mission</span>
              </Link>
            </div>

            {/* Stat Counters */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={animStaggerContainer}
              className="home-hero__stats"
            >
              <div className="home-hero__stat">
                <p className="home-hero__stat-value home-hero__stat-value--accent-1">{count}</p>
                <p className="home-hero__stat-label">papers online</p>
              </div>
              <div className="home-hero__stat">
                <p className="home-hero__stat-value home-hero__stat-value--accent-2">{genres.length}</p>
                <p className="home-hero__stat-label">research disciplines</p>
              </div>
              <div className="home-hero__stat">
                <p className="home-hero__stat-value home-hero__stat-value--accent-3">CC BY 4.0</p>
                <p className="home-hero__stat-label">open licensing</p>
              </div>
              <div className="home-hero__stat">
                <p className="home-hero__stat-value home-hero__stat-value--accent-1">100%</p>
                <p className="home-hero__stat-label">free & accessible</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Visual Spotlight Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animFadeUp}
            transition={{ delay: 0.15 }}
            className="home-hero__visual"
          >
            <div className="home-hero__preview-panel">
              <div className="home-hero__preview-header">
                <div className="home-hero__preview-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="home-hero__preview-tag">
                  <TrendingUp size={13} className="text-[var(--color-accent-1)]" />
                  Featured Spotlight
                </span>
              </div>

              {papers[0] && (
                <div className="home-hero__spotlight-card">
                  <span className="home-hero__spotlight-genre">{papers[0].genre}</span>
                  <h3 className="home-hero__spotlight-title">{papers[0].title}</h3>
                  <p className="home-hero__spotlight-authors">
                    {papers[0].authors.map((a, i) => (
                      <span key={a.name}>
                        {i > 0 && ', '}
                        <FormattedAuthorName name={a.name} />
                      </span>
                    ))}
                  </p>
                  <div className="home-hero__spotlight-footer">
                    <div className="home-hero__spotlight-meta">
                      <Building2 size={13} />
                      <span>{papers[0].journal?.name || papers[0].institutions?.[0]?.name || 'Scientific Archive'} ({papers[0].year})</span>
                    </div>
                    <Link to={`/library/${papers[0].id}`} className="home-hero__spotlight-link">
                      <span>Read Paper</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              )}

              <div className="home-hero__quick-specs">
                <div className="home-hero__spec-item">
                  <CheckCircle2 size={14} className="text-[var(--color-accent-2)]" />
                  <span>Peer-reviewed scientific journals</span>
                </div>
                <div className="home-hero__spec-item">
                  <CheckCircle2 size={14} className="text-[var(--color-accent-2)]" />
                  <span>Cross-referenced bibliography</span>
                </div>
                <div className="home-hero__spec-item">
                  <CheckCircle2 size={14} className="text-[var(--color-accent-2)]" />
                  <span>Original PDF and clean HTML format</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
