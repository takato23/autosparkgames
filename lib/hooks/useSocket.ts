'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

interface UseSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  onConnect?: () => void
  onDisconnect?: (reason: string) => void
  onError?: (error: Error) => void
}

export interface SocketMetrics {
  connected: boolean
  latency: number
  reconnectAttempts: number
  lastPing: Date | null
  messagesSent: number
  messagesReceived: number
}

export function useSocket({
  url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3010',
  autoConnect = true,
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
  onConnect,
  onDisconnect,
  onError,
}: UseSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [metrics, setMetrics] = useState<SocketMetrics>({
    connected: false,
    latency: 0,
    reconnectAttempts: 0,
    lastPing: null,
    messagesSent: 0,
    messagesReceived: 0,
  })

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reconnectAttemptsRef = useRef(0)

  // Heartbeat system
  const setupHeartbeat = useCallback((socket: Socket) => {
    // Clear existing interval
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
    }

    // Ping every 30 seconds
    pingIntervalRef.current = setInterval(() => {
      const start = Date.now()
      
      socket.emit('ping', { timestamp: start })
      
      const timeout = setTimeout(() => {
        console.warn('Ping timeout - connection may be lost')
        setMetrics(prev => ({ ...prev, latency: -1 }))
      }, 5000)

      socket.once('pong', ({ timestamp }: { timestamp: number }) => {
        clearTimeout(timeout)
        const latency = Date.now() - timestamp
        setMetrics(prev => ({
          ...prev,
          latency,
          lastPing: new Date(),
        }))
      })
    }, 30000)
  }, [])

  // Initialize socket connection
  const connect = useCallback(() => {
    if (socket?.connected) return

    setStatus('connecting')

    // Endure entornos mixtos y proxies: path fijo, fallback de transportes y timeout razonable
    const computedUrl = (() => {
      try {
        const envUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || process.env.NEXT_PUBLIC_WS_URL || ''
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        // Preferir runtime env sobre el valor por defecto, luego origin como último recurso
        const base = (envUrl || url || origin).trim() || 'http://localhost:3010'
        if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
          return base.replace(/^http:/, 'https:')
        }
        return base
      } catch {
        return url
      }
    })()

    // Log de conexión antes de iniciar el handshake
    // eslint-disable-next-line no-console
    console.info('[useSocket] connecting to', computedUrl)

    const newSocket = io(computedUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: false, // mantenemos nuestra lógica manual abajo
      timeout: 10000,
      withCredentials: false,
    })

    // Connection event handlers
    newSocket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.info('[useSocket] connected', newSocket.id)
      setStatus('connected')
      setMetrics(prev => ({ ...prev, connected: true, reconnectAttempts: 0 }))
      reconnectAttemptsRef.current = 0
      
      setupHeartbeat(newSocket)
      onConnect?.()
      
      toast.success('Conectado al servidor', {
        duration: 2000,
      })
    })

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      setStatus('disconnected')
      setMetrics(prev => ({ ...prev, connected: false }))
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
      
      onDisconnect?.(reason)

      // Auto-reconnect logic
      if (reason === 'io server disconnect') {
        // Server disconnected us, don't auto-reconnect
        toast.error('Desconectado por el servidor')
      } else {
        // Try to reconnect
        attemptReconnect(newSocket)
      }
    })

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setStatus('error')
      onError?.(error)
      
      attemptReconnect(newSocket)
    })

    // Custom error handling
    newSocket.on('error', (data) => {
      console.error('WebSocket error:', data)
      toast.error(data.message || 'Error de conexión')
    })

    // Track metrics
    const originalEmit = newSocket.emit.bind(newSocket)
    newSocket.emit = (...args: any[]) => {
      setMetrics(prev => ({ ...prev, messagesSent: prev.messagesSent + 1 }))
      return originalEmit(...args)
    }

    newSocket.onAny(() => {
      setMetrics(prev => ({ ...prev, messagesReceived: prev.messagesReceived + 1 }))
    })

    setSocket(newSocket)
    return newSocket
  }, [url, socket, setupHeartbeat, onConnect, onDisconnect, onError])

  // Reconnection logic
  const attemptReconnect = useCallback((socketInstance: Socket) => {
    if (reconnectAttemptsRef.current >= reconnectionAttempts) {
      toast.error('No se pudo reconectar al servidor')
      setStatus('error')
      return
    }

    reconnectAttemptsRef.current++
    setMetrics(prev => ({ ...prev, reconnectAttempts: reconnectAttemptsRef.current }))

    const delay = reconnectionDelay * Math.pow(2, reconnectAttemptsRef.current - 1) // Exponential backoff
    
    toast.info(`Reconectando... (intento ${reconnectAttemptsRef.current}/${reconnectionAttempts})`)
    
    reconnectTimeoutRef.current = setTimeout(() => {
      socketInstance.connect()
    }, delay)
  }, [reconnectionAttempts, reconnectionDelay])

  // Disconnect function
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
    }

    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    
    setStatus('disconnected')
    setMetrics(prev => ({ ...prev, connected: false }))
  }, [socket])

  // Emit with error handling
  const emit = useCallback((event: string, data?: any) => {
    if (!socket?.connected) {
      toast.error('No hay conexión con el servidor')
      return false
    }

    try {
      socket.emit(event, data)
      return true
    } catch (error) {
      console.error('Error emitting event:', error)
      toast.error('Error al enviar datos')
      return false
    }
  }, [socket])

  // Listen to events with cleanup
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (!socket) return () => {}

    socket.on(event, callback)
    return () => {
      socket.off(event, callback)
    }
  }, [socket])

  // Once listener
  const once = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (!socket) return () => {}

    socket.once(event, callback)
    return () => {
      socket.off(event, callback)
    }
  }, [socket])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, []) // Only run on mount/unmount

  return {
    socket,
    status,
    metrics,
    connect,
    disconnect,
    emit,
    on,
    once,
    isConnected: status === 'connected',
  }
}

// Hook para el contexto de sesión de juego
export function useGameSession(sessionCode?: string) {
  const { socket, isConnected, emit, on, connect } = useSocket()
  const [sessionData, setSessionData] = useState<any>(null)
  const [isHost, setIsHost] = useState(false)

  // Join or create session
  const joinSession = useCallback((code: string, playerName: string, team?: string) => {
    return new Promise((resolve, reject) => {
      const proceed = () => {
        // eslint-disable-next-line no-console
        console.info('[useSocket] join-session → emitting', { code, name: playerName, team })
        if (!emit('join-session', { code, name: playerName, team })) {
          reject(new Error('No conectado al servidor'))
          return
        }

        const offJoined = on('joined-session', (data) => {
          // eslint-disable-next-line no-console
          console.info('[useSocket] joined-session', { code, room: `session-${code}` })
          setSessionData(data)
          offJoined()
          resolve(data)
        })

        const offError = on('error', (error) => {
          // eslint-disable-next-line no-console
          console.error('[useSocket] join-session error', error)
          offError()
          reject(error)
        })

        setTimeout(() => {
          try { offJoined() } catch {}
          try { offError() } catch {}
          reject(new Error('Timeout al unirse a la sesión'))
        }, 10000)
      }

      if (isConnected) {
        proceed()
        return
      }

      const s = connect()
      const target = s || socket
      if (!target) {
        setTimeout(() => reject(new Error('No conectado al servidor')), 5000)
        return
      }
      try {
        target.once('connect', () => proceed())
        setTimeout(() => reject(new Error('Timeout de conexión')), 8000)
      } catch (e) {
        reject(new Error('No conectado al servidor'))
      }
    })
  }, [isConnected, emit, on, connect, socket])

  // Create session as host
  const createSession = useCallback((presentationId: string, teams?: string[]) => {
    return new Promise((resolve, reject) => {
      const proceed = () => {
        // Emit y listeners sobre el socket actual
        // eslint-disable-next-line no-console
        console.info('[useSocket] create-session → emitting', { presentationId, teams })
        if (!emit('create-session', { presentationId, teams })) {
          reject(new Error('No conectado al servidor'))
          return
        }

        const offCreated = on('session-created', (data) => {
          // eslint-disable-next-line no-console
          console.info('[useSocket] session-created', { code: data?.session?.code, room: `host-${data?.session?.code}` })
          setSessionData(data)
          setIsHost(true)
          offCreated()
          resolve(data)
        })

        const offError = on('error', (error) => {
          // eslint-disable-next-line no-console
          console.error('[useSocket] create-session error', error)
          offError()
          reject(error)
        })

        setTimeout(() => {
          try { offCreated() } catch {}
          try { offError() } catch {}
          reject(new Error('Timeout al crear la sesión'))
        }, 10000)
      }

      if (isConnected) {
        proceed()
        return
      }

      // Intentar conectar y luego proceder
      const s = connect()
      const target = s || socket
      if (!target) {
        setTimeout(() => reject(new Error('No conectado al servidor')), 5000)
        return
      }
      try {
        target.once('connect', () => proceed())
        setTimeout(() => reject(new Error('Timeout de conexión')), 8000)
      } catch (e) {
        reject(new Error('No conectado al servidor'))
      }
    })
  }, [isConnected, emit, on, connect, socket])

  // Submit answer
  const submitAnswer = useCallback((slideId: string, answer: any, timeSpent: number) => {
    if (!sessionCode) return Promise.reject(new Error('No session code'))

    return new Promise((resolve, reject) => {
      emit('submit-answer', {
        sessionCode,
        slideId,
        answer,
        timeSpent,
      })

      const cleanup = on('answer-confirmed', (data) => {
        cleanup()
        resolve(data)
      })

      // Timeout
      setTimeout(() => {
        cleanup()
        reject(new Error('Timeout al enviar respuesta'))
      }, 5000)
    })
  }, [sessionCode, emit, on])

  // Send reaction
  const sendReaction = useCallback((emoji: string) => {
    if (!sessionCode) return

    emit('send-reaction', { sessionCode, emoji })
  }, [sessionCode, emit])

  // Navigation (host only)
  const nextSlide = useCallback(() => {
    if (!isHost || !sessionCode) return

    emit('next-slide', { sessionCode })
  }, [isHost, sessionCode, emit])

  const previousSlide = useCallback(() => {
    if (!isHost || !sessionCode) return

    emit('previous-slide', { sessionCode })
  }, [isHost, sessionCode, emit])

  return {
    socket,
    isConnected,
    sessionData,
    isHost,
    joinSession,
    createSession,
    submitAnswer,
    sendReaction,
    nextSlide,
    previousSlide,
  }
}