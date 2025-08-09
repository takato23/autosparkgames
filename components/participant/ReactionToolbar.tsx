'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Flame, Smile, HandMetal } from 'lucide-react'
import { ReactionType } from '@/lib/types'

interface ReactionToolbarProps {
  onSendReaction: (type: ReactionType) => void
}

interface FloatingReaction {
  id: string
  type: ReactionType
  x: number
}

const reactionConfig = [
  { type: ReactionType.CLAP, icon: '👏', label: 'Aplauso' },
  { type: ReactionType.LOVE, icon: '❤️', label: 'Me encanta' },
  { type: ReactionType.MIND_BLOWN, icon: '🔥', label: 'Fuego' },
  { type: ReactionType.CONFUSED, icon: '😂', label: 'Risa' },
]

export default function ReactionToolbar({ onSendReaction }: ReactionToolbarProps) {
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([])

  const handleReaction = (type: ReactionType, index: number) => {
    onSendReaction(type)

    // Create floating reaction animation
    const id = `${Date.now()}-${Math.random()}`
    const button = document.getElementById(`reaction-${index}`)
    const rect = button?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2

    setFloatingReactions((prev) => [...prev, { id, type, x }])

    // Remove floating reaction after animation
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id))
    }, 3000)
  }

  const getReactionEmoji = (type: ReactionType) => {
    const reaction = reactionConfig.find((r) => r.type === type)
    return reaction?.icon || '👍'
  }

  return (
    <>
      {/* Floating reactions */}
      <AnimatePresence>
        {floatingReactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ 
              x: reaction.x - 20,
              y: window.innerHeight - 100,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: reaction.x - 20 + (Math.random() - 0.5) * 100,
              y: window.innerHeight * 0.2,
              scale: 1,
              opacity: [0, 1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              ease: [0.68, -0.55, 0.265, 1.55],
              opacity: {
                times: [0, 0.1, 0.8, 1]
              }
            }}
            className="fixed z-50 pointer-events-none"
            style={{ 
              fontSize: '2rem',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
          >
            {getReactionEmoji(reaction.type)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Reaction toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {reactionConfig.map((reaction, index) => (
              <motion.button
                key={reaction.type}
                id={`reaction-${index}`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleReaction(reaction.type, index)}
                className="relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                aria-label={`Reacción: ${reaction.label}`}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl transition-all group-hover:bg-primary/20 group-active:bg-primary/30">
                  {reaction.icon}
                </div>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-popover text-popover-foreground px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {reaction.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}