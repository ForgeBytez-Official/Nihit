import { Link } from 'react-router-dom'
import { Building2, Globe2, ExternalLink } from 'lucide-react'
import './HomeInstitutions.css'

export function HomeInstitutions() {
  const institutions = [
    'Bangladesh Agricultural University (BAU)',
    'University of Dhaka',
    'Bangladesh Livestock Research Institute',
    'Bangabandhu Sheikh Mujibur Rahman Agricultural University',
    'Patuakhali Science and Technology University',
  ]

  return (
    <section className="home-institutions-section">
      <div className="container">
        <div className="home-institutions-banner">
          <div className="home-institutions-info">
            <span className="home-institutions-eyebrow">Academic Coverage</span>
            <h3 className="home-institutions-title">Partnering with Leading Scholars and Universities</h3>
            <p className="home-institutions-desc">
              Papers in the nihit catalog represent seminal research published in Bangladesh Agricultural University, 
              veterinary councils, and international open scientific forums.
            </p>
            <div className="home-institutions-pills">
              {institutions.map((inst, index) => (
                <span key={index} className="home-institution-pill">
                  <Building2 size={13} className="text-[var(--color-accent-1)]" />
                  <span>{inst}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="home-institutions-cta">
            <div className="home-institutions-cta-card">
              <Globe2 size={32} className="text-[var(--color-accent-2)]" />
              <h4>Submit Your Research</h4>
              <p>Have an open-access paper or dataset you want indexed in the nihit archive?</p>
              <Link to="/contact" className="home-institutions-cta-btn">
                <span>Contact Submissions Team</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeInstitutions

