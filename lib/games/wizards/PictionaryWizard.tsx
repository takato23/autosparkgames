'use client'

import { useState } from 'react'
import { Input, Button, Badge, Card } from '@/lib/design-system/components'
import { WizardStepProps } from './GameWizardModal'
import WizardStep, { FieldGroup, TooltipHelp } from './WizardStep'
import { validateStep } from '../validation/gameValidation'
import { 
  Palette, Users, Clock, Plus, Trash2, 
  Download, Shuffle, Sparkles, AlertCircle,
  Pencil, Timer, Trophy, Star, Zap, CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Step 1: Configuración Básica
export function PictionaryBasicStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'basic', data)

  const teamFormats = [
    { 
      id: 'auto', 
      name: 'Equipos Automáticos', 
      description: 'El sistema forma los equipos',
      icon: '🎲',
      recommended: 'Más rápido'
    },
    { 
      id: 'manual', 
      name: 'Equipos Manuales', 
      description: 'Los jugadores eligen su equipo',
      icon: '👥',
      recommended: 'Más control'
    },
    { 
      id: 'individual', 
      name: 'Individual', 
      description: 'Cada uno por su cuenta',
      icon: '🎯',
      recommended: 'Competitivo'
    }
  ]

  const difficulties = [
    { id: 'easy', name: 'Fácil', description: 'Palabras simples y comunes', icon: '😊', color: 'text-green-400' },
    { id: 'medium', name: 'Medio', description: 'Mix de palabras variadas', icon: '🤔', color: 'text-yellow-400' },
    { id: 'hard', name: 'Difícil', description: 'Conceptos abstractos', icon: '🧠', color: 'text-red-400' }
  ]

  return (
    <WizardStep
      step={1}
      totalSteps={4}
      title="Configuración del Pictionary"
      description="Define cómo se jugará tu Pictionary digital"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Información del Juego */}
        <FieldGroup 
          title="Información del Juego" 
          description="Dale identidad a tu Pictionary"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre del Juego
              </label>
              <Input
                value={data.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Ej. Pictionary Creativo"
                className={cn(
                  "w-full",
                  errors.some(e => e.field === 'name') && "border-red-500"
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                Duración Estimada
                <TooltipHelp 
                  content="Tiempo total aproximado del juego completo"
                  type="tip"
                />
              </label>
              <select
                value={data.estimatedTime || 30}
                onChange={(e) => onChange({ estimatedTime: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value={15}>15 minutos - Rápido</option>
                <option value={30}>30 minutos - Normal</option>
                <option value={45}>45 minutos - Extendido</option>
                <option value={60}>60 minutos - Completo</option>
              </select>
            </div>
          </div>
        </FieldGroup>

        {/* Formato de Equipos */}
        <FieldGroup 
          title="Formato de Equipos" 
          description="¿Cómo se organizarán los jugadores?"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamFormats.map((format) => (
              <motion.button
                key={format.id}
                type="button"
                onClick={() => onChange({ teamFormat: format.id })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  data.teamFormat === format.id
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-3xl mb-2">{format.icon}</div>
                <h3 className="font-semibold text-white">{format.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{format.description}</p>
                <Badge variant="default" size="sm">
                  {format.recommended}
                </Badge>
              </motion.button>
            ))}
          </div>

          {data.teamFormat === 'auto' && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Número de Equipos
                </label>
                <Input
                  type="number"
                  value={data.teamCount || 2}
                  onChange={(e) => onChange({ teamCount: parseInt(e.target.value) })}
                  min="2"
                  max="8"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tamaño de Equipos
                </label>
                <Input
                  type="number"
                  value={data.teamSize || 4}
                  onChange={(e) => onChange({ teamSize: parseInt(e.target.value) })}
                  min="2"
                  max="10"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </FieldGroup>

        {/* Nivel de Dificultad */}
        <FieldGroup 
          title="Nivel de Dificultad" 
          description="Define qué tan desafiante será"
        >
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.id}
                type="button"
                onClick={() => onChange({ difficulty: diff.id })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  data.difficulty === diff.id
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn("text-3xl mb-2", diff.color)}>{diff.icon}</div>
                <h3 className="font-semibold text-white">{diff.name}</h3>
                <p className="text-xs text-gray-300">{diff.description}</p>
              </motion.button>
            ))}
          </div>
        </FieldGroup>
      </div>
    </WizardStep>
  )
}

// Step 2: Banco de Palabras
export function PictionaryWordsStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'words', data)
  const [newWord, setNewWord] = useState('')
  const [bulkInput, setBulkInput] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')

  const words = data.wordBank || []
  
  const categories = [
    { id: 'general', name: 'General', icon: '🌍' },
    { id: 'animals', name: 'Animales', icon: '🐾' },
    { id: 'objects', name: 'Objetos', icon: '📦' },
    { id: 'actions', name: 'Acciones', icon: '🏃' },
    { id: 'movies', name: 'Películas', icon: '🎬' },
    { id: 'custom', name: 'Personalizado', icon: '✨' }
  ]

  const wordTemplates: Record<string, string[]> = {
    animals: ['Perro', 'Gato', 'Elefante', 'Jirafa', 'Pingüino', 'Canguro', 'Tortuga', 'Delfín', 'Águila', 'Mariposa'],
    objects: ['Teléfono', 'Computadora', 'Silla', 'Mesa', 'Reloj', 'Libro', 'Llave', 'Maleta', 'Cámara', 'Bicicleta'],
    actions: ['Correr', 'Saltar', 'Bailar', 'Cocinar', 'Dormir', 'Leer', 'Cantar', 'Nadar', 'Escribir', 'Volar'],
    movies: ['Star Wars', 'Harry Potter', 'Titanic', 'Avatar', 'Toy Story', 'Frozen', 'Shrek', 'Matrix', 'Inception', 'Avengers']
  }

  const addWord = () => {
    if (newWord.trim()) {
      onChange({ 
        wordBank: [...words, { word: newWord.trim(), category: selectedCategory }] 
      })
      setNewWord('')
    }
  }

  const addTemplate = (category: string) => {
    const template = wordTemplates[category] || []
    const newWords = template.map(word => ({ word, category }))
    onChange({ 
      wordBank: [...words, ...newWords]
    })
  }

  const removeWord = (index: number) => {
    onChange({ 
      wordBank: words.filter((_: any, i: number) => i !== index) 
    })
  }

  return (
    <WizardStep
      step={2}
      totalSteps={4}
      title="Banco de Palabras"
      description="Agrega las palabras que los jugadores dibujarán"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Progreso */}
        <Card className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Banco de Palabras</h3>
              <p className="text-sm text-gray-300 mt-1">
                Recomendamos al menos 20 palabras para una buena variedad
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{words.length}</div>
              <div className="text-sm text-gray-400">palabras</div>
            </div>
          </div>
        </Card>

        {/* Categorías */}
        <FieldGroup title="Categorías">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all flex items-center gap-2",
                  selectedCategory === cat.id
                    ? "border-pink-500 bg-pink-500/20 text-white"
                    : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500"
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </FieldGroup>

        {/* Plantillas Rápidas */}
        <FieldGroup title="Plantillas Rápidas">
          <div className="flex flex-wrap gap-2">
            {Object.keys(wordTemplates).map((key) => (
              <Button
                key={key}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addTemplate(key)}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Agregar {categories.find(c => c.id === key)?.name}
              </Button>
            ))}
          </div>
        </FieldGroup>

        {/* Agregar Palabras */}
        <FieldGroup title="Agregar Palabras" required>
          <div className="flex gap-2">
            <Input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addWord()
                }
              }}
              placeholder="Escribe una palabra..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addWord}
              disabled={!newWord.trim()}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Agregar
            </Button>
          </div>
        </FieldGroup>

        {/* Lista de Palabras */}
        {words.length > 0 && (
          <FieldGroup title={`Palabras Agregadas (${words.length})`}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {words.map((item: any, index: number) => (
                  <motion.div
                    key={`${item.word}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <span className="text-white">{item.word}</span>
                      <div className="text-xs text-gray-400">
                        {categories.find(c => c.id === item.category)?.name}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeWord(index)}
                      className="text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

// Step 3: Configuración del Juego
export function PictionarySettingsStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid } = validateStep(gameType, 'settings', data)

  const drawingTimes = [
    { seconds: 30, label: '30 seg', description: 'Súper rápido' },
    { seconds: 60, label: '1 min', description: 'Estándar' },
    { seconds: 90, label: '1:30 min', description: 'Relajado' },
    { seconds: 120, label: '2 min', description: 'Sin prisa' }
  ]

  return (
    <WizardStep
      step={3}
      totalSteps={4}
      title="Configuración del Juego"
      description="Ajusta las reglas y mecánicas"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Tiempo de Dibujo */}
        <FieldGroup 
          title="Tiempo para Dibujar" 
          description="¿Cuánto tiempo tendrán para cada dibujo?"
          required
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {drawingTimes.map((time) => (
              <motion.button
                key={time.seconds}
                type="button"
                onClick={() => onChange({ drawingTime: time.seconds })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  data.drawingTime === time.seconds
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Timer className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                <div className="font-semibold text-white">{time.label}</div>
                <div className="text-xs text-gray-400">{time.description}</div>
              </motion.button>
            ))}
          </div>
        </FieldGroup>

        {/* Puntuación */}
        <FieldGroup title="Sistema de Puntuación">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Puntos por Adivinar
              </label>
              <Input
                type="number"
                value={data.pointsForGuessing || 100}
                onChange={(e) => onChange({ pointsForGuessing: parseInt(e.target.value) })}
                min="10"
                max="1000"
                step="10"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Puntos por Dibujar
              </label>
              <Input
                type="number"
                value={data.pointsForDrawing || 50}
                onChange={(e) => onChange({ pointsForDrawing: parseInt(e.target.value) })}
                min="10"
                max="500"
                step="10"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bonus Velocidad
              </label>
              <Input
                type="number"
                value={data.speedBonus || 20}
                onChange={(e) => onChange({ speedBonus: parseInt(e.target.value) })}
                min="0"
                max="100"
                step="5"
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>

        {/* Herramientas de Dibujo */}
        <FieldGroup title="Herramientas de Dibujo">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Colores</h4>
                <p className="text-sm text-gray-400">Paleta de colores disponible</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ enableColors: !data.enableColors })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  data.enableColors !== false ? "bg-pink-600" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  data.enableColors !== false ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Borrador</h4>
                <p className="text-sm text-gray-400">Permite borrar trazos</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ enableEraser: !data.enableEraser })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  data.enableEraser !== false ? "bg-pink-600" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  data.enableEraser !== false ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Pistas de Texto</h4>
                <p className="text-sm text-gray-400">El dibujante puede dar pistas</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ enableHints: !data.enableHints })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  data.enableHints ? "bg-pink-600" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  data.enableHints ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </FieldGroup>

        {/* Rondas */}
        <FieldGroup title="Configuración de Rondas">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Número de Rondas
              </label>
              <Input
                type="number"
                value={data.rounds || 3}
                onChange={(e) => onChange({ rounds: parseInt(e.target.value) })}
                min="1"
                max="10"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Palabras por Ronda
              </label>
              <Input
                type="number"
                value={data.wordsPerRound || 3}
                onChange={(e) => onChange({ wordsPerRound: parseInt(e.target.value) })}
                min="1"
                max="5"
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>
      </div>
    </WizardStep>
  )
}

// Step 4: Preview Final
export function PictionaryPreviewStep({ data, onChange, gameType }: WizardStepProps) {
  const totalWords = data.wordBank?.length || 0
  const totalRounds = data.rounds || 3
  const wordsPerRound = data.wordsPerRound || 3
  const drawingTime = data.drawingTime || 60
  const estimatedTime = totalRounds * wordsPerRound * (drawingTime + 30) / 60 // +30s for transitions

  return (
    <WizardStep
      step={4}
      totalSteps={4}
      title="Vista Previa del Pictionary"
      description="Revisa tu juego antes de crearlo"
      isValid={true}
    >
      <div className="space-y-6">
        {/* Resumen */}
        <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center rounded-xl">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{data.name}</h2>
              <p className="text-gray-300">Pictionary Digital</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-pink-400">{totalWords}</div>
              <div className="text-sm text-gray-400">Palabras</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{drawingTime}s</div>
              <div className="text-sm text-gray-400">Por dibujo</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{totalRounds}</div>
              <div className="text-sm text-gray-400">Rondas</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{Math.round(estimatedTime)}</div>
              <div className="text-sm text-gray-400">Minutos</div>
            </div>
          </div>
        </Card>

        {/* Configuración del Juego */}
        <FieldGroup title="Configuración del Juego">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Formato:</span>
                <Badge variant="primary" size="sm">
                  {data.teamFormat === 'auto' && 'Equipos Automáticos'}
                  {data.teamFormat === 'manual' && 'Equipos Manuales'}
                  {data.teamFormat === 'individual' && 'Individual'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Dificultad:</span>
                <Badge variant="default" size="sm">
                  {data.difficulty === 'easy' && 'Fácil'}
                  {data.difficulty === 'medium' && 'Medio'}
                  {data.difficulty === 'hard' && 'Difícil'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Puntos por adivinar:</span>
                <span className="text-white font-semibold">{data.pointsForGuessing || 100}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Colores:</span>
                <span className="text-white">{data.enableColors !== false ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Borrador:</span>
                <span className="text-white">{data.enableEraser !== false ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pistas:</span>
                <span className="text-white">{data.enableHints ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>
        </FieldGroup>

        {/* Ejemplo de Palabras */}
        <FieldGroup title="Muestra de Palabras">
          <div className="flex flex-wrap gap-2">
            {data.wordBank?.slice(0, 12).map((item: any, index: number) => (
              <Badge
                key={index}
                variant="default"
                size="lg"
                className="bg-gray-700 text-white"
              >
                {item.word}
              </Badge>
            ))}
            {totalWords > 12 && (
              <Badge variant="default" size="lg" className="bg-gray-600">
                +{totalWords - 12} más
              </Badge>
            )}
          </div>
        </FieldGroup>

        {/* Instrucciones Finales */}
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-300 mb-2">¡Tu Pictionary está listo!</h3>
              <p className="text-sm text-green-200">
                Al hacer clic en "Crear Juego":
              </p>
              <ul className="text-sm text-green-200 mt-2 space-y-1">
                <li>• Los jugadores podrán unirse con el código</li>
                <li>• Se formarán los equipos automáticamente</li>
                <li>• El sistema seleccionará dibujantes por turnos</li>
                <li>• Todos verán el lienzo en tiempo real</li>
                <li>• Los puntos se calcularán automáticamente</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </WizardStep>
  )
}

// Exportar los steps del wizard
export const pictionaryWizardSteps = [
  {
    id: 'basic',
    title: 'Básica',
    description: 'Configuración del juego',
    component: PictionaryBasicStep,
    isValid: (data: any) => validateStep('pictionary', 'basic', data).isValid
  },
  {
    id: 'words',
    title: 'Palabras',
    description: 'Banco de palabras',
    component: PictionaryWordsStep,
    isValid: (data: any) => validateStep('pictionary', 'words', data).isValid
  },
  {
    id: 'settings',
    title: 'Reglas',
    description: 'Configuración y puntos',
    component: PictionarySettingsStep,
    isValid: (data: any) => validateStep('pictionary', 'settings', data).isValid
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Revisión final',
    component: PictionaryPreviewStep,
    isValid: () => true,
    isOptional: true
  }
]