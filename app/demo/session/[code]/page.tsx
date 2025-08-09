'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockPresentations } from '@/lib/mockData'
import { SlideType } from '@/lib/types/presentation'
import { Wifi, WifiOff, Clock, Trophy } from 'lucide-react'

// Emoji reactions
const reactions = [
  { emoji: '👏', label: 'Clap' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '😂', label: 'Laugh' }
]

export default function DemoParticipantPage() {
  const searchParams = useSearchParams()
  const participantName = searchParams.get('name') || 'Participante'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [connected, setConnected] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Get demo presentation
  const presentation = mockPresentations[0] // Trivia demo
  const currentSlide = presentation.slides[currentSlideIndex]

  // Timer effect
  useEffect(() => {
    if (currentSlide.type === SlideType.TRIVIA && 'timeLimit' in currentSlide && currentSlide.timeLimit) {
      setTimeLeft(currentSlide.timeLimit)
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentSlideIndex, currentSlide])

  const handleAnswer = (optionId: string) => {
    if (selectedAnswer) return // Already answered
    
    setSelectedAnswer(optionId)
    
    if (currentSlide.type === SlideType.TRIVIA && 'correctAnswer' in currentSlide) {
      const isCorrect = optionId === currentSlide.correctAnswer
      if (isCorrect) {
        setScore(score + currentSlide.points)
      }
      setShowResult(true)
      
      // Auto advance after 3 seconds
      setTimeout(() => {
        if (currentSlideIndex < presentation.slides.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1)
          setSelectedAnswer(null)
          setShowResult(false)
        }
      }, 3000)
    }
  }

  const handleReaction = (emoji: string) => {
    // In real app, this would send to presenter
    console.log('Reaction sent:', emoji)
  }

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case SlideType.TITLE:
        return (
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">{currentSlide.title}</h1>
            {'subtitle' in currentSlide && currentSlide.subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-400">{currentSlide.subtitle}</p>
            )}
            <div className="mt-8 text-gray-500">
              Esperando al presentador...
            </div>
          </div>
        )

      case SlideType.TRIVIA:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="mb-2">{currentSlide.category}</Badge>
              <h2 className="text-2xl font-bold mb-2">{currentSlide.question}</h2>
              {timeLeft !== null && timeLeft > 0 && (
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{timeLeft}s</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {'options' in currentSlide && currentSlide.options.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={selectedAnswer !== null}
                  variant={
                    showResult && selectedAnswer === option.id
                      ? option.id === currentSlide.correctAnswer
                        ? 'default'
                        : 'destructive'
                      : showResult && option.id === currentSlide.correctAnswer
                      ? 'default'
                      : 'outline'
                  }
                  className="w-full text-left justify-start text-lg p-6"
                >
                  {option.text}
                  {showResult && option.id === currentSlide.correctAnswer && ' ✓'}
                </Button>
              ))}
            </div>

            {showResult && 'explanation' in currentSlide && currentSlide.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <p className="text-sm">{currentSlide.explanation}</p>
              </motion.div>
            )}
          </div>
        )

      case SlideType.ICE_BREAKER:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{currentSlide.prompt}</h2>
            </div>

            {'options' in currentSlide && currentSlide.options && (
              <div className="grid grid-cols-2 gap-4">
                {currentSlide.options.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    variant={selectedAnswer === option.id ? 'default' : 'outline'}
                    className="h-32 text-lg flex flex-col gap-2"
                  >
                    {'emoji' in option && option.emoji && (
                      <span className="text-3xl">{option.emoji}</span>
                    )}
                    {option.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )

      case SlideType.LEADERBOARD:
        return (
          <div className="text-center p-8">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-4">{currentSlide.title}</h2>
            <div className="space-y-2">
              <div className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                <div className="font-bold">1. {participantName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{score} puntos</div>
              </div>
              {[2, 3, 4, 5].map((pos) => (
                <div key={pos} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="font-medium">{pos}. Jugador {pos}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.max(0, score - pos * 50)} puntos
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Slide type not supported in demo</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Badge variant={connected ? 'default' : 'destructive'}>
              {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connected ? 'Conectado' : 'Desconectado'}
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sesión: 123456
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{participantName}</span>
            <Badge variant="secondary">
              <Trophy className="h-3 w-3 mr-1" />
              {score} pts
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <Card>
              <CardContent className="p-6">
                {renderSlideContent()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reaction Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            {reactions.map((reaction) => (
              <Button
                key={reaction.emoji}
                variant="ghost"
                size="lg"
                onClick={() => handleReaction(reaction.emoji)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {reaction.emoji}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}