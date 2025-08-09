'use client'

import { useState, useEffect } from 'react'
import { useUIStore } from '@/lib/store'
import { Button, Card } from '@/lib/design-system/components'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ChevronRight, ChevronLeft, Sparkles,
  Gamepad2, Users, BarChart3, Rocket, Check
} from 'lucide-react'
import confetti from 'canvas-confetti'

const onboardingSteps = [
  {
    id: 'welcome',
    title: '¡Bienvenido a AutoSpark Games! 🎉',
    description: 'La plataforma más divertida para crear presentaciones interactivas',
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <p className="text-white/80">
          Con AutoSpark puedes crear experiencias únicas que cautivan a tu audiencia.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={Gamepad2}
            title="Juegos Interactivos"
            description="Más de 6 tipos de juegos"
          />
          <FeatureCard
            icon={Users}
            title="Engagement Total"
            description="Participación en tiempo real"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'create',
    title: 'Crea tu primera presentación',
    description: 'Es tan fácil como 1, 2, 3',
    icon: Rocket,
    content: (
      <div className="space-y-6">
        <StepItem
          number="1"
          title="Elige un tipo"
          description="Quiz, juego o combinado"
        />
        <StepItem
          number="2"
          title="Añade contenido"
          description="Arrastra y suelta elementos"
        />
        <StepItem
          number="3"
          title="¡Lanza!"
          description="Comparte el código con tu audiencia"
        />
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Funciones potentes',
    description: 'Todo lo que necesitas en un solo lugar',
    icon: BarChart3,
    content: (
      <div className="space-y-4">
        <FeatureItem
          icon={Check}
          text="Vista previa en vivo mientras editas"
        />
        <FeatureItem
          icon={Check}
          text="Guardado automático con historial de versiones"
        />
        <FeatureItem
          icon={Check}
          text="Analytics en tiempo real"
        />
        <FeatureItem
          icon={Check}
          text="Plantillas prediseñadas"
        />
        <FeatureItem
          icon={Check}
          text="Colaboración en tiempo real (próximamente)"
        />
      </div>
    ),
  },
  {
    id: 'ready',
    title: '¡Estás listo! 🚀',
    description: 'Comienza a crear experiencias increíbles',
    icon: Sparkles,
    content: (
      <div className="text-center space-y-6">
        <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-full mx-auto flex items-center justify-center">
          <Rocket className="h-16 w-16 text-white" />
        </div>
        <p className="text-white/80 text-lg">
          ¿Qué te gustaría hacer primero?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="h-auto py-4">
            <div>
              <p className="font-semibold">Crear desde cero</p>
              <p className="text-xs text-white/60">Diseña tu propia experiencia</p>
            </div>
          </Button>
          <Button variant="secondary" className="h-auto py-4">
            <div>
              <p className="font-semibold">Usar plantilla</p>
              <p className="text-xs text-white/60">Comienza rápido</p>
            </div>
          </Button>
        </div>
      </div>
    ),
  },
]

export default function Onboarding() {
  const { hasCompletedOnboarding, setOnboardingComplete } = useUIStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setIsVisible(true)
    }
  }, [hasCompletedOnboarding])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const completeOnboarding = () => {
    // Celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
    
    setOnboardingComplete()
    setTimeout(() => setIsVisible(false), 500)
  }

  if (!isVisible) return null

  const step = onboardingSteps[currentStep]
  const Icon = step.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Card variant="elevated" className="w-full max-w-2xl relative">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Progress dots */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-primary-500'
                      : index < currentStep
                      ? 'bg-primary-500/50'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-8 pt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {step.title}
                    </h2>
                    <p className="text-lg text-white/70">
                      {step.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    {step.content}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  leftIcon={<ChevronLeft className="h-5 w-5" />}
                >
                  Anterior
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-white/60"
                >
                  Omitir tour
                </Button>

                <Button
                  variant="primary"
                  onClick={handleNext}
                  rightIcon={
                    currentStep === onboardingSteps.length - 1 ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )
                  }
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper Components
function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <Icon className="h-8 w-8 text-primary-400 mb-2" />
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/60">{description}</p>
    </div>
  )
}

function StepItem({ number, title, description }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold">{number}</span>
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
  )
}

function FeatureItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-green-400" />
      </div>
      <span className="text-white/80">{text}</span>
    </div>
  )
}