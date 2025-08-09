'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@/lib/design-system/components'
import { 
  Play, Pause, StopCircle, SkipForward, SkipBack,
  Users, Clock, Activity, Trophy, MessageSquare,
  Settings, Share2, BarChart3, QrCode
} from 'lucide-react'
import { useGameSession } from '@/lib/hooks/useSocket'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

interface SessionControlProps {
  sessionCode: string
  presentationId: string
  className?: string
}

export default function SessionControl({ 
  sessionCode, 
  presentationId,
  className = '' 
}: SessionControlProps) {
  const { 
    isConnected, 
    sessionData, 
    isHost,
    createSession,
    nextSlide,
    previousSlide,
    socket
  } = useGameSession(sessionCode)

  const [sessionStatus, setSessionStatus] = useState<'waiting' | 'active' | 'paused' | 'ended'>('waiting')
  const [participants, setParticipants] = useState<any[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isAnswersLocked, setIsAnswersLocked] = useState(false)
  const [questionState, setQuestionState] = useState<'show'|'locked'|'reveal'>('show')
  const [timerSeconds, setTimerSeconds] = useState<number>(30)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null)
  const [answeredTotal, setAnsweredTotal] = useState<number>(0)
  const [connectedCount, setConnectedCount] = useState<number>(0)

  // Initialize session
  useEffect(() => {
    if (isConnected && !sessionData && isHost) {
      createSession(presentationId).catch(err => {
        toast.error('Error al crear sesión: ' + err.message)
      })
    }
  }, [isConnected, sessionData, isHost, presentationId, createSession])

  // Listen to session events
  useEffect(() => {
    if (!socket) return

    const unsubscribers: Array<() => void> = []

    socket.on('participant-joined', ({ participant, totalParticipants }) => {
        setParticipants(prev => [...prev, participant])
        toast.success(`${participant.name} se unió`, {
          duration: 2000,
        })
        if (typeof totalParticipants === 'number') setConnectedCount(totalParticipants)
      unsubscribers.push(() => socket.off('participant-joined'))
    })

      socket.on('participant-left', ({ participantName, activeParticipants, totalParticipants }) => {
        setParticipants(prev => prev.filter(p => p.name !== participantName))
        toast.info(`${participantName} salió`, {
          duration: 2000,
        })
        if (typeof totalParticipants === 'number') setConnectedCount(totalParticipants)
        unsubscribers.push(() => socket.off('participant-left'))
      })

      socket.on('answer-received', ({ participantName, isCorrect, leaderboard: newLeaderboard }) => {
        if (isCorrect) {
          toast.success(`${participantName} respondió correctamente! 🎉`, {
            duration: 2000,
          })
        }
        setLeaderboard(newLeaderboard || [])
        unsubscribers.push(() => socket.off('answer-received'))
      })

      socket.on('reaction-received', ({ emoji, participantName }) => {
        // Trigger reaction display
        if ((window as any).addReaction) {
          (window as any).addReaction(emoji, participantName)
        }
        unsubscribers.push(() => socket.off('reaction-received'))
      })

      socket.on('slide-changed', ({ slideIndex }) => {
        setCurrentSlideIndex(slideIndex)
        setAnsweredTotal(0)
        unsubscribers.push(() => socket.off('slide-changed'))
      })

      socket.on('slide:state', ({ state }) => {
        setQuestionState(state)
        setIsAnswersLocked(state === 'locked')
        unsubscribers.push(() => socket.off('slide:state'))
      })

      socket.on('audience:update', ({ totalParticipants }) => {
        if (typeof totalParticipants === 'number') setConnectedCount(totalParticipants)
        unsubscribers.push(() => socket.off('audience:update'))
      })

      socket.on('results:update', ({ total }) => {
        if (typeof total === 'number') setAnsweredTotal(total)
        unsubscribers.push(() => socket.off('results:update'))
      })

      socket.on('session-started', () => {
        setSessionStatus('active')
        toast.success('¡Sesión iniciada!', {
          icon: '🚀',
          duration: 3000,
        })
        unsubscribers.push(() => socket.off('session-started'))
      })

      socket.on('session-ended', ({ leaderboard: finalLeaderboard }) => {
        setSessionStatus('ended')
        setLeaderboard(finalLeaderboard)
        
        // Celebration
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.4 }
        })
        
        toast.success('¡Sesión finalizada!', {
          icon: '🏆',
          duration: 5000,
        })
        unsubscribers.push(() => socket.off('session-ended'))
      })

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [socket])

  // Timer
  useEffect(() => {
    if (sessionStatus === 'active') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [sessionStatus])

  // Countdown del slide
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null
        const next = prev - 1
        if (next <= 0) {
          clearInterval(interval)
          setTimerId(null)
          try {
            socket?.emit('time-up', { sessionCode, slideIndex: currentSlideIndex })
          } catch (error) {
            console.error('[SessionControl] Error al emitir time-up', error)
          }
          toast.info('Tiempo agotado')
          return 0
        }
        return next
      })
    }, 1000)
    setTimerId(interval)
    return () => clearInterval(interval)
  }, [timeLeft, socket, sessionCode, currentSlideIndex])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartSession = () => {
    if (!socket || !isConnected) return
    
    socket.emit('start-session', { sessionCode })
  }

  const handleEndSession = () => {
    if (!socket || !isConnected) return
    
    if (confirm('¿Estás seguro de finalizar la sesión?')) {
      socket.emit('end-session', { sessionCode })
    }
  }

  const handlePauseSession = () => {
    setSessionStatus('paused')
    toast.info('Sesión pausada')
  }

  const handleResumeSession = () => {
    setSessionStatus('active')
    toast.info('Sesión reanudada')
  }

  const handleToggleLockAnswers = () => {
    try {
      if (!socket) return
      if (isAnswersLocked) {
        socket.emit('question:show', { slideIndex: currentSlideIndex })
        setIsAnswersLocked(false)
        setQuestionState('show')
        toast.success('Respuestas habilitadas')
      } else {
        socket.emit('question:lock', { slideIndex: currentSlideIndex })
        setIsAnswersLocked(true)
        setQuestionState('locked')
        toast.info('Respuestas bloqueadas')
      }
    } catch (error) {
      console.error('[SessionControl] Error al alternar bloqueo de respuestas', error)
      toast.error('No se pudo cambiar el estado de respuestas')
    }
  }

  const handleReveal = () => {
    try {
      if (!socket) return
      socket.emit('question:reveal', { slideIndex: currentSlideIndex })
      setQuestionState('reveal')
      toast.info('Respuestas reveladas')
    } catch (error) {
      console.error('[SessionControl] Error al revelar', error)
    }
  }

  const handleStartCountdown = () => {
    if (timeLeft && timeLeft > 0) return
    setTimeLeft(Math.max(1, Math.floor(timerSeconds)))
    toast.info('Temporizador iniciado')
  }

  const handleResetCountdown = () => {
    if (timerId) clearInterval(timerId)
    setTimerId(null)
    setTimeLeft(null)
    toast.info('Temporizador reiniciado')
  }

  if (!isHost) {
    return (
      <Card variant="elevated" className={className}>
        <div className="p-6 text-center">
          <Badge variant="default" size="lg" className="mb-4">
            Código: {sessionCode}
          </Badge>
          <p className="text-gray-400">Vista de participante</p>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="elevated" className={`${className}`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-3" aria-live="polite">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl" aria-label={`Estado: ${questionState}`}>
              Estado: <span className="ml-1 font-semibold">{questionState}</span>
            </Badge>
            <Badge className="rounded-xl" aria-label={`Participantes conectados: ${connectedCount}`}>
              Conectados: <span className="ml-1 tabular-nums">{connectedCount}</span>
            </Badge>
            <Badge className="rounded-xl" aria-label={`Han respondido: ${answeredTotal}`}>
              Han respondido: <span className="ml-1 tabular-nums">{answeredTotal}</span>
            </Badge>
          </div>
          <div className="text-sm text-gray-300">Slide #{currentSlideIndex + 1}</div>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-1">
              Control de Sesión
            </h3>
            <Badge variant="primary" size="lg">
              Código: {sessionCode}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<QrCode className="h-4 w-4" />}
              aria-label="Abrir proyector en nueva ventana"
              onClick={() => {
                const url = `${window.location.origin}/session/${sessionCode}/projector`
                window.open(url, '_blank', 'noopener,noreferrer')
              }}
            >
              Abrir Proyector
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<MessageSquare className="h-4 w-4" />}
              aria-label="Abrir panel de moderación"
              onClick={() => {
                const url = `${window.location.origin}/presenter/session/${sessionCode}/moderation`
                window.open(url, '_blank', 'noopener,noreferrer')
              }}
            >
              Moderación
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Share2 className="h-4 w-4" />}
              aria-label="Copiar enlace de acceso para participantes"
              onClick={() => {
                const joinUrl = `${window.location.origin}/join/simple?code=${sessionCode}`
                navigator.clipboard.writeText(joinUrl)
                toast.success('Link de acceso copiado')
              }}
            >
              Copiar Link
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Settings className="h-4 w-4" />}
              aria-label="Abrir configuración"
            >
              Configurar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="bg-gray-800/50 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Participantes</span>
            </div>
            <p className="text-2xl font-bold text-gray-100">{participants.length}</p>
          </motion.div>

          <motion.div 
            className="bg-gray-800/50 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Tiempo</span>
            </div>
            <p className="text-2xl font-bold text-gray-100">{formatTime(elapsedTime)}</p>
          </motion.div>

          <motion.div 
            className="bg-gray-800/50 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">Diapositiva</span>
            </div>
            <p className="text-2xl font-bold text-gray-100">
              {currentSlideIndex + 1}/{sessionData?.presentation?.slides?.length || '?'}
            </p>
          </motion.div>
        </div>

        {/* Herramientas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="region" aria-label="Herramientas de control">
          <motion.div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between" whileHover={{ scale: 1.01 }}>
            <div>
              <div className="text-sm text-gray-400">Estado de respuestas</div>
              <div className="text-lg font-semibold text-gray-100">{isAnswersLocked ? 'Bloqueadas' : 'Habilitadas'}</div>
            </div>
            <Button
              size="sm"
              variant={isAnswersLocked ? 'success' : 'secondary'}
              onClick={handleToggleLockAnswers}
              aria-pressed={isAnswersLocked}
              aria-label={isAnswersLocked ? 'Habilitar respuestas' : 'Bloquear respuestas'}
            >
              {isAnswersLocked ? 'Habilitar' : 'Bloquear'}
            </Button>
          </motion.div>

          <motion.div className="bg-gray-800/50 rounded-lg p-4" whileHover={{ scale: 1.01 }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm text-gray-400">Temporizador</div>
                <div className="text-lg font-semibold text-gray-100">{timeLeft !== null ? formatTime(timeLeft) : `${timerSeconds}s`}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Number(e.target.value))}
                  className="w-24 bg-gray-900/60 border border-gray-700 rounded px-2 py-1 text-gray-100"
                  aria-label="Segundos del temporizador"
                />
                <Button size="sm" variant="primary" onClick={handleStartCountdown} aria-label="Iniciar temporizador">Iniciar</Button>
                <Button size="sm" variant="ghost" onClick={handleResetCountdown} aria-label="Reiniciar temporizador">Reiniciar</Button>
              </div>
            </div>
            <div className="h-1 bg-gray-700 rounded">
              {timeLeft !== null && (
                <div
                  className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded"
                  style={{ width: `${Math.max(0, Math.min(100, (timeLeft / Math.max(1, timerSeconds)) * 100))}%` }}
                  aria-hidden
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            size="lg"
            variant="ghost"
            leftIcon={<SkipBack className="h-5 w-5" />}
            onClick={previousSlide}
            disabled={currentSlideIndex === 0 || sessionStatus !== 'active'}
            aria-label="Ir a la diapositiva anterior"
          >
            Anterior
          </Button>

          {sessionStatus === 'waiting' && (
            <Button
              size="lg"
              variant="success"
              leftIcon={<Play className="h-5 w-5" />}
              onClick={handleStartSession}
              className="px-8"
              aria-label="Iniciar sesión en vivo"
            >
              Iniciar Sesión
            </Button>
          )}

          {sessionStatus === 'active' && (
            <>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Pause className="h-5 w-5" />}
                onClick={handlePauseSession}
                aria-label="Pausar sesión"
              >
                Pausar
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={handleReveal}
                aria-label="Revelar resultados"
                disabled={questionState !== 'locked'}
              >
                Revelar
              </Button>
              <Button
                size="lg"
                variant="danger"
                leftIcon={<StopCircle className="h-5 w-5" />}
                onClick={handleEndSession}
                aria-label="Finalizar sesión"
              >
                Finalizar
              </Button>
            </>
          )}

          {sessionStatus === 'paused' && (
            <Button
              size="lg"
              variant="success"
              leftIcon={<Play className="h-5 w-5" />}
              onClick={handleResumeSession}
              className="px-8"
              aria-label="Reanudar sesión"
            >
              Reanudar
            </Button>
          )}

          <Button
            size="lg"
            variant="ghost"
            leftIcon={<SkipForward className="h-5 w-5" />}
            onClick={() => {
              if (!socket) return
              socket.emit('question:next', { nextIndex: currentSlideIndex + 1 })
            }}
            disabled={
              !sessionData?.presentation?.slides || 
              currentSlideIndex >= sessionData.presentation.slides.length - 1 || 
              sessionStatus !== 'active' || questionState !== 'reveal'
            }
            aria-label="Ir a la diapositiva siguiente"
          >
            Siguiente
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-700">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Trophy className="h-4 w-4" />}
            onClick={() => {
              // Show leaderboard
              toast.info('Mostrando tabla de posiciones')
            }}
            aria-label="Mostrar tabla de posiciones"
          >
            Tabla
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={() => {
              // Toggle chat
              toast.info('Chat próximamente')
            }}
            aria-label="Abrir chat"
          >
            Chat
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<BarChart3 className="h-4 w-4" />}
            onClick={() => {
              // Show analytics
              toast.info('Analíticas próximamente')
            }}
            aria-label="Mostrar estadísticas"
          >
            Estadísticas
          </Button>
        </div>
      </div>
    </Card>
  )
}