import { Sparkles } from 'lucide-react'
import ContactForm from '../../containers/contact_form/ContactForm'
import ContactFaq from '../../containers/contact_faq/ContactFaq'
import './ContactUs.css'

export default function ContactUs() {
  return (
    <main className="page-contact">
      <div className="container">
        {/* Header Eyebrow */}
        <div className="contact-page-header">
          <span className="contact-page-header__badge">
            <Sparkles size={14} className="text-[var(--color-accent-1)]" />
            Communication & Editorial Support
          </span>
          <h1 className="contact-page-header__title">Let's talk about the archive</h1>
          <p className="contact-page-header__desc">
            Whether you are submitting an open paper, reporting an erratum, or exploring institutional indexing, our team responds to every inquiry.
          </p>
        </div>

        {/* Section 1: Interactive Contact Form & Direct Outreach Details */}
        <ContactForm />

        {/* Section 2: Frequently Asked Questions Accordion */}
        <ContactFaq />
      </div>
    </main>
  )
}
