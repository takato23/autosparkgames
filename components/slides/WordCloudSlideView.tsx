'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { WordCloudSlide } from '@/lib/types/presentation'
import type { WordCloudResponse } from '@/lib/types/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, Plus, Check } from 'lucide-react'

interface WordCloudSlideViewProps {
  slide: WordCloudSlide
  onSubmit: (response: Omit<WordCloudResponse, 'participantId' | 'slideId' | 'timestamp'>) => void
  hasResponded: boolean
  isParticipant?: boolean
}

export default function WordCloudSlideView({ 
  slide, 
  onSubmit, 
  hasResponded,
  isParticipant = false 
}: WordCloudSlideViewProps) {
  const [words, setWords] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const maxWords = slide.maxWords || 5
  const minLength = slide.minWordLength || 1
  const maxLength = slide.maxWordLength || 20

  const handleAddWord = () => {
    const trimmedWord = currentWord.trim()
    
    if (!trimmedWord) return
    
    if (trimmedWord.length < minLength) {
      setError(`Word must be at least ${minLength} characters`)
      return
    }
    
    if (trimmedWord.length > maxLength) {
      setError(`Word must be no more than ${maxLength} characters`)
      return
    }
    
    if (words.includes(trimmedWord.toLowerCase())) {
      setError('Word already added')
      return
    }
    
    if (words.length >= maxWords) {
      setError(`Maximum ${maxWords} words allowed`)
      return
    }

    setWords([...words, trimmedWord.toLowerCase()])
    setCurrentWord('')
    setError('')
  }

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index))
    setError('')
  }

  const handleSubmit = () => {
    if (words.length === 0 || submitted) return

    const response: Omit<WordCloudResponse, 'participantId' | 'slideId' | 'timestamp'> = {
      type: 'word_cloud',
      words,
      timeSpent: Date.now() - startTime
    }

    onSubmit(response)
    setSubmitted(true)
  }

  const startTime = Date.now()

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{slide.prompt}</CardTitle>
        {!hasResponded && !submitted && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Add up to {maxWords} words
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasResponded && !submitted && (
          <>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a word..."
                value={currentWord}
                onChange={(e) => {
                  setCurrentWord(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddWord()
                  }
                }}
                disabled={words.length >= maxWords}
                maxLength={maxLength}
              />
              <Button
                onClick={handleAddWord}
                disabled={!currentWord.trim() || words.length >= maxWords}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border rounded-lg bg-muted/50">
              {words.length === 0 ? (
                <p className="text-sm text-muted-foreground w-full text-center">
                  Your words will appear here...
                </p>
              ) : (
                words.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                  >
                    <span>{word}</span>
                    <button
                      onClick={() => handleRemoveWord(index)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={words.length === 0}
              className="w-full"
              size="lg"
            >
              Submit Words ({words.length}/{maxWords})
            </Button>
          </>
        )}

        {(hasResponded || submitted) && (
          <div className="text-center py-4">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-medium">Words submitted!</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Waiting for the next question...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}