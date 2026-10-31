import { motion } from 'framer-motion'
import { animFadeUp, animStaggerContainer } from '../../lib/animations'
import { getPaperCount, getGenres } from '../../data/research_papers/researchPapers'
import './AboutIntro.css'

export function AboutIntro() {
  const count = getPaperCount()
  const genres = getGenres()

  return (
    <section className="about-intro">
      <div className="container">
        <motion.div initial="hidden" animate="visible" variants={animFadeUp} className="about-intro__header">
          <h1 className="about-intro__title">
            Advancing Scientific Transparency & Open Scholarship
          </h1>
          <p className="about-intro__lead">
            nihit was conceived to bridge the gap between high-impact scientific inquiry produced in
            Bangladesh and equitable global access. We build infrastructure that treats scientific literature
            as a public good.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animStaggerContainer}
          className="about-intro__stats-grid"
        >
          <motion.div variants={animFadeUp} className="about-intro__stat-card">
            <span className="about-intro__stat-num text-[var(--color-accent-1)]">{count}</span>
            <span className="about-intro__stat-title">Cataloged Papers</span>
            <span className="about-intro__stat-subtitle">Full text & metadata indexed</span>
          </motion.div>

          <motion.div variants={animFadeUp} className="about-intro__stat-card">
            <span className="about-intro__stat-num text-[var(--color-accent-2)]">{genres.length}</span>
            <span className="about-intro__stat-title">Research Genres</span>
            <span className="about-intro__stat-subtitle">From Agronomy to Biomedicine</span>
          </motion.div>

          <motion.div variants={animFadeUp} className="about-intro__stat-card">
            <span className="about-intro__stat-num text-[var(--color-accent-3)]">CC BY 4.0</span>
            <span className="about-intro__stat-title">Licensing Model</span>
            <span className="about-intro__stat-subtitle">Free to share, adapt & cite</span>
          </motion.div>

          <motion.div variants={animFadeUp} className="about-intro__stat-card">
            <span className="about-intro__stat-num text-[var(--color-accent-1)]">0৳</span>
            <span className="about-intro__stat-title">Cost to Read or Publish</span>
            <span className="about-intro__stat-subtitle">Completely open-access</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutIntro
