'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PollSlide } from '@/lib/types'
import { BarChart3, Users, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PollRealtimeViewProps {
  slide: PollSlide
  responses: Record<string, number> // option -> count
  totalResponses: number
  onVote?: (option: string) => void
  hasVoted?: boolean
  selectedOption?: string
  isPresenter?: boolean
}

// Mentimeter-style color palette
const optionColors = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
]

export default function PollRealtimeView({
  slide,
  responses = {},
  totalResponses = 0,
  onVote,
  hasVoted = false,
  selectedOption,
  isPresenter = false,
}: PollRealtimeViewProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger animation when responses change
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [totalResponses])

  const getPercentage = (count: number) => {
    if (totalResponses === 0) return 0
    return Math.round((count / totalResponses) * 100)
  }

  const handleVote = async (option: string) => {
    if (!onVote || hasVoted) return
    await onVote(option)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          {slide.question}
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{totalResponses} {totalResponses === 1 ? 'vote' : 'votes'}</span>
          </div>
          {slide.allowMultiple && (
            <span className="text-gray-500">• Multiple selection allowed</span>
          )}
        </div>
      </div>

      {/* Options/Results */}
      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {slide.options.map((option, index) => {
            const key = typeof option === 'string' ? option : option.id ?? String(option)
            const count = responses[key] || 0
            const percentage = getPercentage(count)
            const isSelected = selectedOption === key
            const colorClass = optionColors[index % optionColors.length]

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredOption(key)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                {isPresenter || hasVoted ? (
                  // Results view
                  <div className="relative bg-white rounded-xl shadow-sm overflow-hidden">
                    <motion.div
                      className={cn(colorClass, "absolute inset-0 opacity-20")}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ 
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    />
                    <div className="relative p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-semibold text-gray-800">
                          {typeof option === 'string' ? option : option.text}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={count}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-3xl font-bold text-gray-800"
                          >
                            {percentage}%
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-gray-500">
                          ({count})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Voting view
                  <motion.button
                    onClick={() => handleVote(key)}
                    className={cn(
                      "w-full p-6 bg-white rounded-xl shadow-sm",
                      "border-2 transition-all duration-200",
                      "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                      hoveredOption === key ? "border-gray-400" : "border-transparent"
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-gray-800">
                        {typeof option === 'string' ? option : option.text}
                      </span>
                      <div className={cn(
                        "w-8 h-8 rounded-full",
                        colorClass,
                        "opacity-60"
                      )} />
                    </div>
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Status Bar */}
      {!isPresenter && (
        <div className="p-6 bg-white border-t">
          {hasVoted ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Vote submitted!</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Watch the results update in real-time
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                Select an option to cast your vote
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