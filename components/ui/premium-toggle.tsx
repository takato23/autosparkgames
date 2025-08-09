'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PremiumToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  disabled?: boolean
  label?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

const sizeClasses = {
  sm: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
    text: 'text-sm'
  },
  md: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
    text: 'text-base'
  },
  lg: {
    track: 'w-20 h-10',
    thumb: 'w-8 h-8',
    translate: 'translate-x-10',
    text: 'text-lg'
  }
}

const variants = {
  default: {
    on: 'bg-gradient-to-r from-purple-500 to-pink-500',
    off: 'bg-gray-300',
    glow: 'shadow-purple-500/50'
  },
  success: {
    on: 'bg-gradient-to-r from-green-500 to-emerald-500',
    off: 'bg-gray-300',
    glow: 'shadow-green-500/50'
  },
  warning: {
    on: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    off: 'bg-gray-300',
    glow: 'shadow-yellow-500/50'
  },
  danger: {
    on: 'bg-gradient-to-r from-red-500 to-pink-500',
    off: 'bg-gray-300',
    glow: 'shadow-red-500/50'
  }
}

export function PremiumToggle({
  checked = false,
  onCheckedChange,
  size = 'md',
  variant = 'default',
  disabled = false,
  label,
  description,
  icon,
  className
}: PremiumToggleProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const sizes = sizeClasses[size]
  const colors = variants[variant]

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange?.(!checked)
    }
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex-shrink-0">
        <button
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          disabled={disabled}
          className={cn(
            "relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:ring-offset-2",
            sizes.track,
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer"
          )}
          role="switch"
          aria-checked={checked}
          aria-label={label}
        >
          {/* Track */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full transition-all duration-300",
              checked ? colors.on : colors.off
            )}
            animate={{
              boxShadow: checked && !disabled 
                ? `0 0 20px ${colors.glow.includes('purple') ? 'rgba(168, 85, 247, 0.4)' : 
                     colors.glow.includes('green') ? 'rgba(34, 197, 94, 0.4)' :
                     colors.glow.includes('yellow') ? 'rgba(234, 179, 8, 0.4)' :
                     'rgba(239, 68, 68, 0.4)'}`
                : "0 0 0px rgba(0,0,0,0)"
            }}
          />
          
          {/* Thumb */}
          <motion.div
            className={cn(
              "relative rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden",
              sizes.thumb
            )}
            animate={{
              x: checked ? 
                (size === 'sm' ? 20 : size === 'md' ? 28 : 40) : 
                2,
              scale: isPressed ? 0.95 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            {/* Icon animation */}
            <AnimatePresence mode="wait">
              {checked ? (
                <motion.div
                  key="on"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                  className="text-green-500"
                >
                  ✓
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  ✕
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Ripple effect */}
            {isPressed && (
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: "-200%" }}
            animate={checked ? { 
              x: "200%",
              transition: { duration: 0.6, ease: "easeOut" }
            } : {}}
          />
        </button>
      </div>
      
      {/* Label and description */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <motion.label
              htmlFor={`toggle-${label}`}
              className={cn(
                "font-semibold text-gray-900 cursor-pointer",
                sizes.text,
                disabled && "text-gray-500"
              )}
              whileHover={!disabled ? { x: 2 } : undefined}
              onClick={handleClick}
            >
              {icon && <span className="mr-2">{icon}</span>}
              {label}
            </motion.label>
          )}
          {description && (
            <p className={cn(
              "text-gray-600 mt-1",
              size === 'sm' ? 'text-xs' : 'text-sm',
              disabled && "text-gray-400"
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}