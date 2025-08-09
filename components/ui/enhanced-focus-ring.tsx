'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedFocusRingProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'vibrant' | 'subtle' | 'high-contrast'
  shape?: 'rounded' | 'pill' | 'square' | 'circle'
  animated?: boolean
  glowing?: boolean
  skipFocus?: boolean
}

const variants = {
  default: {
    ring: 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent',
    shadow: 'shadow-lg shadow-blue-500/25',
    glow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'
  },
  vibrant: {
    ring: 'ring-3 ring-purple-500 ring-offset-2 ring-offset-transparent',
    shadow: 'shadow-xl shadow-purple-500/30',
    glow: 'drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]'
  },
  subtle: {
    ring: 'ring-1 ring-gray-400 ring-offset-1 ring-offset-transparent',
    shadow: 'shadow-md shadow-gray-500/20',
    glow: 'drop-shadow-[0_0_10px_rgba(156,163,175,0.3)]'
  },
  'high-contrast': {
    ring: 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-black',
    shadow: 'shadow-2xl shadow-yellow-500/40',
    glow: 'drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]'
  }
}

const shapes = {
  rounded: 'rounded-lg',
  pill: 'rounded-full',
  square: 'rounded-none',
  circle: 'rounded-full'
}

export function EnhancedFocusRing({
  children,
  className,
  variant = 'default',
  shape = 'rounded',
  animated = true,
  glowing = true,
  skipFocus = false
}: EnhancedFocusRingProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false)
  
  const variantStyles = variants[variant]
  const shapeStyles = shapes[shape]
  
  React.useEffect(() => {
    const handleKeyDown = () => setIsKeyboardFocus(true)
    const handleMouseDown = () => setIsKeyboardFocus(false)
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])
  
  const handleFocus = () => {
    setIsFocused(true)
    
    // Announce focus for screen readers
    const element = document.activeElement
    if (element && element.getAttribute('aria-label')) {
      const announcement = `Enfocado: ${element.getAttribute('aria-label')}`
      announceToScreenReader(announcement)
    }
  }
  
  const handleBlur = () => {
    setIsFocused(false)
  }
  
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  if (skipFocus) {
    return <>{children}</>
  }
  
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Enhanced focus ring with animations */}
      <AnimatePresence>
        {isFocused && isKeyboardFocus && (
          <motion.div
            className={cn(
              "absolute inset-0 pointer-events-none",
              shapeStyles,
              variantStyles.ring,
              variantStyles.shadow,
              glowing && variantStyles.glow
            )}
            initial={animated ? { scale: 0.95, opacity: 0 } : { opacity: 1 }}
            animate={animated ? { 
              scale: [0.95, 1.05, 1], 
              opacity: 1 
            } : { opacity: 1 }}
            exit={animated ? { scale: 0.95, opacity: 0 } : { opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut"
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Pulsing effect for high contrast */}
      {isFocused && isKeyboardFocus && variant === 'high-contrast' && animated && (
        <motion.div
          className={cn(
            "absolute inset-0 pointer-events-none",
            shapeStyles,
            "ring-2 ring-yellow-400"
          )}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Content wrapper with focus handling */}
      <div
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="relative"
      >
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              className: cn(
                (children as React.ReactElement<any>).props?.className,
                "focus:outline-none transition-all duration-200",
                isFocused && isKeyboardFocus && "relative z-10"
              )
            })
          : children}
      </div>
      
      {/* Accessibility indicators */}
      {isFocused && (
        <div className="sr-only" aria-live="polite">
          Elemento enfocado: {(children as any)?.props?.['aria-label'] || 'Elemento interactivo'}
        </div>
      )}
    </div>
  )
}

// High contrast focus ring for accessibility
export function HighContrastFocusRing({ children, ...props }: Omit<EnhancedFocusRingProps, 'variant'>) {
  return (
    <EnhancedFocusRing variant="high-contrast" {...props}>
      {children}
    </EnhancedFocusRing>
  )
}

// Skip links component for keyboard navigation
export function SkipLinks() {
  const skipLinks = [
    { href: '#main-content', label: 'Saltar al contenido principal' },
    { href: '#navigation', label: 'Saltar a la navegación' },
    { href: '#accessibility-panel', label: 'Saltar a opciones de accesibilidad' }
  ]
  
  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-4 left-4 z-[9999] space-y-2">
        {skipLinks.map((link) => (
          <EnhancedFocusRing key={link.href} variant="high-contrast">
            <a
              href={link.href}
              className="block px-4 py-2 bg-black text-yellow-400 font-bold rounded-md border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
            >
              {link.label}
            </a>
          </EnhancedFocusRing>
        ))}
      </div>
    </div>
  )
}

// Focus trap for modals and panels
export function FocusTrap({ 
  children, 
  active = true 
}: { 
  children: React.ReactNode
  active?: boolean 
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    if (!active) return
    
    const container = containerRef.current
    if (!container) return
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    // Focus first element when trap activates
    firstElement?.focus()
    
    document.addEventListener('keydown', handleTabKey)
    
    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [active])
  
  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}