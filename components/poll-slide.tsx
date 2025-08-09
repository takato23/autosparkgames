'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GradientButton } from '@/components/ui/gradient-button'
import { theme } from '@/lib/theme'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface PollSlideProps {
  question: string
  options: PollOption[]
  totalVotes: number
  allowMultiple?: boolean
  showResults?: boolean
  onVote?: (optionId: string) => void
  isPresenter?: boolean
}

export function PollSlide({
  question,
  options,
  totalVotes,
  allowMultiple = false,
  showResults = false,
  onVote,
  isPresenter = false
}: PollSlideProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const maxVotes = Math.max(...options.map(o => o.votes), 1)

  const handleVote = (optionId: string) => {
    if (hasVoted && !allowMultiple) return
    
    if (allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
      setHasVoted(true)
    }
    
    onVote?.(optionId)
  }

  const submitVotes = () => {
    setHasVoted(true)
    // Submit all selected options
    selectedOptions.forEach(id => onVote?.(id))
  }

  if (isPresenter) {
    return (
      <div className="p-12">
        <div className="text-center mb-8">
          <Badge className="mb-6 text-2xl md:text-3xl px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold shadow-xl rounded-full">
            <BarChart3 className="h-6 w-6 mr-2" aria-hidden="true" />
            Encuesta en Vivo
          </Badge>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-4 text-blue-800 px-4 md:px-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {question}
          </motion.h2>
          
          <div className="flex items-center justify-center gap-4 text-lg text-gray-600">
            <Users className="h-5 w-5" aria-hidden="true" />
            <span>{totalVotes} votos</span>
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <AnimatePresence>
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {option.text}
                      </h3>
                      <span className="text-2xl font-bold text-blue-600">
                        {option.percentage}%
                      </span>
                    </div>
                    
                    <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${option.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {option.votes} votos
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Participant view
  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <Badge className="mb-4 text-lg px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold shadow-lg rounded-full">
          <BarChart3 className="h-5 w-5 mr-2" aria-hidden="true" />
          Encuesta
        </Badge>
        
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 px-4">
          {question}
        </h2>
        
        {allowMultiple && !hasVoted && (
          <p className="text-sm text-gray-600 mt-2">
            Puedes seleccionar múltiples opciones
          </p>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.id)
          const colorSet = theme.colors.answers[index % theme.colors.answers.length]
          
          return (
            <motion.button
              key={option.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted && !allowMultiple}
              className={`w-full text-left p-6 rounded-2xl transition-all transform ${
                isSelected 
                  ? `bg-gradient-to-r ${colorSet.bg} ${colorSet.text} ring-4 ring-blue-500 scale-[1.02]`
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-blue-300'
              } ${hasVoted && !allowMultiple ? 'cursor-not-allowed opacity-60' : 'hover:scale-[1.01]'}`}
              aria-pressed={isSelected}
              aria-label={`Opción: ${option.text}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{option.text}</span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                    aria-hidden="true"
                  >
                    ✓
                  </motion.span>
                )}
              </div>
              
              {showResults && hasVoted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span>{option.votes} votos</span>
                    <span className="font-bold">{option.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${option.percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {allowMultiple && !hasVoted && selectedOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <GradientButton
            onClick={submitVotes}
            gradient="secondary"
            size="lg"
            className="w-full"
          >
            Enviar Votos ({selectedOptions.length} seleccionados)
          </GradientButton>
        </motion.div>
      )}

      {hasVoted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl"
        >
          <p className="text-green-700 font-semibold">
            ¡Gracias por tu voto! {showResults ? 'Aquí están los resultados:' : 'Esperando resultados...'}
          </p>
        </motion.div>
      )}
    </div>
  )
}