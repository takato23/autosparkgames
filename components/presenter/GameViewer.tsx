'use client'

import { motion } from 'framer-motion'
import { 
  Eye, 
  Palette, 
  Trophy, 
  Users,
  Sparkles,
  Zap,
  Grid3x3,
  Brush,
  Timer,
  Target
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface GameViewerProps {
  content: any
  isActive?: boolean
  onStart?: () => void
  participantCount?: number
}

export default function GameViewer({ content, isActive = false, onStart, participantCount = 0 }: GameViewerProps) {
  const getGameDetails = (type: string) => {
    switch (type) {
      case 'bingo':
        return {
          icon: Eye,
          color: 'from-blue-500 to-cyan-500',
          description: 'Encuentra los patrones y gana premios',
          features: ['Cartones únicos', 'Patrones ganadores', 'Premios sorpresa']
        }
      case 'pictionary':
        return {
          icon: Palette,
          color: 'from-pink-500 to-purple-500',
          description: 'Dibuja y adivina en tiempo real',
          features: ['Canvas colaborativo', '10 colores', 'Turnos rotativos']
        }
      case 'question-race':
        return {
          icon: Trophy,
          color: 'from-orange-500 to-red-500',
          description: 'Compite respondiendo rápido y bien',
          features: ['Power-ups', 'Ranking en vivo', 'Modo turbo']
        }
      case 'team-challenge':
        return {
          icon: Users,
          color: 'from-green-500 to-teal-500',
          description: 'Colabora con tu equipo para ganar',
          features: ['Equipos dinámicos', 'Desafíos grupales', 'Chat de equipo']
        }
      default:
        return {
          icon: Sparkles,
          color: 'from-purple-500 to-pink-500',
          description: 'Juego interactivo',
          features: []
        }
    }
  }

  const gameDetails = getGameDetails(content.subtype)
  const Icon = gameDetails.icon

  // Mock de estado del juego
  const mockGameState = {
    bingo: {
      currentNumber: 42,
      calledNumbers: [5, 12, 23, 34, 42],
      winners: []
    },
    pictionary: {
      currentWord: 'Robot',
      timeLeft: 45,
      drawer: 'Juan'
    },
    'question-race': {
      currentQuestion: '¿Cuál es la capital de Francia?',
      questionNumber: 3,
      totalQuestions: 10,
      leaders: [
        { name: 'María', score: 250 },
        { name: 'Carlos', score: 200 },
        { name: 'Ana', score: 180 }
      ]
    },
    'team-challenge': {
      teams: [
        { name: 'Equipo Rojo', score: 120 },
        { name: 'Equipo Azul', score: 100 },
        { name: 'Equipo Verde', score: 90 }
      ]
    }
  }

  const renderGameContent = () => {
    if (!isActive) {
      // Vista previa del juego
      return (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${gameDetails.color} flex items-center justify-center shadow-2xl`}
          >
            <Icon className="h-16 w-16 text-white" />
          </motion.div>
          
          <div>
            <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
            <p className="text-xl text-white/80 mb-8">{gameDetails.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {gameDetails.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge className="px-4 py-2 bg-white/20 text-white border-white/30 text-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {feature}
                </Badge>
              </motion.div>
            ))}
          </div>

          {onStart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg shadow-lg"
                onClick={onStart}
              >
                <Zap className="h-6 w-6 mr-2" />
                Iniciar Juego
              </Button>
            </motion.div>
          )}

          <div className="text-white/60">
            <Users className="h-5 w-5 inline mr-2" />
            {participantCount} participantes listos
          </div>
        </div>
      )
    }

    // Vista del juego activo
    switch (content.subtype) {
      case 'bingo':
        const bingoState = mockGameState.bingo
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">BINGO</h2>
              <p className="text-xl text-white/80">Número actual</p>
            </div>

            <motion.div
              key={bingoState.currentNumber}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl"
            >
              <span className="text-6xl font-black text-white">{bingoState.currentNumber}</span>
            </motion.div>

            <div className="text-center">
              <p className="text-lg text-white/80 mb-4">Números llamados</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {bingoState.calledNumbers.map((num, index) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <span className="font-semibold">{num}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'pictionary':
        const pictionaryState = mockGameState.pictionary
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Pictionary</h2>
              <p className="text-xl text-white/80">Dibujando: {pictionaryState.drawer}</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Brush className="h-6 w-6" />
                  <span className="text-lg">Palabra secreta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <span className="text-2xl font-mono">{pictionaryState.timeLeft}s</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-64 bg-white/5 rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <Palette className="h-24 w-24 mx-auto mb-4 text-white/40" />
                  <p className="text-white/60">Canvas del juego aquí</p>
                </div>
              </motion.div>
            </div>
          </div>
        )

      case 'question-race':
        const raceState = mockGameState['question-race']
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Carrera de Preguntas</h2>
              <p className="text-lg text-white/80">
                Pregunta {raceState.questionNumber} de {raceState.totalQuestions}
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                {raceState.currentQuestion}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {['París', 'Londres', 'Madrid', 'Berlín'].map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <span className="text-lg">{option}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Ranking en vivo
              </h4>
              <div className="space-y-2">
                {raceState.leaders.map((player, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white/60">#{index + 1}</span>
                      <span>{player.name}</span>
                    </div>
                    <span className="font-semibold">{player.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'team-challenge':
        const teamState = mockGameState['team-challenge']
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Desafío de Equipos</h2>
              <p className="text-xl text-white/80">Colabora para ganar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamState.teams.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 rounded-xl p-6 backdrop-blur"
                >
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-red-500 to-pink-500' :
                      index === 1 ? 'from-blue-500 to-cyan-500' :
                      'from-green-500 to-teal-500'
                    } flex items-center justify-center`}>
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                    <p className="text-3xl font-bold">{team.score} pts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <Icon className="h-24 w-24 mx-auto mb-6" />
            <h2 className="text-3xl font-bold">Juego en progreso</h2>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <Badge className={`bg-gradient-to-r ${gameDetails.color} text-white border-0 px-4 py-1`}>
            <Sparkles className="h-4 w-4 mr-2" />
            Juego Interactivo
          </Badge>
          {isActive && (
            <Badge className="bg-green-500 text-white border-0 animate-pulse">
              <Target className="h-4 w-4 mr-2" />
              En vivo
            </Badge>
          )}
        </div>
        
        <div className="p-12">
          {renderGameContent()}
        </div>
      </motion.div>
    </div>
  )
}