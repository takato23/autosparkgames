'use client'

import { useState } from 'react'
import { Input, Button, Badge, Card } from '@/lib/design-system/components'
import { WizardStepProps } from './GameWizardModal'
import WizardStep, { FieldGroup, TooltipHelp } from './WizardStep'
import { validateStep } from '../validation/gameValidation'
import { 
  Grid3X3, Users, Trophy, Sparkles, Plus, Trash2, 
  Copy, Shuffle, Download, Upload, AlertCircle,
  Dice1, CheckCircle2, Star, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Step 1: Configuración Básica
export function BingoBasicStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'basic', data)

  const gridSizes = [
    { 
      id: '3x3', 
      name: '3x3', 
      description: 'Rápido y fácil', 
      cells: 9,
      time: '5-10 min',
      icon: '🎯',
      recommended: 'Ideal para calentamiento'
    },
    { 
      id: '4x4', 
      name: '4x4', 
      description: 'Balance perfecto', 
      cells: 16,
      time: '10-20 min',
      icon: '⭐',
      recommended: 'Más popular'
    },
    { 
      id: '5x5', 
      name: '5x5', 
      description: 'Desafío completo', 
      cells: 25,
      time: '15-30 min',
      icon: '🏆',
      recommended: 'Para sesiones largas'
    }
  ]

  const themes = [
    { id: 'custom', name: 'Personalizado', description: 'Crea tu propio contenido', icon: '✨' },
    { id: 'education', name: 'Educativo', description: 'Términos y conceptos', icon: '📚' },
    { id: 'team', name: 'Team Building', description: 'Conoce a tu equipo', icon: '👥' },
    { id: 'conference', name: 'Conferencia', description: 'Speakers y temas', icon: '🎤' },
    { id: 'holiday', name: 'Festividades', description: 'Celebraciones especiales', icon: '🎉' },
    { id: 'icebreaker', name: 'Rompehielos', description: 'Actividades divertidas', icon: '🧊' }
  ]

  return (
    <WizardStep
      step={1}
      totalSteps={4}
      title="Configuración del Bingo"
      description="Define el formato y tema de tu bingo"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Información del Juego */}
        <FieldGroup 
          title="Información del Juego" 
          description="Dale identidad a tu bingo"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre del Bingo
              </label>
              <Input
                value={data.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Ej. Bingo de Conferencia 2024"
                className={cn(
                  "w-full",
                  errors.some(e => e.field === 'name') && "border-red-500"
                )}
              />
              {errors.find(e => e.field === 'name') && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Máximo de Jugadores
              </label>
              <Input
                type="number"
                value={data.maxPlayers || 100}
                onChange={(e) => onChange({ maxPlayers: parseInt(e.target.value) })}
                min="2"
                max="500"
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>

        {/* Tamaño del Cartón */}
        <FieldGroup 
          title="Tamaño del Cartón" 
          description="Elige qué tan grande será el desafío"
          required
        >
          <div className="grid grid-cols-3 gap-4">
            {gridSizes.map((size) => (
              <motion.button
                key={size.id}
                type="button"
                onClick={() => onChange({ gridSize: size.id })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  data.gridSize === size.id
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-3xl mb-2">{size.icon}</div>
                <h3 className="font-semibold text-white text-lg">{size.name}</h3>
                <p className="text-sm text-gray-300 mb-1">{size.description}</p>
                <div className="space-y-1 text-xs">
                  <p className="text-blue-400">{size.cells} casillas</p>
                  <p className="text-gray-400">{size.time}</p>
                  <Badge variant="default" size="sm" className="mt-2">
                    {size.recommended}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        </FieldGroup>

        {/* Tema del Bingo */}
        <FieldGroup 
          title="Tema del Bingo" 
          description="Selecciona o crea tu propio tema"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChange({ theme: theme.id })}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  data.theme === theme.id
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{theme.icon}</span>
                  <span className="font-medium text-white">{theme.name}</span>
                </div>
                <p className="text-xs text-gray-300">{theme.description}</p>
              </button>
            ))}
          </div>
        </FieldGroup>
      </div>
    </WizardStep>
  )
}

// Step 2: Contenido del Bingo
export function BingoContentStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'cards', data)
  const [newItem, setNewItem] = useState('')
  const [bulkInput, setBulkInput] = useState(false)
  
  const items = data.cardContent || []
  const gridSize = data.gridSize || '4x4'
  const requiredItems = parseInt(gridSize.split('x')[0]) ** 2

  const addItem = () => {
    if (newItem.trim() && items.length < requiredItems * 2) {
      onChange({ cardContent: [...items, newItem.trim()] })
      setNewItem('')
    }
  }

  const addBulkItems = (text: string) => {
    const newItems = text
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    onChange({ 
      cardContent: [...items, ...newItems].slice(0, requiredItems * 2) 
    })
    setBulkInput(false)
  }

  const removeItem = (index: number) => {
    onChange({ 
      cardContent: items.filter((_: string, i: number) => i !== index) 
    })
  }

  const shuffleItems = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    onChange({ cardContent: shuffled })
  }

  const loadTemplate = (templateId: string) => {
    const templates: Record<string, string[]> = {
      education: [
        'Pregunta al ponente', 'Toma notas', 'Aprende algo nuevo', 
        'Comparte en redes', 'Conecta con alguien', 'Participa en Q&A',
        'Visita un stand', 'Descarga material', 'Foto con speaker'
      ],
      team: [
        'Comparte un hobby', 'Cuenta un chiste', 'Menciona tu película favorita',
        'Habla de tu mascota', 'Comparte una meta', 'Cuenta una anécdota',
        'Menciona tu comida favorita', 'Habla de un viaje', 'Comparte un talento'
      ],
      icebreaker: [
        'Haz un cumplido', 'Comparte un meme', 'Baila 10 segundos',
        'Imita un animal', 'Canta una canción', 'Cuenta hasta 10 en otro idioma',
        'Haz una cara graciosa', 'Comparte un dato curioso', 'Haz un dibujo rápido'
      ]
    }
    
    if (templates[templateId]) {
      onChange({ cardContent: templates[templateId] })
    }
  }

  return (
    <WizardStep
      step={2}
      totalSteps={4}
      title="Contenido del Bingo"
      description="Agrega las palabras o frases que aparecerán en los cartones"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Estadísticas */}
        <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Progreso del Contenido</h3>
              <p className="text-sm text-gray-300 mt-1">
                Necesitas al menos {requiredItems} elementos para cartones de {gridSize}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{items.length}</div>
              <div className="text-sm text-gray-400">de {requiredItems} mínimo</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((items.length / requiredItems) * 100, 100)}%` }}
            />
          </div>
        </Card>

        {/* Acciones Rápidas */}
        <FieldGroup title="Acciones Rápidas">
          <div className="flex flex-wrap gap-2">
            {data.theme && data.theme !== 'custom' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => loadTemplate(data.theme)}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Cargar Plantilla {data.theme}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setBulkInput(!bulkInput)}
              leftIcon={<Copy className="h-4 w-4" />}
            >
              Agregar en Lote
            </Button>
            {items.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={shuffleItems}
                leftIcon={<Shuffle className="h-4 w-4" />}
              >
                Mezclar
              </Button>
            )}
          </div>
        </FieldGroup>

        {/* Input de Contenido */}
        <FieldGroup 
          title="Agregar Elementos" 
          description="Cada elemento puede aparecer en los cartones"
          required
        >
          {bulkInput ? (
            <div className="space-y-3">
              <textarea
                placeholder="Pega o escribe múltiples elementos (uno por línea)..."
                className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    addBulkItems(e.target.value)
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBulkInput(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder="Escribe un elemento del bingo..."
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addItem}
                disabled={!newItem.trim() || items.length >= requiredItems * 2}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Agregar
              </Button>
            </div>
          )}
        </FieldGroup>

        {/* Lista de Elementos */}
        {items.length > 0 && (
          <FieldGroup title={`Elementos Agregados (${items.length})`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {items.map((item: string, index: number) => (
                  <motion.div
                    key={`${item}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <span className="text-white">{item}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </FieldGroup>
        )}

        {errors.length > 0 && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errors[0].message}</span>
          </div>
        )}
      </div>
    </WizardStep>
  )
}

// Step 3: Reglas y Patrones
export function BingoRulesStep({ data, onChange, gameType }: WizardStepProps) {
  const { isValid, errors } = validateStep(gameType, 'rules', data)

  const winPatterns = [
    { 
      id: 'line', 
      name: 'Línea', 
      description: 'Horizontal, vertical o diagonal',
      icon: '➖',
      difficulty: 'Fácil'
    },
    { 
      id: 'fullCard', 
      name: 'Cartón Lleno', 
      description: 'Todas las casillas marcadas',
      icon: '🎯',
      difficulty: 'Difícil'
    },
    { 
      id: 'corners', 
      name: '4 Esquinas', 
      description: 'Las 4 esquinas del cartón',
      icon: '⬜',
      difficulty: 'Medio'
    },
    { 
      id: 'cross', 
      name: 'Cruz', 
      description: 'Forma de + en el centro',
      icon: '➕',
      difficulty: 'Medio'
    },
    { 
      id: 'letter', 
      name: 'Letra', 
      description: 'Forma letras como T, L, X',
      icon: '🔤',
      difficulty: 'Medio'
    },
    { 
      id: 'custom', 
      name: 'Personalizado', 
      description: 'Define tu propio patrón',
      icon: '✨',
      difficulty: 'Variable'
    }
  ]

  const selectedPatterns = data.winPatterns || []

  const togglePattern = (patternId: string) => {
    if (selectedPatterns.includes(patternId)) {
      onChange({ winPatterns: selectedPatterns.filter((p: string) => p !== patternId) })
    } else {
      onChange({ winPatterns: [...selectedPatterns, patternId] })
    }
  }

  return (
    <WizardStep
      step={3}
      totalSteps={4}
      title="Reglas del Juego"
      description="Define cómo se puede ganar el bingo"
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Patrones de Victoria */}
        <FieldGroup 
          title="Patrones de Victoria" 
          description="Selecciona uno o más patrones para ganar"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {winPatterns.map((pattern) => (
              <motion.button
                key={pattern.id}
                type="button"
                onClick={() => togglePattern(pattern.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  selectedPatterns.includes(pattern.id)
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{pattern.icon}</span>
                      <h3 className="font-semibold text-white">{pattern.name}</h3>
                    </div>
                    <p className="text-sm text-gray-300">{pattern.description}</p>
                  </div>
                  <Badge 
                    variant="default" 
                    size="sm"
                    className={cn(
                      pattern.difficulty === 'Fácil' && "bg-green-600/20 text-green-300",
                      pattern.difficulty === 'Medio' && "bg-yellow-600/20 text-yellow-300",
                      pattern.difficulty === 'Difícil' && "bg-red-600/20 text-red-300"
                    )}
                  >
                    {pattern.difficulty}
                  </Badge>
                </div>
                {selectedPatterns.includes(pattern.id) && (
                  <CheckCircle2 className="h-5 w-5 text-blue-400 mt-2" />
                )}
              </motion.button>
            ))}
          </div>
        </FieldGroup>

        {/* Configuración del Juego */}
        <FieldGroup 
          title="Configuración del Juego" 
          description="Ajusta las reglas y mecánicas"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Espacio Central Libre</h4>
                <p className="text-sm text-gray-400">La casilla central ya está marcada</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ freeSpace: !data.freeSpace })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  data.freeSpace !== false ? "bg-blue-600" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  data.freeSpace !== false ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Auto-verificación</h4>
                <p className="text-sm text-gray-400">El sistema verifica automáticamente</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ autoVerify: !data.autoVerify })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  data.autoVerify !== false ? "bg-blue-600" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  data.autoVerify !== false ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Múltiples Ganadores</h4>
                <p className="text-sm text-gray-400">Permite varios ganadores</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ multipleWinners: !data.multipleWinners })}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  data.multipleWinners ? "bg-blue-600" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  data.multipleWinners ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </FieldGroup>

        {/* Premios */}
        <FieldGroup 
          title="Premios (Opcional)" 
          description="Motiva a los participantes con premios"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                1er Premio
              </label>
              <Input
                value={data.prizes?.first || ''}
                onChange={(e) => onChange({ 
                  prizes: { ...data.prizes, first: e.target.value } 
                })}
                placeholder="Ej. Gift Card $50"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                2do Premio
              </label>
              <Input
                value={data.prizes?.second || ''}
                onChange={(e) => onChange({ 
                  prizes: { ...data.prizes, second: e.target.value } 
                })}
                placeholder="Ej. Descuento 25%"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                3er Premio
              </label>
              <Input
                value={data.prizes?.third || ''}
                onChange={(e) => onChange({ 
                  prizes: { ...data.prizes, third: e.target.value } 
                })}
                placeholder="Ej. Merchandising"
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>

        {errors.length > 0 && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errors[0].message}</span>
          </div>
        )}
      </div>
    </WizardStep>
  )
}

// Step 4: Preview Final
export function BingoPreviewStep({ data, onChange, gameType }: WizardStepProps) {
  const gridSize = data.gridSize || '4x4'
  const [rows, cols] = gridSize.split('x').map(Number)
  const items = data.cardContent || []
  
  // Generar un cartón de ejemplo
  const generateSampleCard = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    const card = []
    const totalCells = rows * cols
    const centerIndex = Math.floor(totalCells / 2)
    
    for (let i = 0; i < totalCells; i++) {
      if (i === centerIndex && data.freeSpace !== false && rows % 2 === 1) {
        card.push('LIBRE')
      } else {
        card.push(shuffled[i % shuffled.length] || `Casilla ${i + 1}`)
      }
    }
    
    return card
  }

  const sampleCard = generateSampleCard()

  return (
    <WizardStep
      step={4}
      totalSteps={4}
      title="Vista Previa del Bingo"
      description="Revisa tu bingo antes de crearlo"
      isValid={true}
    >
      <div className="space-y-6">
        {/* Resumen */}
        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center rounded-xl text-2xl">
              🎯
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{data.name}</h2>
              <p className="text-gray-300">Bingo {gridSize} • {items.length} elementos</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-amber-400">{gridSize}</div>
              <div className="text-sm text-gray-400">Tamaño</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{data.maxPlayers || 100}</div>
              <div className="text-sm text-gray-400">Jugadores</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{data.winPatterns?.length || 0}</div>
              <div className="text-sm text-gray-400">Patrones</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{items.length}</div>
              <div className="text-sm text-gray-400">Elementos</div>
            </div>
          </div>
        </Card>

        {/* Cartón de Ejemplo */}
        <FieldGroup title="Ejemplo de Cartón">
          <div className="max-w-md mx-auto">
            <div 
              className="grid gap-2 p-4 bg-white rounded-lg shadow-lg"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {sampleCard.map((item, index) => {
                const isCenter = index === Math.floor((rows * cols) / 2) && data.freeSpace !== false && rows % 2 === 1
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square flex items-center justify-center p-2 rounded text-center text-sm font-medium border-2",
                      isCenter 
                        ? "bg-amber-100 border-amber-400 text-amber-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"
                    )}
                  >
                    {isCenter ? (
                      <Star className="h-6 w-6 text-amber-500" />
                    ) : (
                      <span className="line-clamp-2">{item}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </FieldGroup>

        {/* Reglas Configuradas */}
        <FieldGroup title="Reglas del Juego">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-white">
                Patrones de victoria: {data.winPatterns?.join(', ') || 'Línea'}
              </span>
            </div>
            {data.freeSpace !== false && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-white">Espacio central libre activado</span>
              </div>
            )}
            {data.autoVerify !== false && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-white">Auto-verificación de ganadores</span>
              </div>
            )}
            {data.multipleWinners && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-white">Múltiples ganadores permitidos</span>
              </div>
            )}
          </div>
        </FieldGroup>

        {/* Premios */}
        {(data.prizes?.first || data.prizes?.second || data.prizes?.third) && (
          <FieldGroup title="Premios">
            <div className="grid grid-cols-3 gap-4">
              {data.prizes.first && (
                <div className="text-center p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="font-semibold text-white">1er Premio</div>
                  <div className="text-sm text-gray-300">{data.prizes.first}</div>
                </div>
              )}
              {data.prizes.second && (
                <div className="text-center p-3 bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-semibold text-white">2do Premio</div>
                  <div className="text-sm text-gray-300">{data.prizes.second}</div>
                </div>
              )}
              {data.prizes.third && (
                <div className="text-center p-3 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="font-semibold text-white">3er Premio</div>
                  <div className="text-sm text-gray-300">{data.prizes.third}</div>
                </div>
              )}
            </div>
          </FieldGroup>
        )}

        {/* Instrucciones Finales */}
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-300 mb-2">¡Tu bingo está listo!</h3>
              <p className="text-sm text-green-200">
                Al hacer clic en "Crear Juego":
              </p>
              <ul className="text-sm text-green-200 mt-2 space-y-1">
                <li>• Se generarán cartones únicos para cada jugador</li>
                <li>• Los jugadores podrán unirse con el código</li>
                <li>• Podrás controlar el juego desde tu panel</li>
                <li>• Los ganadores se detectarán automáticamente</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </WizardStep>
  )
}

// Exportar los steps del wizard
export const bingoWizardSteps = [
  {
    id: 'basic',
    title: 'Básica',
    description: 'Configuración del bingo',
    component: BingoBasicStep,
    isValid: (data: any) => validateStep('bingo', 'basic', data).isValid
  },
  {
    id: 'content',
    title: 'Contenido',
    description: 'Elementos del bingo',
    component: BingoContentStep,
    isValid: (data: any) => validateStep('bingo', 'cards', data).isValid
  },
  {
    id: 'rules',
    title: 'Reglas',
    description: 'Patrones y premios',
    component: BingoRulesStep,
    isValid: (data: any) => validateStep('bingo', 'rules', data).isValid
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Revisión final',
    component: BingoPreviewStep,
    isValid: () => true,
    isOptional: true
  }
]