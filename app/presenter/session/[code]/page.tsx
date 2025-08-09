'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSocket } from '@/lib/hooks/useSocket'
import ConnectionStatus from '@/components/presenter/ConnectionStatus'
import SessionControl from '@/components/presenter/SessionControl'
import ParticipantsList from '@/components/presenter/ParticipantsList'
import TeamScoreboard from '@/components/presenter/TeamScoreboard'
import WordCloudDisplay from '@/components/presenter/WordCloudDisplay'
import ReactionDisplay from '@/components/presenter/ReactionDisplay'
import { Card } from '@/lib/design-system/components'
import { motion } from 'framer-motion'

export default function SessionPage() {
  const params = useParams()
  const sessionCode = params.code as string
  
  const { status, metrics, socket, on } = useSocket()
  const [participants, setParticipants] = useState([])
  const [teams, setTeams] = useState([])
  const [wordCloudData, setWordCloudData] = useState([])
  const [currentSlide, setCurrentSlide] = useState<any>(null)

  // Mock presentation ID - in real app this would come from the session data
  const presentationId = 'demo-trivia-1'

  // Listen to events
  useEffect(() => {
    if (!socket) return

    // eslint-disable-next-line no-console
    console.info('[PresenterSession] suscripto a rooms', { rooms: [`host-${sessionCode}`, `session-${sessionCode}`] })

    const unsubscribers = [
      on('participant-joined', ({ participant }) => {
        setParticipants(prev => [...prev, participant])
      }),

      on('participant-left', ({ participantId }) => {
        setParticipants(prev => prev.map(p => 
          p.id === participantId ? { ...p, isActive: false } : p
        ))
      }),

      on('word-cloud-update', ({ wordCounts }) => {
        setWordCloudData(wordCounts)
      }),

      on('team-scores-updated', ({ teamScores }) => {
        const teamsData = teamScores.map(([name, score]) => ({
          name,
          score,
          color: getTeamColor(name),
          members: participants.filter(p => p.team === name).length
        }))
        setTeams(teamsData)
      }),

      on('slide-changed', ({ slide }) => {
        setCurrentSlide(slide)
        // Reset word cloud if it's a new word cloud slide
        if (slide.type === 'word-cloud') {
          setWordCloudData([])
        }
      }),
    ]

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [socket, on, participants])

  const getTeamColor = (teamName: string) => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
    const index = teamName.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleKickParticipant = (participantId: string) => {
    if (socket) {
      socket.emit('kick-participant', { sessionCode, participantId })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Reaction Display Overlay */}
      <ReactionDisplay />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-100">
          Sesión en Vivo
        </h1>
        <ConnectionStatus status={status} metrics={metrics} />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Control */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <SessionControl 
            sessionCode={sessionCode}
            presentationId={presentationId}
          />

          {/* Current Slide Content */}
          {currentSlide && (
            <Card variant="elevated">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">
                  Contenido Actual
                </h3>
                
                {currentSlide.type === 'word-cloud' && (
                  <WordCloudDisplay words={wordCloudData} />
                )}
                
                {currentSlide.type === 'trivia' && (
                  <div className="text-center py-8">
                    <h4 className="text-2xl font-bold text-gray-100 mb-4">
                      {currentSlide.question}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {currentSlide.options.map((option: any) => (
                        <div
                          key={option.id}
                          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentSlide.type === 'poll' && (
                  <div className="text-center py-8">
                    <h4 className="text-2xl font-bold text-gray-100 mb-4">
                      {currentSlide.question}
                    </h4>
                    <p className="text-gray-400">
                      Encuesta en progreso...
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Right Column - Participants & Teams */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <ParticipantsList 
            participants={participants}
            onKickParticipant={handleKickParticipant}
          />
          
          {teams.length > 0 && (
            <TeamScoreboard teams={teams} />
          )}
        </motion.div>
      </div>
    </div>
  )
}