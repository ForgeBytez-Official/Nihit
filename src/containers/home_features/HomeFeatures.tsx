import { FileText, Quote, ShieldCheck, Layers } from 'lucide-react'
import './HomeFeatures.css'

export function HomeFeatures() {
  const features = [
    {
      icon: <FileText size={22} className="text-[var(--color-accent-1)]" />,
      title: 'Full Corpus & Verified PDF Text',
      description: 'Every article includes structured parsed sections, methodology details, data tables, and high-fidelity PDF reading.',
    },
    {
      icon: <Quote size={22} className="text-[var(--color-accent-2)]" />,
      title: 'Instant Formatted Citations',
      description: 'Copy APA, BibTeX, and DOI citations with one click. Integrated directly into all reading workflows.',
    },
    {
      icon: <ShieldCheck size={22} className="text-[var(--color-accent-3)]" />,
      title: 'Strict Open-Access CC BY 4.0',
      description: 'Zero paywalls, zero registrations. Guaranteed unrestricted academic dissemination worldwide.',
    },
    {
      icon: <Layers size={22} className="text-[var(--color-accent-1)]" />,
      title: 'Dedicated Focus & Deep Focus Modes',
      description: 'Immersive distraction-free reading environments with clean typography and seamless fullscreen capability.',
    },
  ]

  return (
    <section className="home-features-section">
      <div className="container">
        <div className="home-section-header home-section-header--centered">
          <span className="home-section-eyebrow">Built For Researchers</span>
          <h2 className="home-section-title">Everything You Need for Academic Exploration</h2>
          <p className="home-section-subtext">
            Engineered with clean architectural principles to elevate scholarly discovery without cognitive clutter.
          </p>
        </div>

        <div className="home-features-grid">
          {features.map((item, idx) => (
            <div key={idx} className="home-feature-card">
              <div className="home-feature-card__icon-wrap">
                {item.icon}
              </div>
              <h3 className="home-feature-card__title">{item.title}</h3>
              <p className="home-feature-card__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeFeatures

