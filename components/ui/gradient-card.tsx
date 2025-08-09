import * as React from "react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: keyof typeof theme.colors.gradients
  hover?: boolean
  interactive?: boolean
  glassy?: boolean
}

export function GradientCard({
  className,
  gradient = 'primary',
  hover = true,
  interactive = false,
  glassy = true,
  children,
  ...props
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        glassy && "bg-white/95 backdrop-blur-md",
        hover && "transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
        interactive && "cursor-pointer",
        theme.shadows.xl,
        className
      )}
      {...props}
    >
      {/* Gradient border effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r",
        theme.colors.gradients[gradient]
      )}>
        <div className={cn(
          "h-full w-full rounded-2xl",
          glassy ? "bg-white/95 backdrop-blur-md" : "bg-white"
        )} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface GradientHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: keyof typeof theme.colors.gradients
}

export function GradientHeader({
  className,
  gradient = 'primary',
  children,
  ...props
}: GradientHeaderProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r text-white rounded-t-2xl p-6",
        theme.colors.gradients[gradient],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}