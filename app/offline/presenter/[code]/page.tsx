'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useSocket } from '@/hooks/useSocket'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GradientCard, GradientHeader } from '@/components/ui/gradient-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { IconWrapper } from '@/components/ui/icon-wrapper'
import { KeyboardHint } from '@/components/ui/keyboard-hint'
import { theme, a11y } from '@/lib/theme'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Users,
  Trophy,
  BarChart3,
  Clock,
  Sparkles,
  Crown,
  Wifi,
  WifiOff
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Chart colors for data visualization
const CHART_COLORS = [
  theme.colors.teams[0].bg.replace('bg-', '#'),
  theme.colors.teams[1].bg.replace('bg-', '#'),
  theme.colors.teams[2].bg.replace('bg-', '#'),
  theme.colors.teams[3].bg.replace('bg-', '#'),
  theme.colors.teams[4].bg.replace('bg-', '#'),
  theme.colors.teams[5].bg.replace('bg-', '#')
].map(color => {
  // Convert Tailwind class to hex color
  const colorMap: Record<string, string> = {
    '#red-500': '#ef4444',
    '#blue-500': '#3b82f6',
    '#green-500': '#22c55e',
    '#yellow-500': '#eab308',
    '#purple-500': '#a855f7',
    '#pink-500': '#ec4899'
  }
  return colorMap[color] || '#6b7280'
})

interface FloatingReaction {
  id: number
  emoji: string
  x: number
  y: number
}

export default function OfflinePresenterPage() {
  const params = useParams()
  const sessionCode = params.code as string
  const { socket, connected } = useSocket()

  const [presentation, setPresentation] = useState<any>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [timer, setTimer] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([])

  const currentSlide = presentation?.slides[currentSlideIndex]

  useEffect(() => {
    if (!socket) return

    // Request session data when connected
    socket.emit('get-session-data', { sessionCode })

    socket.on('session-data', (data) => {
      setPresentation(data.presentation)
      setCurrentSlideIndex(data.currentSlideIndex)
      setParticipantCount(data.participantCount)
    })

    socket.on('participant-joined', (data) => {
      setParticipantCount(data.totalParticipants)
    })

    socket.on('participant-left', (data) => {
      setParticipantCount(data.totalParticipants)
    })

    socket.on('answer-received', (data) => {
      setResponses(data.responses)
      setLeaderboard(data.leaderboard)
    })

    socket.on('reaction-received', (data) => {
      addFloatingReaction(data.emoji)
    })

    return () => {
      socket.off('session-data')
      socket.off('participant-joined')
      socket.off('participant-left')
      socket.off('answer-received')
      socket.off('reaction-received')
    }
  }, [socket, sessionCode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') previousSlide()
      if (e.key === ' ') {
        e.preventDefault()
        toggleTimer()
      }
      if (e.key === 'r' || e.key === 'R') setShowResults(!showResults)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showResults])

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isTimerRunning, timer])

  const addFloatingReaction = useCallback((emoji: string) => {
    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: Math.random() * 20 + 70   // Bottom 30% of screen
    }
    
    setFloatingReactions(prev => [...prev, newReaction])
    
    // Remove reaction after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id))
    }, 4000)
  }, [])

  const nextSlide = () => {
    if (!socket || !presentation || currentSlideIndex >= presentation.slides.length - 1) return
    
    socket.emit('next-slide', { sessionCode })
    setCurrentSlideIndex(prev => prev + 1)
    setShowResults(false)
    setResponses([])
    
    // Start timer for new slide
    const nextSlide = presentation.slides[currentSlideIndex + 1]
    if (nextSlide?.type === 'trivia' && nextSlide.timeLimit) {
      setTimer(nextSlide.timeLimit)
      setIsTimerRunning(true)
    }
  }

  const previousSlide = () => {
    if (!socket || currentSlideIndex <= 0) return
    
    socket.emit('previous-slide', { sessionCode })
    setCurrentSlideIndex(prev => prev - 1)
    setShowResults(false)
    setResponses([])
  }

  const toggleTimer = () => {
    if (timer === null || timer === 0) {
      // Start new timer
      if (currentSlide?.type === 'trivia' && currentSlide.timeLimit) {
        setTimer(currentSlide.timeLimit)
        setIsTimerRunning(true)
      }
    } else {
      setIsTimerRunning(!isTimerRunning)
    }
  }

  const renderSlideContent = () => {
    if (!currentSlide) return null

    switch (currentSlide.type) {
      case 'title':
        return (
          <div className="text-center p-16">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-block mb-8"
            >
              <IconWrapper size="xl" gradient="warning">
                <Sparkles />
              </IconWrapper>
            </motion.div>
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentSlide.title}
            </motion.h1>
            {currentSlide.subtitle && (
              <motion.p 
                className="text-3xl md:text-4xl text-purple-700 font-medium px-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {currentSlide.subtitle}
              </motion.p>
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="mt-12 text-2xl md:text-3xl font-bold text-orange-600"
            >
              <span aria-hidden="true">🎮</span> ¡Que comience la diversión! <span aria-hidden="true">🎮</span>
            </motion.div>
          </div>
        )

      case 'trivia':
        return (
          <div className="p-12">
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Badge className="mb-6 text-2xl md:text-3xl px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl rounded-full">
                  <span aria-hidden="true">🧠</span> Trivia Challenge <span aria-hidden="true">🏆</span>
                </Badge>
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-8 text-purple-800 px-4 md:px-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentSlide.question}
              </motion.h2>
              
              {timer !== null && (
                <motion.div 
                  className="inline-flex items-center justify-center gap-4 px-6 md:px-8 py-3 md:py-4 bg-white rounded-full shadow-xl"
                  animate={{ 
                    scale: timer <= 5 ? [1, 1.3, 1] : 1,
                  }}
                  transition={{ 
                    repeat: timer <= 5 ? Infinity : 0, 
                    duration: 0.8 
                  }}
                  role="timer"
                  aria-live="polite"
                  aria-label={`${timer} segundos restantes`}
                >
                  <Clock className={`h-10 md:h-12 w-10 md:w-12 ${timer <= 5 ? 'text-red-500' : 'text-orange-500'}`} aria-hidden="true" />
                  <span className={`font-mono font-black text-4xl md:text-6xl ${timer <= 5 ? 'text-red-500' : 'text-orange-500'}`}>
                    {timer}s
                  </span>
                </motion.div>
              )}
            </div>

            {showResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={responses.map((r: any) => ({
                    option: currentSlide.options.find((o: any) => o.id === r.answer)?.text || 'Unknown',
                    count: responses.filter((resp: any) => resp.answer === r.answer).length,
                    isCorrect: r.answer === currentSlide.correctAnswer
                  })).filter((item: any, index: number, self: any) => 
                    index === self.findIndex((t: any) => t.option === item.option)
                  )}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="option" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {responses.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isCorrect ? '#22c55e' : CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mt-8 p-6 md:p-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl text-center shadow-2xl"
                  role="alert"
                  aria-live="assertive"
                >
                  <Trophy className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-4 text-yellow-300 drop-shadow-lg" aria-hidden="true" />
                  <p className="text-2xl md:text-3xl font-black text-white">
                    <span aria-hidden="true">✅</span> Respuesta correcta: {currentSlide.options.find((o: any) => o.id === currentSlide.correctAnswer)?.text}
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 px-4">
                {currentSlide.options.map((option: any, index: number) => {
                  const answerColor = theme.colors.answers[index % theme.colors.answers.length]
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2, type: "spring" }}
                      className={`p-8 md:p-12 rounded-3xl text-center shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${answerColor.bg} ${answerColor.text}`}
                      aria-label={`Opción ${String.fromCharCode(65 + index)}: ${option.text}`}
                    >
                      <div className="text-4xl md:text-5xl font-black mb-4 md:mb-6 bg-white/20 w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="text-2xl md:text-3xl font-bold">
                        {option.text}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )

      case 'leaderboard':
        return (
          <div className="p-12">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-6"
              >
                <IconWrapper size="xl" gradient="warning" rounded={true}>
                  <Trophy />
                </IconWrapper>
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {currentSlide.title}
              </h2>
            </motion.div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {leaderboard.slice(0, 5).map((player: any, index: number) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, type: "spring" }}
                  className={`p-10 rounded-3xl flex items-center justify-between shadow-2xl transform transition-all ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white scale-110' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white scale-105' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white scale-102' :
                    'bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800'
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <div className="text-6xl font-black">
                      {index === 0 ? (
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Crown className="h-12 md:h-16 w-12 md:w-16 text-yellow-300 drop-shadow-lg" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <span className={index < 3 ? 'text-white' : ''} aria-label={`Posición ${index + 1}`}>#{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-3xl md:text-4xl font-black">{player.name}</div>
                      <div className="text-xl md:text-2xl font-semibold opacity-90">
                        {player.score} puntos
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <motion.div 
                      className="text-5xl md:text-6xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.2 }}
                      aria-label={`Medalla de ${index === 0 ? 'oro' : index === 1 ? 'plata' : 'bronce'}`}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center p-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Sparkles className="h-20 w-20 text-purple-500" />
            </motion.div>
            <div className="text-3xl font-bold text-purple-700">Preparando siguiente diapositiva...</div>
          </div>
        )
    }
  }

  if (!presentation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <IconWrapper size="xl" gradient="primary">
              <Sparkles />
            </IconWrapper>
          </motion.div>
          <div className="text-2xl font-bold text-white">Cargando presentación...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="vibrant" />
      
      {/* Floating Reactions */}
      <AnimatePresence>
        {floatingReactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            className="absolute text-6xl pointer-events-none z-50"
            initial={{ 
              left: `${reaction.x}%`, 
              top: `${reaction.y}%`, 
              opacity: 1, 
              scale: 1 
            }}
            animate={{ 
              y: -400, 
              opacity: 0, 
              scale: 1.5,
              rotate: Math.random() * 360 - 180
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: 'easeOut' }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Presentation Area */}
      <div className="flex-1 p-8 flex items-center justify-center relative z-10">
        {/* Participant Count */}
        <motion.div 
          className="absolute top-4 md:top-8 right-4 md:right-8 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          <Badge className="text-lg md:text-2xl px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-2xl rounded-full flex items-center gap-2">
            <Users className="h-5 md:h-7 w-5 md:w-7" aria-hidden="true" />
            <span aria-live="polite" aria-label={`${participantCount} participantes conectados`}>
              {participantCount} participantes <span aria-hidden="true">🎉</span>
            </span>
          </Badge>
        </motion.div>

        <GradientCard 
          className="w-full max-w-7xl mx-auto" 
          glassy={true}
          hover={false}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="region"
              aria-live="polite"
              aria-label={`Diapositiva ${currentSlideIndex + 1} de ${presentation?.slides.length}`}
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </GradientCard>
      </div>

      {/* Presenter Toolbar */}
      <motion.div 
        className="bg-white/95 backdrop-blur-md shadow-2xl p-4 md:p-6 relative z-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", delay: 0.3 }}
        role="toolbar"
        aria-label="Controles de presentación"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <GradientButton
              onClick={previousSlide}
              disabled={currentSlideIndex === 0}
              gradient="primary"
              size="lg"
              aria-label="Diapositiva anterior"
              className="px-4 md:px-8"
            >
              <ChevronLeft className="h-5 md:h-6 w-5 md:w-6" />
            </GradientButton>
            <GradientButton
              onClick={nextSlide}
              disabled={currentSlideIndex === presentation.slides.length - 1}
              gradient="primary"
              size="lg"
              aria-label="Siguiente diapositiva"
              className="px-4 md:px-8"
            >
              <ChevronRight className="h-5 md:h-6 w-5 md:w-6" />
            </GradientButton>
            <Badge 
              className="text-base md:text-xl font-bold text-purple-700 bg-purple-100 px-3 md:px-4 py-1 md:py-2 rounded-full ml-2 md:ml-6"
              role="status"
              aria-live="polite"
            >
              {currentSlideIndex + 1} / {presentation.slides.length}
            </Badge>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <GradientButton
              onClick={toggleTimer}
              disabled={currentSlide?.type !== 'trivia'}
              gradient="warning"
              size="lg"
              aria-label={isTimerRunning ? 'Pausar temporizador' : 'Iniciar temporizador'}
              className="px-4 md:px-8"
            >
              {isTimerRunning ? <Pause className="h-5 md:h-6 w-5 md:w-6" /> : <Play className="h-5 md:h-6 w-5 md:w-6" />}
            </GradientButton>
            <GradientButton
              onClick={() => setShowResults(!showResults)}
              disabled={currentSlide?.type === 'title' || currentSlide?.type === 'leaderboard'}
              gradient="secondary"
              size="lg"
              aria-label={showResults ? 'Ocultar resultados' : 'Mostrar resultados'}
              aria-pressed={showResults}
              className="px-4 md:px-8"
            >
              <BarChart3 className="h-5 md:h-6 w-5 md:w-6" />
            </GradientButton>
          </div>

          {/* Session Info */}
          <div className="flex items-center gap-3">
            <Badge 
              className={`px-3 py-1 font-semibold ${
                connected 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              } ${theme.borderRadius.xl}`}
              role="status"
              aria-live="polite"
            >
              {connected ? (
                <><Wifi className="h-4 w-4" aria-hidden="true" /> Conectado</>
              ) : (
                <><WifiOff className="h-4 w-4" aria-hidden="true" /> Desconectado</>
              )}
            </Badge>
            <div className="text-base md:text-xl font-bold text-gray-800">
              Código: <span className="font-mono font-black text-xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{sessionCode}</span>
            </div>
          </div>
        </div>
        
        {/* Keyboard shortcuts hint */}
        <div className="max-w-7xl mx-auto mt-2 flex gap-4 justify-center opacity-70">
          <KeyboardHint keys={['←', '→']} description="Navegar" />
          <KeyboardHint keys={['Espacio']} description="Timer" />
          <KeyboardHint keys={['R']} description="Resultados" />
        </div>
      </motion.div>
    </div>
  )
}