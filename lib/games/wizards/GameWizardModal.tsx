'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalContent, 
  ModalFooter,
  Button
} from '@/lib/design-system/components'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  HelpCircle,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type GameType = 'trivia' | 'bingo' | 'pictionary' | 'memory' | 'race' | 'team'

export interface GameConfig {
  type: GameType
  name: string
  description?: string
  estimatedTime: number
  maxPlayers: number
  settings: Record<string, any>
}

export interface WizardStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<WizardStepProps>
  isValid?: (data: any) => boolean
  isOptional?: boolean
}

export interface WizardStepProps {
  data: Record<string, any>
  onChange: (updates: Record<string, any>) => void
  onNext: () => void
  onPrevious: () => void
  gameType: GameType
}

interface GameWizardModalProps {
  gameType: GameType
  isOpen: boolean
  onClose: () => void
  onComplete: (config: GameConfig) => void
  steps: WizardStep[]
}

const gameTypeInfo = {
  trivia: {
    title: 'Trivia Quiz',
    icon: '🧠',
    description: 'Preguntas y respuestas interactivas con múltiples opciones',
    color: 'from-violet-500 to-purple-600'
  },
  bingo: {
    title: 'Bingo Dinámico',
    icon: '🎯',
    description: 'Cartones personalizables con contenido educativo',
    color: 'from-amber-500 to-orange-600'
  },
  pictionary: {
    title: 'Pictionary Digital',
    icon: '🎨',
    description: 'Dibujos en tiempo real con adivinanzas',
    color: 'from-pink-500 to-rose-600'
  },
  memory: {
    title: 'Memory Challenge',
    icon: '🧩',
    description: 'Encuentra las parejas con contenido personalizado',
    color: 'from-emerald-500 to-teal-600'
  },
  race: {
    title: 'Question Race',
    icon: '⚡',
    description: 'Carrera de preguntas a contrarreloj',
    color: 'from-red-500 to-pink-600'
  },
  team: {
    title: 'Team Challenge',
    icon: '👥',
    description: 'Desafíos colaborativos por equipos',
    color: 'from-blue-500 to-indigo-600'
  }
}

export default function GameWizardModal({ 
  gameType, 
  isOpen, 
  onClose, 
  onComplete, 
  steps 
}: GameWizardModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [wizardData, setWizardData] = useState<Record<string, any>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  const gameInfo = gameTypeInfo[gameType]

  const updateData = useCallback((updates: Record<string, any>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }, [])

  const goToNext = useCallback(() => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [isLastStep])

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [isFirstStep])

  const isCurrentStepValid = useCallback(() => {
    if (!currentStep.isValid) return true
    return currentStep.isValid(wizardData)
  }, [currentStep, wizardData])

  const handleComplete = async () => {
    setIsCompleting(true)
    
    try {
      const gameConfig: GameConfig = {
        type: gameType,
        name: wizardData.name || `Nuevo ${gameInfo.title}`,
        description: wizardData.description,
        estimatedTime: wizardData.estimatedTime || 30,
        maxPlayers: wizardData.maxPlayers || 50,
        settings: wizardData
      }
      
      await onComplete(gameConfig)
      
      // Reset state
      setCurrentStepIndex(0)
      setWizardData({})
    } finally {
      setIsCompleting(false)
    }
  }

  const handleClose = () => {
    if (Object.keys(wizardData).length > 0) {
      const confirmed = confirm('¿Estás seguro? Se perderá todo el progreso.')
      if (!confirmed) return
    }
    
    setCurrentStepIndex(0)
    setWizardData({})
    onClose()
  }

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-4xl max-h-[90vh]">
      <ModalHeader showCloseButton={false}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Game Type Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gameInfo.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
              {gameInfo.icon}
            </div>
            
            <div>
              <ModalTitle className="flex items-center gap-2">
                Crear {gameInfo.title}
                <Sparkles className="h-5 w-5 text-amber-400" />
              </ModalTitle>
              <p className="text-sm text-gray-400 mt-1">
                {gameInfo.description}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Paso {currentStepIndex + 1} de {steps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progressPercentage)}% completado
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${gameInfo.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center flex-1",
                  index <= currentStepIndex ? "text-white" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all",
                  index < currentStepIndex 
                    ? `bg-gradient-to-r ${gameInfo.color} border-transparent text-white`
                    : index === currentStepIndex
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-gray-600 text-gray-500"
                )}>
                  {index < currentStepIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-20 leading-tight">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ModalHeader>

      <ModalContent className="p-0 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Step Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentStep.description}
                </p>
                
                {currentStep.isOptional && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                    <HelpCircle className="h-3 w-3" />
                    Opcional
                  </span>
                )}
              </div>
              
              {!isCurrentStepValid() && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-600/20 text-amber-300 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Información requerida</span>
                </div>
              )}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <currentStep.component
                  data={wizardData}
                  onChange={updateData}
                  onNext={goToNext}
                  onPrevious={goToPrevious}
                  gameType={gameType}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={goToPrevious}
            disabled={isFirstStep}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            
            {isLastStep ? (
              <Button
                variant="success"
                leftIcon={isCompleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                onClick={handleComplete}
                disabled={!isCurrentStepValid() || isCompleting}
              >
                {isCompleting ? 'Creando...' : 'Crear Juego'}
              </Button>
            ) : (
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={goToNext}
                disabled={!isCurrentStepValid()}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </ModalFooter>
    </Modal>
  )
}