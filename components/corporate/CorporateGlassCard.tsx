'use client'

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface CorporateGlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'professional' | 'executive' | 'standard'
  intensity?: 'subtle' | 'minimal' | 'none'
  interactive?: boolean
  glow?: boolean
  floating?: boolean
  tilt?: boolean
  animated?: boolean
}

const corporateVariants = {
  professional: {
    background: 'bg-gradient-to-br from-blue-600/15 via-slate-500/8 to-blue-800/15',
    border: 'border-blue-600/25',
    shadow: 'shadow-blue-600/15',
    glow: 'drop-shadow-[0_0_20px_rgba(30,64,175,0.2)]'
  },
  executive: {
    background: 'bg-gradient-to-br from-slate-700/20 via-blue-600/10 to-slate-800/20',
    border: 'border-slate-600/30',
    shadow: 'shadow-slate-600/15',
    glow: 'drop-shadow-[0_0_25px_rgba(55,65,81,0.25)]'
  },
  standard: {
    background: 'bg-gradient-to-br from-gray-500/15 via-blue-500/8 to-gray-600/15',
    border: 'border-gray-500/25',
    shadow: 'shadow-gray-500/15',
    glow: 'drop-shadow-[0_0_18px_rgba(107,114,128,0.2)]'
  }
}

export function CorporateGlassCard({
  children,
  className,
  variant = 'professional',
  intensity = 'subtle',
  interactive = true,
  glow = false,
  floating = false,
  tilt = false,
  animated = true
}: CorporateGlassCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8])
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8])
  
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!ref.current || !tilt) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }, [mouseX, mouseY, tilt])
  
  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }, [mouseX, mouseY])

  const variantStyles = corporateVariants[variant]

  const intensityMultiplier = {
    subtle: 0.8,
    minimal: 0.5,
    none: 0
  }[intensity]

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative group cursor-pointer",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000
      }}
    >
      <motion.div
        className={cn(
          // Base styles
          "relative backdrop-blur-xl border rounded-xl overflow-hidden",
          "transition-all duration-300 ease-out",
          
          // Variant styles
          variantStyles.background,
          variantStyles.border,
          variantStyles.shadow,
          
          // Interactive states
          interactive && "hover:shadow-lg",
          glow && isHovered && variantStyles.glow
        )}
        style={{
          rotateX: tilt ? rotateX : 0,
          rotateY: tilt ? rotateY : 0,
          transformStyle: "preserve-3d"
        }}
        animate={floating && animated ? {
          y: [0, -4, 0]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={interactive ? {
          scale: 1.01,
          transition: { duration: 0.2 }
        } : {}}
      >
        {/* Subtle shimmer effect */}
        {interactive && intensity !== 'none' && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)`
            }}
            animate={isHovered ? {
              x: ['-100%', '100%']
            } : {}}
            transition={{
              duration: 2,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
        
        {/* Inner glow for corporate feel */}
        {glow && intensity !== 'none' && (
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)`,
              opacity: intensityMultiplier
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}