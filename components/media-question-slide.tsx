'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { AnswerButton } from '@/components/ui/answer-button'
import { Badge } from '@/components/ui/badge'
import { theme } from '@/lib/theme'
import { Clock, Image as ImageIcon, Play } from 'lucide-react'

interface MediaOption {
  id: string
  text?: string
  imageUrl?: string
  isCorrect?: boolean
}

interface MediaQuestionSlideProps {
  question: string
  questionImageUrl?: string
  questionVideoUrl?: string
  options: MediaOption[]
  timeLimit?: number
  currentTime?: number
  onAnswer?: (optionId: string) => void
  showResult?: boolean
  isPresenter?: boolean
  selectedAnswer?: string
}

export function MediaQuestionSlide({
  question,
  questionImageUrl,
  questionVideoUrl,
  options,
  timeLimit,
  currentTime,
  onAnswer,
  showResult = false,
  isPresenter = false,
  selectedAnswer
}: MediaQuestionSlideProps) {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<string | null>(null)
  const selected = selectedAnswer || localSelectedAnswer
  
  const handleAnswer = (optionId: string) => {
    if (selected || showResult) return
    setLocalSelectedAnswer(optionId)
    onAnswer?.(optionId)
  }

  const timeLeft = timeLimit && currentTime ? timeLimit - currentTime : null

  if (isPresenter) {
    return (
      <div className="p-8 md:p-12">
        <div className="text-center mb-8">
          <Badge className="mb-6 text-2xl md:text-3xl px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl rounded-full">
            <ImageIcon className="h-6 w-6 mr-2" aria-hidden="true" />
            Pregunta Visual
          </Badge>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-purple-800 px-4 md:px-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {question}
          </motion.h2>
          
          {timeLeft !== null && timeLeft > 0 && !showResult && (
            <motion.div
              animate={{ scale: timeLeft <= 5 ? [1, 1.3, 1] : 1 }}
              transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.8 }}
              className="inline-flex items-center justify-center gap-4 px-6 py-3 bg-white rounded-full shadow-xl"
            >
              <Clock className={`h-10 w-10 ${timeLeft <= 5 ? 'text-red-500' : 'text-orange-500'}`} />
              <span className={`font-mono font-black text-4xl ${timeLeft <= 5 ? 'text-red-500' : 'text-orange-500'}`}>
                {timeLeft}s
              </span>
            </motion.div>
          )}
        </div>

        {/* Question Media */}
        {(questionImageUrl || questionVideoUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 flex justify-center"
          >
            {questionVideoUrl ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl">
                <ImagePlaceholder
                  type="general"
                  aspectRatio="video"
                  label="Video de la pregunta"
                  description="El video se reproducirá aquí"
                  className="w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="h-10 w-10 text-purple-600 ml-1" />
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg text-sm">
                  ⚠️ Necesitarás agregar el video aquí
                </p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-2xl">
                <ImagePlaceholder
                  type="question"
                  aspectRatio="video"
                  label="Imagen de la pregunta"
                  description="La imagen aparecerá aquí"
                  className="w-full"
                />
                <p className="bg-purple-100 text-purple-700 px-4 py-2 text-sm text-center">
                  ⚠️ Necesitarás agregar la imagen aquí
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Answer Options */}
        <div className={`grid gap-6 ${options.some(o => o.imageUrl) ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} max-w-5xl mx-auto`}>
          {options.map((option, index) => {
            const answerColor = theme.colors.answers[index % theme.colors.answers.length]
            const isCorrect = showResult && option.isCorrect
            const isWrong = showResult && selected === option.id && !option.isCorrect
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative rounded-2xl overflow-hidden shadow-xl transition-all ${
                  isCorrect ? 'ring-4 ring-green-500' :
                  isWrong ? 'ring-4 ring-red-500' : ''
                }`}
              >
                {option.imageUrl ? (
                  <div>
                    <ImagePlaceholder
                      type="general"
                      aspectRatio="square"
                      label={`Opción ${String.fromCharCode(65 + index)}`}
                      className="w-full h-64"
                    />
                    <div className={`p-4 text-center font-bold text-lg bg-gradient-to-r ${answerColor.bg} ${answerColor.text}`}>
                      {option.text || `Opción ${String.fromCharCode(65 + index)}`}
                    </div>
                    <p className="absolute top-4 right-4 bg-white/90 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold">
                      ⚠️ Imagen requerida
                    </p>
                  </div>
                ) : (
                  <div className={`p-8 text-center bg-gradient-to-r ${answerColor.bg} ${answerColor.text}`}>
                    <div className="text-4xl font-black mb-4 bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="text-2xl font-bold">
                      {option.text}
                    </div>
                  </div>
                )}
                
                {showResult && (
                  <div className="absolute top-4 left-4">
                    {isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl bg-white rounded-full p-2"
                      >
                        ✅
                      </motion.div>
                    )}
                    {isWrong && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl bg-white rounded-full p-2"
                      >
                        ❌
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // Participant view
  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <Badge className="mb-4 text-lg px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg rounded-full">
          {questionImageUrl || questionVideoUrl ? (
            <>
              <ImageIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Pregunta Visual
            </>
          ) : (
            'Trivia Challenge'
          )}
        </Badge>
        
        <h2 className="text-2xl md:text-3xl font-bold text-purple-800 px-4">
          {question}
        </h2>
        
        {timeLeft !== null && timeLeft > 0 && !selected && (
          <motion.div
            animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
            className="inline-flex items-center justify-center gap-3 mt-4 bg-white px-4 py-2 rounded-full shadow-lg"
          >
            <Clock className={`h-5 w-5 ${timeLeft <= 5 ? 'text-red-600' : 'text-orange-600'}`} />
            <span className={`text-2xl font-mono font-black ${timeLeft <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
              {timeLeft}s
            </span>
          </motion.div>
        )}
      </div>

      {/* Question Media */}
      {(questionImageUrl || questionVideoUrl) && (
        <div className="mb-6 flex justify-center">
          <div className="rounded-xl overflow-hidden shadow-lg max-w-md w-full">
            <ImagePlaceholder
              type="question"
              aspectRatio="video"
              label="Contenido multimedia"
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Answer Options */}
      {options.some(o => o.imageUrl) ? (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(option.id)}
              disabled={selected !== null || timeLeft === 0}
              className={`relative rounded-xl overflow-hidden shadow-lg transition-all ${
                selected === option.id ? 'ring-4 ring-purple-500 scale-105' : 'hover:scale-105'
              } ${(selected !== null || timeLeft === 0) && selected !== option.id ? 'opacity-60' : ''}`}
            >
              <ImagePlaceholder
                type="general"
                aspectRatio="square"
                label=""
                className="w-full h-32"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-white font-bold">
                  {option.text || `Opción ${String.fromCharCode(65 + index)}`}
                </span>
              </div>
              {selected === option.id && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2">
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnswerButton
                index={index}
                selected={selected === option.id}
                correct={showResult && option.isCorrect}
                incorrect={showResult && selected === option.id && !option.isCorrect}
                showResult={showResult}
                onClick={() => handleAnswer(option.id)}
                disabled={selected !== null || timeLeft === 0}
              >
                {option.text}
              </AnswerButton>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}