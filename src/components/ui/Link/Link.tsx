import { type ReactNode } from 'react'
import { Link as RouterLink, type LinkProps } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import './Link.css'

interface LinkComponentProps extends Omit<LinkProps, 'to'> {
  to?: string
  external?: boolean
  className?: string
  children: ReactNode
}

// Internal routes use react-router Link (keeps the URL in sync for auto-scroll
// sections). External URLs (DOIs, emails, institutions) use a plain anchor.
export function Link({ to, external, className, children, ...props }: LinkComponentProps) {
  const classes = cn(
    'link',
    external || (to && /^https?:\/\//.test(to)) ? undefined : undefined,
    className,
  )

  if (external || (to && /^https?:\/\//.test(to))) {
    return (
      <a href={to} className={classes} target="_blank" rel="noopener noreferrer" {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  if (!to) {
    return (
      <span className={cn('link--muted', className)} {...(props as React.HTMLAttributes<HTMLSpanElement>)}>
        {children}
      </span>
    )
  }

  return (
    <RouterLink to={to} className={classes} {...props}>
      {children}
    </RouterLink>
  )
}

export default Link