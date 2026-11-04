import { type ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import './Card.css'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  as?: 'article' | 'div'
}

export function Card({ children, className, hoverable = false, as = 'div' }: CardProps) {
  const Tag = as
  return (
    <Tag
      className={cn(
        'card',
        hoverable && 'card--hoverable',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export default Card