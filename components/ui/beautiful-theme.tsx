'use client'

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface BeautifulThemeProps {
  children: React.ReactNode
  theme?: 'aurora' | 'sunset' | 'ocean' | 'forest' | 'galaxy' | 'rainbow'
  intensity?: 'subtle' | 'vibrant' | 'intense'
  animated?: boolean
  responsive?: boolean
  accessibility?: {
    reducedMotion?: boolean
    highContrast?: boolean
    largeText?: boolean
    colorBlind?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  }
}

// Generador determinista para evitar diferencias SSR/CSR
const seededRandom = (index: number, salt: number): number => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const themes = {
  aurora: {
    gradients: [
      'from-emerald-400 via-cyan-400 to-purple-500',
      'from-pink-400 via-purple-400 to-indigo-600',
      'from-green-300 via-blue-500 to-purple-600'
    ],
    colors: {
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#8b5cf6'
    },
    shadows: 'shadow-emerald-500/30'
  },
  sunset: {
    gradients: [
      'from-orange-400 via-red-500 to-pink-500',
      'from-yellow-400 via-orange-500 to-red-600',
      'from-amber-300 via-orange-400 to-rose-500'
    ],
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#ec4899'
    },
    shadows: 'shadow-orange-500/30'
  },
  ocean: {
    gradients: [
      'from-blue-400 via-cyan-500 to-teal-500',
      'from-indigo-400 via-blue-500 to-cyan-600',
      'from-sky-300 via-blue-400 to-teal-500'
    ],
    colors: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      accent: '#14b8a6'
    },
    shadows: 'shadow-blue-500/30'
  },
  forest: {
    gradients: [
      'from-green-400 via-emerald-500 to-teal-500',
      'from-lime-400 via-green-500 to-emerald-600',
      'from-green-300 via-emerald-400 to-cyan-500'
    ],
    colors: {
      primary: '#22c55e',
      secondary: '#10b981',
      accent: '#06b6d4'
    },
    shadows: 'shadow-green-500/30'
  },
  galaxy: {
    gradients: [
      'from-purple-600 via-pink-500 to-indigo-600',
      'from-violet-500 via-purple-600 to-pink-500',
      'from-indigo-500 via-purple-500 to-pink-600'
    ],
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      accent: '#ec4899'
    },
    shadows: 'shadow-purple-500/30'
  },
  rainbow: {
    gradients: [
      'from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400',
      'from-pink-400 via-red-400 via-orange-400 via-yellow-400 via-green-400 to-blue-400',
      'from-purple-400 via-pink-400 via-red-400 via-yellow-400 via-green-400 to-cyan-400'
    ],
    colors: {
      primary: '#f59e0b',
      secondary: '#10b981',
      accent: '#8b5cf6'
    },
    shadows: 'shadow-rainbow'
  }
}

const intensitySettings = {
  subtle: { opacity: 0.45, blur: 'blur-sm', glow: 0.15 },
  vibrant: { opacity: 0.7, blur: 'blur-md', glow: 0.3 },
  intense: { opacity: 0.85, blur: 'blur-lg', glow: 0.45 }
}

export function BeautifulTheme({
  children,
  theme = 'aurora',
  intensity = 'vibrant',
  animated = true,
  responsive = true,
  accessibility = {}
}: BeautifulThemeProps) {
  const [currentGradient, setCurrentGradient] = React.useState(0)
  const [motionEnabled, setMotionEnabled] = React.useState(!accessibility.reducedMotion)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const themeConfig = themes[theme]
  const intensityConfig = intensitySettings[intensity]
  
  // Animated gradient rotation
  React.useEffect(() => {
    if (!animated || !motionEnabled) return
    
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % themeConfig.gradients.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [animated, motionEnabled, themeConfig.gradients.length])
  
  // Mouse parallax effect
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!motionEnabled) return
    
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    
    mouseX.set((clientX - innerWidth / 2) * 0.02)
    mouseY.set((clientY - innerHeight / 2) * 0.02)
  }, [mouseX, mouseY, motionEnabled])
  
  // Accessibility preferences detection
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMotionEnabled(!mediaQuery.matches && !accessibility.reducedMotion)
    
    const handleChange = () => {
      setMotionEnabled(!mediaQuery.matches && !accessibility.reducedMotion)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [accessibility.reducedMotion])
  
  // Color blind filters
  const getColorBlindFilter = () => {
    switch (accessibility.colorBlind) {
      case 'protanopia':
        return 'sepia(100%) saturate(50%) hue-rotate(320deg)'
      case 'deuteranopia':
        return 'sepia(100%) saturate(60%) hue-rotate(280deg)'
      case 'tritanopia':
        return 'sepia(100%) saturate(80%) hue-rotate(60deg)'
      default:
        return 'none'
    }
  }
  
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        accessibility.highContrast && "contrast-125",
        accessibility.largeText && "text-lg"
      )}
      onMouseMove={handleMouseMove}
      style={{
        filter: getColorBlindFilter()
      }}
    >
      {/* Animated background layers */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            themeConfig.gradients[currentGradient]
          )}
          animate={motionEnabled ? {
            opacity: [intensityConfig.opacity, intensityConfig.opacity + 0.1, intensityConfig.opacity],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            x: mouseX,
            y: mouseY
          }}
        />
        
        {/* Overlay patterns */}
        {motionEnabled && (
          <>
            {/* Floating orbs */}
            {[...Array(responsive ? 10 : 6)].map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className={cn(
                  "absolute rounded-full mix-blend-overlay",
                  intensityConfig.blur
                )}
                style={{
                  background: `radial-gradient(circle, ${themeConfig.colors.primary}40, transparent)`,
                  width: `${50 + i * 10}px`,
                  height: `${50 + i * 10}px`,
                  left: `${Number((seededRandom(i, 1) * 100).toFixed(3))}%`,
                  top: `${Number((seededRandom(i, 2) * 100).toFixed(3))}%`
                }}
                animate={{
                  x: [0, seededRandom(i, 3) * 200 - 100],
                  y: [0, seededRandom(i, 4) * 200 - 100],
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.35, 0.15]
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                suppressHydrationWarning
              />
            ))}
            
            {/* Mesh gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-40"
              style={{
                background: `
                  radial-gradient(at 20% 30%, ${themeConfig.colors.primary}40 0px, transparent 60%),
                  radial-gradient(at 80% 20%, ${themeConfig.colors.secondary}30 0px, transparent 60%),
                  radial-gradient(at 40% 80%, ${themeConfig.colors.accent}35 0px, transparent 60%),
                  radial-gradient(at 90% 70%, ${themeConfig.colors.primary}25 0px, transparent 60%)
                `
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}
        
        {/* Noise texture for depth */}
        <div 
          className="absolute inset-0 opacity-5 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Content with accessibility enhancements */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Accessibility panel toggle */}
      <motion.button
        className="fixed bottom-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white z-50"
        whileHover={motionEnabled ? { scale: 1.1 } : {}}
        whileTap={motionEnabled ? { scale: 0.95 } : {}}
        aria-label="Opciones de accesibilidad"
        onClick={() => {
          // Toggle accessibility panel (to be implemented)
          console.log('Accessibility panel toggled')
        }}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a7 7 0 0 1-7 7v-1.27c.6-.34 1-.99 1-1.73a2 2 0 0 1-4 0c0 .74.4 1.39 1 1.73V21a7 7 0 0 1-7-7H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M9 9a1 1 0 1 0 0 2a1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-3 4c-2 0-2 3-2 3s0 3 2 3s2-3 2-3s0-3-2-3Z"/>
        </svg>
      </motion.button>
    </div>
  )
}