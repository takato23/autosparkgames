'use client'

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface BeautifulGlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'aurora' | 'sunset' | 'ocean' | 'cosmic' | 'rainbow'
  intensity?: 'subtle' | 'vibrant' | 'intense'
  interactive?: boolean
  glow?: boolean
  floating?: boolean
  tilt?: boolean
  animated?: boolean
}

const variants = {
  aurora: {
    background: 'bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-purple-500/20',
    border: 'border-emerald-500/30',
    shadow: 'shadow-emerald-500/20',
    glow: 'drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]'
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-500/20 via-red-500/10 to-pink-500/20',
    border: 'border-orange-500/30',
    shadow: 'shadow-orange-500/20',
    glow: 'drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]'
  },
  ocean: {
    background: 'bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20',
    border: 'border-blue-500/30',
    shadow: 'shadow-blue-500/20',
    glow: 'drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]'
  },
  cosmic: {
    background: 'bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-indigo-600/20',
    border: 'border-purple-500/30',
    shadow: 'shadow-purple-500/20',
    glow: 'drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]'
  },
  rainbow: {
    background: 'bg-gradient-to-br from-red-400/15 via-yellow-400/10 via-green-400/10 via-blue-400/10 via-indigo-400/10 to-purple-400/15',
    border: 'border-white/30',
    shadow: 'shadow-white/20',
    glow: 'drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]'
  }
}

export function BeautifulGlassCard({
  children,
  className,
  variant = 'aurora',
  intensity = 'vibrant',
  interactive = true,
  glow = true,
  floating = true,
  tilt = true,
  animated = true
}: BeautifulGlassCardProps) {
  // Normalize unsupported variant values at runtime
  if (!(variant in variants)) {
    // eslint-disable-next-line no-console
    console.warn(`[BeautifulGlassCard] Unknown variant "${variant}", falling back to "aurora"`)
    variant = 'aurora'
  }
  const ref = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15])
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15])
  
  const glowOpacity = useTransform(
    mouseX,
    [-300, 0, 300],
    [0.3, 0.8, 0.3]
  )
  
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
  
  // Guard against invalid variant lookups
  const variantStyles = variants[variant] ?? variants.aurora

  const intensityMultiplier = {
    subtle: 0.6,
    vibrant: 1,
    intense: 1.4
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
          "relative backdrop-blur-xl border rounded-2xl overflow-hidden",
          "transition-all duration-500 ease-out",
          
          // Variant styles
          variantStyles.background,
          variantStyles.border,
          variantStyles.shadow,
          
          // Interactive states
          interactive && "hover:shadow-2xl",
          glow && isHovered && variantStyles.glow
        )}
        style={{
          rotateX: tilt ? rotateX : 0,
          rotateY: tilt ? rotateY : 0,
          transformStyle: "preserve-3d"
        }}
        animate={floating && animated ? {
          y: [0, -8, 0],
          rotate: [0, 1, 0, -1, 0]
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={interactive ? {
          scale: 1.02,
          transition: { duration: 0.2 }
        } : {}}
      >
        {/* Animated gradient overlay */}
        {animated && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              // Fallback to a safe gradient if background parsing fails
              background: (() => {
                try {
                  const parts = variantStyles.background
                    .replace('bg-gradient-to-br', '')
                    .trim()
                    .split(' ')
                    .filter(Boolean)
                  const stops = parts.map((color) =>
                    color.includes('/')
                      ? `${color.split('/')[0]}/${Math.round(20 * intensityMultiplier)}`
                      : color
                  )
                  return `conic-gradient(from 0deg at 50% 50%, ${stops.join(', ')}, transparent)`
                } catch {
                  return 'conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.15), transparent)'
                }
              })()
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
        
        {/* Shimmer effect */}
        {interactive && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`
            }}
            animate={isHovered ? {
              x: ['-100%', '100%']
            } : {}}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
        
        {/* Inner glow */}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
              opacity: glowOpacity
            }}
          />
        )}
        
        {/* Border highlight */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
            mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            maskComposite: 'xor',
            padding: '1px'
          }}
        />
      </motion.div>
      
      {/* Floating particles */}
      {animated && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
              animate={{
                y: [-20, -60, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}