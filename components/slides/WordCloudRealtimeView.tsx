'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WordCloudSlide } from '@/lib/types'
import { Cloud, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface WordCloudRealtimeViewProps {
  slide: WordCloudSlide
  responses: Array<{ word: string; count: number }>
  onSubmit?: (word: string) => void
  hasResponded?: boolean
  isPresenter?: boolean
}

// Color palette for words similar to Mentimeter
const wordColors = [
  'text-purple-600',
  'text-blue-600',
  'text-pink-600',
  'text-indigo-600',
  'text-violet-600',
  'text-fuchsia-600',
]

// Calculate font size based on frequency
function calculateFontSize(count: number, maxCount: number, minSize = 16, maxSize = 48) {
  if (maxCount === 0) return minSize
  const ratio = count / maxCount
  return Math.floor(minSize + (maxSize - minSize) * Math.pow(ratio, 0.8))
}

// Simple word cloud layout algorithm
function calculateWordPositions(
  words: Array<{ word: string; count: number }>,
  containerWidth: number,
  containerHeight: number
) {
  const positions: Array<{ x: number; y: number; fontSize: number }> = []
  const maxCount = Math.max(...words.map(w => w.count), 1)
  
  // Simple spiral layout
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  let angle = 0
  let radius = 0
  
  words.forEach((_, index) => {
    const fontSize = calculateFontSize(words[index].count, maxCount)
    
    // Calculate position in spiral
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    positions.push({ x, y, fontSize })
    
    // Update spiral parameters
    angle += 0.5
    radius += 2
  })
  
  return positions
}

export default function WordCloudRealtimeView({
  slide,
  responses = [],
  onSubmit,
  hasResponded = false,
  isPresenter = false,
}: WordCloudRealtimeViewProps) {
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById('word-cloud-container')
      if (container) {
        setContainerSize({
          width: container.clientWidth,
          height: container.clientHeight,
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Calculate word positions
  const wordPositions = useMemo(() => {
    return calculateWordPositions(responses, containerSize.width, containerSize.height)
  }, [responses, containerSize])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || !onSubmit || hasResponded) return
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Error submitting word:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const maxCount = Math.max(...responses.map(r => r.count), 1)

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="px-6 py-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {slide.prompt}
        </h2>
        {slide.maxWordLength && (
          <p className="text-gray-600">Máx. {slide.maxWordLength} caracteres</p>
        )}
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Cloud className="h-4 w-4" />
          <span>{responses.length} words submitted</span>
        </div>
      </div>

      {/* Word Cloud Display */}
      <div 
        id="word-cloud-container"
        className="flex-1 relative overflow-hidden p-8"
      >
        {responses.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isPresenter ? 'Waiting for responses...' : 'Be the first to submit a word!'}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {responses.map((response, index) => {
              const position = wordPositions[index] || { x: 0, y: 0, fontSize: 16 }
              const colorClass = wordColors[index % wordColors.length]
              
              return (
                <motion.div
                  key={response.word}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: position.x - containerSize.width / 2,
                    y: position.y - containerSize.height / 2,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  className={cn(
                    "absolute left-1/2 top-1/2 font-bold cursor-default select-none",
                    colorClass
                  )}
                  style={{
                    fontSize: `${position.fontSize}px`,
                    transform: `translate(-50%, -50%)`,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {response.word}
                  {response.count > 1 && (
                    <span className="ml-1 text-sm opacity-60">
                      ({response.count})
                    </span>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Input Form (for participants) */}
      {!isPresenter && (
        <div className="p-6 bg-white border-t">
          {hasResponded ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Thank you for your response!</p>
              <p className="text-gray-500 text-sm mt-1">Watch the word cloud grow in real-time</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={"Enter a word or short phrase..."}
                  className="flex-1 h-12 text-lg"
                  maxLength={50}
                  disabled={isSubmitting}
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isSubmitting}
                  className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {inputValue.length}/50 characters
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  )
}