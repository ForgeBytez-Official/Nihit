import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import './AboutTeam.css'

export function AboutTeam() {
  const teamMembers = [
    {
      name: 'Curatorial & Review Board',
      role: 'Literature Verification',
      bio: 'Ensuring DOI precision, peer-review validation, and structured accuracy across agricultural and biological sciences.'
    },
    {
      name: 'Open Archive Engineering',
      role: 'Platform & Indexing Architecture',
      bio: 'Designing responsive web reader interfaces, metadata schemas, and fast search indexing for uninterrupted access.'
    },
    {
      name: 'Scholarly Communications',
      role: 'Institutional Outreach',
      bio: 'Connecting university departments and independent researchers across Bangladesh to bring their work to the open archive.'
    }
  ]

  return (
    <section className="about-team-section">
      <div className="container">
        <div className="about-section-header">
          <span className="about-section-eyebrow">Collective Governance</span>
          <h2 className="about-section-title">Who Maintains the Archive</h2>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member, i) => (
            <div key={i} className="about-team-card">
              <div className="about-team-avatar">
                <Users size={20} className="text-[var(--color-accent-1)]" />
              </div>
              <h3 className="about-team-name">{member.name}</h3>
              <span className="about-team-role">{member.role}</span>
              <p className="about-team-bio">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Action CTA Box */}
        <div className="about-cta-banner">
          <div className="about-cta-text">
            <h3>Interested in Contributing or Sponsoring an Archive Dataset?</h3>
            <p>nihit is developed under the digital studio <strong>forgebytez</strong> based in Chittagong. We welcome research submissions from scholars and university faculties.</p>
          </div>
          <div className="about-cta-actions">
            <Link to="/contact" className="about-cta-btn about-cta-btn--primary">
              <span>Contact Editorial Team</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/library" className="about-cta-btn about-cta-btn--secondary">
              <span>Explore the Library</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutTeam

