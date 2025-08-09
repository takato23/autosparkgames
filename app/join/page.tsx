'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, AlertCircle, Zap } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}> 
      <JoinPageContent />
    </Suspense>
  )
}

function JoinPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoJoin, setAutoJoin] = useState(false)

  // Auto-detect code from URL and auto-join if valid
  useEffect(() => {
    const urlCode = searchParams.get('code')
    if (urlCode && urlCode.length === 6) {
      setCode(urlCode)
      setAutoJoin(true)
      // Auto-join after a short delay
      setTimeout(() => {
        handleCodeSubmit(urlCode)
      }, 1000)
    }
  }, [searchParams])

  const handleCodeSubmit = async (sessionCode: string) => {
    if (sessionCode.length !== 6) {
      setError('Por favor ingresa un código de 6 dígitos')
      toast.error('Código inválido. Debe tener 6 dígitos.')
      return
    }

    setIsLoading(true)
    setError('')
    // eslint-disable-next-line no-console
    console.info('[Join] código ingresado, redirigiendo a flujo simple', { code: sessionCode })
    // Redirigir al flujo funcional que pide nombre y ejecuta join-session
    router.push(`/join/simple?code=${sessionCode}`)
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/10 blur-3xl animate-blob animation-delay-2000" />
      </div>
      <div className="relative z-0 mx-auto w-full max-w-md px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <span className="text-4xl" aria-hidden>🎮</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">AutoSpark</h1>
          <p className="text-foreground/70 text-base">Únete a la experiencia interactiva</p>
        </div>

        <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl" aria-labelledby="join-title" aria-describedby="join-description" role="region">
          <CardHeader className="text-center pb-2">
            <CardTitle id="join-title" className="text-xl font-semibold">Ingresa el código del juego</CardTitle>
            <CardDescription id="join-description">
              El presentador mostrará el código en pantalla
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-join indicator */}
            {autoJoin && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="h-4 w-4" aria-hidden />
                  <span className="text-sm font-medium">Uniéndose automáticamente...</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Código de sesión</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setCode(value)
                    setError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && code.length === 6) {
                      handleCodeSubmit(code)
                    }
                  }}
                  className="text-center text-3xl tracking-[0.5em] font-bold h-20 rounded-xl"
                  maxLength={6}
                  disabled={isLoading || autoJoin}
                  inputMode="numeric"
                  aria-label="Código de sesión"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'code-error' : undefined}
                  autoComplete="off"
                />
              </div>
              <Button
                onClick={() => handleCodeSubmit(code)}
                disabled={code.length !== 6 || isLoading || autoJoin}
                className="w-full h-14 rounded-xl"
                aria-label="Unirse al juego"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : (
                  <>
                    Unirse al Juego
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div id="code-error" className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" aria-hidden />
                <span role="alert">{error}</span>
              </div>
            )}

            {/* Información sobre demo */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Modo Demo</p>
                <p>Prueba con el código <strong>123456</strong> para simular una sesión válida.</p>
                <p className="mt-2 text-xs">Firebase está configurado y listo para usar cuando se resuelvan los problemas de compilación.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-foreground/70 mb-2">
            Ve a <span className="font-semibold">autospark.games</span> en tu dispositivo
          </p>
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-foreground/60">En línea</span>
          </div>
        </div>
      </div>
    </div>
  )
}