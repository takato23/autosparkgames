import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

type ConnState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'offline'

type Metrics = {
  rttMs: number | null
  lastPingAt: number | null
  lastPongAt: number | null
  failures: number
}

type StateEntry = { state: ConnState | 'online' | 'offline' | 'connecting'; at: number }

type UseSocketOptions = {
  url?: string
  transports?: ('websocket' | 'polling')[]
  heartbeatIntervalMs?: number
  heartbeatTimeoutMs?: number
  maxBackoffMs?: number
  historySize?: number
}

const DEFAULTS: Required<UseSocketOptions> = {
  url: 'http://localhost:3004',
  transports: ['websocket'],
  heartbeatIntervalMs: 10000,
  heartbeatTimeoutMs: 5000,
  maxBackoffMs: 15000,
  historySize: 20,
}

function expBackoff(attempt: number, maxMs: number) {
  const base = Math.min(maxMs, 500 * Math.pow(2, attempt))
  const jitter = Math.random() * 0.3 * base
  return Math.floor(base + jitter)
}

export function useSocket(opts?: UseSocketOptions) {
  const options = { ...DEFAULTS, ...(opts || {}) }
  const [state, setState] = useState<ConnState>('idle')
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [metrics, setMetrics] = useState<Metrics>({
    rttMs: null,
    lastPingAt: null,
    lastPongAt: null,
    failures: 0,
  })
  const [rttSamples, setRttSamples] = useState<number[]>([])
  const [stateHistory, setStateHistory] = useState<StateEntry[]>([])

  const pushState = useCallback((s: StateEntry) => {
    setStateHistory((arr) => {
      const next = [...arr, s]
      const overflow = next.length - options.historySize
      return overflow > 0 ? next.slice(overflow) : next
    })
  }, [options.historySize])

  const reconnectAttemptRef = useRef(0)
  const hbTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hbTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const destroyedRef = useRef(false)

  const clearHeartbeatTimers = useCallback(() => {
    if (hbTimerRef.current) {
      clearInterval(hbTimerRef.current)
      hbTimerRef.current = null
    }
    if (hbTimeoutRef.current) {
      clearTimeout(hbTimeoutRef.current)
      hbTimeoutRef.current = null
    }
  }, [])

  const startHeartbeat = useCallback((s: Socket) => {
    clearHeartbeatTimers()
    hbTimerRef.current = setInterval(() => {
      const pingAt = Date.now()
      setMetrics((m) => ({ ...m, lastPingAt: pingAt }))
      s.timeout(options.heartbeatTimeoutMs).emit('ping', { t: pingAt }, (ack: { t: number } | undefined) => {
        const pongAt = Date.now()
        setMetrics((m) => {
          const rtt = typeof m.lastPingAt === 'number' ? pongAt - m.lastPingAt : null
          return { ...m, lastPongAt: pongAt, rttMs: rtt }
        })
        // track rtt sample when available
        setRttSamples((arr) => {
          const val = typeof ack?.t === 'number' || typeof pingAt === 'number'
            ? (typeof pingAt === 'number' ? pongAt - pingAt : null)
            : null
          const next = typeof val === 'number' ? [...arr, val] : [...arr]
          const overflow = next.length - options.historySize
          return overflow > 0 ? next.slice(overflow) : next
        })
      })
      // fallback noop timeout
      hbTimeoutRef.current = setTimeout(() => {
        // allow socket.io to manage actual disconnects
      }, options.heartbeatTimeoutMs + 200)
    }, options.heartbeatIntervalMs)
  }, [clearHeartbeatTimers, options.heartbeatIntervalMs, options.heartbeatTimeoutMs, options.historySize])

  const bindCoreEvents = useCallback((s: Socket) => {
    s.on('connect', () => {
      setConnected(true)
      setState('connected')
      pushState({ state: 'online', at: Date.now() })
      startHeartbeat(s)
    })

    s.on('disconnect', () => {
      setConnected(false)
      clearHeartbeatTimers()
      if (destroyedRef.current) return
      setState('reconnecting')
      pushState({ state: 'offline', at: Date.now() })
    })

    s.on('connect_error', () => {
      setConnected(false)
      clearHeartbeatTimers()
      if (destroyedRef.current) return
      setState('reconnecting')
      setMetrics((m) => ({ ...m, failures: m.failures + 1 }))
      pushState({ state: 'connecting', at: Date.now() })
    })

    s.on('pong', (payload: { t?: number } = {}) => {
      const now = Date.now()
      setMetrics((m) => {
        const base = payload?.t ?? m.lastPingAt ?? now
        return { ...m, lastPongAt: now, rttMs: now - base }
      })
      // record derived rtt too
      setRttSamples((arr) => {
        const base = payload?.t
        const val = typeof base === 'number' ? now - base : null
        const next = typeof val === 'number' ? [...arr, val] : [...arr]
        const overflow = next.length - options.historySize
        return overflow > 0 ? next.slice(overflow) : next
      })
    })
  }, [clearHeartbeatTimers, pushState, startHeartbeat, options.historySize])

  const connect = useCallback(() => {
    setState('connecting')
    pushState({ state: 'connecting', at: Date.now() })
    const s = io(options.url, {
      transports: options.transports,
      autoConnect: true,
    })
    setSocket(s)
    bindCoreEvents(s)
  }, [bindCoreEvents, options.transports, options.url, pushState])

  useEffect(() => {
    if (state !== 'reconnecting' || destroyedRef.current) return
    const attempt = reconnectAttemptRef.current++
    const wait = expBackoff(attempt, options.maxBackoffMs)
    const t = setTimeout(() => {
      if (destroyedRef.current) return
      if (socket && socket.connected) {
        setState('connected')
        pushState({ state: 'online', at: Date.now() })
        reconnectAttemptRef.current = 0
        return
      }
      try {
        socket?.connect()
      } catch {
        const s = io(options.url, {
          transports: options.transports,
          autoConnect: true,
        })
        setSocket(s)
        bindCoreEvents(s)
      }
    }, wait)
    return () => clearTimeout(t)
  }, [state, socket, options.maxBackoffMs, options.transports, options.url, bindCoreEvents, pushState])

  useEffect(() => {
    destroyedRef.current = false
    connect()
    return () => {
      destroyedRef.current = true
      clearHeartbeatTimers()
      socket?.removeAllListeners()
      socket?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const status = useMemo(() => {
    if (connected) return 'online'
    if (state === 'reconnecting' || state === 'connecting') return 'connecting'
    return 'offline'
  }, [connected, state])

  return { socket, connected, status, metrics, rttSamples, stateHistory }
}