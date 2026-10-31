import './AboutWorkflow.css'

export function AboutWorkflow() {
  const workflowSteps = [
    {
      step: '01',
      title: 'Sourcing & Ingestion',
      desc: 'Scientific literature is ingested directly from verified journals, university presses, and institutional repositories with author approval.'
    },
    {
      step: '02',
      title: 'Metadata Extraction',
      desc: 'Automated and human-verified parsing extracts author affiliations, DOIs, publication dates, abstracts, methodology, and citations.'
    },
    {
      step: '03',
      title: 'Dual Reading Formats',
      desc: 'Each paper is mapped to high-fidelity PDF documents alongside a responsive web reader tailored for rapid desktop or mobile study.'
    },
    {
      step: '04',
      title: 'Citation & Dissemination',
      desc: 'Scholars generate APA and BibTeX citations instantaneously, export assets, and share research outputs worldwide.'
    }
  ]

  return (
    <section className="about-workflow-section">
      <div className="container">
        <div className="about-section-header">
          <span className="about-section-eyebrow">Standards & Process</span>
          <h2 className="about-section-title">How Research is Curated & Ingested</h2>
          <p className="about-section-desc">
            From print-ready PDF originals to interactive metadata trees, see how we transform publications into digital-first academic tools.
          </p>
        </div>

        <div className="about-workflow-grid">
          {workflowSteps.map((s, idx) => (
            <div key={idx} className="about-workflow-card">
              <span className="about-workflow-num">{s.step}</span>
              <h4 className="about-workflow-title">{s.title}</h4>
              <p className="about-workflow-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutWorkflow

