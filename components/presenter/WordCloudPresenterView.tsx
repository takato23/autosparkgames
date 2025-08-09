'use client'

import { motion } from 'framer-motion'
import { WordCloudSlide } from '@/lib/types/presentation'
import { SlideResponses, WordCloudAggregated } from '@/lib/types/session'
import { Card } from '@/components/ui/card'
import { useMemo } from 'react'

interface WordCloudPresenterViewProps {
  slide: WordCloudSlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

interface WordData {
  text: string
  size: number
  count: number
}

export default function WordCloudPresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: WordCloudPresenterViewProps) {
  const aggregatedData = responses?.aggregatedData?.data as WordCloudAggregated
  
  const wordData = useMemo(() => {
    if (!aggregatedData?.wordFrequency) return []
    
    const words: WordData[] = []
    const maxCount = Math.max(...Object.values(aggregatedData.wordFrequency))
    
    Object.entries(aggregatedData.wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50) // Show top 50 words
      .forEach(([word, count]) => {
        words.push({
          text: word,
          count,
          size: 16 + (count / maxCount) * 48 // Size range: 16-64px
        })
      })
    
    return words
  }, [aggregatedData])
  
  // Generate random positions for words
  const getRandomPosition = (index: number) => {
    const angle = (index / wordData.length) * 2 * Math.PI
    const radius = 200 + Math.random() * 150
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y }
  }
  
  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-12 shadow-2xl">
        <motion.h1 
          className="text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {slide.prompt}
        </motion.h1>
        
        {showResults && wordData.length > 0 ? (
          <motion.div 
            className="relative h-[500px] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {wordData.map((word, index) => {
                const pos = getRandomPosition(index)
                const colors = [
                  'text-blue-600', 'text-green-600', 'text-amber-600', 
                  'text-red-600', 'text-purple-600', 'text-pink-600',
                  'text-teal-600', 'text-orange-600'
                ]
                const colorClass = colors[index % colors.length]
                
                return (
                  <motion.div
                    key={word.text}
                    className={`absolute font-bold ${colorClass} select-none cursor-default`}
                    style={{
                      fontSize: `${word.size}px`,
                      transform: `translate(${pos.x}px, ${pos.y}px)`
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ 
                      delay: 0.4 + index * 0.02,
                      duration: 0.5,
                      type: "spring"
                    }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    title={`${word.count} times`}
                  >
                    {word.text}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-3xl text-muted-foreground">
              Waiting for responses...
            </p>
          </motion.div>
        )}
        
        {showResults && responses && (
          <motion.div 
            className="mt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg">
              {aggregatedData?.uniqueWords || 0} unique words from {responses.responseCount} responses
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}