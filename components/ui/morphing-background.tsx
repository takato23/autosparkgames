'use client'

import { motion } from 'framer-motion'

export function MorphingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient blobs */}
      <motion.div
        className="absolute -top-48 -left-48 w-96 h-96"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-transparent opacity-40 blur-3xl" />
      </motion.div>
      
      <motion.div
        className="absolute -bottom-48 -right-48 w-96 h-96"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          borderRadius: ["70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%"]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-tl from-blue-400 via-teal-400 to-transparent opacity-40 blur-3xl" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-1/3 w-80 h-80"
        animate={{
          scale: [1, 1.3, 1],
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          borderRadius: ["50% 50% 50% 50% / 50% 50% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50% / 50% 50% 50% 50%"]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-yellow-400 to-transparent opacity-30 blur-3xl" />
      </motion.div>
      
      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 219, 98, 0.1) 0%, transparent 50%)
          `
        }}
      />
    </div>
  )
}