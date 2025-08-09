'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'glass' | 'neon'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'default' | 'pill' | 'square' | 'circle'
  effect?: 'ripple' | 'glow' | 'shine' | 'pulse' | 'bounce' | 'magnetic' | 'particle'
  gradient?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const variants = {
  primary: {
    base: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    hover: 'from-purple-700 to-pink-700',
    glow: 'shadow-purple-500/50'
  },
  secondary: {
    base: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
    hover: 'from-blue-700 to-cyan-700',
    glow: 'shadow-blue-500/50'
  },
  success: {
    base: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
    hover: 'from-green-700 to-emerald-700',
    glow: 'shadow-green-500/50'
  },
  warning: {
    base: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    hover: 'from-yellow-600 to-orange-600',
    glow: 'shadow-yellow-500/50'
  },
  danger: {
    base: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
    hover: 'from-red-700 to-pink-700',
    glow: 'shadow-red-500/50'
  },
  ghost: {
    base: 'bg-transparent border-2 border-white/30 text-white backdrop-blur-sm',
    hover: 'border-white/50 bg-white/10',
    glow: 'shadow-white/30'
  },
  glass: {
    base: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white',
    hover: 'bg-white/20 border-white/30',
    glow: 'shadow-white/20'
  },
  neon: {
    base: 'bg-black border-2 border-cyan-400 text-cyan-400',
    hover: 'border-cyan-300 text-cyan-300 shadow-cyan-400/50',
    glow: 'shadow-cyan-400/80'
  }
}

const sizes = {
  xs: {
    padding: 'px-3 py-1.5',
    text: 'text-xs',
    iconSize: 'h-3 w-3',
    height: 'h-7'
  },
  sm: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    iconSize: 'h-4 w-4',
    height: 'h-9'
  },
  md: {
    padding: 'px-6 py-3',
    text: 'text-base',
    iconSize: 'h-5 w-5',
    height: 'h-11'
  },
  lg: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    iconSize: 'h-6 w-6',
    height: 'h-14'
  },
  xl: {
    padding: 'px-10 py-5',
    text: 'text-xl',
    iconSize: 'h-7 w-7',
    height: 'h-16'
  }
}

const elevations = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    shape = 'default',
    effect = 'ripple',
    gradient = true,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    elevation = 'md',
    children,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false)
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])
    const [magnetPosition, setMagnetPosition] = React.useState({ x: 0, y: 0 })
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const variantStyles = variants[variant]
    const sizeStyles = sizes[size]

    // Ripple effect
    const createRipple = (event: React.MouseEvent) => {
      if (effect !== 'ripple') return

      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const newRipple = {
        id: Date.now(),
        x,
        y
      }

      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }

    // Magnetic effect
    const handleMouseMove = (event: React.MouseEvent) => {
      if (effect !== 'magnetic' || !buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
      )

      if (distance < 100) {
        const x = (event.clientX - centerX) * 0.1
        const y = (event.clientY - centerY) * 0.1
        setMagnetPosition({ x, y })
      } else {
        setMagnetPosition({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      if (effect === 'magnetic') {
        setMagnetPosition({ x: 0, y: 0 })
      }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return
      
      createRipple(event)
      onClick?.(event)
    }

    const getShapeClasses = () => {
      switch (shape) {
        case 'pill':
          return 'rounded-full'
        case 'square':
          return 'rounded-lg'
        case 'circle':
          return 'rounded-full aspect-square p-0 flex items-center justify-center'
        default:
          return 'rounded-xl'
      }
    }

    const getEffectStyles = () => {
      switch (effect) {
        case 'glow':
          return `hover:shadow-2xl hover:${variantStyles.glow}`
        case 'pulse':
          return 'hover:animate-pulse'
        case 'bounce':
          return 'hover:animate-bounce'
        default:
          return ''
      }
    }

    const MotionButton: any = motion.button

    return (
      <MotionButton
        ref={buttonRef}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-semibold transition-all duration-300 overflow-hidden',
          'focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:ring-offset-2',
          'transform-gpu will-change-transform',
          
          // Variant styles
          variantStyles.base,
          
          // Size styles
          sizeStyles.padding,
          sizeStyles.text,
          sizeStyles.height,
          
          // Shape styles
          getShapeClasses(),
          
          // Effect styles
          getEffectStyles(),
          
          // Elevation
          elevations[elevation],
          
          // State styles
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          loading && 'cursor-wait',
          fullWidth && 'w-full',
          
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsPressed(false)
          handleMouseLeave()
        }}
        onMouseMove={handleMouseMove}
        whileHover={
          effect === 'magnetic' 
            ? { x: magnetPosition.x, y: magnetPosition.y, scale: 1.05 }
            : { scale: 1.05 }
        }
        whileTap={{ scale: 0.95 }}
        animate={
          effect === 'magnetic' 
            ? { x: magnetPosition.x, y: magnetPosition.y }
            : {}
        }
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        {...props}
      >
        {/* Background glow */}
        {effect === 'glow' && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-inherit opacity-0 blur-xl',
              variantStyles.base
            )}
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Shine effect */}
        {effect === 'shine' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: "-200%" }}
            whileHover={{ 
              x: "200%",
              transition: { duration: 0.8, ease: "easeOut" }
            }}
          />
        )}

        {/* Particle effect */}
        {effect === 'particle' && isPressed && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0 
                }}
                animate={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2 z-10">
          {loading ? (
            <Loader2 className={cn(sizeStyles.iconSize, "animate-spin")} />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <span className={sizeStyles.iconSize}>{icon}</span>
              )}
              {children}
              {icon && iconPosition === 'right' && (
                <span className={sizeStyles.iconSize}>{icon}</span>
              )}
            </>
          )}
        </div>
      </MotionButton>
    )
  }
)

PremiumButton.displayName = "PremiumButton"