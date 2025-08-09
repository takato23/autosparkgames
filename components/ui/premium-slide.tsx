'use client'

import * as React from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { GlassCard } from "./glass-card"
import { ModernButton } from "./modern-button"

interface PremiumSlideProps {
  children: React.ReactNode[]
  currentSlide?: number
  onSlideChange?: (slide: number) => void
  className?: string
  // Visual options
  showIndicators?: boolean
  showNavigation?: boolean
  showProgress?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  // Transition options
  transition?: 'slide' | 'fade' | 'scale' | 'rotate' | 'flip' | 'cube'
  direction?: 'horizontal' | 'vertical'
  // Gesture options
  swipeEnabled?: boolean
  swipeThreshold?: number
  // Advanced features
  loop?: boolean
  pauseOnHover?: boolean
  keyboard?: boolean
}

const slideVariants = {
  slide: {
    horizontal: {
      enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      }),
      center: {
        x: 0,
        opacity: 1
      },
      exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      })
    },
    vertical: {
      enter: (direction: number) => ({
        y: direction > 0 ? 1000 : -1000,
        opacity: 0
      }),
      center: {
        y: 0,
        opacity: 1
      },
      exit: (direction: number) => ({
        y: direction < 0 ? 1000 : -1000,
        opacity: 0
      })
    }
  },
  fade: {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  },
  scale: {
    enter: { scale: 0, opacity: 0, rotate: -180 },
    center: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0, opacity: 0, rotate: 180 }
  },
  rotate: {
    enter: { rotateY: 90, opacity: 0 },
    center: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 }
  },
  flip: {
    enter: { rotateX: 90, opacity: 0 },
    center: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 }
  },
  cube: {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: { rotateY: 0, x: 0, opacity: 1 },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }
}

export function PremiumSlide({
  children,
  currentSlide = 0,
  onSlideChange,
  className,
  showIndicators = true,
  showNavigation = true,
  showProgress = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  transition = 'slide',
  direction = 'horizontal',
  swipeEnabled = true,
  swipeThreshold = 50,
  loop = true,
  pauseOnHover = true,
  keyboard = true
}: PremiumSlideProps) {
  const [current, setCurrent] = React.useState(currentSlide)
  const [slideDirection, setSlideDirection] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const [isDragging, setIsDragging] = React.useState(false)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSlides = children.length

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && !isDragging) {
      intervalRef.current = setInterval(() => {
        goToNext()
      }, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isDragging, current])

  // Keyboard navigation
  React.useEffect(() => {
    if (!keyboard) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
        case ' ':
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case 'Home':
          e.preventDefault()
          goToSlide(0)
          break
        case 'End':
          e.preventDefault()
          goToSlide(totalSlides - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [keyboard, isPlaying, current])

  const goToSlide = (index: number) => {
    if (index === current) return
    
    const newIndex = loop 
      ? (index + totalSlides) % totalSlides 
      : Math.max(0, Math.min(totalSlides - 1, index))
    
    setSlideDirection(newIndex > current ? 1 : -1)
    setCurrent(newIndex)
    onSlideChange?.(newIndex)
  }

  const goToNext = () => {
    const nextIndex = loop ? (current + 1) % totalSlides : current + 1
    if (nextIndex < totalSlides || loop) {
      goToSlide(nextIndex)
    }
  }

  const goToPrevious = () => {
    const prevIndex = loop ? (current - 1 + totalSlides) % totalSlides : current - 1
    if (prevIndex >= 0 || loop) {
      goToSlide(prevIndex)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    
    if (!swipeEnabled) return

    const threshold = swipeThreshold * 0.7 // Reduced threshold for less friction
    const velocity = direction === 'horizontal' ? info.velocity.x : info.velocity.y
    const offset = direction === 'horizontal' ? info.offset.x : info.offset.y

    // More sensitive velocity detection
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 300) {
      if ((direction === 'horizontal' && offset > 0) || (direction === 'vertical' && offset > 0)) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
  }

  const getVariants = () => {
    if (transition === 'slide') {
      return slideVariants.slide[direction]
    }
    return slideVariants[transition]
  }

  const progress = ((current + 1) / totalSlides) * 100

  return (
    <div 
      className={cn("relative w-full h-full overflow-hidden", className)}
      onMouseEnter={pauseOnHover ? () => setIsPlaying(false) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsPlaying(autoPlay) : undefined}
    >
      {/* Progress bar */}
      {showProgress && (
        <motion.div className="absolute top-0 left-0 right-0 z-20 h-1">
          <div className="w-full h-full bg-white/20" />
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Slide container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={slideDirection} mode="wait">
          <motion.div
            key={current}
            custom={slideDirection}
            variants={getVariants()}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              duration: 0.4
            }}
            drag={swipeEnabled ? (direction === 'horizontal' ? 'x' : 'y') : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full"
            style={{
              perspective: transition === 'cube' ? 1000 : undefined,
              transformStyle: transition === 'cube' ? 'preserve-3d' : undefined
            }}
          >
            {children[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {showNavigation && (
        <>
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <GlassCard className="p-2" opacity={20} blur="lg">
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                disabled={!loop && current === 0}
                className="p-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </ModernButton>
            </GlassCard>
          </motion.div>

          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <GlassCard className="p-2" opacity={20} blur="lg">
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={!loop && current === totalSlides - 1}
                className="p-2"
              >
                <ChevronRight className="h-6 w-6" />
              </ModernButton>
            </GlassCard>
          </motion.div>
        </>
      )}

      {/* Slide indicators */}
      {showIndicators && (
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="flex items-center gap-2 px-4 py-2" opacity={20} blur="lg">
            {children.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  current === index 
                    ? "bg-white scale-125 shadow-lg" 
                    : "bg-white/40 hover:bg-white/60"
                )}
                whileHover={{ scale: current === index ? 1.25 : 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                {current === index && (
                  <motion.div
                    className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </GlassCard>
        </motion.div>
      )}

      {/* Play/Pause button */}
      {autoPlay && (
        <motion.div
          className="absolute top-4 right-4 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <GlassCard className="p-2" opacity={20} blur="lg">
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </ModernButton>
          </GlassCard>
        </motion.div>
      )}

      {/* Slide counter */}
      <motion.div
        className="absolute top-4 left-4 z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="px-3 py-1" opacity={20} blur="lg">
          <span className="text-white font-medium text-sm">
            {current + 1} / {totalSlides}
          </span>
        </GlassCard>
      </motion.div>
    </div>
  )
}