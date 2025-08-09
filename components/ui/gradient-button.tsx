import * as React from "react"
import { cn } from "@/lib/utils"
import { theme, a11y } from "@/lib/theme"
import { Button, ButtonProps } from "./button"

interface GradientButtonProps extends ButtonProps {
  gradient?: keyof typeof theme.colors.gradients
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: keyof typeof theme.shadows
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradient = 'primary', rounded = 'lg', shadow = 'xl', children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden font-bold text-white transition-all duration-200",
          "transform hover:scale-105 active:scale-95",
          `bg-gradient-to-r ${theme.colors.gradients[gradient]}`,
          `hover:${theme.shadows['2xl']}`,
          theme.shadows[shadow],
          theme.borderRadius[rounded],
          a11y.focusRing,
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          className
        )}
        {...props}
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
        <span className="relative z-10">{children}</span>
      </Button>
    )
  }
)
GradientButton.displayName = "GradientButton"