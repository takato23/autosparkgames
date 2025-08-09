'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/lib/design-system/components'
import { Cloud } from 'lucide-react'

interface Word {
  word: string
  count: number
}

interface WordCloudDisplayProps {
  words: Word[]
  maxWords?: number
  className?: string
}

export default function WordCloudDisplay({ 
  words, 
  maxWords = 20,
  className = '' 
}: WordCloudDisplayProps) {
  const [displayWords, setDisplayWords] = useState<Word[]>([])

  useEffect(() => {
    // Sort by count and limit
    const sorted = [...words]
      .sort((a, b) => b.count - a.count)
      .slice(0, maxWords)
    
    setDisplayWords(sorted)
  }, [words, maxWords])

  // Calculate font size based on count
  const getFontSize = (count: number, maxCount: number) => {
    const minSize = 14
    const maxSize = 48
    const ratio = count / maxCount
    return minSize + (maxSize - minSize) * ratio
  }

  // Get color based on frequency
  const getColor = (count: number, maxCount: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'text-purple-400'
    if (ratio > 0.6) return 'text-blue-400'
    if (ratio > 0.4) return 'text-cyan-400'
    if (ratio > 0.2) return 'text-green-400'
    return 'text-gray-400'
  }

  const maxCount = Math.max(...displayWords.map(w => w.count), 1)

  if (displayWords.length === 0) {
    return (
      <Card variant="gradient" className={`flex flex-col items-center justify-center p-12 ${className}`}>
        <Cloud className="h-16 w-16 text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">Esperando respuestas...</p>
      </Card>
    )
  }

  return (
    <Card variant="gradient" className={`p-8 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <AnimatePresence mode="popLayout">
          {displayWords.map((word, index) => (
            <motion.div
              key={word.word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }
              }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ 
                scale: 1.2,
                transition: { duration: 0.2 }
              }}
              className={`cursor-pointer transition-colors ${getColor(word.count, maxCount)}`}
              style={{ 
                fontSize: `${getFontSize(word.count, maxCount)}px`,
                fontWeight: word.count > maxCount * 0.5 ? 600 : 400
              }}
            >
              {word.word}
              <span className="text-xs ml-1 opacity-50">({word.count})</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  )
}