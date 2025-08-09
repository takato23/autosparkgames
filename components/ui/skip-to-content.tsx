'use client'

import { a11y } from '@/lib/theme'

interface SkipToContentProps {
  href?: string
  children?: React.ReactNode
}

export function SkipToContent({ 
  href = '#main-content', 
  children = 'Saltar al contenido principal' 
}: SkipToContentProps) {
  return (
    <a 
      href={href} 
      className={a11y.skipLink}
    >
      {children}
    </a>
  )
}