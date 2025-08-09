'use client'

import { useState } from 'react'
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  Button,
  Input,
  Badge
} from '@/lib/design-system/components'
import GameWizardModal, { GameType, WizardStep } from '@/lib/games/wizards/GameWizardModal'
import { triviaWizardSteps } from '@/lib/games/wizards/TriviaWizard'
import { bingoWizardSteps } from '@/lib/games/wizards/BingoWizard'
import { pictionaryWizardSteps } from '@/lib/games/wizards/PictionaryWizard'
import { 
  Gamepad2,
  Brain,
  Grid3X3,
  Palette,
  Trophy,
  Users,
  Zap,
  ChevronRight,
  Star,
  Clock,
  Target
} from 'lucide-react'

interface CreateGameModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateGame: (gameData: GameData) => void
}

interface GameData {
  name: string
  type: 'trivia' | 'bingo' | 'pictionary' | 'memory' | 'race' | 'team'
  description: string
  maxPlayers: number
  estimatedTime: number
  // Optional settings for advanced game configs
  settings?: Record<string, any>
}

const gameTypes = [
  {
    id: 'trivia',
    name: 'Trivia Quiz',
    description: 'Preguntas y respuestas con múltiples opciones',
    icon: Brain,
    color: 'violet',
    difficulty: 'Fácil',
    time: '15-30 min',
    players: '2-50',
    features: ['Preguntas múltiples', 'Tiempo límite', 'Puntuación']
  },
  {
    id: 'bingo',
    name: 'Bingo Dinámico',
    description: 'Cartones personalizables con contenido educativo',
    icon: Grid3X3,
    color: 'amber',
    difficulty: 'Fácil',
    time: '20-45 min',
    players: '5-100',
    features: ['Cartones únicos', 'Auto-verificación', 'Premios múltiples']
  },
  {
    id: 'pictionary',
    name: 'Pictionary Digital',
    description: 'Dibujos en tiempo real con adivinanzas',
    icon: Palette,
    color: 'pink',
    difficulty: 'Medio',
    time: '25-40 min',
    players: '4-20',
    features: ['Dibujo digital', 'Equipos', 'Chat en vivo']
  },
  {
    id: 'memory',
    name: 'Memory Challenge',
    description: 'Encuentra las parejas con contenido personalizado',
    icon: Target,
    color: 'emerald',
    difficulty: 'Medio',
    time: '10-25 min',
    players: '2-30',
    features: ['Cartas personalizadas', 'Niveles', 'Récords']
  },
  {
    id: 'race',
    name: 'Question Race',
    description: 'Carrera de preguntas a contrarreloj',
    icon: Zap,
    color: 'red',
    difficulty: 'Difícil',
    time: '15-30 min',
    players: '2-40',
    features: ['Velocidad', 'Ranking en vivo', 'Power-ups']
  },
  {
    id: 'team',
    name: 'Team Challenge',
    description: 'Desafíos colaborativos por equipos',
    icon: Users,
    color: 'blue',
    difficulty: 'Difícil',
    time: '30-60 min',
    players: '6-60',
    features: ['Equipos automáticos', 'Retos variados', 'Leaderboard']
  }
] as const

export default function CreateGameModal({ isOpen, onClose, onCreateGame }: CreateGameModalProps) {
  const [step, setStep] = useState<'type' | 'config' | 'wizard'>('type')
  const [selectedType, setSelectedType] = useState<(typeof gameTypes)[number] | null>(null)
  const [gameData, setGameData] = useState<Partial<GameData>>({
    name: '',
    description: '',
    maxPlayers: 20,
    estimatedTime: 30
  })
  const [showWizard, setShowWizard] = useState(false)

  const handleTypeSelect = (type: (typeof gameTypes)[number]) => {
    setSelectedType(type)
    setGameData({
      ...gameData,
      type: type.id,
      name: type.name,
      description: type.description
    })
    
    // Usar wizards para juegos con configuración compleja
    if (['trivia', 'bingo', 'pictionary'].includes(type.id)) {
      setShowWizard(true)
    } else {
      setStep('config')
    }
  }

  const handleBack = () => {
    setStep('type')
    setSelectedType(null)
  }

  const handleCreate = () => {
    if (selectedType && gameData.name) {
      // Para juegos sin wizard, crear configuración básica
      const basicSettings: Record<string, any> = {
        memory: {
          gridSize: '4x4',
          difficulty: 'medium',
          theme: 'icons',
          timeLimit: 120,
          pairs: 8
        },
        race: {
          questionCount: 10,
          timePerQuestion: 15,
          powerUps: true,
          difficulty: 'medium',
          raceType: 'speed'
        },
        team: {
          teamCount: 2,
          challengeTypes: ['trivia', 'creative', 'physical'],
          roundDuration: 5,
          scoringSystem: 'points'
        }
      }

      onCreateGame({
        name: gameData.name,
        type: selectedType.id,
        description: gameData.description || selectedType.description,
        maxPlayers: gameData.maxPlayers || 20,
        estimatedTime: gameData.estimatedTime || 30,
        settings: basicSettings[selectedType.id] || {}
      })
      resetModal()
    }
  }

  const handleWizardComplete = (gameConfig: any) => {
    onCreateGame(gameConfig)
    resetModal()
  }

  const resetModal = () => {
    setStep('type')
    setSelectedType(null)
    setShowWizard(false)
    setGameData({
      name: '',
      description: '',
      maxPlayers: 20,
      estimatedTime: 30
    })
    onClose()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-600/20 text-green-300 border-green-500/30'
      case 'Medio': return 'bg-amber-600/20 text-amber-300 border-amber-500/30'
      case 'Difícil': return 'bg-red-600/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30'
    }
  }

  const getTypeColor = (color: string) => {
    const colors = {
      violet: 'border-violet-500/30 bg-violet-600/10 hover:bg-violet-600/20',
      amber: 'border-amber-500/30 bg-amber-600/10 hover:bg-amber-600/20',
      pink: 'border-pink-500/30 bg-pink-600/10 hover:bg-pink-600/20',
      emerald: 'border-emerald-500/30 bg-emerald-600/10 hover:bg-emerald-600/20',
      red: 'border-red-500/30 bg-red-600/10 hover:bg-red-600/20',
      blue: 'border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <>
      {/* Wizard Enterprise para juegos */}
      {showWizard && selectedType && (
        <GameWizardWrapper
          gameType={selectedType.id as GameType}
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}

      {/* Modal original para selección y config simple */}
      <Modal
        isOpen={isOpen && !showWizard}
        onClose={resetModal}
        className="max-w-4xl"
        ariaLabel="Crear juego"
        labelledById="create-game-title"
        describedById="create-game-desc"
      >
      <ModalHeader>
        <div>
          <ModalTitle>
            {step === 'type' ? 'Crear Nuevo Juego' : `Configurar ${selectedType?.name}`}
          </ModalTitle>
          <ModalDescription>
            {step === 'type' 
              ? 'Selecciona el tipo de juego que quieres crear'
              : 'Personaliza los detalles de tu juego'
            }
          </ModalDescription>
        </div>
      </ModalHeader>
      
      <ModalContent className="p-0">
        {step === 'type' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className={`p-6 border rounded-xl text-left transition-all hover:scale-[1.02] ${getTypeColor(type.color)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${type.color}-500/20`}>
                        <type.icon className={`h-6 w-6 text-${type.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{type.name}</h3>
                        <Badge 
                          variant="default" 
                          size="sm" 
                          className={getDifficultyColor(type.difficulty)}
                        >
                          {type.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">
                    {type.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {type.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {type.players}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {type.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-xs text-gray-300 rounded"
                      >
                        <Star className="h-2 w-2" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Game Type Selected */}
            <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className={`p-3 rounded-lg bg-${selectedType?.color}-500/20`}>
                {selectedType && <selectedType.icon className={`h-8 w-8 text-${selectedType.color}-400`} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{selectedType?.name}</h3>
                <p className="text-sm text-gray-300">{selectedType?.description}</p>
              </div>
              <Badge 
                variant="default" 
                size="sm" 
                className={getDifficultyColor(selectedType?.difficulty || '')}
              >
                {selectedType?.difficulty}
              </Badge>
            </div>
            
            {/* Configuration Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nombre del Juego
                  </label>
                  <Input
                    value={gameData.name || ''}
                    onChange={(e) => setGameData({ ...gameData, name: e.target.value })}
                    placeholder="Ej. Quiz de Historia Mundial"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={gameData.description || ''}
                    onChange={(e) => setGameData({ ...gameData, description: e.target.value })}
                    placeholder="Describe brevemente el contenido del juego..."
                    className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Máximo de Jugadores
                  </label>
                  <Input
                    type="number"
                    value={gameData.maxPlayers || 20}
                    onChange={(e) => setGameData({ ...gameData, maxPlayers: parseInt(e.target.value) })}
                    min="2"
                    max="100"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Recomendado: {selectedType?.players}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tiempo Estimado (minutos)
                  </label>
                  <Input
                    type="number"
                    value={gameData.estimatedTime || 30}
                    onChange={(e) => setGameData({ ...gameData, estimatedTime: parseInt(e.target.value) })}
                    min="5"
                    max="120"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Recomendado: {selectedType?.time}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Preview Card */}
            <div className="p-4 bg-gray-700/20 border border-gray-600/50 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Vista Previa</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded bg-${selectedType?.color}-500/20`}>
                    <Gamepad2 className={`h-4 w-4 text-${selectedType?.color}-400`} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{gameData.name || 'Nombre del juego'}</p>
                    <p className="text-xs text-gray-400">
                      {gameData.maxPlayers} jugadores • {gameData.estimatedTime} min
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="default" 
                  size="sm" 
                  className={getDifficultyColor(selectedType?.difficulty || '')}
                >
                  {selectedType?.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
      
      <ModalFooter>
        {step === 'config' && (
          <Button variant="ghost" onClick={handleBack}>
            Atrás
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        {step === 'config' && (
          <Button 
            variant="primary" 
            onClick={handleCreate}
            disabled={!gameData.name}
          >
            Crear Juego
          </Button>
        )}
      </ModalFooter>
    </Modal>
    </>
  )
}

// Wizard Modal genérico para todos los juegos
function GameWizardWrapper({ 
  gameType,
  isOpen, 
  onClose, 
  onComplete 
}: { 
  gameType: GameType
  isOpen: boolean
  onClose: () => void
  onComplete: (config: any) => void 
}) {
  // Seleccionar los steps según el tipo de juego
  const getWizardSteps = () => {
    switch (gameType) {
      case 'trivia':
        return triviaWizardSteps
      case 'bingo':
        return bingoWizardSteps
      case 'pictionary':
        return pictionaryWizardSteps
      // TODO: Agregar más wizards aquí
      default:
        return triviaWizardSteps
    }
  }

  return (
    <GameWizardModal
      gameType={gameType}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={onComplete}
      steps={getWizardSteps()}
    />
  )
}