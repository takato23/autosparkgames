'use client'

import { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGameSession } from '@/lib/hooks/useSocket'
import { getPresentation } from '@/lib/firebase/helpers/presentations'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LaunchPage() {
  const router = useRouter()
  const params = useParams()
  const { createSession, isConnected, socket } = useGameSession()
  const hasLaunchedRef = useRef(false)

  const presentationId = params.presentationId as string

  useEffect(() => {
    if (!isConnected || hasLaunchedRef.current || !presentationId) return

    const run = async () => {
      try {
        hasLaunchedRef.current = true

        // Registrar la presentación en el servidor (evita "Presentación no encontrada")
        const p = await getPresentation(presentationId)
        if (!p) throw new Error('Presentación no encontrada')
        socket?.emit('register-presentation', { presentation: p })

        const data: unknown = await createSession(presentationId)
        const code = (data as { session?: { code?: string } })?.session?.code
        if (!code) throw new Error('Código de sesión no recibido')

        const projectorUrl = `${window.location.origin}/session/${code}/projector`
        window.open(projectorUrl, '_blank', 'noopener,noreferrer')
        toast.success(`Sesión creada. Código: ${code}`)
        router.replace(`/presenter/session/${code}`)
      } catch (error) {
        console.error('[Launch] Error al iniciar sesión', error)
        toast.error((error as Error)?.message || 'No se pudo crear la sesión')
        router.replace('/presenter')
      }
    }

    void run()
  }, [isConnected, presentationId, createSession, router, socket])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Iniciando sesión...
      </div>
    </div>
  )
}
