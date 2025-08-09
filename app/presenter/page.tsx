"use client"

import { useCallback, useMemo, useState } from 'react'
import PresenterHub from '@/components/presenter/PresenterHub'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { createQuickQuiz } from '@/lib/actions/createQuickQuiz'
import { useGameSession } from '@/lib/hooks/useSocket'

export default function PresenterPage() {
  const { user } = useAuth()
  const { createSession } = useGameSession()
  const [question, setQuestion] = useState<string>('¿Cuál es la opción correcta?')
  const [options, setOptions] = useState<string[]>(['A', 'B', 'C', 'D'])
  const [time, setTime] = useState<number>(20)
  const [submitting, setSubmitting] = useState(false)
  const disabled = useMemo(() => submitting || options.some(o => o.trim().length === 0) || question.trim().length === 0, [submitting, options, question])

  const handleOptionChange = useCallback((idx: number, value: string) => {
    setOptions(prev => prev.map((o, i) => (i === idx ? value : o)))
  }, [])

  const handlePresentNow = useCallback(async () => {
    try {
      if (!user?.uid) {
        alert('Inicia sesión para continuar')
        return
      }
      setSubmitting(true)
      const presentationId = await createQuickQuiz({
        userId: user.uid,
        question,
        options,
        time,
      })
      const data: unknown = await createSession(presentationId)
      const code = (data as { session?: { code?: string } })?.session?.code
      if (!code) throw new Error('No se pudo obtener el código de sesión')
      // eslint-disable-next-line no-console
      console.info('[PresenterPage] session created', { code })
      const projectorUrl = `${window.location.origin}/session/${code}/projector`
      window.open(projectorUrl, '_blank', 'noopener,noreferrer')
      window.location.href = `/presenter/session/${code}`
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[PresenterPage] Error Presentar ahora', error)
      alert('No se pudo presentar. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }, [user?.uid, question, options, time, createSession])

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Crear Quiz rápido (1 pregunta)</CardTitle>
          <CardDescription>El primer paso siempre a la vista</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="pq">Pregunta</Label>
              <Input id="pq" aria-label="Pregunta" value={question} onChange={(e) => setQuestion(e.target.value)} className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label>Opciones</Label>
              {options.map((opt, i) => (
                <Input key={i} aria-label={`Opción ${i + 1}`} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="rounded-xl" />
              ))}
            </div>
            <div className="grid gap-2 max-w-xs">
              <Label htmlFor="pt">Tiempo</Label>
              <select id="pt" aria-label="Tiempo por pregunta" className="h-11 rounded-xl border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={time} onChange={(e) => setTime(Number(e.target.value))}>
                <option value={10}>10 segundos</option>
                <option value={20}>20 segundos</option>
                <option value={30}>30 segundos</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handlePresentNow} aria-label="Presentar ahora" disabled={disabled} className="rounded-xl">Presentar ahora</Button>
              <Button asChild variant="outline" className="rounded-xl" aria-label="Abrir asistente completo">
                <a href="/presenter/new?type=quiz">Asistente completo</a>
              </Button>
            </div>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground">
            Empieza más rápido: completamos valores por defecto y puedes presentar en 1 clic.
          </div>
        </CardContent>
      </Card>

      <PresenterHub />
    </div>
  )
}