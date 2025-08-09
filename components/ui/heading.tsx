import * as React from "react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4
  visualLevel?: 1 | 2 | 3 | 4
}

/**
 * Neutral Heading component
 * - Removes gradient styling
 * - Uses semantic typography from neutral theme
 */
export function Heading({
  level = 2,
  visualLevel,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
  const displayLevel = visualLevel || level

  const sizeClasses = {
    1: theme.typography.heading.h1,
    2: theme.typography.heading.h2,
    3: theme.typography.heading.h3,
    4: theme.typography.heading.h4,
  }

  const headingClass = cn(
    sizeClasses[displayLevel],
    "text-foreground",
    className
  )

  return React.createElement(
    Tag,
    { className: headingClass, ...props },
    children
  )
}