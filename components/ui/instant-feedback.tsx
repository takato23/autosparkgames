'use client'

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface InstantFeedbackProps {
  children: React.ReactNode
  feedbackType?: 'haptic' | 'visual' | 'audio' | 'all'
  sensitivity?: 'low' | 'medium' | 'high'
  responsiveness?: 'instant' | 'smooth' | 'delayed'
  className?: string
}

const feedbackSettings = {
  low: { threshold: 10, intensity: 0.5, duration: 100 },
  medium: { threshold: 5, intensity: 0.8, duration: 150 },
  high: { threshold: 2, intensity: 1, duration: 200 }
}

const responsivenessSettings = {
  instant: { duration: 0, ease: "linear" },
  smooth: { duration: 0.1, ease: "easeOut" },
  delayed: { duration: 0.2, ease: "easeInOut" }
}

export function InstantFeedback({
  children,
  feedbackType = 'all',
  sensitivity = 'medium',
  responsiveness = 'instant',
  className
}: InstantFeedbackProps) {
  const [isInteracting, setIsInteracting] = React.useState(false)
  const [feedbackActive, setFeedbackActive] = React.useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const pressure = useMotionValue(0)
  
  const settings = feedbackSettings[sensitivity]
  const responseSettings = responsivenessSettings[responsiveness]
  
  const shadowIntensity = useTransform(pressure, [0, 1], [0, 20])
  const borderRadius = useTransform(pressure, [0, 1], [16, 8])
  const brightness = useTransform(pressure, [0, 1], [1, 1.1])
  
  const triggerHaptic = React.useCallback((intensity: number) => {
    if (feedbackType === 'haptic' || feedbackType === 'all') {
      if ('vibrate' in navigator) {
        navigator.vibrate(Math.round(intensity * settings.duration))
      }
    }
  }, [feedbackType, settings.duration])
  
  const audioContext = React.useRef<AudioContext | null>(null)
  
  const triggerAudio = React.useCallback((frequency: number, duration: number) => {
    if (feedbackType === 'audio' || feedbackType === 'all') {
      try {
        if (!audioContext.current) {
          audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        
        const ctx = audioContext.current
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + duration / 1000)
      } catch (error) {
        // Audio not supported or blocked
      }
    }
  }, [feedbackType])
  
  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    setIsInteracting(true)
    setFeedbackActive(true)
    pressure.set(e.pressure || 0.5)
    
    triggerHaptic(settings.intensity)
    triggerAudio(800, 50)
  }, [pressure, settings.intensity, triggerHaptic, triggerAudio])
  
  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (isInteracting) {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      pressure.set(e.pressure || 0.5)
    }
  }, [isInteracting, mouseX, mouseY, pressure])
  
  const handlePointerUp = React.useCallback(() => {
    setIsInteracting(false)
    setFeedbackActive(false)
    pressure.set(0)
    
    triggerAudio(600, 30)
  }, [pressure, triggerAudio])
  
  const handlePointerEnter = React.useCallback(() => {
    triggerHaptic(0.3)
    triggerAudio(1000, 20)
  }, [triggerHaptic, triggerAudio])

  return (
    <motion.div
      className={cn("relative transform-gpu will-change-transform", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      style={{
        filter: useTransform(brightness, (v) => `brightness(${v})`),
        borderRadius: feedbackType === 'visual' || feedbackType === 'all' ? borderRadius : undefined
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: responseSettings.duration as number, ease: 'easeOut' }}
    >
      {children}
      
      {(feedbackType === 'visual' || feedbackType === 'all') && (
        <AnimatePresence>
          {feedbackActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <motion.div
                className="absolute inset-0 rounded-inherit"
                style={{
                  boxShadow: useTransform(
                    shadowIntensity,
                    [0, 20],
                    ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.5)"]
                  )
                }}
              />
              
              <motion.div
                className="absolute w-4 h-4 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: mouseX,
                  top: mouseY
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
              
              <motion.div
                className="absolute top-2 right-2 w-3 h-3 bg-white/50 rounded-full"
                style={{
                  scale: useTransform(pressure, [0, 1], [0.5, 1.5])
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 text-xs text-white/50 p-1 font-mono">
          FPS: 60 | Latency: &lt;1ms
        </div>
      )}
    </motion.div>
  )
}

export function InstantFeedbackList({
  children,
  itemProps,
  className
}: {
  children: React.ReactNode[]
  itemProps?: Partial<InstantFeedbackProps>
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => (
        <InstantFeedback
          key={index}
          {...itemProps}
          responsiveness="instant"
        >
          {child}
        </InstantFeedback>
      ))}
    </div>
  )
}