import { Link } from '../../../components/ui/Link/Link'
import type { Paper } from '../../../lib/paperTypes'
import { FormattedAuthorName } from '../AuthorMark/AuthorMark'
import '../AuthorMark/AuthorMark.css'
import './PaperMeta.css'

interface MetaRowProps {
  label: string
  children: React.ReactNode
}

function MetaRow({ label, children }: MetaRowProps) {
  return (
    <div className="paper-meta__row">
      <span className="paper-meta__label">{label}</span>
      <div className="paper-meta__value">{children}</div>
    </div>
  )
}

export function PaperMeta({ paper }: { paper: Paper }) {
  return (
    <div className="paper-meta">
      <MetaRow label="Authors">
        {paper.authors.map((a, i) => (
          <span key={a.name} className="paper-meta__author">
            {i > 0 && <span className="paper-meta__separator">, </span>}
            <Link
              to={`/library?author=${encodeURIComponent(a.name.replace(/[\^*]+$/, '').trim())}`}
              className={cn(
                'paper-meta__author-name',
                a.corresponding && 'paper-meta__author-name--corresponding',
              )}
            >
              <FormattedAuthorName name={a.name} />
            </Link>
          </span>
        ))}
      </MetaRow>

      <MetaRow label="Institution">
        {paper.institutions.map(inst => (
          <span key={inst.name} className="paper-meta__institution">
            <Link to={`/library?institution=${encodeURIComponent(inst.name)}`} className="paper-meta__institution-link">
              {inst.name}
            </Link>
            {inst.location && <span className="paper-meta__institution-location">· {inst.location}</span>}
          </span>
        ))}
      </MetaRow>

      <MetaRow label="Year">
        <Link to={`/library?year=${paper.year}`} className="paper-meta__year">
          {paper.year}
        </Link>
      </MetaRow>

      <MetaRow label="Genre">
        <Link to={`/library?genre=${paper.genre}`} className="paper-meta__genre">
          {paper.genre}
        </Link>
      </MetaRow>

      <MetaRow label="Paper code">
        <code className="paper-meta__code">{paper.paperCode}</code>
      </MetaRow>

      <MetaRow label="DOI">
        <a
          href={paper.doi}
          target="_blank"
          rel="noopener noreferrer"
          className="paper-meta__doi"
        >
          {paper.doiCode}
          <svg className="paper-meta__doi-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M7 17l9-9M7 7h9v9" />
          </svg>
        </a>
      </MetaRow>

      <MetaRow label="Keywords">
        {paper.keywords.map(k => (
          <Link key={k} to={`/library?keyword=${encodeURIComponent(k)}`} className="paper-meta__keyword">
            {k}
          </Link>
        ))}
      </MetaRow>

      {paper.license && (
        <MetaRow label="License">
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="paper-meta__license">
            {paper.license}
          </a>
        </MetaRow>
      )}
    </div>
  )
}

function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}

export default PaperMeta