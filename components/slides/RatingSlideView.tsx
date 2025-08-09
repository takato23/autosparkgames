'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RatingSlide } from '@/lib/types/presentation'
import type { RatingResponse } from '@/lib/types/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Star } from 'lucide-react'

interface RatingSlideViewProps {
  slide: RatingSlide
  onSubmit: (response: Omit<RatingResponse, 'participantId' | 'slideId' | 'timestamp'>) => void
  hasResponded: boolean
  isParticipant?: boolean
}

export default function RatingSlideView({ 
  slide, 
  onSubmit, 
  hasResponded,
  isParticipant = false 
}: RatingSlideViewProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === null || submitted) return

    const response: Omit<RatingResponse, 'participantId' | 'slideId' | 'timestamp'> = {
      type: 'rating',
      value: rating,
      timeSpent: Date.now() - startTime
    }

    onSubmit(response)
    setSubmitted(true)
  }

  const startTime = Date.now()

  // Generate rating options based on min, max, and step
  const ratingOptions: number[] = []
  for (let i = slide.minValue; i <= slide.maxValue; i += slide.step) {
    ratingOptions.push(i)
  }

  const isStarRating = slide.minValue === 1 && slide.maxValue === 5 && slide.step === 1

  return (
    <Card className="max-w-2xl mx-auto" role="region" aria-label="Puntuación">
      <CardHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CardTitle className="text-2xl text-center">{slide.question}</CardTitle>
          </motion.div>
        </AnimatePresence>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasResponded && !submitted && (
          <>
            {isStarRating ? (
              // Star rating display
              <div className="flex justify-center gap-2">
                {ratingOptions.map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRating(value)}
                    disabled={hasResponded || submitted}
                    className="p-2 transition-colors"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        rating !== null && value <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            ) : (
              // Numeric scale display
              <div className="space-y-4">
                <div className="flex justify-center items-center gap-4">
                  {ratingOptions.map((value, index) => (
                    <motion.button
                      key={value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setRating(value)}
                      disabled={hasResponded || submitted}
                      className={`
                        w-12 h-12 rounded-lg border-2 font-semibold transition-all
                        ${
                          rating === value
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }
                        ${(hasResponded || submitted) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                      `}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
                {slide.labels && (
                  <div className="flex justify-between text-sm text-muted-foreground px-4">
                    <span>{slide.labels.min}</span>
                    <span>{slide.labels.max}</span>
                  </div>
                )}
              </div>
            )}

            {rating !== null && (
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Tu puntuación: {rating}{isStarRating && ' ⭐'}</p>
                <Button
                  onClick={handleSubmit}
                  className="w-full max-w-xs"
                  size="lg"
                  aria-label="Enviar puntuación"
                >
                  Enviar puntuación
                </Button>
              </div>
            )}
          </>
        )}

        {(hasResponded || submitted) && (
          <div className="text-center py-4" role="status" aria-live="polite">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-medium">¡Puntuación enviada!</p>
            <p className="text-2xl font-bold text-primary mt-2">
              {rating}
              {isStarRating && ' ⭐'}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Esperando la siguiente pregunta…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}