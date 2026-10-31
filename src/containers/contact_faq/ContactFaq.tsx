import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './ContactFaq.css'

export function ContactFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'How can I submit my research paper or dataset to nihit?',
      a: 'We welcome peer-reviewed publications and verified research preprints. Submit through our contact form selecting "Submit a paper for indexing", including your paper DOI, institutional affiliation, and links to the full-text PDF or repository.'
    },
    {
      q: 'Are there any publication fees, processing charges, or paywalls?',
      a: 'No. nihit is 100% free and open-access under the Creative Commons CC BY 4.0 license. We do not charge reading fees, article processing charges (APCs), or platform subscription fees.'
    },
    {
      q: 'What is forgebytez and how is it connected to nihit?',
      a: 'nihit is designed and engineered by forgebytez, a digital technology studio based in Chittagong, Bangladesh (forgebytez.pages.dev). The studio develops public software and open-access scholarly tools.'
    },
    {
      q: 'Can university departments partner to index their journals?',
      a: 'Yes. We actively collaborate with academic faculties, library systems, and journal editorial boards in Bangladesh to index historical back-catalogs and current volumes.'
    },
    {
      q: 'How are DOI links and metadata accuracy verified?',
      a: 'Our curatorial team cross-checks all Crossref and publisher DOIs, extracts standardized author affiliations, and validates bibliographic citations before inclusion in the library.'
    }
  ]

  return (
    <section className="contact-faq-section">
      <div className="contact-faq-header">
        <span className="contact-faq-eyebrow">Common Inquiries</span>
        <h2 className="contact-faq-title">Frequently Asked Questions</h2>
        <p className="contact-faq-desc">Answers to common questions about submitting, reading, and indexing papers.</p>
      </div>

      <div className="contact-faq-list">
        {faqs.map((faq, index) => {
          const isOpen = activeFaq === index
          return (
            <div key={index} className={`contact-faq-item ${isOpen ? 'open' : ''}`}>
              <button 
                type="button" 
                className="contact-faq-question"
                onClick={() => setActiveFaq(isOpen ? null : index)}
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`contact-faq-chevron ${isOpen ? 'rotate' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="contact-faq-answer"
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ContactFaq

