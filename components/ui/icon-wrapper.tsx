import * as React from "react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: keyof typeof theme.colors.gradients
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: boolean
  shadow?: boolean
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24'
}

const iconSizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12'
}

export function IconWrapper({
  className,
  gradient = 'primary',
  size = 'md',
  rounded = true,
  shadow = true,
  children,
  ...props
}: IconWrapperProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        "flex items-center justify-center",
        rounded && "rounded-full",
        !rounded && "rounded-2xl",
        shadow && "shadow-lg",
        `bg-gradient-to-br ${theme.colors.gradients[gradient]}`,
        className
      )}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const el = child as React.ReactElement<any>
          return React.cloneElement(el, {
            className: cn(iconSizes[size], "text-white", el.props?.className)
          })
        }
        return child
      })}
    </div>
  )
}