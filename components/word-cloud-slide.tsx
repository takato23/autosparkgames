'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Send, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { GradientButton } from '@/components/ui/gradient-button'
import { theme } from '@/lib/theme'

interface Word {
  text: string
  count: number
  size: number
  color: string
}

interface WordCloudSlideProps {
  question: string
  words: Word[]
  maxResponses?: number
  onSubmit?: (word: string) => void
  isPresenter?: boolean
}

export function WordCloudSlide({
  question,
  words,
  maxResponses = 3,
  onSubmit,
  isPresenter = false
}: WordCloudSlideProps) {
  const [responses, setResponses] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const gradients = [
    'from-purple-600 to-pink-600',
    'from-blue-600 to-teal-600',
    'from-green-600 to-emerald-600',
    'from-yellow-500 to-orange-600',
    'from-red-600 to-pink-600',
    'from-indigo-600 to-purple-600'
  ]

  const handleSubmit = () => {
    if (!currentInput.trim() || responses.length >= maxResponses) return
    
    const newResponses = [...responses, currentInput.trim()]
    setResponses(newResponses)
    setCurrentInput('')
    onSubmit?.(currentInput.trim())
    
    if (newResponses.length >= maxResponses) {
      setHasSubmitted(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  if (isPresenter) {
    return (
      <div className="p-12 h-full flex flex-col">
        <div className="text-center mb-8">
          <Badge className="mb-6 text-2xl md:text-3xl px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl rounded-full">
            <Cloud className="h-6 w-6 mr-2" aria-hidden="true" />
            Nube de Palabras
          </Badge>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-4 text-purple-800 px-4 md:px-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {question}
          </motion.h2>
        </div>

        <div className="flex-1 relative max-w-6xl mx-auto w-full">
          <AnimatePresence>
            {words.map((word, index) => {
              // Calculate position in a circular/spiral pattern
              const angle = (index * 137.5) * (Math.PI / 180) // Golden angle
              const radius = 50 + (index * 15) // Expanding spiral
              const x = 50 + (radius * Math.cos(angle) / 5)
              const y = 50 + (radius * Math.sin(angle) / 5)
              
              return (
                <motion.div
                  key={`${word.text}-${index}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    fontSize: `${word.size}px`
                  }}
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    rotate: 0,
                    transition: {
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200
                    }
                  }}
                  whileHover={{ scale: 1.2 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <span 
                    className={`font-bold bg-gradient-to-r ${gradients[index % gradients.length]} bg-clip-text text-transparent drop-shadow-lg cursor-default`}
                  >
                    {word.text}
                  </span>
                  {word.count > 1 && (
                    <span className="ml-1 text-xs text-gray-500 font-normal">
                      ×{word.count}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {words.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Cloud className="h-20 w-20 mx-auto mb-4 text-gray-300" aria-hidden="true" />
                <p className="text-xl text-gray-500">
                  Esperando respuestas...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Participant view
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Badge className="mb-4 text-lg px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg rounded-full">
          <Cloud className="h-5 w-5 mr-2" aria-hidden="true" />
          Nube de Palabras
        </Badge>
        
        <h2 className="text-2xl md:text-3xl font-bold text-purple-800 px-4">
          {question}
        </h2>
        
        <p className="text-sm text-gray-600 mt-2">
          Puedes enviar hasta {maxResponses} palabras o frases cortas
        </p>
      </div>

      {!hasSubmitted ? (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu respuesta..."
              className="flex-1 text-lg p-6 border-2 border-purple-300 bg-purple-50"
              disabled={responses.length >= maxResponses}
              maxLength={30}
              aria-label="Tu respuesta"
            />
            <GradientButton
              onClick={handleSubmit}
              disabled={!currentInput.trim() || responses.length >= maxResponses}
              gradient="primary"
              size="lg"
              aria-label="Enviar respuesta"
            >
              <Send className="h-5 w-5" />
            </GradientButton>
          </div>

          {responses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-sm font-semibold text-purple-700">
                Tus respuestas ({responses.length}/{maxResponses}):
              </p>
              <div className="flex flex-wrap gap-2">
                {responses.map((response, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200">
                      <Hash className="h-3 w-3 mr-1" aria-hidden="true" />
                      {response}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="text-center text-sm text-gray-600">
            {maxResponses - responses.length} respuestas restantes
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3"
          >
            <Cloud className="h-12 w-12 text-green-600" aria-hidden="true" />
          </motion.div>
          <p className="text-lg font-semibold text-green-700 mb-3">
            ¡Respuestas enviadas!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {responses.map((response, index) => (
              <Badge 
                key={index}
                className="px-3 py-1 bg-white text-green-700 border border-green-300"
              >
                {response}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}