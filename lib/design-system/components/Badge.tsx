'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-700 text-gray-200 border border-gray-600',
        primary: 'bg-blue-600 text-blue-100 border border-blue-500',
        success: 'bg-green-600 text-green-100 border border-green-500',
        warning: 'bg-yellow-600 text-yellow-100 border border-yellow-500',
        error: 'bg-red-600 text-red-100 border border-red-500',
        gaming: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-500',
      },
      size: {
        sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
        md: 'text-sm px-2.5 py-1 rounded-lg gap-1.5',
        lg: 'text-base px-3 py-1.5 rounded-lg gap-2',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy' | 'onCut' | 'onPaste'>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  interactive?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    const Component: any = interactive ? 'button' : 'div'
    
    return (
      <Component
        ref={ref as any}
        className={cn(badgeVariants({ variant, size, interactive, className }))}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </Component>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }