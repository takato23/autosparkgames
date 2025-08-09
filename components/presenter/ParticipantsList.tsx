'use client'

import { useState, useMemo } from 'react'
import { Card, Badge, Button, Input } from '@/lib/design-system/components'
import { 
  Users, Search, Filter, UserCheck, UserX, 
  Trophy, Clock, Zap, MoreVertical 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Participant {
  id: string
  name: string
  team?: string
  score: number
  joinedAt: Date
  lastActiveAt: Date
  isActive: boolean
  responseCount: number
}

interface ParticipantsListProps {
  participants: Participant[]
  className?: string
  onKickParticipant?: (id: string) => void
}

export default function ParticipantsList({ 
  participants, 
  className = '',
  onKickParticipant 
}: ParticipantsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'joined'>('score')

  const filteredParticipants = useMemo(() => {
    let filtered = participants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesActive = showInactive || p.isActive
      return matchesSearch && matchesActive
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'score':
          return b.score - a.score
        case 'joined':
          return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [participants, searchQuery, showInactive, sortBy])

  const activeCount = participants.filter(p => p.isActive).length

  const getActivityStatus = (participant: Participant) => {
    if (!participant.isActive) return 'offline'
    
    const lastActive = new Date(participant.lastActiveAt)
    const minutesAgo = (Date.now() - lastActive.getTime()) / 1000 / 60
    
    if (minutesAgo < 1) return 'active'
    if (minutesAgo < 5) return 'idle'
    return 'inactive'
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card variant="elevated" className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-100">Participantes</h3>
            <Badge variant="primary" size="sm">
              {activeCount}/{participants.length}
            </Badge>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'Ocultar inactivos' : 'Mostrar todos'}
          </Button>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Buscar participante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500"
          >
            <option value="score">Puntuación</option>
            <option value="name">Nombre</option>
            <option value="joined">Entrada</option>
          </select>
        </div>

        {/* Participants List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredParticipants.map((participant, index) => {
              const activityStatus = getActivityStatus(participant)
              
              return (
                <motion.div
                  key={participant.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    ${participant.isActive ? 'bg-gray-800/50' : 'bg-gray-800/30 opacity-60'}
                    hover:bg-gray-700/50 transition-colors
                  `}
                >
                  {/* Activity Indicator */}
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(activityStatus)}`} />
                    {activityStatus === 'active' && (
                      <div className={`absolute inset-0 w-2 h-2 rounded-full ${getActivityColor(activityStatus)} animate-ping`} />
                    )}
                  </div>

                  {/* Name and Team */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-100 truncate">{participant.name}</p>
                    {participant.team && (
                      <p className="text-xs text-gray-400">Equipo: {participant.team}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Trophy className="h-3 w-3" />
                      <span>{participant.score}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Zap className="h-3 w-3" />
                      <span>{participant.responseCount}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {onKickParticipant && (
                    <div className="relative group">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onKickParticipant(participant.id)}
                      >
                        <UserX className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredParticipants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchQuery ? 'No se encontraron participantes' : 'No hay participantes'}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}