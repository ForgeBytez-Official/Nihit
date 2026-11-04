import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from '../Navbar/Navbar'
import { Footer } from '../Footer/Footer'
import { SearchBar } from '../../searchbar'
import Home from '../../../pages/Home/Home'
import Library from '../../../pages/Library/Library'
import FocusedPaper from '../../../pages/Focused/FocusedPaper'
import About from '../../../pages/About/About'
import ContactUs from '../../../pages/ContactUs/ContactUs'
import Terms from '../../../pages/Terms/Terms'
import Privacy from '../../../pages/Privacy/Privacy'
import NotFound from '../../../pages/NotFound/NotFound'
import './Layout.css'

export function Layout() {
  const location = useLocation()

  // Reset scroll whenever the route changes.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<FocusedPaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SearchBar />
      <Footer />
    </div>
  )
}

export default Layout