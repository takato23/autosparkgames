'use client'

import * as React from "react"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface FrictionReducerProps {
  children: React.ReactNode
  intensity?: 'minimal' | 'moderate' | 'high' | 'extreme'
  enablePredictive?: boolean
  enableMagnetism?: boolean
  enableSmoothing?: boolean
  className?: string
}

// Predictive interaction system
const usePredictiveInteraction = () => {
  const [predictedAction, setPredictedAction] = React.useState<string | null>(null)
  const [confidence, setConfidence] = React.useState(0)
  
  const analyzeMovement = React.useCallback((x: number, y: number, velocity: number) => {
    // Simple predictive algorithm based on movement patterns
    if (Math.abs(x) > Math.abs(y) && velocity > 200) {
      if (x > 0) {
        setPredictedAction('swipe-right')
        setConfidence(Math.min(velocity / 500, 1))
      } else {
        setPredictedAction('swipe-left')
        setConfidence(Math.min(velocity / 500, 1))
      }
    } else if (Math.abs(y) > Math.abs(x) && velocity > 200) {
      if (y > 0) {
        setPredictedAction('swipe-down')
        setConfidence(Math.min(velocity / 500, 1))
      } else {
        setPredictedAction('swipe-up')
        setConfidence(Math.min(velocity / 500, 1))
      }
    } else {
      setPredictedAction(null)
      setConfidence(0)
    }
  }, [])

  return { predictedAction, confidence, analyzeMovement }
}

// Smart friction physics
const frictionSettings = {
  minimal: {
    damping: 35,
    stiffness: 800,
    mass: 0.1,
    dragElastic: 0.05
  },
  moderate: {
    damping: 25,
    stiffness: 600,
    mass: 0.2,
    dragElastic: 0.1
  },
  high: {
    damping: 15,
    stiffness: 400,
    mass: 0.3,
    dragElastic: 0.2
  },
  extreme: {
    damping: 8,
    stiffness: 200,
    mass: 0.5,
    dragElastic: 0.3
  }
}

export function FrictionReducer({
  children,
  intensity = 'moderate',
  enablePredictive = true,
  enableMagnetism = true,
  enableSmoothing = true,
  className
}: FrictionReducerProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  
  const { predictedAction, confidence, analyzeMovement } = usePredictiveInteraction()
  
  // Smooth transforms with spring physics
  const smoothX = useSpring(x, frictionSettings[intensity])
  const smoothY = useSpring(y, frictionSettings[intensity])
  const smoothScale = useSpring(scale, { stiffness: 400, damping: 30 })
  const smoothRotate = useSpring(rotate, { stiffness: 300, damping: 25 })
  
  // Magnetic field effect
  const magneticRange = useTransform(smoothX, [-100, 0, 100], [0.8, 1, 0.8])
  const magneticGlow = useTransform(smoothScale, [0.9, 1, 1.1], [0, 0.5, 1])
  
  // Predictive visual hints
  const hintOpacity = useTransform(() => enablePredictive ? confidence : 0)
  const hintX = useTransform(() => {
    if (!predictedAction) return 0
    return predictedAction.includes('right') ? 20 : predictedAction.includes('left') ? -20 : 0
  })

  const settings = frictionSettings[intensity]

  return (
    <motion.div
      className={cn("relative will-change-transform", className)}
      style={{
        x: enableSmoothing ? smoothX : x,
        y: enableSmoothing ? smoothY : y,
        scale: enableSmoothing ? smoothScale : scale,
        rotate: enableSmoothing ? smoothRotate : rotate,
      }}
      drag
      dragMomentum={false}
      dragElastic={settings.dragElastic}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDrag={(_, info) => {
        if (enablePredictive) {
          analyzeMovement(info.point.x, info.point.y, Math.abs(info.velocity.x) + Math.abs(info.velocity.y))
        }
        
        // Micro-feedback on drag
        if (enableMagnetism && Math.abs(info.offset.x) > 10) {
          scale.set(1 + Math.abs(info.offset.x) * 0.001)
          rotate.set(info.offset.x * 0.1)
        }
      }}
      onDragEnd={() => {
        // Smooth return to rest position
        x.set(0)
        y.set(0)
        scale.set(1)
        rotate.set(0)
      }}
      whileHover={enableMagnetism ? { scale: 1.02 } : undefined}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        damping: settings.damping,
        stiffness: settings.stiffness,
        mass: settings.mass
      }}
    >
      {children}
      
      {/* Predictive hints */}
      {enablePredictive && (
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ 
            opacity: hintOpacity,
            x: hintX
          }}
        >
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {predictedAction?.replace('-', ' ').toUpperCase()}
          </div>
        </motion.div>
      )}
      
      {/* Magnetic field visualization */}
      {enableMagnetism && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            boxShadow: useTransform(
              magneticGlow,
              [0, 1],
              ["0 0 0px rgba(255,255,255,0)", "0 0 30px rgba(255,255,255,0.3)"]
            )
          }}
        />
      )}
    </motion.div>
  )
}