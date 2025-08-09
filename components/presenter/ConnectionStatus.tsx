'use client'

import { Badge } from '@/lib/design-system/components'
import { Wifi, WifiOff, AlertCircle, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import type { SocketMetrics } from '@/lib/hooks/useSocket'

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  metrics?: SocketMetrics
  className?: string
}

export default function ConnectionStatus({ 
  status, 
  metrics,
  className = '' 
}: ConnectionStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-4 w-4" />
      case 'connecting':
        return <Activity className="h-4 w-4 animate-pulse" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'success'
      case 'connecting':
        return 'warning'
      case 'disconnected':
        return 'default'
      case 'error':
        return 'error'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Conectado'
      case 'connecting':
        return 'Conectando...'
      case 'disconnected':
        return 'Desconectado'
      case 'error':
        return 'Error'
    }
  }

  const getLatencyColor = (latency: number) => {
    if (latency < 0) return 'text-red-400'
    if (latency < 50) return 'text-green-400'
    if (latency < 150) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Badge
        variant={getStatusColor() as any}
        leftIcon={getStatusIcon()}
        size="sm"
      >
        {getStatusText()}
      </Badge>

      {status === 'connected' && metrics && (
        <>
          {/* Latency */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 text-xs"
          >
            <Activity className="h-3 w-3 text-gray-400" />
            <span className={getLatencyColor(metrics.latency)}>
              {metrics.latency < 0 ? 'Sin respuesta' : `${metrics.latency}ms`}
            </span>
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-xs text-gray-400"
          >
            <span>↑ {metrics.messagesSent}</span>
            <span>↓ {metrics.messagesReceived}</span>
          </motion.div>

          {/* Reconnect attempts */}
          {metrics.reconnectAttempts > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-yellow-400"
            >
              Reintentos: {metrics.reconnectAttempts}
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}