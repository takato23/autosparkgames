'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Keyboard, Users, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { useGameSession } from '@/lib/hooks/useSocket'

export default function SimpleJoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}> 
      <SimpleJoinContent />
    </Suspense>
  )
}

function SimpleJoinContent() {
  const router = useRouter()
  const search = useSearchParams()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [step, setStep] = useState<'code' | 'name'>('code')
  const { joinSession, socket } = useGameSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = search.get('code')
    if (q && /^\d{6}$/.test(q)) {
      setCode(q)
      setStep('name')
    }
  }, [search])

  const handleCodeSubmit = () => {
    if (code.length !== 6) {
      toast.error('Código inválido. Debe tener 6 dígitos.')
      return
    }
    setStep('name')
  }

  const handleJoin = async () => {
    if (!name.trim()) {
      toast.error('Por favor ingresa tu nombre')
      return
    }

    setIsJoining(true)
    setError(null)

    // Suscribirse temporalmente a errores del socket durante el intento de unión
    const errorHandler = (payload: any) => {
      const message = payload?.message || 'No se pudo unir a la sesión'
      // eslint-disable-next-line no-console
      console.error('[Join] socket error', payload)
      setError(message)
      toast.error(message)
    }
    try {
      if (socket) {
        socket.on('error', errorHandler)
      }
      // eslint-disable-next-line no-console
      console.info('[Join] intentando unirse', { code, name: name.trim() })
      await joinSession(code, name.trim())
      // eslint-disable-next-line no-console
      console.info('[Join] conectado y suscripto a room', { room: `session-${code}` })
      toast.success('¡Te has unido a la sesión!')
      router.push(`/session/${code}/participant`)
    } catch (e) {
      const msg = (e as { message?: string })?.message || 'No se pudo unir a la sesión'
      // eslint-disable-next-line no-console
      console.error('[Join] join-session error', e)
      setError(msg)
      toast.error(msg)
    } finally {
      if (socket) {
        try { socket.off('error', errorHandler) } catch {}
      }
      setIsJoining(false)
    }
  }

  const handleCodeChange = (value: string) => {
    // Solo permitir números y máximo 6 dígitos
    const cleanValue = value.replace(/\D/g, '').slice(0, 6)
    setCode(cleanValue)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <AnimatedBackground variant="vibrant" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm" role="region" aria-labelledby="join-simple-title" aria-describedby="join-simple-desc">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Users className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle id="join-simple-title" className="text-3xl font-bold">Unirse a Sesión</CardTitle>
            <CardDescription id="join-simple-desc">
              {step === 'code' 
                ? 'Ingresa el código de 6 dígitos' 
                : '¿Cómo te llamas?'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'code' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">Código de sesión</Label>
                  <div className="relative">
                    <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="pl-10 text-center text-2xl font-mono tracking-widest h-14"
                      maxLength={6}
                      autoFocus
                      aria-label="Código de sesión"
                      aria-describedby="code-help"
                      aria-invalid={code.length > 0 && code.length !== 6}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && code.length === 6) {
                          handleCodeSubmit()
                        }
                      }}
                    />
                  </div>
                  <p id="code-help" className="text-xs text-muted-foreground text-center">
                    Pídele el código al presentador
                  </p>
                </div>

                <Button 
                  onClick={handleCodeSubmit}
                  disabled={code.length !== 6}
                  size="lg"
                  className="w-full h-12 text-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Continuar a ingresar nombre"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Tu nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-lg"
                    autoFocus
                    aria-label="Tu nombre"
                    aria-describedby="name-help"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && name.trim()) {
                        handleJoin()
                      }
                    }}
                  />
                  <p id="name-help" className="text-xs text-muted-foreground text-center">
                    Este nombre aparecerá en la presentación
                  </p>
                </div>

                {error && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3"
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={handleJoin}
                    disabled={!name.trim() || isJoining}
                    size="lg"
                    className="w-full h-12 text-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Unirse a la sesión"
                  >
                    {isJoining ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                        </motion.div>
                        Uniéndose...
                      </>
                    ) : (
                      <>
                        Unirse ahora
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => setStep('code')}
                    className="w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Cambiar código"
                  >
                    Cambiar código
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-white/80 text-sm">
          Powered by AudienceSpark
        </p>
      </motion.div>
    </div>
  )
}