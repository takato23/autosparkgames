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
  Sparkles, 
  Trophy, 
  Target,
  Star,
  Zap,
  Gift,
  Crown,
  Flame
} from "lucide-react"

interface BingoCell {
  id: string
  text: string
  marked: boolean
  animated?: boolean
}

interface BingoPattern {
  name: string
  check: (cells: BingoCell[][]) => boolean
  icon: React.ReactNode
  points: number
}

interface InteractiveBingoProps {
  title?: string
  theme?: 'corporate' | 'networking' | 'product' | 'fun'
  size?: 3 | 4 | 5
  customWords?: string[]
  onComplete?: (pattern: string, time: number) => void
  className?: string
}

// Predefined word sets by theme
const wordSets = {
  corporate: [
    "Sinergia", "KPI", "ROI", "Innovación", "Estrategia",
    "Objetivos", "Liderazgo", "Equipo", "Calidad", "Proceso",
    "Mejora", "Cliente", "Valor", "Visión", "Misión",
    "Cultura", "Resultado", "Proyecto", "Deadline", "Entregable",
    "Stakeholder", "Agile", "Scrum", "Feedback", "Growth"
  ],
  networking: [
    "LinkedIn", "Contacto", "Tarjeta", "Presentación", "Pitch",
    "Colaboración", "Oportunidad", "Networking", "Conexión", "Reunión",
    "Coffee Chat", "Mentor", "Referencia", "Portfolio", "Experiencia",
    "Habilidades", "Proyecto", "Startup", "Emprendedor", "Inversión",
    "Partnership", "Alianza", "Evento", "Conferencia", "Workshop"
  ],
  product: [
    "Feature", "Usuario", "UX", "Interfaz", "Beta",
    "Launch", "Roadmap", "Sprint", "Backlog", "MVP",
    "Testing", "Bug", "Release", "Update", "Versión",
    "API", "Dashboard", "Analytics", "Métrica", "Conversión",
    "Engagement", "Retention", "Onboarding", "Tutorial", "Demo"
  ],
  fun: [
    "Pizza 🍕", "Café ☕", "Viernes", "Happy Hour", "Meme",
    "GIF", "Emoji 😄", "Break", "Snacks", "Música",
    "Baile", "Chiste", "Juego", "Premio", "Sorpresa",
    "Celebración", "Fiesta", "Karaoke", "Selfie", "TikTok",
    "Instagram", "Viral", "Trending", "Challenge", "Fun"
  ]
}

// Winning patterns
const patterns: BingoPattern[] = [
  {
    name: "Línea Horizontal",
    icon: <Zap className="h-4 w-4" />,
    points: 100,
    check: (cells) => {
      return cells.some(row => row.every(cell => cell.marked))
    }
  },
  {
    name: "Línea Vertical",
    icon: <Target className="h-4 w-4" />,
    points: 100,
    check: (cells) => {
      const size = cells.length
      for (let col = 0; col < size; col++) {
        if (cells.every(row => row[col].marked)) return true
      }
      return false
    }
  },
  {
    name: "Diagonal",
    icon: <Star className="h-4 w-4" />,
    points: 150,
    check: (cells) => {
      const size = cells.length
      // Top-left to bottom-right
      if (cells.every((row, i) => row[i].marked)) return true
      // Top-right to bottom-left
      if (cells.every((row, i) => row[size - 1 - i].marked)) return true
      return false
    }
  },
  {
    name: "Cuatro Esquinas",
    icon: <Gift className="h-4 w-4" />,
    points: 75,
    check: (cells) => {
      const size = cells.length
      return cells[0][0].marked && 
             cells[0][size-1].marked && 
             cells[size-1][0].marked && 
             cells[size-1][size-1].marked
    }
  },
  {
    name: "Full House",
    icon: <Crown className="h-4 w-4" />,
    points: 300,
    check: (cells) => {
      return cells.every(row => row.every(cell => cell.marked))
    }
  }
]

export function InteractiveBingo({
  title = "Bingo Corporativo",
  theme = 'corporate',
  size = 5,
  customWords,
  onComplete,
  className
}: InteractiveBingoProps) {
  const [cells, setCells] = React.useState<BingoCell[][]>([])
  const [completedPatterns, setCompletedPatterns] = React.useState<string[]>([])
  const [score, setScore] = React.useState(0)
  const [startTime] = React.useState(Date.now())
  const [selectedCell, setSelectedCell] = React.useState<string | null>(null)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const controls = useAnimation()

  // Initialize bingo card
  React.useEffect(() => {
    const words = customWords || wordSets[theme]
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    const grid: BingoCell[][] = []

    for (let i = 0; i < size; i++) {
      const row: BingoCell[] = []
      for (let j = 0; j < size; j++) {
        const index = i * size + j
        const isFreeSpace = size === 5 && i === 2 && j === 2
        
        row.push({
          id: `${i}-${j}`,
          text: isFreeSpace ? "FREE" : shuffled[index % shuffled.length],
          marked: isFreeSpace,
          animated: false
        })
      }
      grid.push(row)
    }

    setCells(grid)
  }, [theme, size, customWords])

  // Check for winning patterns
  React.useEffect(() => {
    if (cells.length === 0) return

    patterns.forEach(pattern => {
      if (!completedPatterns.includes(pattern.name) && pattern.check(cells)) {
        setCompletedPatterns(prev => [...prev, pattern.name])
        setScore(prev => prev + pattern.points)
        celebrateWin(pattern.name)
        
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
        onComplete?.(pattern.name, timeElapsed)
      }
    })
  }, [cells, completedPatterns, startTime, onComplete])

  const toggleCell = async (rowIndex: number, colIndex: number) => {
    const cell = cells[rowIndex][colIndex]
    if (cell.text === "FREE" || isAnimating) return

    setIsAnimating(true)
    setSelectedCell(cell.id)

    // Animate the selection
    await controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.4 }
    })

    // Update the cell
    const newCells = cells.map((row, i) =>
      row.map((cell, j) => {
        if (i === rowIndex && j === colIndex) {
          return { ...cell, marked: !cell.marked, animated: true }
        }
        return cell
      })
    )

    setCells(newCells)
    setSelectedCell(null)
    setIsAnimating(false)

    // Play sound effect
    if (!cells[rowIndex][colIndex].marked) {
      playMarkSound()
    }
  }

  const celebrateWin = (patternName: string) => {
    // Confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
    })

    // Play victory sound
    playVictorySound()

    // Animate the board
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5, repeat: 2 }
    })
  }

  const playMarkSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjQFHm7A7+OZURE')
    audio.volume = 0.3
    audio.play()
  }

  const playVictorySound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEAQIcAAECHAAABAAgAZGF0YQQGAACG/4r+jQCNAI0AjP+I/YX7gfh+9Xrwde1w6WzlaeJl317cWtlX1lPTUNBMzUnKRshDxUDCPL86vDe5NLYxszCwLa0srCmpJ6YmpCOhIp8hnx+fH58hnyCfI58mpCepLKoqrS2wMrM0tje5Orw9wEDDRcZIykvNT9BS01bWWdld3GDfZONn5mvpb+1y8HXzef2A/4UAhQGFAYYAhQCE/4L+gPx99Xnwde1x6W7laeRm4V/eW9pX11TUUNFNz0jMRclCx0DEPcE7vzi7Nrg0tTGzMK8urSyrKKkmpCSkIqIhoB+hIKEfnyGdIp0knSWdJ50onSudLZ0wnzKeMJ4wnzCfMJ8wni+eLp0tnCycKpwpnCmcKZwpnCqdK50rnSydLJ0tnS2dLZ0snSycK50rnSudK50rnSudK50rnSudK50rnSudKp4qnimgKaAooiiPKY4qjiqOKo0pjSiNKI0njSeNJ40mjSaNJY0mjSaNJo0njSeNJ40mjSaNJo0njSiNKI0ojSiNKI0pjSqNK40rjSuNK40rjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSuNK40rjSuNK40rjSuNK40rjSuNK40rjSuNK40rjSqNKo0pjSmNKY0pjSmNKY0pjSmNKY0pjSmNKY0pjSmNKY0ojiiOKI4ojiiOKI4ojiiOKI0ojiiNKI0ojSiNKI0pjSmNKY0pjSmNKY0pjSmNKY0qjSuNK40rjSuOK44qjiqOKo4qjiqNK40rjSuNK40rjSuNK40rjSuNK44sjSyNLI4sjiyOLI4sjiyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjiyOLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI4sjiyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI0sjSyNLI4rjSuNK40rjSuNK40rjSuNK40rjSuNKo0qjSqNKo0qjSqNKo0qjSqNKo0pjSiNKI0ojSiNKI0ojSiNKI0ojSiNKI0pjSmNKY0pjSmNKY0pjSmNKY0pjSmNKY0pjSmNKY0pjSmNKo0qjSqNK40rjSuNK40rjSuNK40rjSyNLI0sjSyNLI0sjS2NLY0tjS6OLo8ujy+PL48wjzCPMI8wkDGQMZAykTORM5E0kTWRNpE2kTaRNpI3kjeSN5I3kjeSN5I3kjaSNpI1kjSSM5E0kDSPM48zjzKOMo4xjjGOMY4xjjGOMY4xjjGNMY0xjTGNMY0xjTGNMY0xjTGNMY0xjTCNMY0xjTGNMY0xjTGNMY0xjTGOMY4xjjGOMY4xjjGOMY4yjjKOMo4zjjSNNI00jTSNNI00jTSNNI00jTSONI40jTSNNI00jTSNNI00jTSNNI00jTSNNI00jTSNNI00jTSNNI00jTSNNI00jjSNNI00jTSNNI00jTSNNI00jTSONI40jTSNNI00jTSNNI0=')
    audio.volume = 0.5
    audio.play()
  }

  const getCellColor = (cell: BingoCell) => {
    if (cell.text === "FREE") return "from-yellow-400 to-orange-500"
    if (cell.marked) return "from-green-400 to-emerald-500"
    return "from-purple-400 to-pink-500"
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header */}
      <BeautifulGlassCard variant="cosmic" className="mb-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-white/80">Marca las palabras cuando las escuches</p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-sm text-white/60">Puntos</div>
          </div>
        </div>

        {/* Completed patterns */}
        {completedPatterns.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {completedPatterns.map(pattern => {
              const p = patterns.find(p => p.name === pattern)
              return (
                <motion.div
                  key={pattern}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-sm font-medium flex items-center gap-1"
                >
                  {p?.icon}
                  {pattern}
                </motion.div>
              )
            })}
          </div>
        )}
      </BeautifulGlassCard>

      {/* Bingo Grid */}
      <motion.div 
        animate={controls}
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
        }}
      >
        <AnimatePresence>
          {cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={cell.id}
                layout
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{
                  delay: (rowIndex * size + colIndex) * 0.03,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <EnhancedFocusRing variant="vibrant">
                  <InstantFeedback feedbackType="all" sensitivity="high">
                    <motion.button
                      onClick={() => toggleCell(rowIndex, colIndex)}
                      className={cn(
                        "relative w-full aspect-square rounded-2xl p-4 font-semibold text-white transition-all",
                        "hover:scale-105 active:scale-95",
                        "flex items-center justify-center text-center",
                        "backdrop-blur-lg border border-white/20",
                        cell.marked && "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                      )}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      animate={selectedCell === cell.id ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      style={{
                        background: `linear-gradient(135deg, ${
                          cell.marked 
                            ? 'rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3)' 
                            : 'rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2)'
                        })`,
                        boxShadow: cell.marked 
                          ? '0 0 20px rgba(34, 197, 94, 0.5)' 
                          : '0 0 20px rgba(139, 92, 246, 0.3)'
                      }}
                      aria-label={`${cell.text} ${cell.marked ? 'marcado' : 'no marcado'}`}
                      disabled={cell.text === "FREE"}
                    >
                      {/* Background gradient */}
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-2xl opacity-50",
                          `bg-gradient-to-br ${getCellColor(cell)}`
                        )}
                      />

                      {/* Cell content */}
                      <div className="relative z-10">
                        {cell.text === "FREE" ? (
                          <div className="flex flex-col items-center gap-1">
                            <Trophy className="h-6 w-6" />
                            <span className="text-xs">GRATIS</span>
                          </div>
                        ) : (
                          <span className={cn(
                            "text-sm sm:text-base",
                            cell.marked && "line-through opacity-80"
                          )}>
                            {cell.text}
                          </span>
                        )}
                      </div>

                      {/* Marked indicator */}
                      {cell.marked && cell.text !== "FREE" && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-green-400" />
                          </div>
                        </motion.div>
                      )}

                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity"
                        whileHover={{ opacity: 0.2 }}
                      />
                    </motion.button>
                  </InstantFeedback>
                </EnhancedFocusRing>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pattern Guide */}
      <BeautifulGlassCard variant="ocean" className="mt-6 p-4">
        <h3 className="text-lg font-bold text-white mb-3">Patrones Ganadores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {patterns.map(pattern => (
            <div
              key={pattern.name}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg transition-all",
                completedPatterns.includes(pattern.name)
                  ? "bg-green-500/20 text-green-300"
                  : "bg-white/10 text-white/60"
              )}
            >
              {pattern.icon}
              <div className="flex-1">
                <div className="text-sm font-medium">{pattern.name}</div>
                <div className="text-xs opacity-70">{pattern.points} pts</div>
              </div>
              {completedPatterns.includes(pattern.name) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <Star className="h-4 w-4 text-green-400" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </BeautifulGlassCard>
    </div>
  )
}