'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { QASlide } from '@/lib/types/presentation'
import type { QAResponse } from '@/lib/types/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Check, MessageCircle, ThumbsUp } from 'lucide-react'

interface QASlideViewProps {
  slide: QASlide
  onSubmit: (response: Omit<QAResponse, 'participantId' | 'slideId' | 'timestamp'>) => void
  hasResponded: boolean
  isParticipant?: boolean
}

export default function QASlideView({ 
  slide, 
  onSubmit, 
  hasResponded,
  isParticipant = false 
}: QASlideViewProps) {
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmedQuestion = question.trim()
    
    if (!trimmedQuestion || submitted) return
    
    if (trimmedQuestion.length < 5) {
      setError('Question must be at least 5 characters')
      return
    }

    const response: Omit<QAResponse, 'participantId' | 'slideId' | 'timestamp'> = {
      type: 'qa',
      question: trimmedQuestion,
      upvotes: [],
      timeSpent: Date.now() - startTime
    }

    onSubmit(response)
    setSubmitted(true)
  }

  const startTime = Date.now()

  return (
    <Card className="max-w-2xl mx-auto" role="region" aria-label="Preguntas y respuestas">
      <CardHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-2xl text-center flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-6 w-6 text-primary" />
            <CardTitle>{slide.prompt}</CardTitle>
          </motion.div>
        </AnimatePresence>
        {!hasResponded && !submitted && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            {slide.anonymousAllowed 
              ? 'Tu pregunta puede enviarse de forma anónima'
              : 'Tu nombre se mostrará con tu pregunta'}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasResponded && !submitted && (
          <>
            <div className="space-y-2">
              <Textarea
                placeholder="Escribe tu pregunta aquí..."
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value)
                  setError('')
                }}
                maxLength={300}
                rows={4}
                className="resize-none"
                aria-label="Tu pregunta"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {slide.moderationEnabled && 'Las preguntas serán moderadas'}
                </span>
                <span>
                  {question.length}/300
                </span>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={!question.trim() || question.trim().length < 5}
                className="w-full"
                size="lg"
                aria-label="Enviar pregunta"
              >
                Enviar pregunta
              </Button>
              
              {slide.allowUpvoting && (
                <p className="text-center text-sm text-muted-foreground">
                  <ThumbsUp className="inline h-4 w-4 mr-1" />
                  Podrás votar otras preguntas después de enviar la tuya
                </p>
              )}
            </div>
          </>
        )}

        {(hasResponded || submitted) && (
          <div className="text-center py-4" role="status" aria-live="polite">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-medium">¡Pregunta enviada!</p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground mb-2">Tu pregunta:</p>
              <p className="italic">"{question}"</p>
            </div>
            {slide.moderationEnabled && (
              <p className="text-sm text-muted-foreground mt-4">
                Tu pregunta está pendiente de moderación
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Esperando la siguiente diapositiva…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}