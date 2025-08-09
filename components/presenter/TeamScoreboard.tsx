'use client'

import { useState, useEffect } from 'react'
import { Card, Badge } from '@/lib/design-system/components'
import { Trophy, Users, TrendingUp, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Team {
  name: string
  score: number
  color: string
  members: number
}

interface TeamScoreboardProps {
  teams: Team[]
  className?: string
}

export default function TeamScoreboard({ teams, className = '' }: TeamScoreboardProps) {
  const [sortedTeams, setSortedTeams] = useState<Team[]>([])
  const [previousPositions, setPreviousPositions] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    // Sort teams by score
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    
    // Track position changes
    const newPositions = new Map()
    sorted.forEach((team, index) => {
      newPositions.set(team.name, index)
    })
    
    setPreviousPositions(newPositions)
    setSortedTeams(sorted)
  }, [teams])

  const getPositionChange = (teamName: string, currentPosition: number) => {
    const prevPosition = previousPositions.get(teamName)
    if (prevPosition === undefined) return 0
    return prevPosition - currentPosition
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 1:
        return <Award className="h-5 w-5 text-gray-300" />
      case 2:
        return <Award className="h-5 w-5 text-orange-400" />
      default:
        return <span className="text-lg font-bold text-gray-400">{position + 1}</span>
    }
  }

  return (
    <Card variant="elevated" className={className}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-gray-100">Tabla de Equipos</h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedTeams.map((team, index) => {
              const positionChange = getPositionChange(team.name, index)
              
              return (
                <motion.div
                  key={team.name}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 200, damping: 20 }
                  }}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/40' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-red-500/20 border border-orange-500/40' :
                      'bg-gray-800/50 border border-gray-700'}
                  `}
                >
                  {/* Position */}
                  <div className="flex items-center justify-center w-10">
                    {getPositionIcon(index)}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <h4 className="font-semibold text-gray-100">{team.name}</h4>
                      <Badge variant="default" size="sm">
                        <Users className="h-3 w-3 mr-1" />
                        {team.members}
                      </Badge>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4">
                    {positionChange !== 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center gap-1 text-sm ${
                          positionChange > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        <TrendingUp className={`h-4 w-4 ${positionChange < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(positionChange)}
                      </motion.div>
                    )}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-100">{team.score}</p>
                      <p className="text-xs text-gray-400">puntos</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {sortedTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay equipos registrados</p>
          </div>
        )}
      </div>
    </Card>
  )
}