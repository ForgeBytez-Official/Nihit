import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import './BackToTopButton.css'

export function BackToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
      )
      const winHeight = window.innerHeight || 800
      const maxScroll = Math.max(docHeight - winHeight, 1)

      const rawPct = Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100)
      setScrollProgress(rawPct)

      // Only show when the user is not at the very top (> 40px) and not at the very bottom (< maxScroll - 25px)
      const isNotTop = scrollY > 40
      const isNotBottom = scrollY < maxScroll - 25

      setVisible(isNotTop && isNotBottom)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Radius = 15 -> circumference = 2 * PI * 15 ~= 94.248
  const radius = 15
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`back-to-top-btn ${visible ? 'back-to-top-btn--visible' : ''}`}
      aria-label={`Scroll to top, ${Math.round(scrollProgress)}% scrolled`}
      title={`Back to top (${Math.round(scrollProgress)}%)`}
    >
      <svg className="back-to-top-btn__svg" width="38" height="38" viewBox="0 0 38 38">
        {/* Track circle */}
        <circle
          className="back-to-top-btn__track"
          cx="19"
          cy="19"
          r={radius}
          strokeWidth="2.5"
        />
        {/* Progress indicator circle */}
        <circle
          className="back-to-top-btn__fill"
          cx="19"
          cy="19"
          r={radius}
          strokeWidth="2.5"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <span className="back-to-top-btn__icon">
        <ArrowUp size={14} strokeWidth={2.4} />
      </span>
      <span className="back-to-top-btn__tooltip">
        {Math.round(scrollProgress)}%
      </span>
    </button>
  )
}

export default BackToTopButton
