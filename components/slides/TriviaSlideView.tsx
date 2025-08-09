'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TriviaSlide } from '@/lib/types/presentation'
import type { TriviaResponse } from '@/lib/types/session'

interface TriviaSlideViewProps {
  slide: TriviaSlide
  onSubmit: (response: Omit<TriviaResponse, 'participantId' | 'slideId' | 'timestamp'>) => void
  hasResponded: boolean
  isParticipant?: boolean
}

export default function TriviaSlideView({ slide, onSubmit, hasResponded, isParticipant = true }: TriviaSlideViewProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState<number>(slide.timeLimit ? slide.timeLimit : 0)
  const startRef = React.useRef<number>(Date.now())

  React.useEffect(() => {
    if (!slide.timeLimit) return
    if (submitted || hasResponded) return

    setTimeLeft(slide.timeLimit)
    startRef.current = Date.now()

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000)
      const remaining = Math.max(0, (slide.timeLimit ?? 0) - elapsed)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [slide.id, slide.timeLimit, submitted, hasResponded])

  const handleSelect = (id: string) => {
    if (submitted || hasResponded) return
    setSelectedOption(id)
  }

  const handleSubmit = () => {
    if (submitted || hasResponded) return
    if (!selectedOption) return
    const timeSpentMs = Date.now() - startRef.current
    const payload: Omit<TriviaResponse, 'participantId' | 'slideId' | 'timestamp'> = {
      type: 'trivia' as any,
      selectedOption,
      timeSpent: timeSpentMs,
      // Valores por defecto; el servidor calculará los definitivos
      isCorrect: false,
      pointsEarned: 0,
    }
    onSubmit(payload)
    setSubmitted(true)
  }

  const isDisabled = submitted || hasResponded || (slide.timeLimit ? timeLeft <= 0 : false)

  return (
    <Card className="max-w-2xl mx-auto" role="region" aria-label="Pregunta de trivia con temporizador">
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

        {slide.hint && !submitted && !hasResponded && (
          <p className="text-center text-sm text-muted-foreground mt-2">Pista: {slide.hint}</p>
        )}

        {slide.timeLimit && (
          <div className="mt-3 flex items-center justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
              aria-live="polite"
              role="status"
              aria-label={`Tiempo restante: ${timeLeft} segundos`}
            >
              <span>Tiempo</span>
              <span className="font-semibold tabular-nums">{timeLeft}s</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {slide.options.map((opt, idx) => {
            const selected = selectedOption === opt.id
            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => handleSelect(opt.id)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'} ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                aria-pressed={selected}
                aria-label={`Opción: ${opt.text}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opt.text}</span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {!submitted && !hasResponded && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isDisabled}
            className="w-full"
            size="lg"
            aria-label="Enviar respuesta de trivia"
          >
            Enviar respuesta
          </Button>
        )}

        {(submitted || hasResponded) && (
          <div className="text-center py-4" role="status" aria-live="polite">
            <p className="text-lg font-medium">¡Respuesta enviada!</p>
            {slide.explanation && (
              <p className="text-sm text-muted-foreground mt-1">{slide.explanation}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">Esperando la siguiente pregunta…</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



