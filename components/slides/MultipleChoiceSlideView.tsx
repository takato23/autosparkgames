'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MultipleChoiceSlide } from '@/lib/types/presentation'
import type { MultipleChoiceResponse } from '@/lib/types/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface MultipleChoiceSlideViewProps {
  slide: MultipleChoiceSlide
  onSubmit: (response: Omit<MultipleChoiceResponse, 'participantId' | 'slideId' | 'timestamp'>) => void
  hasResponded: boolean
  isParticipant?: boolean
}

export default function MultipleChoiceSlideView({ 
  slide, 
  onSubmit, 
  hasResponded,
  isParticipant = false 
}: MultipleChoiceSlideViewProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleOptionClick = (optionId: string) => {
    if (hasResponded || submitted) return

    if (slide.allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  const handleSubmit = () => {
    if (selectedOptions.length === 0 || submitted) return

    const response: Omit<MultipleChoiceResponse, 'participantId' | 'slideId' | 'timestamp'> = {
      type: 'multiple_choice',
      selectedOptions,
      timeSpent: Date.now() - startTime
    }

    onSubmit(response)
    setSubmitted(true)
  }

  const startTime = Date.now()

  return (
    <Card className="max-w-2xl mx-auto" role="region" aria-label="Pregunta de opción múltiple">
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
        {slide.allowMultiple && !hasResponded && !submitted && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Selecciona todas las que correspondan
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {slide.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleOptionClick(option.id)}
              disabled={hasResponded || submitted}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${
                  selectedOptions.includes(option.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }
                ${(hasResponded || submitted) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              `}
              aria-pressed={selectedOptions.includes(option.id)}
              aria-label={`Opción: ${option.text}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.text}</span>
                {selectedOptions.includes(option.id) && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              {option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="mt-3 rounded-md max-h-32 object-cover"
                />
              )}
            </motion.button>
          ))}
        </div>

        {!hasResponded && !submitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="w-full"
            size="lg"
            aria-label="Enviar respuesta"
          >
            Enviar respuesta
          </Button>
        )}

        {(hasResponded || submitted) && (
          <div className="text-center py-4" role="status" aria-live="polite">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-medium">¡Respuesta enviada!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Esperando la siguiente pregunta…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}