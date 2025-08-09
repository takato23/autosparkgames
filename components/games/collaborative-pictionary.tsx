'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { BeautifulGlassCard } from "@/components/ui/beautiful-glass-card"
import { PremiumButton } from "@/components/ui/premium-button"
import { EnhancedFocusRing } from "@/components/ui/enhanced-focus-ring"
import { InstantFeedback } from "@/components/ui/instant-feedback"
import confetti from "canvas-confetti"
import { 
  Palette, 
  Eraser, 
  Download,
  RefreshCw,
  Clock,
  Users,
  Sparkles,
  Brush,
  Pencil,
  PaintBucket,
  Undo2,
  Redo2,
  Send
} from "lucide-react"

interface DrawingPoint {
  x: number
  y: number
  color: string
  size: number
  tool: 'pen' | 'brush' | 'eraser'
}

interface DrawingPath {
  points: DrawingPoint[]
  id: string
}

interface CollaborativePictionaryProps {
  categories?: string[]
  timeLimit?: number // seconds
  onRoundComplete?: (word: string, guessed: boolean, time: number) => void
  onGameEnd?: (score: number) => void
  className?: string
}

const defaultCategories = {
  corporate: [
    "Reunión", "Deadline", "Presentación", "Email", "Café",
    "Laptop", "Oficina", "Jefe", "Equipo", "Proyecto",
    "Gráfico", "Meta", "Estrategia", "Cliente", "Contrato"
  ],
  objects: [
    "Teléfono", "Reloj", "Llave", "Libro", "Silla",
    "Mesa", "Lámpara", "Ventana", "Puerta", "Coche",
    "Avión", "Barco", "Bicicleta", "Casa", "Árbol"
  ],
  actions: [
    "Correr", "Saltar", "Bailar", "Cantar", "Dormir",
    "Comer", "Beber", "Escribir", "Leer", "Pensar",
    "Trabajar", "Jugar", "Cocinar", "Nadar", "Volar"
  ],
  emotions: [
    "Feliz", "Triste", "Enojado", "Sorprendido", "Asustado",
    "Cansado", "Emocionado", "Aburrido", "Nervioso", "Relajado",
    "Confundido", "Orgulloso", "Avergonzado", "Ansioso", "Tranquilo"
  ]
}

const colors = [
  { name: "Negro", value: "#000000" },
  { name: "Rojo", value: "#ef4444" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Amarillo", value: "#f59e0b" },
  { name: "Morado", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Naranja", value: "#f97316" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Gris", value: "#6b7280" }
]

const brushSizes = [
  { name: "Fino", value: 2, icon: "·" },
  { name: "Medio", value: 5, icon: "•" },
  { name: "Grueso", value: 10, icon: "●" },
  { name: "Muy Grueso", value: 20, icon: "⬤" }
]

export function CollaborativePictionary({
  categories = ['corporate', 'objects', 'actions', 'emotions'],
  timeLimit = 60,
  onRoundComplete,
  onGameEnd,
  className
}: CollaborativePictionaryProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [currentPath, setCurrentPath] = React.useState<DrawingPath | null>(null)
  const [paths, setPaths] = React.useState<DrawingPath[]>([])
  const [undoStack, setUndoStack] = React.useState<DrawingPath[]>([])
  
  const [selectedColor, setSelectedColor] = React.useState(colors[0].value)
  const [selectedSize, setSelectedSize] = React.useState(5)
  const [selectedTool, setSelectedTool] = React.useState<'pen' | 'brush' | 'eraser'>('pen')
  
  const [currentWord, setCurrentWord] = React.useState("")
  const [timeLeft, setTimeLeft] = React.useState(timeLimit)
  const [score, setScore] = React.useState(0)
  const [round, setRound] = React.useState(1)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showWord, setShowWord] = React.useState(false)
  
  const [guess, setGuess] = React.useState("")
  const [guesses, setGuesses] = React.useState<string[]>([])
  const [isArtist, setIsArtist] = React.useState(true) // In real app, this would be determined by turn

  // Timer effect
  React.useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endRound(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  // Canvas setup and drawing
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      const container = containerRef.current
      if (!container) return
      
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      
      // Redraw after resize
      redrawCanvas()
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  const startNewRound = () => {
    // Select random word
    const allWords = categories.flatMap(cat => 
      defaultCategories[cat as keyof typeof defaultCategories] || []
    )
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)]
    
    setCurrentWord(randomWord)
    setTimeLeft(timeLimit)
    setIsPlaying(true)
    setShowWord(false)
    setGuesses([])
    setGuess("")
    clearCanvas()
  }

  const endRound = (guessed: boolean) => {
    setIsPlaying(false)
    setShowWord(true)
    
    if (guessed) {
      const timeBonus = Math.floor(timeLeft / 10) * 10
      const roundScore = 100 + timeBonus
      setScore(prev => prev + roundScore)
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    
    onRoundComplete?.(currentWord, guessed, timeLimit - timeLeft)
  }

  const submitGuess = () => {
    if (!guess.trim() || !isPlaying) return
    
    const normalizedGuess = guess.toLowerCase().trim()
    const normalizedWord = currentWord.toLowerCase()
    
    setGuesses(prev => [...prev, guess])
    
    if (normalizedGuess === normalizedWord) {
      endRound(true)
    }
    
    setGuess("")
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isArtist || !isPlaying) return
    
    const pos = getMousePos(e)
    const newPath: DrawingPath = {
      id: Date.now().toString(),
      points: [{
        x: pos.x,
        y: pos.y,
        color: selectedTool === 'eraser' ? '#FFFFFF' : selectedColor,
        size: selectedTool === 'eraser' ? selectedSize * 2 : selectedSize,
        tool: selectedTool
      }]
    }
    
    setCurrentPath(newPath)
    setIsDrawing(true)
    setUndoStack([]) // Clear redo stack on new drawing
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath || !isArtist || !isPlaying) return
    
    const pos = getMousePos(e)
    const newPoint: DrawingPoint = {
      x: pos.x,
      y: pos.y,
      color: selectedTool === 'eraser' ? '#FFFFFF' : selectedColor,
      size: selectedTool === 'eraser' ? selectedSize * 2 : selectedSize,
      tool: selectedTool
    }
    
    setCurrentPath(prev => ({
      ...prev!,
      points: [...prev!.points, newPoint]
    }))
    
    // Draw the new segment
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = newPoint.color
    ctx.lineWidth = newPoint.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    ctx.beginPath()
    const lastPoint = currentPath.points[currentPath.points.length - 1]
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (currentPath && currentPath.points.length > 0) {
      setPaths(prev => [...prev, currentPath])
    }
    setCurrentPath(null)
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setPaths([])
    setUndoStack([])
  }

  const undo = () => {
    if (paths.length === 0) return
    
    const lastPath = paths[paths.length - 1]
    setPaths(prev => prev.slice(0, -1))
    setUndoStack(prev => [...prev, lastPath])
    redrawCanvas()
  }

  const redo = () => {
    if (undoStack.length === 0) return
    
    const pathToRedo = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setPaths(prev => [...prev, pathToRedo])
    redrawCanvas()
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    paths.forEach(path => {
      path.points.forEach((point, index) => {
        if (index === 0) return
        
        const prevPoint = path.points[index - 1]
        
        ctx.globalCompositeOperation = point.tool === 'eraser' ? 'destination-out' : 'source-over'
        ctx.strokeStyle = point.color
        ctx.lineWidth = point.size
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
      })
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      {/* Header */}
      <BeautifulGlassCard variant="cosmic" className="mb-6 p-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Pictionary Colaborativo</h2>
            <p className="text-white/80">
              {isArtist ? "¡Dibuja la palabra!" : "¡Adivina qué están dibujando!"}
            </p>
          </div>
          
          <div className="flex gap-6 items-center">
            {/* Timer */}
            <div className="text-center">
              <Clock className="h-8 w-8 text-white mx-auto mb-1" />
              <div className={cn(
                "text-2xl font-bold",
                timeLeft <= 10 ? "text-red-400" : "text-white"
              )}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            {/* Score */}
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{score}</div>
            </div>
            
            {/* Round */}
            <div className="text-center">
              <Users className="h-8 w-8 text-white mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">R{round}</div>
            </div>
          </div>
        </div>

        {/* Current word (for artist) */}
        {isArtist && isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 p-3 bg-purple-500/20 rounded-lg text-center"
          >
            <p className="text-sm text-purple-300 mb-1">Tu palabra es:</p>
            <p className="text-2xl font-bold text-white">{currentWord}</p>
          </motion.div>
        )}

        {/* Game controls */}
        {!isPlaying && (
          <div className="mt-4 flex gap-3 justify-center">
            <PremiumButton
              variant="primary"
              size="lg"
              onClick={startNewRound}
              icon={<RefreshCw />}
            >
              {round === 1 ? "Empezar Juego" : "Siguiente Ronda"}
            </PremiumButton>
            
            {showWord && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-4 py-2 bg-green-500/20 rounded-lg text-green-300 font-medium"
              >
                La palabra era: {currentWord}
              </motion.div>
            )}
          </div>
        )}
      </BeautifulGlassCard>

      {/* Main game area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Drawing tools (left sidebar) */}
        {isArtist && (
          <BeautifulGlassCard variant="ocean" className="p-4 lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Herramientas</h3>
            
            {/* Tool selection */}
            <div className="space-y-3 mb-6">
              <EnhancedFocusRing>
                <PremiumButton
                  variant={selectedTool === 'pen' ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTool('pen')}
                  icon={<Pencil />}
                  fullWidth
                >
                  Lápiz
                </PremiumButton>
              </EnhancedFocusRing>
              
              <EnhancedFocusRing>
                <PremiumButton
                  variant={selectedTool === 'brush' ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTool('brush')}
                  icon={<Brush />}
                  fullWidth
                >
                  Pincel
                </PremiumButton>
              </EnhancedFocusRing>
              
              <EnhancedFocusRing>
                <PremiumButton
                  variant={selectedTool === 'eraser' ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTool('eraser')}
                  icon={<Eraser />}
                  fullWidth
                >
                  Borrador
                </PremiumButton>
              </EnhancedFocusRing>
            </div>

            {/* Color palette */}
            <h4 className="text-sm font-medium text-white mb-2">Colores</h4>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {colors.map(color => (
                <EnhancedFocusRing key={color.value}>
                  <button
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "w-full aspect-square rounded-lg border-2 transition-all",
                      selectedColor === color.value
                        ? "border-white scale-110"
                        : "border-transparent hover:border-white/50"
                    )}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Color ${color.name}`}
                  />
                </EnhancedFocusRing>
              ))}
            </div>

            {/* Brush size */}
            <h4 className="text-sm font-medium text-white mb-2">Tamaño</h4>
            <div className="flex gap-2 mb-6">
              {brushSizes.map(size => (
                <EnhancedFocusRing key={size.value}>
                  <button
                    onClick={() => setSelectedSize(size.value)}
                    className={cn(
                      "flex-1 py-2 rounded-lg border-2 transition-all text-white",
                      selectedSize === size.value
                        ? "border-white bg-white/20"
                        : "border-white/30 hover:border-white/50"
                    )}
                    aria-label={`Tamaño ${size.name}`}
                  >
                    {size.icon}
                  </button>
                </EnhancedFocusRing>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <PremiumButton
                variant="secondary"
                size="sm"
                onClick={undo}
                icon={<Undo2 />}
                fullWidth
                disabled={paths.length === 0}
              >
                Deshacer
              </PremiumButton>
              
              <PremiumButton
                variant="secondary"
                size="sm"
                onClick={redo}
                icon={<Redo2 />}
                fullWidth
                disabled={undoStack.length === 0}
              >
                Rehacer
              </PremiumButton>
              
              <PremiumButton
                variant="danger"
                size="sm"
                onClick={clearCanvas}
                icon={<RefreshCw />}
                fullWidth
              >
                Limpiar
              </PremiumButton>
            </div>
          </BeautifulGlassCard>
        )}

        {/* Canvas area */}
        <BeautifulGlassCard 
          variant="cosmic" 
          className={cn(
            "p-4",
            isArtist ? "lg:col-span-2" : "lg:col-span-3"
          )}
        >
          <div 
            ref={containerRef}
            className="relative w-full bg-white rounded-lg overflow-hidden"
            style={{ paddingBottom: '75%' }} // 4:3 aspect ratio
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className={cn(
                "absolute inset-0 w-full h-full cursor-crosshair",
                !isArtist && "pointer-events-none"
              )}
            />
            
            {!isPlaying && !showWord && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-2xl font-bold text-white">
                  Presiona "Empezar Juego" para comenzar
                </p>
              </div>
            )}
          </div>
        </BeautifulGlassCard>

        {/* Guess area (right sidebar) */}
        <BeautifulGlassCard variant="sunset" className="p-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-4">
            {isArtist ? "Intentos" : "¡Adivina!"}
          </h3>
          
          {!isArtist && isPlaying && (
            <form onSubmit={(e) => { e.preventDefault(); submitGuess(); }} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Tu respuesta..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                />
                <EnhancedFocusRing>
                  <PremiumButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Send />}
                  >
                    Enviar
                  </PremiumButton>
                </EnhancedFocusRing>
              </div>
            </form>
          )}
          
          {/* Guess history */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {guesses.length === 0 && (
              <p className="text-white/60 text-center py-8">
                {isArtist ? "Los jugadores aún no han adivinado" : "Aún no hay intentos"}
              </p>
            )}
            
            <AnimatePresence>
              {guesses.map((g, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-2 bg-white/10 rounded-lg text-white"
                >
                  {g}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </BeautifulGlassCard>
      </div>
    </div>
  )
}