'use client'

import { useState } from 'react'
import { Input, Button, Badge, Card } from '@/lib/design-system/components'
import { WizardStepProps } from './GameWizardModal'
import WizardStep, { FieldGroup, TooltipHelp } from './WizardStep'
import { validateStep } from '../validation/gameValidation'
import { 
  Clock, Users, Trophy, Brain, Plus, Trash2, 
  Play, Pause, CheckCircle2, AlertCircle, 
  Sparkles, Target, Zap, Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Step 1: Configuración Básica
export function TriviaBasicStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'basic', data)

  const difficulties = [
    { id: 'easy', name: 'Fácil', description: 'Preguntas básicas, ideal para romper el hielo', icon: '😊', color: 'bg-green-500' },
    { id: 'medium', name: 'Medio', description: 'Equilibrio entre diversión y desafío', icon: '🤔', color: 'bg-yellow-500' },
    { id: 'hard', name: 'Difícil', description: 'Para expertos que buscan un reto', icon: '🧠', color: 'bg-red-500' }
  ]

  const durations = [
    { minutes: 10, label: '10 min', description: 'Perfecto para energizers', questions: '5-8 preguntas' },
    { minutes: 20, label: '20 min', description: 'Ideal para presentaciones', questions: '10-15 preguntas' },
    { minutes: 30, label: '30 min', description: 'Sesión completa de trivia', questions: '15-25 preguntas' },
    { minutes: 45, label: '45 min', description: 'Competencia extendida', questions: '25-35 preguntas' }
  ]

  return (
    <WizardStep
      step={1}
      totalSteps={4}
      title="Configuración Básica"
      description="Define los aspectos fundamentales de tu trivia"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Información del Juego */}
        <FieldGroup 
          title="Información del Juego" 
          description="Dale identidad a tu trivia"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Nombre del Juego
                <TooltipHelp 
                  content="Elige un nombre atractivo que describa el tema de tu trivia. Ejemplos: 'Historia del Mundo', 'Cultura Pop 2024', 'Conoce a tu Equipo'"
                  type="tip"
                />
              </label>
              <Input
                value={data.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Ej. Trivia de Cultura General"
                className={cn(
                  "w-full",
                  errors.some(e => e.field === 'name') && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.find(e => e.field === 'name') && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Máximo de Jugadores
                <TooltipHelp 
                  content="Considera la capacidad de tu sala. Para mejor interacción recomendamos 20-50 jugadores"
                  type="help"
                />
              </label>
              <Input
                type="number"
                value={data.maxPlayers || 50}
                onChange={(e) => onChange({ maxPlayers: parseInt(e.target.value) })}
                min="2"
                max="500"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe brevemente de qué trata tu trivia..."
              className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">
              {(data.description || '').length}/200 caracteres
            </p>
          </div>
        </FieldGroup>

        {/* Duración */}
        <FieldGroup 
          title="Duración del Juego" 
          description="Selecciona cuánto tiempo durará tu trivia"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {durations.map((duration) => (
              <motion.button
                key={duration.minutes}
                type="button"
                onClick={() => onChange({ estimatedTime: duration.minutes })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left hover:scale-105",
                  data.estimatedTime === duration.minutes
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="font-semibold text-white">{duration.label}</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">{duration.description}</p>
                <p className="text-xs text-blue-400">{duration.questions}</p>
              </motion.button>
            ))}
          </div>
        </FieldGroup>

        {/* Nivel de Dificultad */}
        <FieldGroup 
          title="Nivel de Dificultad" 
          description="Define qué tan desafiante será tu trivia"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <motion.button
                key={difficulty.id}
                type="button"
                onClick={() => onChange({ difficulty: difficulty.id })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  data.difficulty === difficulty.id
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xl", difficulty.color)}>
                    {difficulty.icon}
                  </div>
                  <span className="font-semibold text-white">{difficulty.name}</span>
                </div>
                <p className="text-sm text-gray-300">{difficulty.description}</p>
              </motion.button>
            ))}
          </div>
        </FieldGroup>

        {/* Vista Previa */}
        <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-white">Vista Previa</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-white">{data.name || 'Tu Trivia'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">{data.estimatedTime || 20} minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">Hasta {data.maxPlayers || 50} jugadores</span>
            </div>
          </div>
          {data.difficulty && (
            <div className="mt-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              <Badge variant="default" size="sm">
                Dificultad: {difficulties.find(d => d.id === data.difficulty)?.name}
              </Badge>
            </div>
          )}
        </Card>
      </div>
    </WizardStep>
  )
}

// Step 2: Configuración de Preguntas
export function TriviaQuestionsStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'questions', data)
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  })

  const questions = data.questions || []

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim())) {
      onChange({
        questions: [...questions, { ...newQuestion, id: Date.now() }]
      })
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      })
    }
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_: any, i: number) => i !== index)
    onChange({ questions: updatedQuestions })
  }

  const questionCategories = [
    { id: 'general', name: 'Cultura General', icon: '🌍' },
    { id: 'sports', name: 'Deportes', icon: '⚽' },
    { id: 'history', name: 'Historia', icon: '📚' },
    { id: 'science', name: 'Ciencia', icon: '🔬' },
    { id: 'entertainment', name: 'Entretenimiento', icon: '🎬' },
    { id: 'custom', name: 'Personalizado', icon: '✨' }
  ]

  return (
    <WizardStep
      step={2}
      totalSteps={4}
      title="Configuración de Preguntas"
      description="Define las preguntas que harán brillar a tu trivia"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Categoría y Cantidad */}
        <FieldGroup 
          title="Configuración General" 
          description="Define el tipo y cantidad de preguntas"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Categoría Principal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {questionCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onChange({ category: category.id })}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      data.category === category.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium text-white">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Número de Preguntas
                <TooltipHelp 
                  content="Recomendamos 10-20 preguntas para mantener la atención. Calcula ~1.5 minutos por pregunta"
                  type="tip"
                />
              </label>
              <Input
                type="number"
                value={data.questionCount || 10}
                onChange={(e) => onChange({ questionCount: parseInt(e.target.value) })}
                min="3"
                max="50"
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>

        {/* Añadir Preguntas */}
        <FieldGroup 
          title="Agregar Preguntas" 
          description="Crea preguntas atractivas para tu audiencia"
        >
          <Card className="p-4 border-dashed border-2 border-gray-600">
            <div className="space-y-4">
              <Input
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Escribe tu pregunta aquí..."
                className="w-full text-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="relative">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options]
                        newOptions[index] = e.target.value
                        setNewQuestion({ ...newQuestion, options: newOptions })
                      }}
                      placeholder={`Opción ${index + 1}`}
                      className={cn(
                        "w-full pr-10",
                        newQuestion.correctAnswer === index && "border-green-500 bg-green-500/10"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                      className={cn(
                        "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded",
                        newQuestion.correctAnswer === index
                          ? "text-green-400"
                          : "text-gray-400 hover:text-white"
                      )}
                      title="Marcar como respuesta correcta"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <textarea
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Explicación de la respuesta (opcional)..."
                className="w-full h-16 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Button
                onClick={addQuestion}
                disabled={!newQuestion.question || !newQuestion.options.every(opt => opt.trim())}
                className="w-full"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Agregar Pregunta
              </Button>
            </div>
          </Card>
        </FieldGroup>

        {/* Lista de Preguntas */}
        {questions.length > 0 && (
          <FieldGroup 
            title={`Preguntas Agregadas (${questions.length})`}
            description="Revisa y edita tus preguntas"
          >
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {questions.map((question: any, index: number) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option: string, optIndex: number) => (
                            <div
                              key={optIndex}
                              className={cn(
                                "p-2 rounded border",
                                question.correctAnswer === optIndex
                                  ? "border-green-500 bg-green-500/10 text-green-300"
                                  : "border-gray-600 text-gray-300"
                              )}
                            >
                              {option}
                              {question.correctAnswer === optIndex && (
                                <CheckCircle2 className="h-3 w-3 inline ml-1" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeQuestion(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </FieldGroup>
        )}
      </div>
    </WizardStep>
  )
}

// Step 3: Configuración de Puntuación y Tiempo
export function TriviaScoringStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid } = validateStep(gameType, 'scoring', data)

  const scoringModes = [
    {
      id: 'standard',
      name: 'Estándar',
      description: 'Puntos fijos por respuesta correcta',
      icon: '🎯',
      formula: 'Correcta = +100 pts'
    },
    {
      id: 'speed',
      name: 'Velocidad',
      description: 'Más puntos por responder rápido',
      icon: '⚡',
      formula: 'Tiempo restante × multiplicador'
    },
    {
      id: 'streak',
      name: 'Racha',
      description: 'Bonus por respuestas consecutivas',
      icon: '🔥',
      formula: 'Base + (racha × bonus)'
    },
    {
      id: 'custom',
      name: 'Personalizado',
      description: 'Define tu propia escala',
      icon: '⚙️',
      formula: 'Tu configuración'
    }
  ]

  const difficultyMultipliers = [
    { level: 'easy', name: 'Fácil', multiplier: 1.0, color: 'text-green-400' },
    { level: 'medium', name: 'Medio', multiplier: 1.5, color: 'text-yellow-400' },
    { level: 'hard', name: 'Difícil', multiplier: 2.0, color: 'text-red-400' }
  ]

  return (
    <WizardStep
      step={3}
      totalSteps={4}
      title="Puntuación y Tiempo"
      description="Configura cómo se calcularán los puntos y el tiempo por pregunta"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Modo de Puntuación */}
        <FieldGroup 
          title="Sistema de Puntuación" 
          description="Elige cómo se otorgarán los puntos"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoringModes.map((mode) => (
              <motion.button
                key={mode.id}
                type="button"
                onClick={() => onChange({ scoringMode: mode.id })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  data.scoringMode === mode.id
                    ? "border-blue-500 bg-blue-500/20 scale-105"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{mode.icon}</span>
                  <span className="font-semibold text-white">{mode.name}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{mode.description}</p>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded text-blue-300">
                  {mode.formula}
                </code>
              </motion.button>
            ))}
          </div>
        </FieldGroup>

        {/* Configuración de Puntos */}
        <FieldGroup 
          title="Configuración de Puntos" 
          description="Define los valores de puntuación"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Puntos Base
                <TooltipHelp 
                  content="Puntos que recibe un jugador por respuesta correcta"
                  type="tip"
                />
              </label>
              <Input
                type="number"
                value={data.pointsPerQuestion || 100}
                onChange={(e) => onChange({ pointsPerQuestion: parseInt(e.target.value) })}
                min="10"
                max="1000"
                step="10"
                className="w-full"
              />
            </div>

            {data.scoringMode === 'speed' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  Multiplicador de Velocidad
                  <TooltipHelp 
                    content="Puntos adicionales por cada segundo restante"
                    type="tip"
                  />
                </label>
                <Input
                  type="number"
                  value={data.speedMultiplier || 5}
                  onChange={(e) => onChange({ speedMultiplier: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  step="1"
                  className="w-full"
                />
              </div>
            )}

            {data.scoringMode === 'streak' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  Bonus por Racha
                  <TooltipHelp 
                    content="Puntos adicionales por cada respuesta consecutiva correcta"
                    type="tip"
                  />
                </label>
                <Input
                  type="number"
                  value={data.streakBonus || 25}
                  onChange={(e) => onChange({ streakBonus: parseInt(e.target.value) })}
                  min="5"
                  max="100"
                  step="5"
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Penalización por Error
                <TooltipHelp 
                  content="Puntos que se restan por respuesta incorrecta (0 = sin penalización)"
                  type="help"
                />
              </label>
              <Input
                type="number"
                value={data.penaltyPoints || 0}
                onChange={(e) => onChange({ penaltyPoints: parseInt(e.target.value) })}
                min="0"
                max="50"
                step="5"
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>

        {/* Configuración de Tiempo */}
        <FieldGroup 
          title="Configuración de Tiempo" 
          description="Define cuánto tiempo tendrán los jugadores"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  Tiempo por Pregunta
                  <TooltipHelp 
                    content="Tiempo en segundos que tendrán para responder cada pregunta"
                    type="tip"
                  />
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="range"
                    value={data.timePerQuestion || 30}
                    onChange={(e) => onChange({ timePerQuestion: parseInt(e.target.value) })}
                    min="10"
                    max="120"
                    step="5"
                    className="flex-1"
                  />
                  <span className="text-white font-mono bg-gray-700 px-3 py-1 rounded min-w-[60px] text-center">
                    {data.timePerQuestion || 30}s
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10s</span>
                  <span>Rápido ⚡</span>
                  <span>Normal 🎯</span>
                  <span>Relajado 😌</span>
                  <span>120s</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <span className="text-white font-medium">Cuenta regresiva visible</span>
                  <p className="text-sm text-gray-400">Mostrar timer a los jugadores</p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ showTimer: !data.showTimer })}
                  className={cn(
                    "w-11 h-6 rounded-full relative transition-colors",
                    data.showTimer !== false ? "bg-blue-600" : "bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                    data.showTimer !== false ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-white mb-3">Multiplicadores por Dificultad</h4>
              <div className="space-y-2">
                {difficultyMultipliers.map((diff) => (
                  <div key={diff.level} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                    <span className={cn("font-medium", diff.color)}>{diff.name}</span>
                    <span className="text-gray-300">×{diff.multiplier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FieldGroup>

        {/* Simulador de Puntuación */}
        <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-white">Simulador de Puntuación</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-green-500/20 rounded-lg">
              <div className="text-green-300 font-semibold">Respuesta Correcta</div>
              <div className="text-2xl font-bold text-white mt-1">
                +{data.pointsPerQuestion || 100}
              </div>
              {data.scoringMode === 'speed' && (
                <div className="text-xs text-green-400 mt-1">
                  +{(data.speedMultiplier || 5) * 10} por velocidad
                </div>
              )}
            </div>
            <div className="text-center p-3 bg-red-500/20 rounded-lg">
              <div className="text-red-300 font-semibold">Respuesta Incorrecta</div>
              <div className="text-2xl font-bold text-white mt-1">
                -{data.penaltyPoints || 0}
              </div>
            </div>
            <div className="text-center p-3 bg-amber-500/20 rounded-lg">
              <div className="text-amber-300 font-semibold">Puntuación Máxima</div>
              <div className="text-2xl font-bold text-white mt-1">
                {((data.pointsPerQuestion || 100) + (data.speedMultiplier || 0) * (data.timePerQuestion || 30)) * (data.questionCount || 10)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </WizardStep>
  )
}

// Step 4: Preview Final
export function TriviaPreviewStep({ data, onChange, gameType }: WizardStepProps) {
  const questions = data.questions || []
  const estimatedDuration = (data.questionCount || questions.length) * ((data.timePerQuestion || 30) + 10) / 60 // +10s for transitions

  return (
    <WizardStep
      step={4}
      totalSteps={4}
      title="Vista Previa Final"
      description="Revisa tu trivia antes de crearla"
      isValid={true}
    >
      <div className="space-y-6">
        {/* Resumen del Juego */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center rounded-xl text-2xl">
              🧠
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{data.name}</h2>
              <p className="text-gray-300">{data.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{questions.length}</div>
              <div className="text-sm text-gray-400">Preguntas</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{Math.round(estimatedDuration)}</div>
              <div className="text-sm text-gray-400">Minutos</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{data.maxPlayers || 50}</div>
              <div className="text-sm text-gray-400">Jugadores</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-amber-400">{data.timePerQuestion || 30}s</div>
              <div className="text-sm text-gray-400">Por pregunta</div>
            </div>
          </div>
        </Card>

        {/* Configuración de Puntuación */}
        <FieldGroup title="Configuración de Puntuación">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Sistema:</span>
                <Badge variant="primary" size="sm">
                  {data.scoringMode === 'standard' && 'Estándar'}
                  {data.scoringMode === 'speed' && 'Velocidad'}
                  {data.scoringMode === 'streak' && 'Racha'}
                  {data.scoringMode === 'custom' && 'Personalizado'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Puntos base:</span>
                <span className="text-white font-semibold">{data.pointsPerQuestion || 100}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Penalización:</span>
                <span className="text-white font-semibold">{data.penaltyPoints || 0}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Timer visible:</span>
                <span className="text-white font-semibold">
                  {data.showTimer !== false ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Dificultad:</span>
                <Badge variant="default" size="sm">
                  {data.difficulty === 'easy' && 'Fácil'}
                  {data.difficulty === 'medium' && 'Medio'}
                  {data.difficulty === 'hard' && 'Difícil'}
                </Badge>
              </div>
            </div>
          </div>
        </FieldGroup>

        {/* Preview de Preguntas */}
        <FieldGroup title="Preguntas Incluidas">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {questions.slice(0, 3).map((question: any, index: number) => (
              <div key={index} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <h4 className="font-medium text-white mb-2">{index + 1}. {question.question}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {question.options.map((option: string, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={cn(
                        "p-2 rounded border text-center",
                        question.correctAnswer === optIndex
                          ? "border-green-500 bg-green-500/10 text-green-300"
                          : "border-gray-600 text-gray-300"
                      )}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {questions.length > 3 && (
              <div className="text-center text-gray-400 text-sm">
                ... y {questions.length - 3} preguntas más
              </div>
            )}
          </div>
        </FieldGroup>

        {/* Instrucciones Finales */}
        <Card className="p-4 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-300 mb-2">¡Tu trivia está lista!</h3>
              <p className="text-sm text-amber-200">
                Al hacer clic en "Crear Juego", tu trivia se guardará y podrás:
              </p>
              <ul className="text-sm text-amber-200 mt-2 space-y-1">
                <li>• Iniciar una sesión en vivo inmediatamente</li>
                <li>• Editar preguntas y configuración más tarde</li>
                <li>• Duplicar el juego para crear variaciones</li>
                <li>• Ver estadísticas detalladas después de cada sesión</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </WizardStep>
  )
}

// Exportar los steps del wizard COMPLETO
export const triviaWizardSteps = [
  {
    id: 'basic',
    title: 'Básica',
    description: 'Información general del juego',
    component: TriviaBasicStep,
    isValid: (data: any) => validateStep('trivia', 'basic', data).isValid
  },
  {
    id: 'questions',
    title: 'Preguntas',
    description: 'Configurar preguntas y respuestas',
    component: TriviaQuestionsStep,
    isValid: (data: any) => validateStep('trivia', 'questions', data).isValid
  },
  {
    id: 'scoring',
    title: 'Puntuación',
    description: 'Sistema de puntos y tiempo',
    component: TriviaScoringStep,
    isValid: (data: any) => validateStep('trivia', 'scoring', data).isValid
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Revisión final',
    component: TriviaPreviewStep,
    isValid: () => true,
    isOptional: true
  }
]