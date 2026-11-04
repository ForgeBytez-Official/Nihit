import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, CheckCircle2, ArrowLeft } from 'lucide-react'
import { animFadeUp } from '../../lib/animations'
import './Terms.css'

export default function Terms() {
  return (
    <main className="legal-page">
      <div className="container">
        <motion.div initial="hidden" animate="visible" variants={animFadeUp} className="legal-page__header">
          <Link to="/" className="legal-page__back">
            <ArrowLeft size={16} />
            <span>Return to Archive</span>
          </Link>
          <div className="legal-page__badge">
            <Scale size={14} className="text-[var(--color-accent-1)]" />
            <span>Legal Standards & Terms of Use</span>
          </div>
          <h1 className="legal-page__title">Terms of Service</h1>
          <p className="legal-page__subtitle">
            Effective Date: October 2026 · nihit is an open scholarly project by <strong>forgebytez</strong>.
          </p>
        </motion.div>

        <motion.article initial="hidden" animate="visible" variants={animFadeUp} className="legal-page__card">
          <section className="legal-page__section">
            <h2>1. Open Access & Licensing</h2>
            <p>
              nihit operates strictly as an open-access scholarly repository under the <strong>Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong>. 
              Users are free to share, copy, distribute, transmit, and adapt the cataloged research, provided proper attribution is given to original authors and respective publishing journals.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. Permitted Academic & Educational Use</h2>
            <p>
              Researchers, students, educators, and institutions worldwide are granted unlimited rights to:
            </p>
            <ul className="legal-page__list">
              <li><CheckCircle2 size={15} className="text-[var(--color-accent-2)]" /> Read, download, print, and search full-text PDF documents.</li>
              <li><CheckCircle2 size={15} className="text-[var(--color-accent-2)]" /> Copy and format APA, BibTeX, and DOI citations without restriction.</li>
              <li><CheckCircle2 size={15} className="text-[var(--color-accent-2)]" /> Index, text-mine, and parse structured metadata for non-commercial scholarly synthesis.</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>3. Authorship & Intellectual Property</h2>
            <p>
              All moral and intellectual rights remain with the authors and primary publisher bodies. nihit extracts, cleanses, and presents bibliographic records to maximize discovery. If you are an author or journal representative requiring errata or attribution revisions, please contact our secretariat at <a href="mailto:hello@niheet.dev">hello@niheet.dev</a>.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>4. Project Stewardship & Disclaimer</h2>
            <p>
              nihit is maintained under the digital studio <strong>forgebytez</strong> (based in Chittagong, Bangladesh). 
              The archive materials are provided "as-is" for educational and research benefit without warranties of completeness or fitness for particular legal purposes.
            </p>
          </section>
        </motion.article>
      </div>
    </main>
  )
}
