'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { OpenTextSlide } from '@/lib/types/presentation'
import type { OpenTextResponse } from '@/lib/types/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Check, MessageSquare } from 'lucide-react'

interface OpenTextSlideViewProps {
  slide: OpenTextSlide
  onSubmit: (response: Omit<OpenTextResponse, 'participantId' | 'slideId' | 'timestamp'>) => void
  hasResponded: boolean
  isParticipant?: boolean
}

export default function OpenTextSlideView({ 
  slide, 
  onSubmit, 
  hasResponded,
  isParticipant = false 
}: OpenTextSlideViewProps) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const minLength = slide.minLength || 0
  const maxLength = slide.maxLength || 500

  const handleSubmit = () => {
    const trimmedText = text.trim()
    
    if (!trimmedText || submitted) return
    
    if (trimmedText.length < minLength) {
      setError(`Response must be at least ${minLength} characters`)
      return
    }

    const response: Omit<OpenTextResponse, 'participantId' | 'slideId' | 'timestamp'> = {
      type: 'open_text',
      text: trimmedText,
      timeSpent: Date.now() - startTime
    }

    onSubmit(response)
    setSubmitted(true)
  }

  const startTime = Date.now()

  return (
    <Card className="max-w-2xl mx-auto" role="region" aria-label="Respuesta abierta">
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
            <MessageSquare className="h-6 w-6 text-primary" />
            <CardTitle>{slide.prompt}</CardTitle>
          </motion.div>
        </AnimatePresence>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasResponded && !submitted && (
          <>
            <div className="space-y-2">
              <Textarea
                placeholder="Escribe tu respuesta aquí..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  setError('')
                }}
                maxLength={maxLength}
                rows={6}
                className="resize-none"
                aria-label="Tu respuesta"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {minLength > 0 && `Mínimo: ${minLength} caracteres`}
                </span>
                <span>
                  {text.length}/{maxLength}
                </span>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || text.trim().length < minLength}
              className="w-full"
              size="lg"
              aria-label="Enviar respuesta"
            >
              Enviar respuesta
            </Button>
          </>
        )}

        {(hasResponded || submitted) && (
          <div className="text-center py-4" role="status" aria-live="polite">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-medium">¡Respuesta enviada!</p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground mb-2">Tu respuesta:</p>
              <p className="whitespace-pre-wrap">{text}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Esperando la siguiente pregunta…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}