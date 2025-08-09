"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { createPresentation, addSlide } from "@/lib/firebase/helpers/presentations"
import { SlideType } from "@/lib/types/presentation"
import { useGameSession } from "@/lib/hooks/useSocket"

export default function NewQuizPage() {
  const router = useRouter()
  const search = useSearchParams()
  const { user } = useAuth()
  const { createSession } = useGameSession()

  const [question, setQuestion] = useState<string>("¿Cuál es la opción correcta?")
  const [options, setOptions] = useState<string[]>(["A", "B", "C", "D"])
  const [time, setTime] = useState<number>(20)
  const disabled = useMemo(() => options.some(o => o.trim().length === 0) || question.trim().length === 0, [options, question])

  const handleOptionChange = useCallback((idx: number, value: string) => {
    setOptions(prev => prev.map((o, i) => (i === idx ? value : o)))
  }, [])

  const handlePresentNow = useCallback(async () => {
    try {
      if (!user?.uid) {
        alert("Inicia sesión para continuar")
        return
      }
      const presentationId = await createPresentation(user.uid, "Quiz rápido", "Creado desde asistente rápido")
      await addSlide(presentationId, {
        type: SlideType.TRIVIA,
        title: "Pregunta 1",
        question,
        options: options.map((t, i) => ({ id: String(i), text: t })),
        correctAnswer: "0",
        points: 100,
        difficulty: "easy",
        timeLimit: time,
        order: 0,
        id: "temp"
      } as any)

      const data: unknown = await createSession(presentationId)
      const code = (data as { session?: { code?: string } })?.session?.code
      if (!code) throw new Error("No se pudo obtener el código de sesión")
      const projectorUrl = `${window.location.origin}/session/${code}/projector`
      window.open(projectorUrl, "_blank", "noopener,noreferrer")
      router.replace(`/presenter/session/${code}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Service] Error Presentar ahora', error)
      alert("No se pudo presentar. Intenta nuevamente.")
    }
  }, [user?.uid, question, options, time, createSession, router])

  const handleSaveDraft = useCallback(async () => {
    try {
      if (!user?.uid) {
        alert("Inicia sesión para continuar")
        return
      }
      const presentationId = await createPresentation(user.uid, "Quiz rápido (borrador)")
      await addSlide(presentationId, {
        type: SlideType.TRIVIA,
        title: "Pregunta 1",
        question,
        options: options.map((t, i) => ({ id: String(i), text: t })),
        correctAnswer: "0",
        points: 100,
        difficulty: "easy",
        timeLimit: time,
        order: 0,
        id: "temp"
      } as any)
      router.replace(`/presenter/edit/${presentationId}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Service] Error guardando borrador', error)
      alert("No se pudo guardar. Intenta nuevamente.")
    }
  }, [user?.uid, question, options, time, router])

  useEffect(() => {
    const type = search.get('type')
    if (type && type !== 'quiz') {
      // eslint-disable-next-line no-console
      console.error('[NewQuiz] tipo no soportado:', type)
    }
  }, [search])

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Quiz rápido (1 pregunta)</CardTitle>
            <CardDescription>Completa los campos y presenta en un clic</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="q">Pregunta</Label>
              <Input id="q" aria-label="Pregunta" value={question} onChange={(e) => setQuestion(e.target.value)} className="rounded-xl" placeholder="Escribe la pregunta" />
            </div>
            <div className="grid gap-2">
              <Label>Opciones</Label>
              {options.map((opt, i) => (
                <Input key={i} aria-label={`Opción ${i + 1}`} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="rounded-xl" placeholder={`Opción ${i + 1}`} />
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="t">Tiempo</Label>
              <select id="t" aria-label="Tiempo por pregunta" className="h-11 rounded-xl border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={time} onChange={(e) => setTime(Number(e.target.value))}>
                <option value={10}>10 segundos</option>
                <option value={20}>20 segundos</option>
                <option value={30}>30 segundos</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handlePresentNow} aria-label="Presentar ahora" disabled={disabled} className="rounded-xl">Presentar ahora</Button>
              <Button variant="outline" onClick={handleSaveDraft} aria-label="Guardar como borrador" className="rounded-xl">Guardar como borrador</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}