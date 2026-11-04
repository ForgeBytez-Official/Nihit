import React from 'react'
import { FileText } from 'lucide-react'
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
    const sId = section.id.toLowerCase()

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

    if (sId.includes('method') || sId.includes('material')) {
      return (
        <div className="section-prose">
          <p>
            The investigation was conducted following standard experimental protocols and randomized
            sampling frameworks. Specific environmental and laboratory parameters were systematically
            recorded throughout the duration of the trial to ensure reproducible findings:
          </p>
          <div className="section-parameters-grid">
            <div className="section-parameter-item">
              <span className="section-parameter-item__key">Study Protocol</span>
              <span className="section-parameter-item__val">
                {paper.study?.method || 'Standardized Randomized Complete Block Design (RCBD)'}
              </span>
            </div>
            <div className="section-parameter-item">
              <span className="section-parameter-item__key">Sample Framework</span>
              <span className="section-parameter-item__val">
                {paper.study?.sampleSize ? `${paper.study.sampleSize} monitored observation units` : 'Replicated experimental test plots with untreated controls'}
              </span>
            </div>
            <div className="section-parameter-item">
              <span className="section-parameter-item__key">Location</span>
              <span className="section-parameter-item__val">
                {paper.study?.location || paper.institutions?.[0]?.name || 'Standardized Experimental Station'}
              </span>
            </div>
          </div>
          <p>
            Data were collected periodically and subjected to rigorous variance analysis. Differences between
            individual treatment means were evaluated using standard post-hoc statistical packages at a 5%
            significance threshold (p &lt; 0.05).
          </p>
        </div>
      )
    }

    if (sId.includes('result') || sId.includes('disc')) {
      return (
        <div className="section-prose">
          <p>
            Significant variations were observed among the various experimental treatments. Quantitative
            evaluations revealed measurable differences across physiological indicators, biomass yield, and
            overall resilience under the given environmental conditions.
          </p>
          <div className="section-key-finding">
            <div className="section-key-finding__title">
              <FileText size={14} className="text-[var(--color-accent-1)]" />
              <span>Key Empirical Finding</span>
            </div>
            <p className="section-key-finding__text">
              The recorded responses under integrated treatment regimes demonstrated statistically superior
              performance compared to isolated baseline controls, corroborating previous research conducted
              across comparable climatic environments.
            </p>
          </div>
          <p>
            These findings underline the practical viability of optimizing input ratios, reinforcing both
            ecological balance and productivity outcomes over successive evaluation cycles.
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

    return (
      <div className="section-prose">
        <p>
          Detailed analysis and observations for <em>{section.title}</em>. This section presents comprehensive
          data documentation, comparative literature references, and specialized analysis as originally authored
          in the complete archival document.
        </p>
      </div>
    )
  }

  return (
    <div className="main-paper-sections-flow">
      {sections.map((section, idx) => {
        const domId = section.id.startsWith('section-') ? section.id : `section-${section.id}`
        return (
          <section
            key={section.id}
            id={domId}
            className="main-paper-section"
            data-section-id={domId}
          >
            <div className="main-paper-section__header">
              <span className="main-paper-section__idx">0{idx + 1}</span>
              <h2 className="main-paper-section__title">{section.title}</h2>
            </div>
            <div className="main-paper-section__body">
              {renderSectionProse(section)}
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
