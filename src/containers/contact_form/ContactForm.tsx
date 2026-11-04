import { useState } from 'react'
import { 
  Mail, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileUp, 
  ShieldAlert
} from 'lucide-react'
import { motion } from 'framer-motion'
import './ContactForm.css'

export function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Submit a paper',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true)
    }
  }

  return (
    <section className="contact">
      <div className="contact__inner">
        {/* Left — intro & info cards */}
        <div className="contact__intro">
          <span className="contact__eyebrow">Direct Outreach</span>
          <h2 className="contact__title">Get in touch with our curators</h2>
          <p className="contact__description">
            The nihit archive is operated by researchers and open-science advocates under <strong>forgebytez</strong>. 
            We are committed to rapid editorial assessment and technical support.
          </p>

          <ul className="contact__details">
            <li className="contact__detail">
              <span className="contact__detail-icon" aria-hidden>
                <Mail size={18} />
              </span>
              <div>
                <span className="contact__detail-label">Direct Email</span>
                <a href="mailto:hello@niheet.dev" className="contact__detail-value">
                  hello@niheet.dev
                </a>
              </div>
            </li>
            <li className="contact__detail">
              <span className="contact__detail-icon" aria-hidden>
                <MapPin size={18} />
              </span>
              <div>
                <span className="contact__detail-label">Studio & Secretariat</span>
                <span className="contact__detail-value">forgebytez · Chittagong / Dhaka</span>
              </div>
            </li>
            <li className="contact__detail">
              <span className="contact__detail-icon" aria-hidden>
                <Clock size={18} />
              </span>
              <div>
                <span className="contact__detail-label">Average Response</span>
                <span className="contact__detail-value">Within 24 to 48 business hours</span>
              </div>
            </li>
          </ul>

          <div className="contact__highlights">
            <div className="contact__highlight-item">
              <FileUp size={16} className="text-[var(--color-accent-1)]" />
              <span>Paper submissions reviewed within 5 days</span>
            </div>
            <div className="contact__highlight-item">
              <ShieldAlert size={16} className="text-[var(--color-accent-2)]" />
              <span>Prompt errata and correction handling</span>
            </div>
          </div>
        </div>

        {/* Right — interactive form */}
        <div className="contact__form-container">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="contact__success"
            >
              <div className="contact__success-icon">
                <CheckCircle2 size={36} className="text-[var(--color-accent-2)]" />
              </div>
              <h3>Message Received</h3>
              <p>
                Thank you, <strong>{formState.name}</strong>. Our editorial team will review your inquiry regarding "{formState.subject}" and get back to you at <strong>{formState.email}</strong> shortly.
              </p>
              <button 
                type="button" 
                onClick={() => {
                  setSubmitted(false)
                  setFormState({ name: '', email: '', subject: 'Submit a paper', message: '' })
                }}
                className="contact__reset-btn"
              >
                Send another inquiry
              </button>
            </motion.div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <div className="contact__form-header">
                <h3>Send a message</h3>
                <p>Fill out the fields below and we'll route it to the right department.</p>
              </div>

              <div className="contact__field">
                <label htmlFor="contact-name" className="contact__label">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="contact__input"
                  placeholder="e.g. Dr. Sadia Rahman"
                  value={formState.name}
                  onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email" className="contact__label">
                  Academic / Official Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="contact__input"
                  placeholder="you@university.edu.bd"
                  value={formState.email}
                  onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-subject" className="contact__label">
                  Topic / Department
                </label>
                <select 
                  id="contact-subject" 
                  className="contact__input contact__select"
                  value={formState.subject}
                  onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                  required
                >
                  <option value="Submit a paper">Submit a paper for indexing</option>
                  <option value="Report an issue">Report metadata / DOI erratum</option>
                  <option value="Partnership / collaboration">Institutional / University Partnership</option>
                  <option value="Press & media">Academic Press & Media</option>
                  <option value="Other">General Inquiry</option>
                </select>
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message" className="contact__label">
                  Message & Paper Details
                </label>
                <textarea
                  id="contact-message"
                  className="contact__input contact__textarea"
                  rows={5}
                  placeholder="Provide paper title, journal link, DOI, or details about your inquiry..."
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" className="contact__submit">
                <Send size={16} />
                <span>Send Message to Curators</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactForm
