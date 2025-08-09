'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RatingSlide } from '@/lib/types'
import { Star, ThumbsUp, Heart, Zap, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScaleRealtimeViewProps {
  slide: RatingSlide
  responses: number[]
  onRate?: (rating: number) => void
  hasRated?: boolean
  selectedRating?: number
  isPresenter?: boolean
}

const scaleIcons = {
  star: Star,
  thumbs: ThumbsUp,
  heart: Heart,
  number: null,
  emoji: null,
}

const emojiScale = ['😡', '😕', '😐', '🙂', '😍']

export default function ScaleRealtimeView({
  slide,
  responses = [],
  onRate,
  hasRated = false,
  selectedRating,
  isPresenter = false,
}: ScaleRealtimeViewProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const averageRating = responses.length > 0
    ? responses.reduce((a, b) => a + b, 0) / responses.length
    : 0

  const getRatingCounts = () => {
    const counts: Record<number, number> = {}
    for (let i = slide.minValue; i <= slide.maxValue; i++) {
      counts[i] = 0
    }
    responses.forEach(rating => {
      if (rating >= slide.minValue && rating <= slide.maxValue) {
        counts[rating] = (counts[rating] || 0) + 1
      }
    })
    return counts
  }

  const ratingCounts = getRatingCounts()
  const maxCount = Math.max(...Object.values(ratingCounts), 1)

  const handleRate = async (rating: number) => {
    if (!onRate || hasRated || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onRate(rating)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderIcon = (rating: number, size = 'default') => {
    const sizeClasses = {
      small: 'h-4 w-4',
      default: 'h-8 w-8',
      large: 'h-12 w-12',
    }
    
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default
    
    // Support only numeric/star/thumbs/heart visualizations for rating slides
    if ((slide as any).visual === 'emoji') {
      const min = (slide as any).minValue ?? slide.minValue
      const max = (slide as any).maxValue ?? slide.maxValue
      const emojiIndex = Math.floor(((rating - min) / (max - min)) * (emojiScale.length - 1))
      return <span className={size === 'large' ? 'text-5xl' : size === 'small' ? 'text-lg' : 'text-3xl'}>{emojiScale[emojiIndex]}</span>
    }
    
    if ((slide as any).visual === 'number') {
      return <span className={cn('font-bold', size === 'large' ? 'text-4xl' : size === 'small' ? 'text-sm' : 'text-2xl')}>{rating}</span>
    }
    
    const visual: 'star' | 'thumbs' | 'heart' | 'number' | 'emoji' = (slide as any).visual ?? 'star'
    const Icon = scaleIcons[visual as keyof typeof scaleIcons]
    if (!Icon) return null
    
    return <Icon className={cn(sizeClass)} />
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          {slide.question}
        </h2>
        {slide.labels && (
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 mt-4">
            <span>{slide.labels.min}</span>
            <div className="flex-1 max-w-md h-px bg-gray-300" />
            <span>{slide.labels.max}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-4">
        {isPresenter || hasRated ? (
          // Results view
          <div className="max-w-4xl mx-auto">
            {/* Average rating */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg">
                <span className="text-lg text-gray-600">Average:</span>
                <span className="text-4xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-gray-500">/ {slide.maxValue}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {responses.length} {responses.length === 1 ? 'response' : 'responses'}
              </p>
            </div>

            {/* Distribution chart */}
            <div className="space-y-3">
              {Array.from({ length: slide.maxValue - slide.minValue + 1 }, (_, i) => {
                const rating = i + slide.minValue
                const count = ratingCounts[rating] || 0
                const percentage = responses.length > 0 ? (count / responses.length) * 100 : 0
                const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="w-16 flex items-center justify-center">
                      {renderIcon(rating, 'small')}
                    </div>
                    <div className="flex-1">
                      <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-4">
                          <span className="text-sm font-medium text-gray-700">
                            {rating}
                          </span>
                          <span className="text-sm text-gray-600">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          // Rating view
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {Array.from({ length: slide.maxValue - slide.minValue + 1 }, (_, i) => {
                const rating = i + slide.minValue
                const isHovered = hoveredRating !== null && rating <= hoveredRating
                const isSelected = selectedRating === rating

                return (
                  <motion.button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(null)}
                    disabled={isSubmitting}
                    className={cn(
                      "p-4 rounded-xl transition-all duration-200",
                      "hover:scale-110 active:scale-95",
                      isHovered || isSelected ? "text-amber-500" : "text-gray-400"
                    )}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {renderIcon(rating, 'large')}
                  </motion.button>
                )
              })}
            </div>

            {/* Labels */}
            {slide.labels && (
              <div className="flex justify-between mt-8 px-8">
                <span className="text-sm text-gray-500">{slide.labels.min}</span>
                <span className="text-sm text-gray-500">{slide.labels.max}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      {!isPresenter && (
        <div className="p-6 bg-white border-t">
          {hasRated ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Rating submitted!</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Your rating: {selectedRating}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                Select a rating to continue
              </p>
            </div>
          )}
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-600">LIVE</span>
        </div>
      </div>
    </div>
  )
}