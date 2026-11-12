import React from 'react'
import type { Paper, PaperSection } from '../../../../../lib/paperTypes'
import { parseReferences } from '../../../../../functions/references/parseReferences'
import './MainPaperSections.css'

interface MainPaperSectionsProps {
  paper: Paper
  sections: PaperSection[]
}

export const MainPaperSections: React.FC<MainPaperSectionsProps> = ({
  paper,
  sections,
}) => {
  const renderSectionProse = (section: PaperSection) => {
    const sId = (section.id || section.title || section.subtitle || '').toLowerCase()

    // -----------------------------------------------------------------------
    // REFERENCES SECTION — always run through the smart parser first if there
    // is content (handles blobs, arrays, mixed formats). Only falls through
    // to the hardcoded placeholder if no content was supplied at all.
    // -----------------------------------------------------------------------
    if (sId.includes('ref') && section.content) {
      const refEntries = parseReferences(section.content as string | string[])
      if (refEntries.length > 0) {
        return (
          <div className="section-prose">
            <ol className="section-references-list">
              {refEntries.map((ref, idx) => (
                <li key={idx} className="section-reference-item">
                  {ref}
                </li>
              ))}
            </ol>
          </div>
        )
      }
    }

    // -----------------------------------------------------------------------
    // GENERIC CONTENT — any section with explicit content in the JSON renders
    // it directly (paragraphs and image blocks).
    // -----------------------------------------------------------------------
    if (section.content) {
      if (Array.isArray(section.content)) {
        return (
          <div className="section-prose">
            {section.content.map((block, pIdx) => {
              if (typeof block === 'object' && block !== null && block.type === 'image') {
                return (
                  <figure key={pIdx} className="section-figure">
                    <div className="section-figure__image-wrap">
                      <img
                        src={block.src}
                        alt={block.alt || block.caption || `Figure for ${section.title}`}
                        className="section-figure__image"
                        loading="lazy"
                        style={block.width ? { maxWidth: block.width } : undefined}
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="section-figure__caption">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              }
              if (typeof block === 'string') {
                return <p key={pIdx}>{block}</p>
              }
              return null
            })}
          </div>
        )
      }
      return (
        <div className="section-prose">
          <p>{section.content}</p>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // FALLBACK — no content in JSON, show generic boilerplate per section type
    // -----------------------------------------------------------------------

    if (sId.includes('intro')) {
      return (
        <div className="section-prose">
          <p>
            Agricultural advancements and systematic research in this domain continue to play a pivotal
            role in sustainable development, economic stability, and rural livelihood security. The
            challenges encountered within the local agro-ecological zones require targeted investigations,
            rigorous empirical observations, and evidence-based interventions tailored for maximum efficiency.
          </p>
          <p>
            In recent years, modern methodologies integrating organic and inorganic approaches have gained
            prominence among agronomists and researchers. The primary goal of this study is to examine the
            direct correlations between experimental treatments and observable outcomes across standardized
            monitoring periods.
          </p>
        </div>
      )
    }

    if (sId.includes('conclu')) {
      return (
        <div className="section-prose">
          <p>
            Based on the comprehensive empirical findings of this research, it is evident that systematic
            adoption of integrated practices yields superior results in both quality metrics and overall output.
            The findings emphasize the urgent requirement for wider dissemination among field practitioners and
            policymakers.
          </p>
          <p>
            Further long-term longitudinal studies across multi-year cycles are recommended to evaluate the residual
            benefits and socio-economic dynamics in broader regional farming systems.
          </p>
        </div>
      )
    }

    if (sId.includes('ref')) {
      // Fallback generic placeholder when no content provided
      return (
        <div className="section-prose">
          <ol className="section-references-list">
            <li>
              BBS (2020). Bangladesh Bureau of Statistics. Statistics and Informatics Division, Ministry of Planning,
              Government of the People's Republic of Bangladesh, Dhaka.
            </li>
            <li>
              BARC (2018). Fertilizer Recommendation Guide. Bangladesh Agricultural Research Council, New Airport
              Road, Farmgate, Dhaka-1215. pp. 1-274.
            </li>
            <li>
              Rahman, M. A., &amp; Paul, S. K. (2019). Integrated nutrient management in sustainable agricultural systems.
              <em> Journal of Agro-Science and Technology</em>, 14(2), 112–124.
            </li>
          </ol>
        </div>
      )
    }
  }

  return (
    <div className="main-paper-sections-flow">
      {sections.map((section, idx) => {
        const domId = section.id ? (section.id.startsWith('section-') ? section.id : `section-${section.id}`) : `section-${idx}`
        const displayTitle = section.title || section.subtitle || ''
        const sectionNum = section.number !== undefined && section.number !== null && section.number !== '' ? String(section.number) : undefined

        return (
          <section
            key={section.id || idx}
            id={domId}
            className="main-paper-section"
            data-section-id={domId}
          >
            <div className="main-paper-section__header">
              {sectionNum && <span className="main-paper-section__idx">{sectionNum}</span>}
              <h2 className="main-paper-section__title">{displayTitle}</h2>
            </div>
            <div className="main-paper-section__body">
              {renderSectionProse(section)}

              {/* Render subsections if present */}
              {section.subsections && section.subsections.length > 0 && (
                <div className="main-paper-subsections-flow">
                  {section.subsections.map((sub, subIdx) => {
                    const subDomId = sub.id ? (sub.id.startsWith('section-') ? sub.id : `section-${sub.id}`) : `section-${idx}-${subIdx}`
                    const subDisplayTitle = sub.subtitle || sub.title || ''
                    const subNumber = sub.number !== undefined && sub.number !== null && sub.number !== ''
                      ? String(sub.number)
                      : (sectionNum ? `${sectionNum}.${subIdx + 1}` : `${idx + 1}.${subIdx + 1}`)
                    return (
                      <div
                        key={sub.id || subIdx}
                        id={subDomId}
                        className="main-paper-subsection"
                        data-section-id={subDomId}
                      >
                        <div className="main-paper-subsection__header">
                          <h3 className="main-paper-section__subtitle">{subDisplayTitle}</h3>
                          <span className="main-paper-subsection__num">{subNumber}</span>
                        </div>
                        <div className="main-paper-section__body">
                          {renderSectionProse(sub)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* Optional Acknowledgement note if present */}
      {paper.acknowledgement && (
        <section
          id="section-acknowledgement"
          className="main-paper-section"
          data-section-id="section-acknowledgement"
        >
          <div className="main-paper-section__header">
            <h3 className="main-paper-section__subtitle">Acknowledgements</h3>
          </div>
          <div className="section-prose">
            <p className="italic text-[var(--text-muted)]">{paper.acknowledgement}</p>
          </div>
        </section>
      )}
    </div>
  )
}
