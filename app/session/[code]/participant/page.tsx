'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  BarChart3, 
  Cloud, 
  FileText, 
  Star, 
  HelpCircle,
  Gamepad2,
  Send,
  Users,
  CheckCircle2,
  Heart,
  ThumbsUp,
  Smile,
  Zap
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSocket } from '@/lib/hooks/useSocket'
import { useRef } from 'react'

type ServerSlide = {
  id: string
  type: 'trivia' | 'word-cloud' | 'poll' | 'title' | string
  question?: string
  prompt?: string
  options?: Array<{ id: string; text: string }>
}

export default function ParticipantViewPage() {
  const params = useParams()
  const router = useRouter()
  const sessionCode = params.code as string
  const { on } = useSocket()
  
  const [participant, setParticipant] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [presentation, setPresentation] = useState<any>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [hasResponded, setHasResponded] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [serverSlide, setServerSlide] = useState<ServerSlide | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answersLocked, setAnswersLocked] = useState(false)

  useEffect(() => {
    loadSession()
  }, [sessionCode])

  // Suscribirse a bloqueo/desbloqueo de respuestas y tiempo agotado
  useEffect(() => {
    const unsubs = [
      on('slide:state', ({ state }: { state: 'show'|'locked'|'reveal' }) => {
        setAnswersLocked(state === 'locked')
      }),
      on('slide-changed', ({ slide }: { slide: ServerSlide }) => {
        try {
          if (slide) {
            setServerSlide(slide)
            sessionStorage.setItem(`session_${sessionCode}_currentSlide`, JSON.stringify(slide))
            setHasResponded(false)
            setSelectedOptionId(null)
            setResponse(null)
          }
        } catch {}
      }),
      on('time-up', () => {
        setAnswersLocked(true)
        toast.info('Tiempo agotado')
      })
    ]
    return () => { unsubs.forEach(u => u && u()) }
  }, [on])

  const loadSession = () => {
    try {
      // Verificar participante
      const participantData = sessionStorage.getItem('participant')
      if (!participantData) {
        toast.error('No estás registrado en esta sesión')
        router.push('/join/simple')
        return
      }
      
      const participant = JSON.parse(participantData)
      if (participant.sessionCode !== sessionCode) {
        toast.error('Código de sesión no coincide')
        router.push('/join/simple')
        return
      }
      
      setParticipant(participant)
      
      // Intentar usar datos guardados por la página de join
      const p = sessionStorage.getItem(`session_${sessionCode}_presentation`)
      if (p) {
        try { setPresentation(JSON.parse(p)) } catch {}
      }
      const sSlide = sessionStorage.getItem(`session_${sessionCode}_currentSlide`)
      if (sSlide) {
        try { setServerSlide(JSON.parse(sSlide)) } catch {}
      }
    } catch (error) {
      console.error('Error loading session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendReaction = (emoji: string) => {
    toast.success(`Reacción enviada: ${emoji}`)
    // Aquí se enviaría la reacción en tiempo real
  }

  const submitResponse = (value: any) => {
    if (answersLocked) {
      toast.error('Las respuestas están bloqueadas')
      return
    }
    setResponse(value)
    setHasResponded(true)
    toast.success('¡Respuesta enviada!')
    
    // Guardar respuesta en localStorage (simulado)
    const responses = JSON.parse(localStorage.getItem(`session_${sessionCode}_responses`) || '{}')
    responses[participant.id] = {
      slideIndex: currentSlideIndex,
      value: value,
      timestamp: new Date()
    }
    localStorage.setItem(`session_${sessionCode}_responses`, JSON.stringify(responses))

    // Emitir al servidor si es multiple-choice "simulada"
    if (serverSlide?.type === 'trivia' && typeof value === 'number') {
      // value es índice 0..n-1
      const slideId = serverSlide.id
      try {
        const { socket } = useSocket()
        if (socket) {
          socket.emit('answer:submit', { slideId, slideIndex: currentSlideIndex, participantId: participant.id, answer: value })
        }
      } catch {}
    }
  }

  const submitServerTrivia = () => {
    if (!serverSlide || serverSlide.type !== 'trivia') return
    if (!selectedOptionId) return
    const idx = (serverSlide.options || []).findIndex(o => o.id === selectedOptionId)
    if (idx < 0) return
    if (answersLocked) {
      toast.error('Las respuestas están bloqueadas')
      return
    }
    setHasResponded(true)
    try {
      const { socket } = useSocket()
      if (socket) {
        socket.emit('answer:submit', { slideId: serverSlide.id, slideIndex: currentSlideIndex, participantId: participant?.id, answer: idx })
      }
      toast.success('¡Respuesta enviada!')
    } catch {}
  }

  const submitServerWordCloud = (text: string) => {
    if (!serverSlide || serverSlide.type !== 'word-cloud') return
    if (!text.trim()) return
    if (answersLocked) {
      toast.error('Las respuestas están bloqueadas')
      return
    }
    setHasResponded(true)
    try {
      const { socket } = useSocket()
      if (socket) {
        socket.emit('submit-word-cloud', { sessionCode, slideId: serverSlide.id, words: [text.trim()] })
      }
      toast.success('¡Respuesta enviada!')
    } catch {}
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  const currentContent = presentation?.contents?.[currentSlideIndex]

  const renderContent = () => {
    if (!currentContent && !serverSlide) {
      return (
        <div className="text-center text-white/60">
          <Users className="h-24 w-24 mx-auto mb-4 opacity-50" />
          <p className="text-xl">Esperando al presentador...</p>
        </div>
      )
    }

    // Render basado en slide del servidor si existe
    if (serverSlide) {
      if (serverSlide.type === 'trivia') {
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">{serverSlide.question}</h2>
            <div className="space-y-3">
              {(serverSlide.options || []).map((opt) => (
                <Button
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  disabled={hasResponded || answersLocked}
                  variant={selectedOptionId === opt.id ? 'default' : 'outline'}
                  className="w-full h-14 text-lg justify-start"
                >
                  {opt.text}
                </Button>
              ))}
            </div>
            {!hasResponded && (
              <Button onClick={submitServerTrivia} disabled={!selectedOptionId || answersLocked} className="w-full" size="lg">Enviar</Button>
            )}
          </div>
        )
      }
      if (serverSlide.type === 'word-cloud') {
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">{serverSlide.prompt || 'Comparte una palabra'}</h2>
            <Input
              placeholder="Escribe aquí..."
              className="text-lg h-14"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  submitServerWordCloud(e.currentTarget.value.trim())
                }
              }}
              disabled={hasResponded || answersLocked}
            />
            <Button 
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement | null
                if (input?.value.trim()) {
                  submitServerWordCloud(input.value.trim())
                }
              }}
              disabled={hasResponded || answersLocked}
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Enviar
            </Button>
          </div>
        )
      }
    }

    if (currentContent.type === 'game') {
      return (
        <div className="text-center space-y-6">
          <Gamepad2 className="h-24 w-24 mx-auto text-cyan-300" />
          <h2 className="text-3xl font-bold">{currentContent.title}</h2>
          <Badge className="px-4 py-2 text-lg bg-cyan-500/20 text-cyan-200 border-cyan-300/30">
            Juego Interactivo
          </Badge>
          <p className="text-white/80">El presentador iniciará el juego pronto</p>
        </div>
      )
    }

    // Slides interactivos
    switch (currentContent.subtype) {
      case 'multiple-choice':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Elige una opción</h2>
            <div className="grid grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((option) => (
                <Button
                  key={option}
                  onClick={() => submitResponse(option)}
                  disabled={hasResponded || answersLocked}
                  variant={response === option ? 'default' : 'outline'}
                  className="h-24 text-xl font-bold"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'poll':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">¿Qué opinas?</h2>
            <div className="space-y-3">
              {['Muy de acuerdo', 'De acuerdo', 'Neutral', 'En desacuerdo'].map((option, index) => (
                <Button
                  key={index}
                  onClick={() => submitResponse(index)}
                  disabled={hasResponded || answersLocked}
                  variant={response === index ? 'default' : 'outline'}
                  className="w-full h-16 text-lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'word-cloud':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Comparte una palabra</h2>
            <Input
              placeholder="Escribe aquí..."
              className="text-lg h-14"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  submitResponse(e.currentTarget.value.trim())
                }
              }}
              disabled={hasResponded || answersLocked}
            />
            <Button 
              onClick={() => {
                const input = document.querySelector('input')
                if (input?.value.trim()) {
                  submitResponse(input.value.trim())
                }
              }}
              disabled={hasResponded || answersLocked}
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Enviar
            </Button>
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Califica</h2>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  onClick={() => submitResponse(rating)}
                  disabled={hasResponded || answersLocked}
                  variant="ghost"
                  className="p-2"
                >
                  <Star 
                    className={`h-12 w-12 ${
                      response >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'
                    }`}
                  />
                </Button>
              ))}
            </div>
          </div>
        )

      case 'open-text':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Tu opinión</h2>
            <Textarea
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[120px] text-lg"
              disabled={hasResponded || answersLocked}
            />
            <Button 
              onClick={() => {
                const textarea = document.querySelector('textarea')
                if (textarea?.value.trim()) {
                  submitResponse(textarea.value.trim())
                }
              }}
              disabled={hasResponded || answersLocked}
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Enviar respuesta
            </Button>
          </div>
        )

      case 'qa':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Haz una pregunta</h2>
            <Textarea
              placeholder="¿Qué te gustaría preguntar?"
              className="min-h-[100px] text-lg"
              disabled={hasResponded}
            />
            <Button 
              onClick={() => {
                const textarea = document.querySelector('textarea')
                if (textarea?.value.trim()) {
                  submitResponse(textarea.value.trim())
                }
              }}
              disabled={hasResponded}
              className="w-full"
              size="lg"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Enviar pregunta
            </Button>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <FileText className="h-24 w-24 mx-auto mb-4 text-white/60" />
            <h2 className="text-2xl font-bold mb-4">{currentContent.title}</h2>
            <p className="text-white/80">Esperando instrucciones...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white">
      {/* Header */}
      <div className="p-4 bg-black/20 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{presentation?.title || 'Sesión'}</h1>
            <p className="text-sm text-white/80">Código: {sessionCode}</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {participant?.name}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                {answersLocked && !hasResponded && (
                  <div className="mb-4 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-yellow-100" role="status" aria-live="polite">
                    Las respuestas están bloqueadas por el presentador
                  </div>
                )}
                {hasResponded ? (
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle2 className="h-24 w-24 mx-auto text-green-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold">¡Respuesta enviada!</h2>
                    <p className="text-white/80">Espera la siguiente pregunta</p>
                  </div>
                ) : (
                  renderContent()
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Reaction Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <p className="text-sm text-center mb-3 text-white/80">Enviar reacción</p>
              <div className="flex justify-center gap-4">
                {[
                  { emoji: '👏', icon: ThumbsUp },
                  { emoji: '❤️', icon: Heart },
                  { emoji: '😄', icon: Smile },
                  { emoji: '🔥', icon: Zap }
                ].map(({ emoji, icon: Icon }) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="lg"
                    onClick={() => sendReaction(emoji)}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl">{emoji}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}