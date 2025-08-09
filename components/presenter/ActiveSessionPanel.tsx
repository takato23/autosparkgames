'use client'

import { useRouter } from 'next/navigation'
import { Button, Badge } from '@/lib/design-system/components'
import { Users, Clock, Activity, Eye, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Session } from '@/lib/store/presenter'

interface ActiveSessionPanelProps {
  sessions: Session[]
}

export default function ActiveSessionPanel({ sessions }: ActiveSessionPanelProps) {
  const router = useRouter()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">
          Sesiones Activas
        </h2>
        <Badge variant="success" size="sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
          {sessions.length} activa{sessions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-green-500/30 rounded-lg p-4 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {session.code}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-3 w-3" />
                  <span>
                    {session.startedAt && (
                      <>Iniciada hace {getTimeSince(session.startedAt)}</>
                    )}
                  </span>
                </div>
              </div>
              <Badge variant="success" size="sm">
                <Activity className="h-3 w-3 mr-1" />
                En vivo
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-white">
                <Users className="h-4 w-4" />
                <span className="font-medium">{session.participants.length}</span>
                <span className="text-white/60 text-sm">participantes</span>
              </div>
              <div className="text-sm text-white/60">
                Slide {session.currentSlideIndex + 1}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                className="flex-1"
                leftIcon={<Eye className="h-4 w-4" />}
                onClick={() => router.push(`/presenter/session/${session.id}`)}
              >
                Controlar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<ExternalLink className="h-4 w-4" />}
                onClick={() => window.open('/join', '_blank')}
              >
                Vista
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getTimeSince(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
  
  if (diffInMinutes < 1) return 'ahora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  
  const hours = Math.floor(diffInMinutes / 60)
  if (hours < 24) return `${hours}h`
  
  const days = Math.floor(hours / 24)
  return `${days}d`
}