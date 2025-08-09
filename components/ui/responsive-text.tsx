import * as React from "react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'small' | 'base' | 'large'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'light' | 'onDark' | 'onDarkSecondary'
  as?: 'p' | 'span' | 'div'
}

export function ResponsiveText({
  size = 'base',
  weight = 'normal',
  color = 'primary',
  as: Component = 'p',
  className,
  children,
  ...props
}: ResponsiveTextProps) {
  const sizeClasses = theme.typography.body
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const textClass = cn(
    sizeClasses[size],
    weightClasses[weight],
    theme.colors.text[color],
    className
  )
  
  return (
    <Component className={textClass} {...props}>
      {children}
    </Component>
  )
}