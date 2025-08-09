'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useSocket } from '@/lib/hooks/useSocket'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Users, Clock, Trophy } from 'lucide-react'
import BarChart from '@/components/ui/BarChart'

export default function ProjectorPage() {
  const params = useParams()
  const search = useSearchParams()
  const sessionCode = params.code as string
  const { socket, isConnected, on } = useSocket()

  const [participantCount, setParticipantCount] = useState(0)
  const [status, setStatus] = useState<'lobby'|'active'|'ended'>('lobby')
  const [slide, setSlide] = useState<any>(null)
  const [slideState, setSlideState] = useState<'show'|'locked'|'reveal'|'lobby'>('lobby')
  const [counts, setCounts] = useState<number[]>([])
  const [total, setTotal] = useState<number>(0)
  const liveBarsOnShow = process.env.NEXT_PUBLIC_LIVE_BARS_ON_SHOW === 'true'
  const [highlighted, setHighlighted] = useState<{ text: string; author?: string } | null>(null)
  const joinUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const base = window.location.origin
    const preferJoin = search.get('joinPath') || '/join/simple'
    return `${base}${preferJoin}?code=${sessionCode}`
  }, [sessionCode, search])

  useEffect(() => {
    if (!socket) return

    // eslint-disable-next-line no-console
    console.info('[Projector] conectado, rooms esperadas', { rooms: [`host-${sessionCode}`, `session-${sessionCode}`] })

    const unsub = [
      on('participant-joined', ({ totalParticipants }) => {
        setParticipantCount(totalParticipants ?? 0)
      }),
      on('session-started', () => setStatus('active')),
      on('session-ended', () => setStatus('ended')),
      on('slide-changed', ({ slide }) => setSlide(slide)),
      on('slide:state', ({ state }) => {
        setSlideState(state)
        if (state === 'show' && status !== 'active') setStatus('active')
      }),
      on('results:update', ({ counts: c, total: t }) => {
        setCounts(Array.isArray(c) ? [...c] : [])
        setTotal(typeof t === 'number' ? t : 0)
      }),
      on('audience:update', ({ totalParticipants }) => {
        if (typeof totalParticipants === 'number') setParticipantCount(totalParticipants)
      }),
      on('qna-highlight', ({ text, author }) => setHighlighted({ text, author })),
      on('qna-clear-highlight', () => setHighlighted(null)),
    ]

    return () => { unsub.forEach(u => u && u()) }
  }, [socket, on])

  const qrSrc = useMemo(() => {
    // Usamos un generador de QR externo para no añadir dependencias
    const size = 280
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(joinUrl)}`
  }, [joinUrl])

  const renderLobby = () => (
    <div className="grid gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Únete con el código</h1>
        <p className="mt-2 text-white/70">Escanea el QR o visita el enlace</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
        <div className="flex flex-col items-center gap-4">
          <img src={qrSrc} alt={`QR para unirse (${sessionCode})`} className="rounded-xl shadow-2xl bg-white" />
          <div className="text-center">
            <div className="text-sm text-white/70">Código</div>
            <div className="text-5xl font-black tracking-widest">{sessionCode}</div>
          </div>
          <a href={joinUrl} target="_blank" rel="noreferrer" className="text-cyan-300 underline break-all max-w-2xl">
            {joinUrl}
          </a>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
          <div className="text-sm text-white/70 mb-2">Vista previa</div>
          <div className="text-white/80">La pregunta y opciones aparecerán aquí cuando inicie.</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <Badge className="bg-white/15 border-white/20"><Users className="h-4 w-4 mr-2" />{participantCount} conectados</Badge>
        <Badge className="bg-white/15 border-white/20"><Clock className="h-4 w-4 mr-2" />Esperando al conductor…</Badge>
      </div>
    </div>
  )

  const renderActive = () => (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">En vivo</h2>
          <p className="text-white/70">Participantes: {participantCount}</p>
        </div>
        <Badge className="bg-green-500 text-white border-green-400/40">Activo</Badge>
      </div>

      {/* Contenido actual (vista simple por ahora) */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-8">
          {!slide && (
            <div className="text-center text-white/70">Esperando contenido…</div>
          )}

          {slide?.type === 'trivia' && (
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">{slide.question}</h3>
              <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                {slide.options?.map((opt: any) => (
                  <div key={opt.id} className="p-4 rounded-lg bg-white/10 border border-white/20">
                    {opt.text}
                  </div>
                ))}
              </div>
              {/* Barras en reveal o en show si flag activa */}
              {(slideState === 'reveal' || (slideState === 'show' && liveBarsOnShow)) && (
                <div className="mt-8">
                  <BarChart
                    labels={(slide.options || []).map((o: any) => o.text)}
                    counts={counts}
                    total={total}
                    reveal={slideState === 'reveal'}
                    correctIndex={(() => {
                      if (slideState !== 'reveal') return undefined
                      if (typeof slide.correctAnswer === 'string') {
                        const idx = (slide.options || []).findIndex((o: any) => o.id === slide.correctAnswer)
                        return idx >= 0 ? idx : undefined
                      }
                      if (typeof slide.correctIndex === 'number') return slide.correctIndex
                      return undefined
                    })()}
                  />
                </div>
              )}
            </div>
          )}

          {slide?.type === 'poll' && (
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">{slide.question}</h3>
              <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                {slide.options?.map((opt: any) => (
                  <div key={opt.id} className="p-4 rounded-lg bg-white/10 border border-white/20">
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide?.type === 'word-cloud' && (
            <div className="text-center text-white/80">Nube de palabras activa…</div>
          )}
        </CardContent>
      </Card>

      {/* Overlay de pregunta destacada */}
      <AnimatePresence>
        {highlighted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50"
            role="region"
            aria-label="Pregunta destacada"
          >
            <div className="rounded-xl border border-white/30 bg-white/15 backdrop-blur px-6 py-4 shadow-xl">
              <p className="text-lg font-semibold">{highlighted.text}</p>
              {highlighted.author && (
                <p className="text-sm text-white/80 mt-1">— {highlighted.author}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const renderEnded = () => (
    <div className="text-center space-y-6">
      <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
      <h2 className="text-3xl font-bold">¡Sesión finalizada!</h2>
      <p className="text-white/70">Gracias por participar</p>
    </div>
  )

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="text-white/80 text-sm">Sesión</div>
              <div className="text-2xl font-bold leading-tight">{sessionCode}</div>
            </div>
          </div>
          <Badge className={isConnected ? 'bg-emerald-500 text-white' : 'bg-white/20'}>
            {isConnected ? 'Conectado' : 'Conectando…'}
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={status + (slide?.id || '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {status === 'lobby' && renderLobby()}
            {status === 'active' && renderActive()}
            {status === 'ended' && renderEnded()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
