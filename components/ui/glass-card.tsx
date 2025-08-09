import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
  border?: boolean
  shadow?: boolean
  hover?: boolean
  glow?: boolean
  children?: React.ReactNode
}

export function GlassCard({
  blur = 'md',
  opacity = 10,
  border = true,
  shadow = true,
  hover = true,
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }
  
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        blurClasses[blur],
        `bg-white/${opacity}`,
        border && "border border-white/20",
        shadow && "shadow-2xl shadow-purple-500/10",
        hover && "transition-all duration-500 hover:bg-white/20 hover:shadow-purple-500/20",
        glow && "before:absolute before:inset-0 before:rounded-3xl before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:via-pink-600 before:to-orange-600 before:-z-10 before:blur-xl before:opacity-50",
        className
      )}
      whileHover={hover ? { 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      } : undefined}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
        }}
      />
    </motion.div>
  )
}