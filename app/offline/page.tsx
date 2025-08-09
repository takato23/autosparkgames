'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSocket } from '@/hooks/useSocket'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GradientCard, GradientHeader } from '@/components/ui/gradient-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingElement } from '@/components/ui/floating-element'
import { MorphingBackground } from '@/components/ui/morphing-background'
import { theme, a11y } from '@/lib/theme'
import { 
  Wifi, 
  WifiOff, 
  Users, 
  Play, 
  Zap,
  Trophy,
  Sparkles,
  QrCode,
  Gamepad2,
  Settings
} from 'lucide-react'

export default function OfflinePage() {
  const { socket, connected } = useSocket()
  const [session, setSession] = useState<any>(null)
  const [participantCount, setParticipantCount] = useState(0)
  const [serverUrl, setServerUrl] = useState('')
  const [selectedGame, setSelectedGame] = useState('demo-trivia-1')
  const [teams, setTeams] = useState(['Equipo Rojo', 'Equipo Azul', 'Equipo Verde', 'Equipo Amarillo'])

  // Available games
  const games = [
    {
      id: 'demo-trivia-1',
      title: 'Trivia General',
      description: 'Preguntas de conocimiento general con puntos',
      icon: Trophy,
      gradient: 'primary' as keyof typeof theme.colors.gradients
    },
    {
      id: 'demo-icebreaker-1', 
      title: 'Ice Breakers',
      description: 'Actividades para romper el hielo',
      icon: Users,
      gradient: 'secondary' as keyof typeof theme.colors.gradients
    },
    {
      id: 'demo-team-1',
      title: 'Team Building',
      description: 'Desafíos colaborativos por equipos',
      icon: Sparkles,
      gradient: 'success' as keyof typeof theme.colors.gradients
    }
  ]

  useEffect(() => {
    if (!socket) return

    socket.on('session-created', (data) => {
      setSession(data.session)
      setServerUrl(data.serverUrl)
      console.log('Sesión creada:', data)
    })

    socket.on('participant-joined', (data) => {
      setParticipantCount(data.totalParticipants)
      console.log('Participante unido:', data.participant.name)
    })

    socket.on('participant-left', (data) => {
      setParticipantCount(data.totalParticipants)
    })

    return () => {
      socket.off('session-created')
      socket.off('participant-joined')  
      socket.off('participant-left')
    }
  }, [socket])

  const createSession = () => {
    if (!socket) return
    
    socket.emit('create-session', {
      presentationId: selectedGame,
      teams: teams.filter(t => t.trim())
    })
  }

  const startPresentation = () => {
    if (session) {
      window.open(`/offline/presenter/${session.code}`, '_blank')
    }
  }

  const joinUrl = session ? `${serverUrl}/offline/join/${session.code}` : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      <MorphingBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <FloatingElement delay={0} duration={4} distance={10}>
            <GlassCard 
              className="inline-flex items-center justify-center w-24 h-24 mb-6"
              blur="xl"
              opacity={90}
              glow
            >
              <Gamepad2 className="h-12 w-12 text-purple-600" aria-hidden="true" />
            </GlassCard>
          </FloatingElement>
          <h1 className="text-5xl md:text-6xl font-black mb-3 text-white drop-shadow-lg">
            AudienceSpark
            <span className="text-yellow-300"> Offline</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-semibold max-w-2xl mx-auto">
            Crea juegos interactivos sin necesidad de internet
          </p>
          
          {/* Connection Status */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <Badge 
              className={`px-6 py-3 text-base font-bold flex items-center gap-2 ${
                connected 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              } ${theme.borderRadius.xl} ${theme.shadows.lg}`}
              role="status"
              aria-live="polite"
            >
              {connected ? (
                <><Wifi className="h-5 w-5" aria-hidden="true" /> Servidor Conectado</>
              ) : (
                <><WifiOff className="h-5 w-5" aria-hidden="true" /> Servidor Desconectado</>
              )}
            </Badge>
            
            <motion.a
              href="/offline/settings"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-full flex items-center gap-2 hover:bg-white/30 transition-colors"
              aria-label="Configuración"
            >
              <Settings className="h-5 w-5" />
              Configuración
            </motion.a>
          </motion.div>
        </motion.div>

        {!session ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Game Selection */}
            <GradientCard gradient="primary">
              <GradientHeader gradient="primary">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                  Selecciona un Juego
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Elige el tipo de actividad para tu evento
                </CardDescription>
              </GradientHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {games.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        className={`w-full text-left transition-all transform rounded-2xl ${
                          selectedGame === game.id 
                            ? 'ring-4 ring-purple-500 shadow-2xl scale-105 bg-gradient-to-br from-purple-50 to-pink-50' 
                            : 'hover:shadow-xl hover:scale-102 bg-white shadow-lg'
                        } ${a11y.focusRing}`}
                        onClick={() => setSelectedGame(game.id)}
                        aria-pressed={selectedGame === game.id}
                        aria-label={`Seleccionar ${game.title}`}
                      >
                        <div className="p-6">
                          <motion.div 
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                            className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                              theme.colors.gradients[game.gradient]
                            } shadow-lg`}
                          >
                            <game.icon className="h-8 w-8 text-white" aria-hidden="true" />
                          </motion.div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 text-center">{game.title}</h3>
                          <p className="text-sm text-gray-700 text-center">
                            {game.description}
                          </p>
                          {selectedGame === game.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-3 text-center"
                            >
                              <Badge className="bg-purple-600 text-white font-semibold px-3 py-1">
                                ✓ Seleccionado
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </GradientCard>

            {/* Team Configuration */}
            <GradientCard gradient="warning">
              <GradientHeader gradient="warning">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" aria-hidden="true" />
                  Configurar Equipos
                  <Badge className="ml-2 bg-white/20 text-white border-white/30 font-medium">
                    Opcional
                  </Badge>
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Define los equipos para competencias grupales
                </CardDescription>
              </GradientHeader>
              <CardContent className="space-y-4 p-6">
                {teams.map((team, index) => {
                  const teamColor = theme.colors.teams[index] || theme.colors.teams[0]
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-2xl" aria-hidden="true">{teamColor.emoji}</span>
                      <Input
                        value={team}
                        onChange={(e) => {
                          const newTeams = [...teams]
                          newTeams[index] = e.target.value
                          setTeams(newTeams)
                        }}
                        placeholder={`Equipo ${index + 1}`}
                        aria-label={`Nombre del equipo ${index + 1}`}
                        className={`${teamColor.light} border-2 border-gray-300 font-medium text-gray-900 placeholder-gray-600 ${a11y.focusRing}`}
                      />
                    </motion.div>
                  )
                })}
              </CardContent>
            </GradientCard>

            {/* Create Session Button */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GradientButton
                onClick={createSession}
                disabled={!connected}
                size="lg"
                gradient="primary"
                className="px-12 py-6 text-lg"
              >
                <Play className="mr-3 h-6 w-6" aria-hidden="true" />
                Crear Sesión de Juego
              </GradientButton>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Session Info */}
            <GradientCard gradient="success">
              <GradientHeader gradient="success">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl flex items-center gap-2">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                    Sesión Activa
                  </span>
                  <Badge className="text-xl px-4 py-2 bg-white text-green-700 font-bold">
                    {session.code}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Los participantes pueden unirse escaneando el QR
                </CardDescription>
              </GradientHeader>
              <CardContent className="space-y-4 p-6">
                <motion.div 
                  className={`flex items-center justify-between p-6 bg-gradient-to-r ${theme.colors.gradients.secondaryLight} rounded-xl`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${theme.colors.gradients.secondary} rounded-full flex items-center justify-center shadow-lg`}>
                      <Users className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Participantes</h3>
                      <p className="text-sm text-gray-700">
                        Conectados ahora mismo
                      </p>
                    </div>
                  </div>
                  <motion.div 
                    className="text-4xl font-black text-blue-700"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    aria-live="polite"
                    aria-label={`${participantCount} participantes conectados`}
                  >
                    {participantCount}
                  </motion.div>
                </motion.div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    URL para unirse:
                  </h3>
                  <div className="p-4 bg-gray-100 rounded-xl font-mono text-sm break-all border-2 border-gray-300 text-gray-800" role="textbox" aria-readonly="true">
                    {joinUrl}
                  </div>
                </div>

                <GradientButton
                  onClick={startPresentation}
                  gradient="success"
                  size="lg"
                  className="w-full py-6 text-lg"
                >
                  <Zap className="mr-3 h-6 w-6" aria-hidden="true" />
                  Iniciar Presentación
                </GradientButton>
              </CardContent>
            </GradientCard>

            {/* QR Code */}
            <GradientCard gradient="primary">
              <GradientHeader gradient="primary">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <QrCode className="h-6 w-6" aria-hidden="true" />
                  Código QR para Unirse
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Los participantes escanean para unirse instantáneamente
                </CardDescription>
              </GradientHeader>
              <CardContent className="flex flex-col items-center space-y-6 p-6">
                <motion.div 
                  className={`p-8 bg-gradient-to-br ${theme.colors.gradients.primaryLight} rounded-2xl shadow-2xl`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring" }}
                >
                  <QRCode
                    value={joinUrl}
                    size={220}
                    level="M"
                    includeMargin={true}
                    fgColor="#7c3aed"
                    aria-label="Código QR para unirse a la sesión"
                  />
                </motion.div>
                <div className="text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-lg text-gray-700 font-medium">Código de acceso:</p>
                    <motion.div 
                      className="text-4xl font-black text-purple-700"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {session.code}
                    </motion.div>
                  </div>
                  <p className="text-gray-700">
                    O ingresar manualmente el código
                  </p>
                  <Badge className="bg-yellow-500 text-gray-900 font-semibold px-4 py-2">
                    Listo para escanear
                  </Badge>
                </div>
              </CardContent>
            </GradientCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}