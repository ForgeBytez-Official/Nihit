import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  BookOpen,
  Mail,
  Library as LibraryIcon,
  ArrowUpRight
} from 'lucide-react'
import { getPaperCount, getGenres } from '../../../data/research_papers/researchPapers'
import './Footer.css'

export function Footer() {
  const count = getPaperCount()
  const genres = getGenres()

  return (
    <footer className="footer">
      <div className="container">
        {/* Main 4-column footer body */}
        <div className="footer__grid">
          {/* Column 1: Brand & Identity & Studio */}
          <div className="footer__brand-col">
            <Link to="/" className="footer__brand">
              <span className="footer__brand-mark" aria-hidden>
                <span className="footer__brand-glow" />
              </span>
              <div className="footer__brand-title-group">
                <span className="footer__brand-text">
                  Nihit<span className="footer__brand-dot">.</span>
                </span>
                <span className="footer__brand-tagline">Open Research Archive</span>
              </div>
            </Link>

            <p className="footer__brand-desc">
              A digital research repository committed to preserving, cataloging, and disseminating
              peer-reviewed scientific literature produced across Bangladesh and global institutes.
            </p>

            {/* Studio Badge */}
            <div className="footer__studio-badge">
              <span className="footer__studio-label">A project by</span>
              <a
                href="https://forgebytez.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__studio-link"
              >
                <strong>forgebytez</strong>
                <span className="footer__studio-city">· Chittagong</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="footer__meta-pill">
              <span className="footer__pulse-dot" />
              <span>{count} Papers Active · {genres.length} Research Domains</span>
            </div>
          </div>

          {/* Column 2: Navigation & Catalog */}
          <div className="footer__col">
            <h4 className="footer__col-title">Archive Catalog</h4>
            <ul className="footer__col-list">
              <li>
                <Link to="/library" className="footer__col-link">
                  <BookOpen size={14} />
                  <span>All Research Papers</span>
                </Link>
              </li>
              <li>
                <Link to="/library?genre=agriculture" className="footer__col-link">
                  <span>Agricultural & Veterinary</span>
                </Link>
              </li>
              <li>
                <Link to="/library" className="footer__col-link">
                  <span>Methodology & Datasets</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer__col-link">
                  <LibraryIcon size={14} />
                  <span>Curatorial Standards</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Editorial */}
          <div className="footer__col">
            <h4 className="footer__col-title">Scholarly Openness</h4>
            <ul className="footer__col-list">
              <li>
                <Link to="/about" className="footer__col-link">
                  <span>About nihit</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer__col-link">
                  <Mail size={14} />
                  <span>Submit Your Paper</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer__col-link">
                  <span>Institutional Indexing</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__col-link"
                >
                  <ShieldCheck size={14} className="text-[var(--color-accent-2)]" />
                  <span>CC BY 4.0 Open License</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Reading Architecture */}
          <div className="footer__col">
            <h4 className="footer__col-title">Governance & Policy</h4>
            <ul className="footer__col-list">
              <li>
                <Link to="/terms" className="footer__col-link">
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer__col-link">
                  <span>Privacy Policy (Zero Tracking)</span>
                </Link>
              </li>
            </ul>
            <div className="footer__tech-tags">
              <span className="footer__tag-badge">Zero Paywalls</span>
              <span className="footer__tag-badge">APA & BibTeX</span>
              <span className="footer__tag-badge">PDF Viewer</span>
              <span className="footer__tag-badge">Mobile Responsive</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <span>
              © {new Date().getFullYear()} nihit Open Archive. An open initiative under{' '}
              <a
                href="https://forgebytez.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__bottom-forgebytez"
              >
                forgebytez
              </a>
              .
            </span>
          </div>

          <div className="footer__bottom-right">
            <div className="footer__bottom-links">
              <Link to="/terms" className="footer__sublink">Terms</Link>
              <span className="footer__separator">·</span>
              <Link to="/privacy" className="footer__sublink">Privacy</Link>
              <span className="footer__separator">·</span>
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__license-pill"
              >
                <ShieldCheck size={14} />
                <span>CC BY 4.0</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
