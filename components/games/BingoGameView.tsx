'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid3X3, Star, Trophy, CheckCircle2, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface BingoGameViewProps {
  data: {
    gridSize: string
    cardContent: string[]
    winPatterns: string[]
    freeSpace: boolean
    autoVerify: boolean
    multipleWinners: boolean
    prizes?: {
      first?: string
      second?: string
      third?: string
    }
  }
  isPresenter?: boolean
  onMark?: (index: number) => void
  markedCells?: number[]
  winners?: string[]
}

export default function BingoGameView({
  data,
  isPresenter = false,
  onMark,
  markedCells = [],
  winners = []
}: BingoGameViewProps) {
  const [rows, cols] = data.gridSize.split('x').map(Number)
  const [bingoCard, setBingoCard] = useState<string[]>([])
  const [localMarked, setLocalMarked] = useState<Set<number>>(new Set(markedCells))
  const [hasWon, setHasWon] = useState(false)
  
  // Generate unique bingo card on mount
  useEffect(() => {
    const shuffled = [...data.cardContent].sort(() => Math.random() - 0.5)
    const card = []
    const totalCells = rows * cols
    const centerIndex = Math.floor(totalCells / 2)
    
    for (let i = 0; i < totalCells; i++) {
      if (i === centerIndex && data.freeSpace && rows % 2 === 1) {
        card.push('FREE')
      } else {
        card.push(shuffled[i % shuffled.length] || `Cell ${i + 1}`)
      }
    }
    
    setBingoCard(card)
    
    // Mark center as free space
    if (data.freeSpace && rows % 2 === 1) {
      const newMarked = new Set(localMarked)
      newMarked.add(centerIndex)
      setLocalMarked(newMarked)
    }
  }, [data, rows, cols])

  const handleCellClick = (index: number) => {
    if (isPresenter || hasWon) return
    
    const isFreeSpace = index === Math.floor((rows * cols) / 2) && data.freeSpace && rows % 2 === 1
    if (isFreeSpace) return
    
    const newMarked = new Set(localMarked)
    if (newMarked.has(index)) {
      newMarked.delete(index)
    } else {
      newMarked.add(index)
    }
    
    setLocalMarked(newMarked)
    onMark?.(index)
    
    // Check for win
    if (data.autoVerify) {
      checkWinCondition(newMarked)
    }
  }

  const checkWinCondition = (marked: Set<number>) => {
    // Simple line check (horizontal, vertical, diagonal)
    // This is a simplified version - real implementation would check all patterns
    const hasLine = checkLines(marked)
    if (hasLine && !hasWon) {
      setHasWon(true)
      // Trigger win animation/notification
    }
  }

  const checkLines = (marked: Set<number>) => {
    // Check rows
    for (let row = 0; row < rows; row++) {
      let complete = true
      for (let col = 0; col < cols; col++) {
        if (!marked.has(row * cols + col)) {
          complete = false
          break
        }
      }
      if (complete) return true
    }
    
    // Check columns
    for (let col = 0; col < cols; col++) {
      let complete = true
      for (let row = 0; row < rows; row++) {
        if (!marked.has(row * cols + col)) {
          complete = false
          break
        }
      }
      if (complete) return true
    }
    
    // Check diagonals
    let diagonal1 = true
    let diagonal2 = true
    for (let i = 0; i < rows; i++) {
      if (!marked.has(i * cols + i)) diagonal1 = false
      if (!marked.has(i * cols + (cols - 1 - i))) diagonal2 = false
    }
    
    return diagonal1 || diagonal2
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="px-6 py-4 text-center border-b">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Bingo Game
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span>{data.gridSize} Grid</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{winners.length} Winners</span>
          </div>
        </div>
      </div>

      {/* Bingo Card */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {hasWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold">BINGO!</span>
                <Sparkles className="h-6 w-6" />
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6"
          >
            <div 
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              <AnimatePresence>
                {bingoCard.map((item, index) => {
                  const isCenter = index === Math.floor((rows * cols) / 2) && data.freeSpace && rows % 2 === 1
                  const isMarked = localMarked.has(index)
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleCellClick(index)}
                      disabled={isPresenter || isCenter}
                      className={cn(
                        "aspect-square flex items-center justify-center p-2 rounded-lg text-sm font-medium border-2 transition-all",
                        isCenter 
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 text-white cursor-default"
                          : isMarked
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-600 text-white transform scale-95"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 cursor-pointer",
                        !isPresenter && !isCenter && "active:scale-95"
                      )}
                      whileHover={!isPresenter && !isCenter && !isMarked ? { scale: 1.05 } : {}}
                      whileTap={!isPresenter && !isCenter ? { scale: 0.95 } : {}}
                    >
                      {isCenter ? (
                        <Star className="h-6 w-6" />
                      ) : isMarked ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 absolute" />
                          <span className="text-xs opacity-75 mt-8">{item}</span>
                        </div>
                      ) : (
                        <span className="text-center line-clamp-2">{item}</span>
                      )}
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Instructions */}
          {!isPresenter && !hasWon && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-gray-600">
                Click on the squares as items are called out!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Get a complete line to win
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Prizes (if any) */}
      {(data.prizes?.first || data.prizes?.second || data.prizes?.third) && (
        <div className="px-6 py-4 bg-white border-t">
          <h3 className="text-center text-sm font-semibold text-gray-600 mb-3">Prizes</h3>
          <div className="flex justify-center gap-6">
            {data.prizes.first && (
              <div className="text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
                <p className="text-sm font-medium">{data.prizes.first}</p>
              </div>
            )}
            {data.prizes.second && (
              <div className="text-center">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                <p className="text-sm font-medium">{data.prizes.second}</p>
              </div>
            )}
            {data.prizes.third && (
              <div className="text-center">
                <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-1" />
                <p className="text-sm font-medium">{data.prizes.third}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-600">LIVE</span>
        </div>
      </div>
    </div>
  )
}