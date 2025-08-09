'use client'

import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'subtle' | 'vibrant'
}

export function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const configs = {
    default: {
      shapes: [
        { color: 'bg-yellow-300', size: 'w-96 h-96', position: '-top-32 -left-32', duration: 20 },
        { color: 'bg-blue-400', size: 'w-96 h-96', position: '-bottom-32 -right-32', duration: 25 },
        { color: 'bg-green-400', size: 'w-64 h-64', position: 'top-1/2 left-1/2', duration: 15 }
      ],
      opacity: 'opacity-20'
    },
    subtle: {
      shapes: [
        { color: 'bg-purple-200', size: 'w-64 h-64', position: 'top-20 right-20', duration: 30 },
        { color: 'bg-pink-200', size: 'w-80 h-80', position: 'bottom-20 left-20', duration: 35 }
      ],
      opacity: 'opacity-10'
    },
    vibrant: {
      shapes: [
        { color: 'bg-orange-400', size: 'w-[40rem] h-[40rem]', position: '-top-48 -left-48', duration: 15 },
        { color: 'bg-purple-500', size: 'w-[30rem] h-[30rem]', position: '-bottom-32 -right-32', duration: 20 },
        { color: 'bg-pink-400', size: 'w-96 h-96', position: 'top-1/3 left-1/3', duration: 25 }
      ],
      opacity: 'opacity-30'
    }
  }

  const config = configs[variant]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {config.shapes.map((shape, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute ${shape.size} ${shape.color} rounded-full ${config.opacity} blur-3xl ${shape.position}`}
        />
      ))}
    </div>
  )
}