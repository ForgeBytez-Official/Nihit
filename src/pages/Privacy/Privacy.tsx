import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import { animFadeUp } from '../../lib/animations'
import '../Terms/Terms.css'

export default function Privacy() {
  return (
    <main className="legal-page">
      <div className="container">
        <motion.div initial="hidden" animate="visible" variants={animFadeUp} className="legal-page__header">
          <Link to="/" className="legal-page__back">
            <ArrowLeft size={16} />
            <span>Return to Archive</span>
          </Link>
          <div className="legal-page__badge">
            <Lock size={14} className="text-[var(--color-accent-2)]" />
            <span>User Rights & Privacy Protocols</span>
          </div>
          <h1 className="legal-page__title">Privacy Policy</h1>
          <p className="legal-page__subtitle">
            Effective Date: October 2026 · nihit is an open-source initiative by <strong>forgebytez</strong>.
          </p>
        </motion.div>

        <motion.article initial="hidden" animate="visible" variants={animFadeUp} className="legal-page__card">
          <section className="legal-page__section">
            <h2>1. Zero-Tracking & No Invasive Cookies</h2>
            <p>
              nihit is engineered around digital privacy. We do <strong>not</strong> track personal browsing habits, deploy third-party advertising cookies, or fingerprint user devices. 
              The reading state, including Deep Focus mode preference, is stored entirely locally on your machine.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. No Mandatory User Accounts</h2>
            <p>
              Every paper in our catalog can be read, searched, filtered, and downloaded without requiring an account, email verification, or registration wall. 
              Academic scholarship should be universally accessible without surveillance.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>3. Contact & Submission Inquiries</h2>
            <p>
              When you submit a message or propose a paper via our Contact portal, we receive only the details you explicitly provide (your name, email address, topic, and message). 
              This information is used exclusively to evaluate paper submissions, process errata, or respond to your scholarly inquiry. We never share, sell, or commercialize contact data.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>4. Organization & Stewardship</h2>
            <p>
              nihit is operated and developed under <strong>forgebytez</strong>, a digital studio based in Chittagong, Bangladesh (<a href="https://forgebytez.pages.dev" target="_blank" rel="noopener noreferrer">forgebytez.pages.dev</a>). 
              Questions regarding privacy safeguards or repository architecture may be directed to <a href="mailto:hello@niheet.dev">hello@niheet.dev</a>.
            </p>
          </section>
        </motion.article>
      </div>
    </main>
  )
}
