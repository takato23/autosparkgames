'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Reaction, ReactionType } from '@/lib/types/session'
import { useEffect, useState } from 'react'

interface FloatingReactionsProps {
  reactions: Reaction[]
}

interface FloatingReaction extends Reaction {
  id: string
  x: number
  y: number
}

const reactionEmojis: Record<ReactionType, string> = {
  [ReactionType.LIKE]: '👍',
  [ReactionType.LOVE]: '❤️',
  [ReactionType.CONFUSED]: '😕',
  [ReactionType.MIND_BLOWN]: '🤯',
  [ReactionType.CLAP]: '👏',
  [ReactionType.RAISE_HAND]: '✋'
}

export default function FloatingReactions({ reactions }: FloatingReactionsProps) {
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([])
  
  useEffect(() => {
    // Convert new reactions to floating reactions with random positions
    const newFloatingReactions = reactions.map((reaction, index) => ({
      ...reaction,
      id: `${reaction.timestamp.toMillis()}-${index}`,
      x: Math.random() * 80 + 10, // 10-90% of screen width
      y: 100 // Start from bottom
    }))
    
    setFloatingReactions(prev => [...prev, ...newFloatingReactions])
    
    // Clean up old reactions after animation completes
    const cleanup = setTimeout(() => {
      setFloatingReactions(prev => 
        prev.filter(r => Date.now() - r.timestamp.toMillis() < 5000)
      )
    }, 5000)
    
    return () => clearTimeout(cleanup)
  }, [reactions])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {floatingReactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            className="absolute text-4xl"
            style={{ left: `${reaction.x}%` }}
            initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
            animate={{ 
              y: '-100vh', 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 4,
              ease: "easeOut",
              opacity: {
                times: [0, 0.1, 0.8, 1]
              }
            }}
          >
            {reactionEmojis[reaction.type]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}