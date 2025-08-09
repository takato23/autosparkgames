'use client'

import * as React from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"
import { BeautifulGlassCard } from "@/components/ui/beautiful-glass-card"
import { PremiumButton } from "@/components/ui/premium-button"
import { EnhancedFocusRing } from "@/components/ui/enhanced-focus-ring"
import { InstantFeedback } from "@/components/ui/instant-feedback"
import confetti from "canvas-confetti"
import { 
  Zap, 
  Rocket, 
  Star,
  Trophy,
  Flag,
  Timer,
  Shield,
  Sparkles,
  Heart,
  Target,
  ChevronRight,
  Gauge,
  Swords,
  Crown,
  RefreshCw
} from "lucide-react"

interface Player {
  id: string
  name: string
  avatar: string
  color: string
  position: number
  speed: number
  powerUps: PowerUp[]
  score: number
  streak: number
}

interface PowerUp {
  type: 'speed' | 'freeze' | 'shield' | 'double'
  duration: number
  activatedAt?: number
}

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

interface QuestionRaceProps {
  players?: Player[]
  questions?: Question[]
  trackLength?: number
  onRaceComplete?: (winner: Player, leaderboard: Player[]) => void
  className?: string
}

// Avatar options
const avatars = [
  { id: '🏃', name: 'Runner' },
  { id: '🚀', name: 'Rocket' },
  { id: '🏎️', name: 'Race Car' },
  { id: '🦸', name: 'Superhero' },
  { id: '🦄', name: 'Unicorn' },
  { id: '🐆', name: 'Cheetah' },
  { id: '🦅', name: 'Eagle' },
  { id: '⚡', name: 'Lightning' }
]

// Sample questions
const defaultQuestions: Question[] = [
  {
    id: '1',
    text: '¿Cuál es el resultado de 15 x 6?',
    options: ['80', '85', '90', '95'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'math'
  },
  {
    id: '2',
    text: '¿Cuál es la capital de Francia?',
    options: ['Londres', 'París', 'Madrid', 'Berlín'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'geography'
  },
  {
    id: '3',
    text: '¿Qué significa CEO?',
    options: ['Chief Executive Officer', 'Chief Economic Officer', 'Central Executive Officer', 'Corporate Executive Officer'],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'business'
  }
]

// Track sections with obstacles and boosts
const trackSections = [
  { type: 'normal', length: 10 },
  { type: 'boost', length: 5, effect: 'speed' },
  { type: 'obstacle', length: 5, effect: 'slow' },
  { type: 'normal', length: 10 },
  { type: 'powerup', length: 5, effect: 'random' },
  { type: 'normal', length: 15 }
]

export function QuestionRace({
  players: initialPlayers,
  questions = defaultQuestions,
  trackLength = 50,
  onRaceComplete,
  className
}: QuestionRaceProps) {
  const [players, setPlayers] = React.useState<Player[]>(
    initialPlayers || [
      {
        id: '1',
        name: 'Jugador 1',
        avatar: '🏃',
        color: 'from-purple-400 to-pink-500',
        position: 0,
        speed: 0,
        powerUps: [],
        score: 0,
        streak: 0
      },
      {
        id: '2',
        name: 'CPU 1',
        avatar: '🤖',
        color: 'from-blue-400 to-cyan-500',
        position: 0,
        speed: 0,
        powerUps: [],
        score: 0,
        streak: 0
      },
      {
        id: '3',
        name: 'CPU 2',
        avatar: '🦾',
        color: 'from-green-400 to-emerald-500',
        position: 0,
        speed: 0,
        powerUps: [],
        score: 0,
        streak: 0
      }
    ]
  )

  const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null)
  const [showCorrectAnswer, setShowCorrectAnswer] = React.useState(false)
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const [isRacing, setIsRacing] = React.useState(false)
  const [raceComplete, setRaceComplete] = React.useState(false)
  const [winner, setWinner] = React.useState<Player | null>(null)
  const [timeBonus, setTimeBonus] = React.useState(100)

  const controls = useAnimation()

  // Timer for time bonus
  React.useEffect(() => {
    if (!currentQuestion || showCorrectAnswer || !isRacing) return

    const timer = setInterval(() => {
      setTimeBonus(prev => Math.max(0, prev - 2))
    }, 100)

    return () => clearInterval(timer)
  }, [currentQuestion, showCorrectAnswer, isRacing])

  // Check for winner
  React.useEffect(() => {
    const finishedPlayers = players.filter(p => p.position >= trackLength)
    if (finishedPlayers.length > 0 && !raceComplete) {
      const raceWinner = finishedPlayers[0]
      setWinner(raceWinner)
      setRaceComplete(true)
      setIsRacing(false)
      
      celebrateWin()
      
      const leaderboard = [...players].sort((a, b) => b.position - a.position)
      onRaceComplete?.(raceWinner, leaderboard)
    }
  }, [players, trackLength, raceComplete, onRaceComplete])

  // Apply power-up effects
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => prev.map(player => {
        let newPowerUps = player.powerUps.filter(pu => {
          if (!pu.activatedAt) return true
          return Date.now() - pu.activatedAt < pu.duration * 1000
        })

        return { ...player, powerUps: newPowerUps }
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const startRace = () => {
    setIsRacing(true)
    setRaceComplete(false)
    setWinner(null)
    setQuestionIndex(0)
    setPlayers(prev => prev.map(p => ({ ...p, position: 0, speed: 0, score: 0, streak: 0 })))
    showNextQuestion()
  }

  const showNextQuestion = () => {
    if (questionIndex >= questions.length) {
      setQuestionIndex(0)
    }
    
    setCurrentQuestion(questions[questionIndex])
    setSelectedAnswer(null)
    setShowCorrectAnswer(false)
    setTimeBonus(100)
    
    // CPU players auto-answer after delay
    setTimeout(() => {
      if (currentQuestion && !showCorrectAnswer) {
        cpuAnswer()
      }
    }, 2000 + Math.random() * 2000)
  }

  const handleAnswer = (answerIndex: number) => {
    if (showCorrectAnswer || selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowCorrectAnswer(true)
    
    const isCorrect = answerIndex === currentQuestion?.correctAnswer
    const humanPlayer = players[0]
    
    if (isCorrect) {
      const baseSpeed = currentQuestion?.difficulty === 'hard' ? 15 : 
                       currentQuestion?.difficulty === 'medium' ? 10 : 5
      const speedBoost = baseSpeed + (timeBonus / 10)
      const streakBonus = humanPlayer.streak * 2
      
      movePlayer(humanPlayer.id, speedBoost + streakBonus, true)
      
      playCorrectSound()
    } else {
      movePlayer(humanPlayer.id, -2, false) // Small penalty
      playIncorrectSound()
    }
    
    setTimeout(() => {
      setQuestionIndex(prev => prev + 1)
      if (!raceComplete) {
        showNextQuestion()
      }
    }, 1500)
  }

  const cpuAnswer = () => {
    if (!currentQuestion || showCorrectAnswer) return
    
    players.slice(1).forEach((cpu, index) => {
      setTimeout(() => {
        // CPU skill level affects accuracy
        const accuracy = 0.6 + (index * 0.15) // 60% to 75% accuracy
        const isCorrect = Math.random() < accuracy
        
        if (isCorrect) {
          const baseSpeed = currentQuestion?.difficulty === 'hard' ? 12 : 
                           currentQuestion?.difficulty === 'medium' ? 8 : 4
          movePlayer(cpu.id, baseSpeed + Math.random() * 5, true)
        } else {
          movePlayer(cpu.id, -1, false)
        }
      }, index * 200)
    })
  }

  const movePlayer = (playerId: string, distance: number, correctAnswer: boolean) => {
    setPlayers(prev => prev.map(player => {
      if (player.id !== playerId) return player
      
      let newPosition = Math.max(0, Math.min(trackLength, player.position + distance))
      let newScore = player.score
      let newStreak = correctAnswer ? player.streak + 1 : 0
      
      // Apply power-up effects
      const hasSpeedBoost = player.powerUps.some(pu => pu.type === 'speed' && pu.activatedAt)
      if (hasSpeedBoost && distance > 0) {
        newPosition = Math.min(trackLength, newPosition + 5)
      }
      
      if (correctAnswer) {
        newScore += Math.floor(distance * 10) + (newStreak * 50)
      }
      
      // Check for power-up zones
      const section = Math.floor(newPosition / 10)
      if (trackSections[section]?.type === 'powerup' && Math.random() > 0.5) {
        const powerUpType = ['speed', 'freeze', 'shield', 'double'][Math.floor(Math.random() * 4)] as PowerUp['type']
        player.powerUps.push({
          type: powerUpType,
          duration: 5,
          activatedAt: Date.now()
        })
      }
      
      return {
        ...player,
        position: newPosition,
        speed: distance,
        score: newScore,
        streak: newStreak
      }
    }))
  }

  const celebrateWin = () => {
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.4 },
      colors: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
    })
    
    controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 360, 0],
      transition: { duration: 1 }
    })
  }

  const playCorrectSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjQFHm7A7+OZURE')
    audio.volume = 0.3
    audio.play()
  }

  const playIncorrectSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRi4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoDAACAAAAA3wEAAAMBAADWAAAAyv7//9L+//8A////+P7//7j9//+u/f//AAAAAPz///8oAQAABAAAANT+//8AAAAA5P///wABAADG////+P///xgAAADK////GAEAACwBAAAsAQAABAAAABT///8A////7P7//wAAAAD8/v//2P7//+z+//8A////AAAAAAAAAAAA////+P///zAAAADK////UAEAAFwBAAAQAQAABAAAAOz+//8AAAAA7P///wABAADU////LAAAADQAAAA0AAAAMAAAAPD///8AAAAA6P///wAAAADg////2P///+z///8A////AAAAAAAAAAD8////CAAAACAAAADM////GAEAAPT//')
    audio.volume = 0.3
    audio.play()
  }

  const getPlayerIcon = (player: Player) => {
    const powerUp = player.powerUps.find(pu => pu.activatedAt)
    if (!powerUp) return null
    
    switch (powerUp.type) {
      case 'speed': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'freeze': return <Timer className="h-4 w-4 text-blue-400" />
      case 'shield': return <Shield className="h-4 w-4 text-green-400" />
      case 'double': return <Star className="h-4 w-4 text-purple-400" />
    }
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      {/* Header */}
      <BeautifulGlassCard variant="cosmic" className="mb-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Carrera de Preguntas</h2>
            <p className="text-white/80">
              ¡Responde correctamente para avanzar en la pista!
            </p>
          </div>
          
          {!isRacing && !raceComplete && (
            <EnhancedFocusRing variant="vibrant">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={startRace}
                icon={<Flag />}
                effect="glow"
              >
                Iniciar Carrera
              </PremiumButton>
            </EnhancedFocusRing>
          )}
          
          {raceComplete && winner && (
            <motion.div
              animate={controls}
              className="text-center"
            >
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{winner.name} Gana!</p>
              <p className="text-yellow-400 font-medium">{winner.score} puntos</p>
            </motion.div>
          )}
        </div>
      </BeautifulGlassCard>

      {/* Race Track */}
      <BeautifulGlassCard variant="cosmic" className="mb-6 p-6 overflow-hidden">
        <div className="relative">
          {/* Track sections */}
          <div className="absolute inset-0 flex">
            {trackSections.map((section, index) => (
              <div
                key={index}
                className={cn(
                  "flex-1 h-full rounded-lg opacity-20",
                  section.type === 'boost' && "bg-green-500",
                  section.type === 'obstacle' && "bg-red-500",
                  section.type === 'powerup' && "bg-purple-500",
                  section.type === 'normal' && "bg-blue-500"
                )}
              />
            ))}
          </div>
          
          {/* Finish line */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 flex items-center justify-center">
            <Flag className="h-8 w-8 text-white" />
          </div>
          
          {/* Player tracks */}
          <div className="relative space-y-4 py-4">
            {players.map((player, index) => (
              <div key={player.id} className="relative h-16">
                {/* Track line */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div className="w-full h-1 bg-white/20 rounded-full" />
                </div>
                
                {/* Player avatar */}
                <motion.div
                  className="absolute top-0 left-0 transform -translate-x-1/2"
                  animate={{
                    left: `${(player.position / trackLength) * 100}%`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                >
                  <div className="relative">
                    {/* Speed effect */}
                    {player.speed > 0 && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 0.6 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                      >
                        <div className={cn(
                          "h-12 w-24 bg-gradient-to-r opacity-50 blur-md transform -translate-x-full",
                          player.color
                        )} />
                      </motion.div>
                    )}
                    
                    {/* Avatar container */}
                    <motion.div
                      className={cn(
                        "relative w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br shadow-lg",
                        player.color
                      )}
                      whileHover={{ scale: 1.1 }}
                      animate={player.speed > 0 ? {
                        rotate: [0, 360],
                        transition: { duration: 0.5, repeat: Infinity, ease: "linear" }
                      } : {}}
                    >
                      {player.avatar}
                      
                      {/* Power-up indicator */}
                      {getPlayerIcon(player) && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {getPlayerIcon(player)}
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {/* Player name */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <p className="text-xs font-medium text-white">
                        {player.name}
                      </p>
                    </div>
                    
                    {/* Streak indicator */}
                    {player.streak > 1 && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                      >
                        <div className="px-2 py-1 bg-orange-500 rounded-full text-white text-xs font-bold">
                          🔥 {player.streak}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                {/* Position indicator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      #{index + 1}
                    </p>
                    <p className="text-xs text-white/60">
                      {player.score} pts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BeautifulGlassCard>

      {/* Question Area */}
      {isRacing && currentQuestion && (
        <BeautifulGlassCard variant="ocean" className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white flex-1">
                {currentQuestion.text}
              </h3>
              
              {/* Time bonus indicator */}
              <div className="text-right ml-4">
                <Gauge className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                <p className={cn(
                  "text-sm font-bold",
                  timeBonus > 50 ? "text-green-400" : 
                  timeBonus > 20 ? "text-yellow-400" : "text-red-400"
                )}>
                  +{Math.floor(timeBonus / 10)}
                </p>
              </div>
            </div>
            
            {/* Difficulty indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Dificultad:</span>
              <div className="flex gap-1">
                {['easy', 'medium', 'hard'].map((level, i) => (
                  <Star
                    key={level}
                    className={cn(
                      "h-4 w-4",
                      i <= ['easy', 'medium', 'hard'].indexOf(currentQuestion.difficulty)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/20"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctAnswer
              const showResult = showCorrectAnswer
              
              return (
                <EnhancedFocusRing key={index} variant="vibrant">
                  <InstantFeedback>
                    <PremiumButton
                      onClick={() => handleAnswer(index)}
                      disabled={showCorrectAnswer}
                      variant={
                        showResult && isCorrect ? "success" :
                        showResult && isSelected && !isCorrect ? "danger" :
                        isSelected ? "primary" : "ghost"
                      }
                      size="lg"
                      fullWidth
                      className="text-left justify-start"
                      effect={isSelected ? "ripple" : undefined}
                    >
                      <span className="mr-2 font-bold">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                      
                      {showResult && isCorrect && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          ✓
                        </motion.span>
                      )}
                    </PremiumButton>
                  </InstantFeedback>
                </EnhancedFocusRing>
              )
            })}
          </div>
        </BeautifulGlassCard>
      )}

      {/* Game Over */}
      {raceComplete && (
        <BeautifulGlassCard variant="sunset" className="p-6">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            🏁 ¡Carrera Terminada! 🏁
          </h3>
          
          {/* Leaderboard */}
          <div className="space-y-3 mb-6">
            {[...players].sort((a, b) => b.position - a.position).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  index === 0 ? "bg-yellow-500/20" :
                  index === 1 ? "bg-gray-300/20" :
                  index === 2 ? "bg-orange-700/20" :
                  "bg-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                  </div>
                  <div className="text-2xl">{player.avatar}</div>
                  <div>
                    <p className="font-bold text-white">{player.name}</p>
                    <p className="text-sm text-white/60">{player.score} puntos</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-white/60">Posición</p>
                  <p className="text-lg font-bold text-white">
                    {Math.floor((player.position / trackLength) * 100)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <EnhancedFocusRing variant="vibrant">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={startRace}
                icon={<RefreshCw />}
                effect="glow"
              >
                Jugar de Nuevo
              </PremiumButton>
            </EnhancedFocusRing>
          </div>
        </BeautifulGlassCard>
      )}
    </div>
  )
}