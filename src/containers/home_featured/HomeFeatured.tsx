import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getAllPapers } from '../../data/research_papers/researchPapers'
import { PaperCard } from '../../components/ui/PaperCard/PaperCard'
import './HomeFeatured.css'

export function HomeFeatured() {
  const papers = getAllPapers()
  const featured = papers.slice(0, 3)

  return (
    <section className="home-featured-section">
      <div className="container">
        <div className="home-section-header">
          <div>
            <span className="home-section-eyebrow">Corpus Highlights</span>
            <h2 className="home-section-title">Latest Catalog Additions</h2>
          </div>
          <Link to="/library" className="home-section-link">
            <span>View All Papers</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="home-featured-grid">
          {featured.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeFeatured

