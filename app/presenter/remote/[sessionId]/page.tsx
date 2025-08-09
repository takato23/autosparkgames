'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  Wifi,
  WifiOff
} from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Session } from '@/lib/types/session'
import { Presentation } from '@/lib/types/presentation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SlideResultsPanel from '@/components/presenter/SlideResultsPanel'

export default function PresenterRemotePage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  
  const [session, setSession] = useState<Session | null>(null)
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [showResults, setShowResults] = useState(true)
  const [votingLocked, setVotingLocked] = useState(false)
  
  // Subscribe to session and presentation data
  useEffect(() => {
    if (!sessionId) return
    
    const sessionUnsubscribe = onSnapshot(
      doc(db, 'sessions', sessionId),
      (snapshot) => {
        if (snapshot.exists()) {
          setSession({ id: snapshot.id, ...snapshot.data() } as Session)
          setIsConnected(true)
        }
      },
      (error) => {
        console.error('Connection error:', error)
        setIsConnected(false)
      }
    )
    
    return () => sessionUnsubscribe()
  }, [sessionId])
  
  useEffect(() => {
    if (!session?.presentationId) return
    
    const presentationUnsubscribe = onSnapshot(
      doc(db, 'presentations', session.presentationId),
      (snapshot) => {
        if (snapshot.exists()) {
          setPresentation({ id: snapshot.id, ...snapshot.data() } as Presentation)
        }
      }
    )
    
    return () => presentationUnsubscribe()
  }, [session?.presentationId])
  
  const handlePreviousSlide = async () => {
    if (!session || !presentation || session.currentSlideIndex === 0) return
    
    const newIndex = session.currentSlideIndex - 1
    await updateDoc(doc(db, 'sessions', sessionId), {
      currentSlideIndex: newIndex,
      currentSlideId: presentation.slides[newIndex].id
    })
  }
  
  const handleNextSlide = async () => {
    if (!session || !presentation || session.currentSlideIndex >= presentation.slides.length - 1) return
    
    const newIndex = session.currentSlideIndex + 1
    await updateDoc(doc(db, 'sessions', sessionId), {
      currentSlideIndex: newIndex,
      currentSlideId: presentation.slides[newIndex].id
    })
  }
  
  const toggleVotingLock = async () => {
    const newLockState = !votingLocked
    setVotingLocked(newLockState)
    await updateDoc(doc(db, 'sessions', sessionId), {
      'settings.votingLocked': newLockState
    })
  }
  
  const toggleResults = async () => {
    const newShowState = !showResults
    setShowResults(newShowState)
    await updateDoc(doc(db, 'sessions', sessionId), {
      'settings.showResults': newShowState
    })
  }
  
  if (!session || !presentation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Conectando a la presentación…</p>
          </div>
      </div>
    )
  }
  
  const currentSlide = presentation.slides[session.currentSlideIndex]
  const participantCount = Object.keys(session.participants || {}).length
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Control del presentador</h1>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Conectado</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Desconectado</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Current slide info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Diapositiva actual</p>
                  <h2 className="text-xl font-semibold">{currentSlide.title}</h2>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Diapositiva {session.currentSlideIndex + 1} de {presentation.slides.length}
                  </p>
                  <p className="text-sm font-medium">
                    {participantCount} participantes
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((session.currentSlideIndex + 1) / presentation.slides.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
              <Card className="p-6" role="region" aria-label="Navegación de diapositivas">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePreviousSlide}
                disabled={session.currentSlideIndex === 0}
                className="h-24 text-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    aria-label="Diapositiva anterior"
              >
                <ChevronLeft className="h-8 w-8 mr-2" />
                    Anterior
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleNextSlide}
                disabled={session.currentSlideIndex >= presentation.slides.length - 1}
                className="h-24 text-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    aria-label="Siguiente diapositiva"
              >
                    Siguiente
                <ChevronRight className="h-8 w-8 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {/* Control buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6" role="region" aria-label="Controles rápidos">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Controles rápidos</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={votingLocked ? "destructive" : "outline"}
                size="lg"
                onClick={toggleVotingLock}
                className="h-16 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-pressed={votingLocked}
                aria-label={votingLocked ? 'Votos bloqueados' : 'Votos abiertos'}
              >
                {votingLocked ? (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Votos bloqueados
                  </>
                ) : (
                  <>
                    <Unlock className="h-5 w-5 mr-2" />
                    Votos abiertos
                  </>
                )}
              </Button>
              <Button
                variant={showResults ? "default" : "outline"}
                size="lg"
                onClick={toggleResults}
                className="h-16 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-pressed={showResults}
                aria-label={showResults ? 'Resultados visibles' : 'Resultados ocultos'}
              >
                {showResults ? (
                  <>
                    <Eye className="h-5 w-5 mr-2" />
                    Resultados visibles
                  </>
                ) : (
                  <>
                    <EyeOff className="h-5 w-5 mr-2" />
                    Resultados ocultos
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Resultados por diapositiva */}
        {showResults && currentSlide && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`results-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-6" role="region" aria-label="Resultados por diapositiva">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Resultados de "{currentSlide.title}"</h3>
                <SlideResultsPanel
                  slide={currentSlide as any}
                  responses={session.responses ? session.responses[currentSlide.id] : undefined}
                  participantCount={participantCount}
                />
              </Card>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Resultados en vivo / leaderboard */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="p-6" role="region" aria-label="Resultados en vivo">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Resultados en vivo</h3>
                <span className="text-xs text-muted-foreground">Top 5</span>
              </div>
              <div className="space-y-2">
                {(session.leaderboard ?? []).slice(0, 5).map((entry, idx) => (
                  <motion.div
                    key={`${entry.participantId ?? entry.teamId ?? idx}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-md border p-3"
                    aria-label={`Posición ${idx + 1}: ${entry.name}, ${entry.score} puntos`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.score} pts
                    </div>
                  </motion.div>
                ))}
                {(!session.leaderboard || session.leaderboard.length === 0) && (
                  <p className="text-sm text-muted-foreground">Aún no hay resultados para mostrar.</p>
                )}
              </div>
            </Card>
          </motion.div>
        )}
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground pt-4"
        >
          <p>Código de sesión: <span className="font-mono font-bold">{session.code}</span></p>
        </motion.div>
      </div>
    </div>
  )
}