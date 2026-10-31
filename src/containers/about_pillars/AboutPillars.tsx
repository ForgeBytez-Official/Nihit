import { Database, ShieldCheck, Cpu, Globe2 } from 'lucide-react'
import './AboutPillars.css'

export function AboutPillars() {
  const pillars = [
    {
      icon: <Database size={24} className="text-[var(--color-accent-1)]" />,
      title: 'Digital Preservation & Indexing',
      desc: 'Preserving Bangladesh’s scientific output with structured DOIs, comprehensive parsed sections, references, and permanent machine-readable indexing.'
    },
    {
      icon: <ShieldCheck size={24} className="text-[var(--color-accent-2)]" />,
      title: 'Open Science Standards',
      desc: 'Operating strictly under Creative Commons CC BY 4.0 licensing. We reject barrier paywalls, restrictive logins, and vendor lock-in.'
    },
    {
      icon: <Cpu size={24} className="text-[var(--color-accent-3)]" />,
      title: 'Advanced Reading Architecture',
      desc: 'Purpose-built reading environment offering Focus Mode, Deep Focus fullscreen immersion, interactive citation generators, and structured abstract browsing.'
    },
    {
      icon: <Globe2 size={24} className="text-[var(--color-accent-1)]" />,
      title: 'Global Academic Visibility',
      desc: 'Elevating regional research to international scientific visibility by adhering to open bibliographic standards and global indexing protocols.'
    }
  ]

  return (
    <section className="about-pillars-section">
      <div className="container">
        <div className="about-section-header">
          <span className="about-section-eyebrow">Guiding Values</span>
          <h2 className="about-section-title">Core Pillars of the nihit Archive</h2>
          <p className="about-section-desc">
            Every design decision in our platform revolves around ease of reading, provenance integrity, and unhindered academic discovery.
          </p>
        </div>

        <div className="about-pillars-grid">
          {pillars.map((pillar, i) => (
            <div key={i} className="about-pillar-card">
              <div className="about-pillar-icon">{pillar.icon}</div>
              <h3 className="about-pillar-title">{pillar.title}</h3>
              <p className="about-pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutPillars

