'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockPresentations } from '@/lib/mockData'
import { SlideType } from '@/lib/types/presentation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  QrCode,
  Users,
  Trophy,
  BarChart3,
  Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Mock participant responses
const mockResponses = {
  trivia: [
    { option: 'Tierra', count: 2 },
    { option: 'Marte', count: 1 },
    { option: 'Júpiter', count: 8 },
    { option: 'Saturno', count: 3 }
  ],
  icebreaker: [
    { option: 'Playa', count: 12, emoji: '🏖️' },
    { option: 'Montaña', count: 8, emoji: '🏔️' }
  ]
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3']

export default function DemoPresenterPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [participantCount] = useState(14)
  const [floatingReactions, setFloatingReactions] = useState<Array<{id: number, emoji: string, x: number}>>([])

  // Get demo presentation
  const presentation = mockPresentations[0] // Trivia demo
  const currentSlide = presentation.slides[currentSlideIndex]

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev! - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timer === 0) {
      setIsTimerRunning(false)
    }
  }, [isTimerRunning, timer])

  // Simulate reactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const emojis = ['👏', '❤️', '🔥', '😂']
        const newReaction = {
          id: Date.now(),
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          x: Math.random() * 80 + 10 // 10% to 90% of screen width
        }
        setFloatingReactions(prev => [...prev, newReaction])
        
        // Remove reaction after animation
        setTimeout(() => {
          setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id))
        }, 3000)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const handleNext = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
      setShowResults(false)
      
      // Set timer for trivia slides
      const nextSlide = presentation.slides[currentSlideIndex + 1]
      if (nextSlide.type === SlideType.TRIVIA && 'timeLimit' in nextSlide) {
        setTimer(nextSlide.timeLimit || 30)
        setIsTimerRunning(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
      setShowResults(false)
    }
  }

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case SlideType.TITLE:
        return (
          <div className="text-center p-16">
            <motion.h1 
              className="text-6xl font-bold mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {currentSlide.title}
            </motion.h1>
            {'subtitle' in currentSlide && currentSlide.subtitle && (
              <motion.p 
                className="text-3xl text-gray-600 dark:text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentSlide.subtitle}
              </motion.p>
            )}
          </div>
        )

      case SlideType.TRIVIA:
        return (
          <div className="p-12">
            <div className="text-center mb-8">
              <Badge className="mb-4 text-lg px-4 py-2">{currentSlide.category}</Badge>
              <h2 className="text-4xl font-bold mb-4">{currentSlide.question}</h2>
              {timer !== null && (
                <div className="flex items-center justify-center gap-3 text-2xl">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <span className="font-mono text-orange-600">{timer}s</span>
                </div>
              )}
            </div>

            {showResults ? (
              <div className="mt-8">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockResponses.trivia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="option" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {mockResponses.trivia.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.option === 'Júpiter' ? '#22c55e' : COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {'explanation' in currentSlide && currentSlide.explanation && (
                  <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xl">{currentSlide.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 mt-8">
                {'options' in currentSlide && currentSlide.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg text-2xl font-medium text-center"
                  >
                    {String.fromCharCode(65 + index)}. {option.text}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )

      case SlideType.ICE_BREAKER:
        return (
          <div className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold">{currentSlide.prompt}</h2>
            </div>

            {showResults ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={mockResponses.icebreaker}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ option, count, emoji }) => `${emoji} ${option}: ${count}`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mockResponses.icebreaker.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                {'options' in currentSlide && currentSlide.options?.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="p-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg text-center"
                  >
                    {'emoji' in option && option.emoji && (
                      <div className="text-6xl mb-4">{option.emoji}</div>
                    )}
                    <div className="text-3xl font-medium">{option.text}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )

      case SlideType.LEADERBOARD:
        return (
          <div className="p-12">
            <div className="text-center mb-8">
              <Trophy className="h-24 w-24 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-4xl font-bold">{currentSlide.title}</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { name: 'María García', score: 350 },
                { name: 'Carlos López', score: 300 },
                { name: 'Ana Martínez', score: 250 },
                { name: 'Pedro Rodríguez', score: 200 },
                { name: 'Laura Sánchez', score: 150 }
              ].map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`p-6 rounded-lg flex items-center justify-between ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30' :
                    index === 1 ? 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30' :
                    'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">{index + 1}</div>
                    <div>
                      <div className="text-xl font-medium">{player.name}</div>
                      <div className="text-gray-600 dark:text-gray-400">{player.score} puntos</div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="text-4xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Slide type not supported</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Main Presentation Area */}
      <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
        {/* Floating Reactions */}
        <AnimatePresence>
          {floatingReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              className="absolute text-4xl"
              initial={{ bottom: 0, left: `${reaction.x}%`, opacity: 1 }}
              animate={{ bottom: '100%', opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: 'easeOut' }}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        <Card className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Participant Count */}
        <div className="absolute top-8 right-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Users className="h-5 w-5 mr-2" />
            {participantCount} participantes
          </Badge>
        </div>
      </div>

      {/* Presenter Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-t p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentSlideIndex === presentation.slides.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {currentSlideIndex + 1} / {presentation.slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              disabled={timer === null || timer === 0}
            >
              {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowResults(!showResults)}
              disabled={currentSlide.type === SlideType.TITLE || currentSlide.type === SlideType.LEADERBOARD}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <QrCode className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Código: <span className="font-mono font-bold">123456</span>
          </div>
        </div>
      </div>
    </div>
  )
}