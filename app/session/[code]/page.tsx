'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type {
  Session,
  Participant,
} from '@/lib/types'
import type {
  Slide,
  SlideType,
  MultipleChoiceSlide,
  WordCloudSlide,
  PollSlide,
  OpenTextSlide,
  RatingSlide,
  QASlide,
  TitleSlide,
  TriviaSlide
} from '@/lib/types/presentation'
import type { ReactionType, ParticipantResponse } from '@/lib/types/session'
import {
  subscribeToSession,
  subscribeToParticipant,
  sendReaction,
  submitResponse,
  updateParticipantConnection
} from '@/lib/firebase/helpers/sessions'
import { getPresentation } from '@/lib/firebase/helpers/presentations'
import { Unsubscribe, Timestamp } from 'firebase/firestore'
import { Loader2, AlertCircle, Wifi, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSocket } from '@/lib/hooks/useSocket'
import { useParticipantStore } from '@/lib/state/participantStore'

// Import slide components
import MultipleChoiceSlideView from '@/components/slides/MultipleChoiceSlideView'
import WordCloudSlideView from '@/components/slides/WordCloudSlideView'
import PollSlideView from '@/components/slides/PollSlideView'
import OpenTextSlideView from '@/components/slides/OpenTextSlideView'
import RatingSlideView from '@/components/slides/RatingSlideView'
import QASlideView from '@/components/slides/QASlideView'
import TitleSlideView from '@/components/slides/TitleSlideView'
import TriviaSlideView from '@/components/slides/TriviaSlideView'
import ReactionToolbar from '@/components/participant/ReactionToolbar'
import { AnimatePresence, motion } from 'framer-motion'

export default function SessionPage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const { status: connStatus, metrics, rttSamples, stateHistory, socket } = useSocket()

  const [session, setSession] = useState<Session | null>(null)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [, setIsConnected] = useState(true)
  const [hasResponded, setHasResponded] = useState(false)
  const [slides, setSlides] = useState<Slide[]>([])
  const [slideState, setSlideState] = useState<'show'|'locked'|'reveal'|'lobby'>('lobby')
  const markAnswered = useParticipantStore(s => s.markAnswered)
  const isAnswered = useParticipantStore(s => currentSlide ? s.answered[currentSlide.id] : false)
  // S2: panel state
  const [metricsOpen, setMetricsOpen] = useState(false)

  // Get participant info from session storage
  const participantId = typeof window !== 'undefined' ? sessionStorage.getItem('participantId') : null
  const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('sessionId') : null

  useEffect(() => {
    if (!participantId || !sessionId) {
      router.push('/join')
      return
    }

    let sessionUnsubscribe: Unsubscribe | null = null
    let participantUnsubscribe: Unsubscribe | null = null
    let presentationLoaded = false

    const setupSubscriptions = async () => {
      try {
        // Subscribe to session updates
        sessionUnsubscribe = subscribeToSession(sessionId, async (updatedSession) => {
          if (!updatedSession) {
            setError('Session not found')
            setIsLoading(false)
            return
          }

          setSession(updatedSession)
          setIsConnected(true)

          // Load presentation slides if not already loaded
          if (!presentationLoaded && updatedSession.presentationId) {
            try {
              const presentation = await getPresentation(updatedSession.presentationId)
              if (presentation && Array.isArray((presentation as any).slides)) {
                // Cast to any to match local types shape
                setSlides((presentation as any).slides as Slide[])
                presentationLoaded = true
              }
            } catch (err) {
              console.error('Error loading presentation:', err)
            }
          }

          // Update current slide
          if (updatedSession.currentSlideIndex >= 0 && slides.length > 0) {
            const slide = slides[updatedSession.currentSlideIndex]
            setCurrentSlide(slide || null)

            // Check if participant has already responded to this slide
            const participantData = updatedSession.participants[participantId]
            if (participantData && slide) {
              setHasResponded(!!participantData.responses[slide.id])
            }
          }

          setIsLoading(false)
        })

        // Subscribe to participant updates
        participantUnsubscribe = subscribeToParticipant(participantId, (updatedParticipant) => {
          if (!updatedParticipant) {
            setError('Participant data not found')
            return
          }
          setParticipant(updatedParticipant)
        })

        // Suscripción a estado y resultados por socket (solo lectura)
        if (socket) {
          const onSlideState = (payload: { slideIndex: number; state: 'show'|'locked'|'reveal' }) => {
            setSlideState(payload.state)
          }
          socket.on('slide:state', onSlideState)

          // Limpieza socket
          return () => {
            socket.off('slide:state', onSlideState)
          }
        }

        // Update connection status periodically
        const pingInterval = setInterval(() => {
          updateParticipantConnection(participantId, 'connected').catch((err) => {
            console.error('Error updating connection:', err)
            setIsConnected(false)
          })
        }, 30000) // Ping every 30 seconds

        // Handle page visibility changes
        const handleVisibilityChange = () => {
          if (document.hidden) {
            updateParticipantConnection(participantId, 'disconnected')
          } else {
            updateParticipantConnection(participantId, 'connected')
          }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Cleanup function
        return () => {
          clearInterval(pingInterval)
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          if (sessionUnsubscribe) sessionUnsubscribe()
          if (participantUnsubscribe) participantUnsubscribe()
          updateParticipantConnection(participantId, 'disconnected')
        }
      } catch (err) {
        console.error('Error setting up subscriptions:', err)
        setError('Failed to connect to session')
        setIsLoading(false)
      }
    }

    const cleanup = setupSubscriptions()

    return () => {
      cleanup.then((cleanupFn) => {
        if (cleanupFn) cleanupFn()
      })
    }
  }, [participantId, sessionId, router, slides])

  // Reset answered al cambiar de pregunta (slide-changed)
  useEffect(() => {
    if (!socket) return
    const onSlideChanged = ({ slide }: { slide: Slide }) => {
      if (slide?.id) {
        useParticipantStore.getState().resetForSlide(slide.id)
        setHasResponded(false)
      }
    }
    socket.on('slide-changed', onSlideChanged)
    return () => {
      socket.off('slide-changed', onSlideChanged)
    }
  }, [socket])

  const handleSendReaction = useCallback(async (type: ReactionType) => {
    if (!participantId || !currentSlide) return

    try {
      await sendReaction(participantId, {
        type,
        timestamp: Timestamp.now(),
        slideId: currentSlide.id
      })
    } catch (err) {
      console.error('Error sending reaction:', err)
    }
  }, [participantId, currentSlide])

  const handleSubmitResponse = useCallback(async (response: Omit<ParticipantResponse, 'participantId' | 'slideId' | 'timestamp'>) => {
    if (!participantId || !currentSlide || !sessionId || hasResponded || isAnswered) return

    try {
      const fullResponse: ParticipantResponse = {
        ...response,
        participantId,
        slideId: currentSlide.id,
        timestamp: Timestamp.now()
      } as ParticipantResponse

      await submitResponse(sessionId, participantId, fullResponse)
      setHasResponded(true)
      markAnswered(currentSlide.id)

      // Envío por socket para tally en tiempo real (multiple-choice/trivia)
      if (socket && (currentSlide.type === 'multiple_choice' || currentSlide.type === 'trivia')) {
        const mc = currentSlide as unknown as MultipleChoiceSlide
        const selected = (fullResponse as any).selectedOptions as string[] | undefined
        if (Array.isArray(selected) && selected.length === 1) {
          const idx = mc.options.findIndex((o: any) => o.id === selected[0])
          if (idx >= 0) {
            socket.emit('answer:submit', {
              slideId: currentSlide.id,
              slideIndex: session?.currentSlideIndex ?? 0,
              participantId,
              answer: idx,
            })
          }
        }
      }
    } catch (err) {
      console.error('Error submitting response:', err)
      setError('Failed to submit response. Please try again.')
    }
  }, [participantId, currentSlide, sessionId, hasResponded, isAnswered, socket, session, markAnswered])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Conectando a la sesión…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error de conexión</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.push('/join')} variant="outline">
              Volver a Unirse
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!session || !participant) {
    return null
  }

  const renderSlide = () => {
    if (!currentSlide) {
      return (
        <Card className="p-8 text-center" role="status" aria-live="polite">
          <h2 className="text-2xl font-semibold mb-4">Esperando al presentador</h2>
          <p className="text-muted-foreground">La presentación comenzará en breve…</p>
        </Card>
      )
    }

    const slideProps = {
      slide: currentSlide,
      onSubmit: handleSubmitResponse,
      hasResponded: hasResponded || isAnswered || (slideState !== 'show'),
      isParticipant: true
    }

    switch (currentSlide.type) {
      case 'multiple_choice':
        return <MultipleChoiceSlideView {...slideProps} slide={currentSlide as MultipleChoiceSlide} />
      case 'word_cloud':
        return <WordCloudSlideView {...slideProps} slide={currentSlide as WordCloudSlide} />
      case 'poll':
        return <PollSlideView {...slideProps} slide={currentSlide as PollSlide} />
      case 'open_text':
        return <OpenTextSlideView {...slideProps} slide={currentSlide as OpenTextSlide} />
      case 'rating':
        return <RatingSlideView {...slideProps} slide={currentSlide as RatingSlide} />
      case 'qa':
        return <QASlideView {...slideProps} slide={currentSlide as QASlide} />
      case 'title':
        return <TitleSlideView slide={currentSlide as TitleSlide} />
      case 'trivia':
        return <TriviaSlideView {...slideProps} slide={currentSlide as TriviaSlide} />
      default:
        return (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Unsupported slide type</p>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">Session {code}</h1>
              {/* Anchor S1: Metrics Badge -> toggles S2 */}
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={metricsOpen}
                aria-controls="metrics-panel"
                onClick={() => setMetricsOpen((v) => !v)}
                className="inline-flex items-center gap-2 text-xs rounded-md px-2 py-1 bg-muted hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Wifi className={`h-3.5 w-3.5 ${connStatus === 'online' ? 'text-primary' : connStatus === 'connecting' ? 'text-yellow-600 dark:text-yellow-400' : 'text-destructive'}`} />
                <span className="text-muted-foreground">
                  {connStatus === 'online' ? 'Conectado' : connStatus === 'connecting' ? 'Conectando…' : 'Desconectado'}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Activity className="h-3 w-3 opacity-70" />
                  {metrics.rttMs != null ? `${metrics.rttMs}ms` : '—'}
                </span>
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.clear()
                router.push('/join')
              }}
            >
              Salir
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide ? currentSlide.id : 'waiting'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* S2: Metrics Panel */}
      {metricsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          id="metrics-panel"
          className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMetricsOpen(false)
          }}
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-background/60"
            aria-hidden="true"
            onClick={() => setMetricsOpen(false)}
          />
          {/* panel */}
          <div className="relative w-full max-w-md bg-background border shadow-sm rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi className={`h-4 w-4 ${connStatus === 'online' ? 'text-primary' : connStatus === 'connecting' ? 'text-yellow-600 dark:text-yellow-400' : 'text-destructive'}`} />
                <h2 className="text-sm font-semibold">Connection Metrics</h2>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setMetricsOpen(false)}>
                Close
              </Button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Current</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-md border p-2">
                    <div className="text-[10px] text-muted-foreground">Status</div>
                    <div className="font-medium">{connStatus}</div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-[10px] text-muted-foreground">RTT</div>
                    <div className="font-medium">{metrics.rttMs != null ? `${metrics.rttMs} ms` : '—'}</div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-[10px] text-muted-foreground">Failures</div>
                    <div className="font-medium">{metrics.failures}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Recent RTT (last 10)</div>
                <div className="flex flex-wrap gap-1">
                  {(rttSamples && rttSamples.length > 0 ? rttSamples : []).slice(-10).map((v, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs">{v}ms</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">State changes (last 10)</div>
                <ul className="space-y-1 max-h-40 overflow-auto pr-1">
                  {(stateHistory && stateHistory.length > 0 ? stateHistory : []).slice(-10).map((s, i) => (
                    <li key={i} className="text-xs flex items-center gap-2">
                      <span className="inline-block w-20 font-mono text-muted-foreground">{new Date(s.at).toLocaleTimeString()}</span>
                      <span className="font-medium">{s.state}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reaction toolbar */}
      <ReactionToolbar onSendReaction={handleSendReaction} />
    </div>
  )
}