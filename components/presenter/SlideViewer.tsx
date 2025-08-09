'use client'

import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  BarChart3, 
  Cloud, 
  FileText, 
  Star, 
  HelpCircle,
  CheckCircle2,
  Hash
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SlideViewerProps {
  content: any
  responses?: any
  showResults?: boolean
}

export default function SlideViewer({ content, responses = {}, showResults = false }: SlideViewerProps) {
  const getSlideIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return MessageSquare
      case 'poll': return BarChart3
      case 'word-cloud': return Cloud
      case 'open-text': return FileText
      case 'rating': return Star
      case 'qa': return HelpCircle
      default: return FileText
    }
  }

  const Icon = getSlideIcon(content.subtype)

  // Mock de opciones para diferentes tipos de slides
  const mockOptions = {
    'multiple-choice': ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    'poll': ['Muy satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho'],
    'rating': [1, 2, 3, 4, 5],
  }

  // Mock de respuestas
  const mockResponses = {
    'multiple-choice': { A: 45, B: 30, C: 15, D: 10 },
    'poll': { 0: 60, 1: 25, 2: 10, 3: 5 },
    'word-cloud': ['innovación', 'equipo', 'calidad', 'mejora', 'cliente', 'proceso'],
    'rating': { average: 4.2, total: 25 },
    'open-text': ['Gran presentación', 'Me gustó mucho', 'Muy interesante'],
    'qa': ['¿Cómo implementamos esto?', '¿Cuál es el timeline?', '¿Hay presupuesto?']
  }

  const renderContent = () => {
    switch (content.subtype) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">¿Cuál es tu opción preferida?</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockOptions['multiple-choice'].map((option, index) => {
                const letter = String.fromCharCode(65 + index)
                const percentage = showResults ? mockResponses['multiple-choice'][letter] : 0
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="p-6 bg-white/10 rounded-xl border-2 border-white/20 hover:border-white/40 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-cyan-300">{letter}</span>
                        {showResults && (
                          <span className="text-xl font-semibold">{percentage}%</span>
                        )}
                      </div>
                      <p className="text-lg">{option}</p>
                      {showResults && (
                        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-cyan-400"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )

      case 'poll':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">¿Qué tan satisfecho estás?</h2>
            <div className="space-y-3">
              {mockOptions['poll'].map((option, index) => {
                const percentage = showResults ? mockResponses['poll'][index] : 0
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-lg w-32">{option}</span>
                    <div className="flex-1 h-8 bg-white/20 rounded-full overflow-hidden">
                      {showResults && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-end pr-3"
                        >
                          <span className="text-sm font-semibold">{percentage}%</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )

      case 'word-cloud':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">¿En qué palabra piensas?</h2>
            {showResults ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {mockResponses['word-cloud'].map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="px-6 py-3 bg-white/20 rounded-full text-lg font-semibold"
                    style={{ fontSize: `${Math.random() * 20 + 20}px` }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60">
                <Cloud className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p>Esperando respuestas...</p>
              </div>
            )}
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Califica esta sesión</h2>
            <div className="flex justify-center gap-4">
              {mockOptions['rating'].map((rating) => (
                <motion.div
                  key={rating}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rating * 0.1 }}
                  className="text-center"
                >
                  <Star 
                    className={`h-16 w-16 mb-2 transition-colors ${
                      showResults && rating <= Math.round(mockResponses['rating'].average)
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-white/40'
                    }`}
                  />
                  <span className="text-lg font-semibold">{rating}</span>
                </motion.div>
              ))}
            </div>
            {showResults && (
              <div className="text-center">
                <p className="text-2xl font-bold">{mockResponses['rating'].average}/5</p>
                <p className="text-white/80">{mockResponses['rating'].total} respuestas</p>
              </div>
            )}
          </div>
        )

      case 'open-text':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Comparte tu opinión</h2>
            {showResults && mockResponses['open-text'].length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {mockResponses['open-text'].map((text, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/10 rounded-lg"
                  >
                    <p className="text-lg">{text}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60">
                <FileText className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p>Esperando respuestas...</p>
              </div>
            )}
          </div>
        )

      case 'qa':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Preguntas y Respuestas</h2>
            {showResults && mockResponses['qa'].length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {mockResponses['qa'].map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/10 rounded-lg flex items-start gap-3"
                  >
                    <HelpCircle className="h-6 w-6 text-cyan-300 mt-1" />
                    <p className="text-lg flex-1">{question}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60">
                <HelpCircle className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p>Esperando preguntas...</p>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center">
            <Icon className="h-24 w-24 mx-auto mb-6 text-white/60" />
            <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
            <p className="text-xl text-white/80">Slide de tipo: {content.subtype}</p>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-white/60" />
            <Badge className="bg-white/20 text-white border-white/30">
              {content.subtype.replace('-', ' ')}
            </Badge>
          </div>
        </div>
        
        <div className="p-12">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  )
}