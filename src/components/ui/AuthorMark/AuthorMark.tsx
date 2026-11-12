import React from 'react'

/**
 * Splits an author name like "Nowshin Laila^" or "Afrina Rahman*"
 * into the clean name and an array of characters/marks like ['^'] or ['*'].
 */
export function parseAuthorName(rawName: string): { baseName: string; marks: string[] } {
  const match = rawName.match(/^([\s\S]*?)([\^*\s]*)$/)
  if (!match) {
    return { baseName: rawName.trim(), marks: [] }
  }

  const baseName = match[1].trim()
  const rawMarks = match[2] || ''
  const marks = Array.from(rawMarks).filter(ch => ch === '^' || ch === '*')

  return { baseName, marks }
}

export interface AuthorMarkProps {
  char: string
  className?: string
}

export const AuthorSpecialMark: React.FC<AuthorMarkProps> = ({ char, className = '' }) => {
  if (char === '^') {
    return (
      <span
        className={`author-special-mark author-special-mark--first ${className}`}
        title="First Author (^)"
        aria-label="First Author"
      >
        ^
      </span>
    )
  }
  if (char === '*') {
    return (
      <span
        className={`author-special-mark author-special-mark--head ${className}`}
        title="Head / Corresponding Author (*)"
        aria-label="Head Author"
      >
        *
      </span>
    )
  }
  return <span className={className}>{char}</span>
}

export interface FormattedAuthorProps {
  name: string
  markClassName?: string
}

/**
 * Renders the author base name followed by any parsed special marks in their respective colors.
 */
export const FormattedAuthorName: React.FC<FormattedAuthorProps> = ({ name, markClassName = '' }) => {
  const { baseName, marks } = parseAuthorName(name)
  return (
    <>
      <span>{baseName}</span>
      {marks.map((char, i) => (
        <AuthorSpecialMark key={`${char}-${i}`} char={char} className={markClassName} />
      ))}
    </>
  )
}

