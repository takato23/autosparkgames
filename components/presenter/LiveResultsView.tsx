'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Maximize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LiveResultsViewProps {
  type: 'poll' | 'quiz' | 'wordcloud' | 'scale' | 'opentext'
  question: string
  responses: any
  participants: number
  timeElapsed?: number
  onNext?: () => void
  onPrevious?: () => void
  onTogglePause?: () => void
  onReset?: () => void
  isPaused?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export default function LiveResultsView({
  type,
  question,
  responses,
  participants,
  timeElapsed = 0,
  onNext,
  onPrevious,
  onTogglePause,
  onReset,
  isPaused = false,
  isFullscreen = false,
  onToggleFullscreen,
}: LiveResultsViewProps) {
  const [animatedParticipants, setAnimatedParticipants] = useState(0)
  
  // Animate participant count
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedParticipants(participants)
    }, 100)
    return () => clearTimeout(timer)
  }, [participants])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderResults = () => {
    switch (type) {
      case 'poll':
      case 'quiz':
        return <BarChartResults data={responses} />
      case 'wordcloud':
        return <WordCloudResults data={responses} />
      case 'scale':
        return <ScaleResults data={responses} />
      case 'opentext':
        return <OpenTextResults data={responses} />
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Encabezado */}
      <div className="px-8 py-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold">{question}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={animatedParticipants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-xl font-semibold"
                  >
                    {animatedParticipants}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg">
                <Clock className="h-5 w-5 text-green-400" />
                <span className="text-xl font-semibold">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
          
          {/* Controles */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="text-gray-400 hover:text-white"
              aria-label="Reiniciar"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePause}
              className="text-gray-400 hover:text-white"
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              aria-pressed={isPaused}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFullscreen}
              className="text-gray-400 hover:text-white"
              aria-label="Pantalla completa"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido de resultados */}
      <div className="flex-1 p-8 overflow-hidden" role="region" aria-label="Resultados en vivo">
        {renderResults()}
      </div>

      {/* Navegación */}
      <div className="px-8 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">EN VIVO</span>
          </div>
          
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            aria-label="Siguiente"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Bar Chart Component
function BarChartResults({ data }: { data: any }) {
  const sortedData = Object.entries(data)
    .map(([option, count]) => ({ option, count: count as number }))
    .sort((a, b) => b.count - a.count)
  
  const maxCount = Math.max(...sortedData.map(d => d.count), 1)
  const total = sortedData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {sortedData.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0
          const barWidth = (item.count / maxCount) * 100

          return (
            <motion.div
              key={item.option}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-medium">{item.option}</span>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">{percentage.toFixed(0)}%</span>
                  <span className="text-gray-400">({item.count})</span>
                </div>
              </div>
              <div className="h-16 bg-gray-700 rounded-lg overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Word Cloud Component
function WordCloudResults({ data }: { data: any }) {
  const sortedWords = Object.entries(data)
    .map(([word, count]) => ({ word, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20) // Top 20 words

  const maxCount = Math.max(...sortedWords.map(w => w.count), 1)

  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-full">
        {sortedWords.map((item, index) => {
          const fontSize = 16 + (item.count / maxCount) * 48
          const opacity = 0.5 + (item.count / maxCount) * 0.5
          
          // Simple grid layout
          const row = Math.floor(index / 4)
          const col = index % 4
          const x = 25 + col * 25
          const y = 25 + row * 20

          return (
            <motion.div
              key={item.word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: opacity, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="absolute text-white font-bold"
              style={{
                fontSize: `${fontSize}px`,
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {item.word}
              <span className="ml-2 text-sm opacity-60">({item.count})</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Scale/Rating Component
function ScaleResults({ data }: { data: any }) {
  const { responses, average, distribution } = data
  
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="mb-12">
          <h2 className="text-2xl text-gray-400 mb-4">Average Rating</h2>
          <div className="text-8xl font-bold text-white">
            {average.toFixed(1)}
          </div>
          <p className="text-gray-400 mt-2">{responses} responses</p>
        </div>
        
        <div className="flex items-end justify-center gap-4 h-64">
          {Object.entries(distribution).map(([rating, count]) => {
            const height = ((count as number) / responses) * 100
            
            return (
              <div key={rating} className="flex flex-col items-center">
                <motion.div
                  className="w-16 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8 }}
                />
                <span className="mt-2 text-gray-400">{rating}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Open Text Component
function OpenTextResults({ data }: { data: any }) {
  const responses = data.slice(0, 10) // Show latest 10
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <AnimatePresence>
          {responses.map((response: any, index: number) => (
            <motion.div
              key={response.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gray-700/50 rounded-xl"
            >
              <p className="text-lg">{response.text}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>{response.author}</span>
                <span>•</span>
                <span>{response.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}