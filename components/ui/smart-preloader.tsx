'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SmartPreloaderProps {
  children: React.ReactNode
  preloadImages?: string[]
  preloadComponents?: React.ComponentType[]
  showProgress?: boolean
  minimumDelay?: number
  className?: string
}

export function SmartPreloader({
  children,
  preloadImages = [],
  preloadComponents = [],
  showProgress = true,
  minimumDelay = 1000,
  className
}: SmartPreloaderProps) {
  const [loadingProgress, setLoadingProgress] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadedItems, setLoadedItems] = React.useState(0)
  
  const totalItems = preloadImages.length + preloadComponents.length + 1 // +1 for base loading
  
  React.useEffect(() => {
    const startTime = Date.now()
    let completed = 0
    
    // Preload images
    const imagePromises = preloadImages.map((src) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = img.onerror = () => {
          completed++
          setLoadedItems(completed)
          setLoadingProgress((completed / totalItems) * 100)
          resolve(true)
        }
        img.src = src
      })
    })
    
    // Preload components (simulate component preparation)
    const componentPromises = preloadComponents.map((_, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          completed++
          setLoadedItems(completed)
          setLoadingProgress((completed / totalItems) * 100)
          resolve(true)
        }, 100 + index * 50)
      })
    })
    
    // Base loading
    const baseLoading = new Promise((resolve) => {
      setTimeout(() => {
        completed++
        setLoadedItems(completed)
        setLoadingProgress((completed / totalItems) * 100)
        resolve(true)
      }, 200)
    })
    
    Promise.all([...imagePromises, ...componentPromises, baseLoading]).then(() => {
      const elapsed = Date.now() - startTime
      const remainingDelay = Math.max(0, minimumDelay - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
      }, remainingDelay)
    })
  }, [preloadImages, preloadComponents, totalItems, minimumDelay])
  
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50",
            className
          )}
        >
          <div className="text-center">
            {/* Loading spinner */}
            <motion.div
              className="relative w-32 h-32 mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, transparent, transparent ${loadingProgress * 3.6}deg, rgba(255,255,255,0.8) ${loadingProgress * 3.6}deg)`
                }}
              />
              
              {/* Center icon */}
              <div className="absolute inset-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl"
                >
                  ⚡
                </motion.div>
              </div>
            </motion.div>
            
            {/* Progress text */}
            {showProgress && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white space-y-2"
              >
                <h2 className="text-2xl font-bold">Cargando AudienceSpark</h2>
                <p className="text-white/70">Preparando experiencia interactiva...</p>
                
                {/* Progress bar */}
                <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <p className="text-sm text-white/60">
                  {Math.round(loadingProgress)}% - {loadedItems}/{totalItems} elementos
                </p>
              </motion.div>
            )}
            
            {/* Loading dots */}
            <motion.div
              className="flex justify-center gap-1 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white/60 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}