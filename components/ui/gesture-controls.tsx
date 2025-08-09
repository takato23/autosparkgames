'use client'

import * as React from "react"
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface GestureControlsProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  // Sensitivity settings
  swipeThreshold?: number
  pinchThreshold?: number
  rotateThreshold?: number
  longPressDelay?: number
  // Visual feedback
  showIndicators?: boolean
  hapticFeedback?: boolean
  className?: string
}

interface TouchData {
  id: number
  x: number
  y: number
}

export function GestureControls({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onRotate,
  onDoubleTap,
  onLongPress,
  swipeThreshold = 30,
  pinchThreshold = 0.1,
  rotateThreshold = 15,
  longPressDelay = 500,
  showIndicators = true,
  hapticFeedback = true,
  className
}: GestureControlsProps) {
  // Motion values for transformations
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)

  // Transform values for visual feedback
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const borderRadius = useTransform(scale, [0.8, 1, 1.2], [20, 16, 8])

  // Touch state
  const [touches, setTouches] = React.useState<TouchData[]>([])
  const [isLongPressing, setIsLongPressing] = React.useState(false)
  const [lastTap, setLastTap] = React.useState(0)
  const [gestureActive, setGestureActive] = React.useState(false)
  const [gestureType, setGestureType] = React.useState<string>('')

  // Refs
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialDistance = React.useRef(0)
  const initialAngle = React.useRef(0)

  // Haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || !navigator.vibrate) return
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50]
    }
    
    navigator.vibrate(patterns[type])
  }

  // Utility functions
  const getDistance = (touch1: TouchData, touch2: TouchData) => {
    return Math.sqrt(
      Math.pow(touch2.x - touch1.x, 2) + Math.pow(touch2.y - touch1.y, 2)
    )
  }

  const getAngle = (touch1: TouchData, touch2: TouchData) => {
    return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x) * 180 / Math.PI
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const newTouches = Array.from(e.touches).map((touch, index) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }))
    
    setTouches(newTouches)
    setGestureActive(true)

    // Single touch - start long press timer
    if (newTouches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true)
        onLongPress?.()
        triggerHaptic('heavy')
      }, longPressDelay)
    }

    // Multi-touch - prepare for pinch/rotate
    if (newTouches.length === 2) {
      initialDistance.current = getDistance(newTouches[0], newTouches[1])
      initialAngle.current = getAngle(newTouches[0], newTouches[1])
      setGestureType('multi-touch')
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    
    const currentTouches = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }))

    // Clear long press on movement
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      setIsLongPressing(false)
    }

    // Multi-touch gestures
    if (currentTouches.length === 2 && touches.length === 2) {
      const currentDistance = getDistance(currentTouches[0], currentTouches[1])
      const currentAngle = getAngle(currentTouches[0], currentTouches[1])

      // Pinch gesture
      const scaleChange = currentDistance / initialDistance.current
      if (Math.abs(scaleChange - 1) > pinchThreshold) {
        scale.set(scaleChange)
        onPinch?.(scaleChange)
        setGestureType('pinch')
      }

      // Rotate gesture
      const angleChange = currentAngle - initialAngle.current
      if (Math.abs(angleChange) > rotateThreshold) {
        rotate.set(angleChange)
        onRotate?.(angleChange)
        setGestureType('rotate')
      }
    }

    setTouches(currentTouches)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear timers
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Handle double tap
    const now = Date.now()
    if (now - lastTap < 300 && !isLongPressing) {
      onDoubleTap?.()
      triggerHaptic('medium')
    }
    setLastTap(now)

    // Reset states
    setTouches([])
    setIsLongPressing(false)
    setGestureActive(false)
    setGestureType('')

    // Reset transformations with spring animation
    scale.set(1)
    rotate.set(0)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const threshold = swipeThreshold

    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe - reduced threshold and velocity for smoother experience
      if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 300) {
        if (offset.x > 0) {
          onSwipeRight?.()
          setGestureType('swipe-right')
        } else {
          onSwipeLeft?.()
          setGestureType('swipe-left')
        }
        triggerHaptic('medium')
      }
    } else {
      // Vertical swipe - reduced threshold and velocity for smoother experience
      if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 300) {
        if (offset.y > 0) {
          onSwipeDown?.()
          setGestureType('swipe-down')
        } else {
          onSwipeUp?.()
          setGestureType('swipe-up')
        }
        triggerHaptic('medium')
      }
    }

    // Reset position
    x.set(0)
    y.set(0)
  }

  return (
    <div className={cn("relative touch-none select-none", className)}>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          x,
          y,
          scale,
          rotate,
          opacity,
          borderRadius
        }}
        className="w-full h-full"
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {children}

        {/* Visual feedback overlay */}
        {showIndicators && gestureActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Long press indicator */}
            {isLongPressing && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/40 animate-pulse" />
                </div>
              </motion.div>
            )}

            {/* Gesture type indicator */}
            {gestureType && (
              <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm font-medium"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                {gestureType.replace('-', ' ').toUpperCase()}
              </motion.div>
            )}

            {/* Multi-touch indicators */}
            {touches.length > 1 && (
              <>
                {touches.map((touch, index) => (
                  <motion.div
                    key={touch.id}
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 border-2 border-white/50"
                    style={{
                      left: touch.x,
                      top: touch.y
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                ))}
                
                {/* Connection line for two-finger gestures */}
                {touches.length === 2 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.line
                      x1={touches[0].x}
                      y1={touches[0].y}
                      x2={touches[1].x}
                      y2={touches[1].y}
                      stroke="white"
                      strokeWidth="2"
                      strokeOpacity="0.5"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                )}
              </>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Gesture hints */}
      {showIndicators && !gestureActive && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 text-white/60 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span>↔️ Deslizar</span>
          <span>🔍 Pellizcar</span>
          <span>↻ Rotar</span>
          <span>⏳ Mantener</span>
        </motion.div>
      )}
    </div>
  )
}