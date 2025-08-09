'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface CelebrationEffectsProps {
  type?: 'confetti' | 'fireworks' | 'stars' | 'hearts'
  duration?: number
  onComplete?: () => void
}

export function CelebrationEffects({ 
  type = 'confetti',
  duration = 3000,
  onComplete 
}: CelebrationEffectsProps) {
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    switch (type) {
      case 'confetti':
        // Multiple bursts of confetti
        const colors = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors
        })
        
        interval = setInterval(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors
          })
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors
          })
        }, 500)
        
        setTimeout(() => {
          clearInterval(interval)
          onComplete?.()
        }, duration)
        break
        
      case 'fireworks':
        const firework = () => {
          const particleCount = 200
          const defaults = {
            origin: { 
              x: Math.random(),
              y: Math.random() * 0.5 + 0.3
            }
          }

          confetti({
            ...defaults,
            particleCount,
            spread: 360,
            ticks: 100,
            gravity: 0.5,
            decay: 0.94,
            startVelocity: 30,
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
          })
        }
        
        // Launch multiple fireworks
        firework()
        interval = setInterval(firework, 700)
        
        setTimeout(() => {
          clearInterval(interval)
          onComplete?.()
        }, duration)
        break
        
      case 'stars':
        const star = confetti.shapeFromText({ text: '⭐', scalar: 2 })
        
        confetti({
          shapes: [star],
          particleCount: 30,
          spread: 360,
          ticks: 200,
          gravity: 0.3,
          decay: 0.95,
          startVelocity: 15,
          origin: { y: 0.5 }
        })
        
        setTimeout(() => onComplete?.(), duration)
        break
        
      case 'hearts':
        const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 })
        
        interval = setInterval(() => {
          confetti({
            shapes: [heart],
            particleCount: 5,
            spread: 50,
            ticks: 300,
            gravity: 0.2,
            decay: 0.95,
            startVelocity: 10,
            origin: { 
              x: Math.random(),
              y: 1
            }
          })
        }, 300)
        
        setTimeout(() => {
          clearInterval(interval)
          onComplete?.()
        }, duration)
        break
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [type, duration, onComplete])
  
  return null
}

// Floating emoji reactions
export function FloatingEmojis({ emojis }: { emojis: string[] }) {
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{
    id: number
    emoji: string
    x: number
    delay: number
  }>>([])
  
  useEffect(() => {
    const newEmojis = emojis.map((emoji, index) => ({
      id: Date.now() + index,
      emoji,
      x: Math.random() * 80 + 10,
      delay: index * 0.2
    }))
    
    setFloatingEmojis(newEmojis)
    
    const timeout = setTimeout(() => {
      setFloatingEmojis([])
    }, 4000)
    
    return () => clearTimeout(timeout)
  }, [emojis])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-6xl"
            initial={{ 
              left: `${item.x}%`, 
              bottom: -100,
              opacity: 1,
              scale: 0
            }}
            animate={{ 
              bottom: '100%',
              opacity: [1, 1, 0],
              scale: [0, 1.5, 1],
              rotate: [0, 360]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              delay: item.delay,
              ease: 'easeOut'
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Victory animation
export function VictoryAnimation({ 
  playerName,
  score,
  position = 1 
}: { 
  playerName: string
  score: number
  position?: number 
}) {
  const medals = ['🥇', '🥈', '🥉']
  const medal = medals[position - 1] || '🏆'
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 100, rotate: -180 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
          className="text-8xl mb-6"
        >
          {medal}
        </motion.div>
        
        <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
          ¡Felicitaciones!
        </h2>
        
        <p className="text-2xl font-bold text-gray-800 mb-2">
          {playerName}
        </p>
        
        <p className="text-lg text-gray-600 mb-6">
          Posición #{position}
        </p>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl font-black text-purple-600"
        >
          {score} puntos
        </motion.div>
        
        <motion.div
          className="mt-8 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ 
                rotate: [0, 360],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity
              }}
              className="text-3xl"
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
      
      <CelebrationEffects type="fireworks" duration={5000} />
    </motion.div>
  )
}