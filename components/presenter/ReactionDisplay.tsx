'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Reaction {
  id: string
  emoji: string
  participantName: string
  timestamp: Date
  x?: number
  y?: number
}

interface ReactionDisplayProps {
  className?: string
}

export default function ReactionDisplay({ className = '' }: ReactionDisplayProps) {
  const [reactions, setReactions] = useState<Reaction[]>([])

  // Add reaction to display
  const addReaction = (emoji: string, participantName: string) => {
    const newReaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      participantName,
      timestamp: new Date(),
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: 100, // Start from bottom
    }

    setReactions(prev => [...prev, newReaction])

    // Special effects for certain emojis
    if (emoji === '🎉' || emoji === '🎊') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else if (emoji === '❤️' || emoji === '💖') {
      confetti({
        particleCount: 50,
        spread: 45,
        colors: ['#ff0000', '#ff69b4', '#ff1493'],
        shapes: ['circle'],
        origin: { y: 0.6 }
      })
    }

    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id))
    }, 5000)
  }

  // Expose addReaction method
  useEffect(() => {
    (window as any).addReaction = addReaction
    return () => {
      delete (window as any).addReaction
    }
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ 
              x: `${reaction.x}%`,
              y: '100%',
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: '-100vh',
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 5,
              ease: 'easeOut',
              opacity: {
                times: [0, 0.1, 0.8, 1]
              }
            }}
            className="absolute flex flex-col items-center"
            style={{ left: 0, bottom: 0 }}
          >
            <div className="text-6xl mb-1">{reaction.emoji}</div>
            <div className="text-xs text-white bg-black/50 px-2 py-1 rounded-full whitespace-nowrap">
              {reaction.participantName}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}