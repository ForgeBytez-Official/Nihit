import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../lib/utils'
import {
  Send,
} from 'lucide-react'
import './Navbar.css'
import { UniversalBackButton } from './subcomponents/UniversalBackButton/UniversalBackButton'
import { UniversalNavigationIndicator } from './subcomponents/UniversalNavigationIndicator/UniversalNavigationIndicator'
import { BackToTopButton } from './subcomponents/BackToTopButton/BackToTopButton'

interface NavItem {
  id: string
  to: string
  label: string
  exact?: boolean
}

// Sub-links on hover completely removed per user request
const navItems: NavItem[] = [
  {
    id: 'home',
    to: '/',
    label: 'Home',
    exact: true,
  },
  {
    id: 'library',
    to: '/library',
    label: 'Library',
    exact: false,
  },
  {
    id: 'about',
    to: '/about',
    label: 'About',
    exact: true,
  },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)

  const location = useLocation()
  const lastScrollYRef = useRef(0)

  // Sub-bar navigation pathway & back button: shown when navigating deep inside papers/pages
  const isMainPage = ['/', '/library', '/about', '/contact', '/contact-us'].includes(location.pathname)
  const showBackAndPath = !isMainPage

  // Scroll detection:
  // - unscrolled: scrollY <= 15
  // - scrolled: scrollY > 15
  // - scrolling down past 75px: smooth hide navbar container towards top, leaving subbar in view
  // - scrolling up: brings navbar back down (UNLESS in deep-focus-navbar-hidden mode)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0
      const isDeepFocus = document.body.classList.contains('deep-focus-active')

      if (currentScrollY <= 15) {
        setIsScrolled(false)
        if (!isDeepFocus) {
          setIsScrollingDown(false)
        }
      } else {
        setIsScrolled(true)

        if (currentScrollY > lastScrollYRef.current && currentScrollY > 75) {
          setIsScrollingDown(true)
        } else if (currentScrollY < lastScrollYRef.current) {
          // If Deep Focus mode is active, do NOT show the navbar when scrolling up
          if (!isDeepFocus) {
            setIsScrollingDown(false)
          }
        }
      }

      lastScrollYRef.current = currentScrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  const prevPathRef = useRef(location.pathname)
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname
      setMobileOpen(false)
    }
  }, [location.pathname])

  const isActive = (to: string, exact = true) => {
    if (exact) {
      return location.pathname === to
    }
    return location.pathname.startsWith(to)
  }

  return (
    <div
      className={cn(
        'navbar-wrapper',
        isScrolled ? 'navbar-wrapper--scrolled' : 'navbar-wrapper--unscrolled',
        isScrollingDown && !mobileOpen && 'navbar-wrapper--hidden',
        mobileOpen && 'navbar-wrapper--mobile-open',
      )}
    >
      <header className="navbar-container">
        <div className="navbar__inner">
          {/* Left: Brand name & logo */}
          <Link to="/" className="navbar__brand" aria-label="Nihit homepage">
            <span className="navbar__brand-mark" aria-hidden>
              <span className="navbar__brand-glow" />
            </span>
            <div className="navbar__brand-title-group">
              <span className="navbar__brand-text">
                Nihit
                <span className="navbar__brand-dot">.</span>
              </span>
              <span className="navbar__brand-tagline-wrap">
                <span className="navbar__brand-pulse" title="Archive Live & Active" />
                <span className="navbar__brand-tagline">BD based open archive</span>
              </span>
            </div>
          </Link>

          {/* Center: Clean page links without sub-links on hover */}
          <nav className="navbar__nav" aria-label="Main Navigation">
            {navItems.map(item => {
              const active = isActive(item.to, item.exact)

              return (
                <div key={item.id} className="navbar__item-wrapper">
                  <Link
                    to={item.to}
                    className={cn(
                      'navbar__link',
                      active && 'navbar__link--active',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="navbar__link-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="navbar__link-label">{item.label}</span>
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Right: Contact Us Button & Mobile Hamburger */}
          <div className="navbar__actions">
            <Link
              to="/contact"
              className={cn(
                'navbar__contact-btn',
                isActive('/contact', true) && 'navbar__contact-btn--active',
              )}
            >
              <span className="navbar__contact-icon">
                <Send size={13} />
              </span>
              <span>Contact Us</span>
            </Link>

            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="navbar__menu-btn md:hidden"
            >
              <span className={cn('navbar__hamburger', mobileOpen && 'navbar__hamburger--open')} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="navbar__mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="navbar__mobile-inner">
                {navItems.map(item => {
                  const active = isActive(item.to, item.exact)

                  return (
                    <div key={item.id} className="navbar__mobile-item">
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'navbar__mobile-link',
                          active && 'navbar__mobile-link--active',
                        )}
                      >
                        {item.label}
                      </Link>
                    </div>
                  )
                })}

                <div className="navbar__mobile-cta-wrapper">
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="navbar__mobile-cta-btn"
                  >
                    <Send size={15} />
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Subcomponents Strip Directly Connected Under Navbar:
          - Left: Universal Back Button (under navbar on the very left)
          - Center: Universal Directions Indicator (under center page links)
          - Right: Back To Top Button (under navbar on the very right)
          Emerges seamlessly like it's coming out from the navbar.
      */}
      <div className="navbar-subbar">
        <div className="navbar-subbar__left">
          <AnimatePresence>
            {showBackAndPath && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <UniversalBackButton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="navbar-subbar__center">
          <AnimatePresence>
            {showBackAndPath && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <UniversalNavigationIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="navbar-subbar__right">
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <BackToTopButton />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Navbar