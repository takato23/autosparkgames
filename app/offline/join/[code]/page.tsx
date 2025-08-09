'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSocket } from '@/hooks/useSocket'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GradientCard, GradientHeader } from '@/components/ui/gradient-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { AnswerButton } from '@/components/ui/answer-button'
import { IconWrapper } from '@/components/ui/icon-wrapper'
import { theme, a11y } from '@/lib/theme'
import { 
  Wifi, 
  WifiOff, 
  Users, 
  Trophy, 
  Clock,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react'

// Reaction emojis
const reactions = [
  { emoji: '👏', label: 'Aplaudir', color: 'from-yellow-400 to-orange-500' },
  { emoji: '❤️', label: 'Me encanta', color: 'from-pink-400 to-red-500' },
  { emoji: '🔥', label: 'Increíble', color: 'from-orange-400 to-red-500' },
  { emoji: '😂', label: 'Divertido', color: 'from-blue-400 to-purple-500' }
]

export default function OfflineJoinPage() {
  const params = useParams()
  const sessionCode = params.code as string
  const { socket, connected } = useSocket()
  
  const [name, setName] = useState('')
  const [team, setTeam] = useState('')
  const [joined, setJoined] = useState(false)
  const [currentSlide, setCurrentSlide] = useState<any>(null)
  const [presentation, setPresentation] = useState<any>(null)
  const [participant, setParticipant] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!socket) return

    socket.on('joined-session', (data) => {
      setJoined(true)
      setCurrentSlide(data.currentSlide)
      setPresentation(data.presentation)
      setParticipant(data.participant)
      setScore(data.participant.score)
    })

    socket.on('slide-changed', (data) => {
      setCurrentSlide(data.slide)
      setSelectedAnswer(null)
      setShowResult(false)
      
      // Start timer for trivia slides
      if (data.slide.type === 'trivia' && data.slide.timeLimit) {
        setTimeLeft(data.slide.timeLimit)
      } else {
        setTimeLeft(null)
      }
    })

    socket.on('answer-confirmed', (data) => {
      setShowResult(true)
      if (data.isCorrect) {
        setScore(prev => prev + data.pointsEarned)
      }
    })

    socket.on('error', (data) => {
      alert(data.message)
    })

    return () => {
      socket.off('joined-session')
      socket.off('slide-changed')
      socket.off('answer-confirmed')
      socket.off('error')
    }
  }, [socket])

  // Timer countdown
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const joinSession = () => {
    if (!socket || !name.trim()) return
    
    socket.emit('join-session', {
      code: sessionCode,
      name: name.trim(),
      team: team.trim() || null
    })
  }

  const submitAnswer = (answer: string) => {
    if (!socket || selectedAnswer || !currentSlide) return
    
    setSelectedAnswer(answer)
    
    socket.emit('submit-answer', {
      sessionCode,
      slideId: currentSlide.id,
      answer,
      timeSpent: currentSlide.timeLimit ? currentSlide.timeLimit - (timeLeft || 0) : 0
    })
  }

  const sendReaction = (emoji: string) => {
    if (!socket) return
    
    socket.emit('send-reaction', {
      sessionCode,
      emoji
    })
  }

  const renderSlideContent = () => {
    if (!currentSlide) return null

    switch (currentSlide.type) {
      case 'title':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <IconWrapper size="xl" gradient="primary">
                <Sparkles />
              </IconWrapper>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="text-lg md:text-xl text-purple-700 font-medium px-4">
                {currentSlide.subtitle}
              </p>
            )}
            <motion.div 
              className="mt-8 text-lg font-bold text-orange-600"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ¡Prepárate para la diversión!
            </motion.div>
          </motion.div>
        )

      case 'trivia':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="mb-4 text-lg px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg">
                Trivia Challenge
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-800 px-4">{currentSlide.question}</h2>
              
              {timeLeft !== null && timeLeft > 0 && !selectedAnswer && (
                <motion.div
                  animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1 }}
                  transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
                  className="inline-flex items-center justify-center gap-3 mb-6 bg-white px-6 py-3 rounded-full shadow-lg"
                  role="timer"
                  aria-live="polite"
                  aria-label={`${timeLeft} segundos restantes`}
                >
                  <Clock className={`h-6 w-6 ${timeLeft <= 5 ? 'text-red-600' : 'text-orange-600'}`} aria-hidden="true" />
                  <span className={`text-3xl font-mono font-black ${timeLeft <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
                    {timeLeft}s
                  </span>
                </motion.div>
              )}
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Opciones de respuesta">
              {currentSlide.options.map((option: any, index: number) => (
                <motion.div
                  key={option.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnswerButton
                    index={index}
                    selected={selectedAnswer === option.id}
                    correct={option.id === currentSlide.correctAnswer}
                    incorrect={selectedAnswer === option.id && option.id !== currentSlide.correctAnswer}
                    showResult={showResult}
                    onClick={() => submitAnswer(option.id)}
                    disabled={selectedAnswer !== null || timeLeft === 0}
                    role="radio"
                    aria-checked={selectedAnswer === option.id}
                    aria-label={`Opción ${String.fromCharCode(65 + index)}: ${option.text}`}
                  >
                    {option.text}
                  </AnswerButton>
                </motion.div>
              ))}
            </div>

            {showResult && selectedAnswer === currentSlide.correctAnswer && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring" }}
                className="text-center p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl text-white"
                role="alert"
                aria-live="assertive"
              >
                <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-300 drop-shadow-lg" aria-hidden="true" />
                <div className="text-xl font-black">
                  ¡CORRECTO!
                </div>
                <div className="text-3xl font-black mt-2">
                  +{currentSlide.points} puntos
                </div>
              </motion.div>
            )}

            {showResult && selectedAnswer !== currentSlide.correctAnswer && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                className="text-center p-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-xl text-white"
                role="alert"
                aria-live="assertive"
              >
                <div className="text-xl font-bold">
                  ¡Ups! No es correcto
                </div>
                <div className="text-base mt-2">
                  ¡Sigue intentando en la próxima!
                </div>
              </motion.div>
            )}
          </div>
        )

      case 'leaderboard':
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center p-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <IconWrapper size="xl" gradient="warning">
                <Trophy />
              </IconWrapper>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {currentSlide.title}
            </h2>
            
            <motion.div 
              className="p-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl shadow-2xl text-white max-w-sm mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-xl font-bold mb-3">Tu puntuación:</div>
              <div className="text-5xl md:text-6xl font-black" aria-live="polite">
                {score} puntos
              </div>
              <div className="text-2xl mt-2" aria-hidden="true">⭐️⭐️⭐️</div>
            </motion.div>
            
            <motion.div 
              className="mt-8 text-lg md:text-xl font-bold text-purple-700"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ¡Excelente participación!
            </motion.div>
          </motion.div>
        )

      default:
        return (
          <div className="text-center p-8 text-gray-500">
            Esperando siguiente diapositiva...
          </div>
        )
    }
  }

  if (!joined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground variant="vibrant" />
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring" }}
          className="max-w-md w-full relative z-10"
        >
          <GradientCard gradient="primary">
            <GradientHeader gradient="primary">
              <div className="text-center p-6">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <IconWrapper size="lg" gradient="primary" className="bg-white">
                    <Users className="text-purple-600" />
                  </IconWrapper>
                </motion.div>
                <CardTitle className="text-3xl font-bold mb-2 text-white">¡Únete al Juego!</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Código: <span className="font-mono font-black text-2xl bg-white/20 px-3 py-1 rounded-lg">{sessionCode}</span>
                </CardDescription>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4"
                >
                  <Badge 
                    className={`px-4 py-2 text-sm font-semibold ${
                      connected 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    } ${theme.borderRadius.xl}`}
                    role="status"
                    aria-live="polite"
                  >
                    {connected ? (
                      <><Wifi className="h-4 w-4 mr-2" aria-hidden="true" /> Conectado</>
                    ) : (
                      <><WifiOff className="h-4 w-4 mr-2" aria-hidden="true" /> Desconectado</>
                    )}
                  </Badge>
                </motion.div>
              </div>
            </GradientHeader>
            <CardContent className="space-y-6 p-6">
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="name" className="text-sm font-bold text-purple-700 flex items-center gap-2">
                  Tu nombre
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan García"
                  className={`text-lg p-6 border-2 border-purple-300 bg-purple-50 text-gray-900 placeholder-gray-600 ${a11y.focusRing}`}
                  onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                  required
                  aria-required="true"
                />
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="team" className="text-sm font-bold text-orange-700 flex items-center gap-2">
                  Equipo
                  <Badge className="bg-orange-200 text-orange-800 text-xs font-medium">Opcional</Badge>
                </label>
                <Input
                  id="team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Ej: Equipo Rojo"
                  className={`text-lg p-6 border-2 border-orange-300 bg-orange-50 text-gray-900 placeholder-gray-600 ${a11y.focusRing}`}
                  onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GradientButton
                  onClick={joinSession}
                  disabled={!connected || !name.trim()}
                  gradient="primary"
                  size="lg"
                  className="w-full py-6 text-lg"
                >
                  <Zap className="mr-3 h-6 w-6" aria-hidden="true" />
                  Entrar al Juego
                </GradientButton>
              </motion.div>
            </CardContent>
          </GradientCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex flex-col">
      {/* Status Bar */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg p-4" role="banner">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
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
            <span className="text-sm font-bold text-purple-700">
              Sesión: <span className="bg-purple-200 px-2 py-1 rounded font-mono">{sessionCode}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-purple-700">{participant?.name}</span>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                <Trophy className="h-4 w-4 mr-1" aria-hidden="true" />
                {score} pts
              </Badge>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <GradientCard glassy={true}>
              <CardContent className="p-4 md:p-8">
                {renderSlideContent()}
              </CardContent>
            </GradientCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reaction Toolbar */}
      <footer className="bg-white/90 backdrop-blur-md shadow-lg p-4" role="complementary">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {reactions.map((reaction) => (
              <motion.div key={reaction.emoji}>
                <Button
                  onClick={() => sendReaction(reaction.emoji)}
                  className={`w-full hover:scale-110 transition-all p-3 md:p-4 flex flex-col gap-1 bg-gradient-to-br ${reaction.color} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl ${a11y.focusRing}`}
                  asChild
                  aria-label={`Enviar reacción: ${reaction.label}`}
                >
                  <motion.span whileTap={{ scale: 0.9 }} className="w-full flex flex-col items-center">
                    <span className="text-3xl md:text-4xl filter drop-shadow-md" aria-hidden="true">
                      {reaction.emoji}
                    </span>
                    <span className="text-xs md:text-sm">{reaction.label}</span>
                  </motion.span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}