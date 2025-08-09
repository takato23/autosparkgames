'use client'

import { useEffect, useState } from 'react'
import { Card, Button, Input } from '@/lib/design-system/components'
import { WifiOff, RefreshCw, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ReconnectionModalProps {
  isOpen: boolean
  onReconnect: (sessionCode: string, participantId: string) => Promise<void>
  onCancel: () => void
}

export default function ReconnectionModal({ 
  isOpen, 
  onReconnect,
  onCancel 
}: ReconnectionModalProps) {
  const [sessionCode, setSessionCode] = useState('')
  const [participantId, setParticipantId] = useState('')
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Check localStorage for saved session info
  useEffect(() => {
    const savedSession = localStorage.getItem('lastSession')
    if (savedSession) {
      const { code, participantId: savedId } = JSON.parse(savedSession)
      setSessionCode(code || '')
      setParticipantId(savedId || '')
    }
  }, [])

  const handleReconnect = async () => {
    if (!sessionCode || sessionCode.length !== 6) {
      toast.error('Código de sesión inválido')
      return
    }

    setIsReconnecting(true)
    
    try {
      await onReconnect(sessionCode, participantId)
      toast.success('¡Reconectado exitosamente!')
    } catch (error: any) {
      toast.error(error.message || 'Error al reconectar')
    } finally {
      setIsReconnecting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <Card variant="elevated" className="w-full max-w-md" role="dialog" aria-modal="true" aria-label="Reconectar a sesión">
              <div className="p-6 space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                    <WifiOff className="h-10 w-10 text-red-400" />
                  </div>
                </div>

                {/* Title */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-100 mb-2" id="reconnect-title">
                    Conexión Perdida
                  </h2>
                  <p className="text-gray-400" id="reconnect-desc">
                    Parece que perdiste la conexión. ¿Quieres reconectarte a la sesión?
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <Input
                    placeholder="Código de sesión (6 dígitos)"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl font-mono"
                    maxLength={6}
                    aria-label="Código de sesión"
                    aria-describedby="reconnect-desc"
                  />

                  {participantId && (
                    <div className="text-sm text-gray-400 text-center">
                      ID guardado: {participantId.slice(0, 8)}...
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={isReconnecting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleReconnect}
                    className="flex-1"
                    disabled={!sessionCode || sessionCode.length !== 6 || isReconnecting}
                    leftIcon={
                      isReconnecting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogIn className="h-4 w-4" />
                      )
                    }
                  >
                    {isReconnecting ? 'Reconectando...' : 'Reconectar'}
                  </Button>
                </div>

                {/* Alternative */}
                <div className="text-center text-sm text-gray-400">
                  ¿No tienes el código?{' '}
                  <button
                    onClick={() => {
                      setSessionCode('')
                      setParticipantId('')
                      localStorage.removeItem('lastSession')
                      onCancel()
                    }}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Unirse como nuevo participante
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}