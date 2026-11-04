import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="page-not-found">
      <div className="page-not-found__inner container">
        <div className="page-not-found__icon-wrap">
          <span className="page-not-found__icon">404</span>
        </div>
        <h1 className="page-not-found__title">Page not found</h1>
        <p className="page-not-found__description">
          The page you're looking for doesn't exist or has been moved.
          You might find what you need in the library instead.
        </p>
        <div className="page-not-found__actions">
          <Link to="/" className="btn btn--primary">
            <Home size={16} />
            <span>Back to home</span>
          </Link>
          <Link to="/library" className="btn btn--secondary">
            Browse papers
          </Link>
        </div>
      </div>
    </main>
  )
}