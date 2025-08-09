'use client'

import { useState } from 'react'
import { BeautifulTheme } from '@/components/ui/beautiful-theme'
import { BeautifulGlassCard } from '@/components/ui/beautiful-glass-card'
import { AccessibilityPanel } from '@/components/ui/accessibility-panel'
import { PremiumButton } from '@/components/ui/premium-button'
import { EnhancedFocusRing } from '@/components/ui/enhanced-focus-ring'
import { InteractiveBingo } from '@/components/games/interactive-bingo'
import { CollaborativePictionary } from '@/components/games/collaborative-pictionary'
import { QuestionRace } from '@/components/games/question-race'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles,
  Palette,
  Accessibility,
  Gamepad2,
  Layers,
  Zap,
  Star,
  Heart,
  Trophy,
  Settings,
  Eye,
  Volume2,
  Brain,
  Keyboard
} from 'lucide-react'

export default function ShowcasePage() {
  const [currentTheme, setCurrentTheme] = useState<'aurora' | 'sunset' | 'ocean' | 'forest' | 'galaxy' | 'rainbow'>('galaxy')
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [activeDemo, setActiveDemo] = useState<'themes' | 'components' | 'games' | null>('themes')

  const themes = [
    { id: 'aurora' as const, name: 'Aurora', colors: 'from-purple-500 to-pink-500' },
    { id: 'sunset' as const, name: 'Sunset', colors: 'from-orange-500 to-red-500' },
    { id: 'ocean' as const, name: 'Ocean', colors: 'from-blue-500 to-cyan-500' },
    { id: 'forest' as const, name: 'Forest', colors: 'from-green-500 to-emerald-500' },
    { id: 'galaxy' as const, name: 'Galaxy', colors: 'from-indigo-500 to-purple-500' },
    { id: 'rainbow' as const, name: 'Rainbow', colors: 'from-red-500 via-yellow-500 to-purple-500' }
  ]

  const cardVariants = ['aurora', 'sunset', 'ocean', 'cosmic', 'rainbow'] as const

  return (
    <BeautifulTheme theme={currentTheme}>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <BeautifulGlassCard variant="cosmic" className="mb-8 p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">
                  AudienceSpark Premium
                </h1>
                <p className="text-xl text-white/80">
                  Experiencia interactiva de última generación para eventos corporativos
                </p>
              </div>
              
              <EnhancedFocusRing variant="vibrant">
                <PremiumButton
                  variant="primary"
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  icon={<Accessibility />}
                  effect="glow"
                >
                  Accesibilidad
                </PremiumButton>
              </EnhancedFocusRing>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-sm font-medium text-white">Visual</p>
                <p className="text-xs text-white/60">6 temas premium</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Volume2 className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-white">Audio</p>
                <p className="text-xs text-white/60">Efectos sonoros</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-sm font-medium text-white">Cognitivo</p>
                <p className="text-xs text-white/60">3 juegos mentales</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Keyboard className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="text-sm font-medium text-white">Motor</p>
                <p className="text-xs text-white/60">Full navegación</p>
              </div>
            </div>
          </BeautifulGlassCard>

          {/* Navigation */}
          <div className="flex gap-4 mb-8 justify-center">
            <EnhancedFocusRing>
              <PremiumButton
                variant={activeDemo === 'themes' ? 'primary' : 'ghost'}
                onClick={() => setActiveDemo('themes')}
                icon={<Palette />}
              >
                Temas y Estilos
              </PremiumButton>
            </EnhancedFocusRing>
            
            <EnhancedFocusRing>
              <PremiumButton
                variant={activeDemo === 'components' ? 'primary' : 'ghost'}
                onClick={() => setActiveDemo('components')}
                icon={<Layers />}
              >
                Componentes UI
              </PremiumButton>
            </EnhancedFocusRing>
            
            <EnhancedFocusRing>
              <PremiumButton
                variant={activeDemo === 'games' ? 'primary' : 'ghost'}
                onClick={() => setActiveDemo('games')}
                icon={<Gamepad2 />}
              >
                Juegos Premium
              </PremiumButton>
            </EnhancedFocusRing>
          </div>

          {/* Content sections */}
          <AnimatePresence mode="wait">
            {/* Themes Demo */}
            {activeDemo === 'themes' && (
              <motion.div
                key="themes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Sistema de Temas Premium</h2>
                
                {/* Theme selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {themes.map(theme => (
                    <EnhancedFocusRing key={theme.id}>
                      <button
                        onClick={() => setCurrentTheme(theme.id)}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${currentTheme === theme.id 
                            ? 'border-white bg-white/20 scale-105' 
                            : 'border-white/30 bg-white/10 hover:bg-white/20'
                          }
                        `}
                      >
                        <div className={`h-12 w-full rounded-lg bg-gradient-to-r ${theme.colors} mb-2`} />
                        <p className="text-sm font-medium text-white">{theme.name}</p>
                      </button>
                    </EnhancedFocusRing>
                  ))}
                </div>

                {/* Glass card variants */}
                <h3 className="text-xl font-bold text-white mb-4">Variantes de Glass Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cardVariants.map((variant, index) => (
                    <BeautifulGlassCard key={variant} variant={variant} className="p-6">
                      <h4 className="text-lg font-bold text-white mb-2">
                        Variante {variant}
                      </h4>
                      <p className="text-white/70 mb-4">
                        Esta tarjeta usa la variante "{variant}" con efectos 3D y shimmer.
                      </p>
                      <div className="flex gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                    </BeautifulGlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Components Demo */}
            {activeDemo === 'components' && (
              <motion.div
                key="components"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Componentes Premium</h2>
                
                <div className="space-y-8">
                  {/* Buttons */}
                  <BeautifulGlassCard variant="ocean" className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Botones Premium</h3>
                    <div className="flex flex-wrap gap-4">
                      <PremiumButton variant="primary" icon={<Zap />} effect="glow">
                        Efecto Glow
                      </PremiumButton>
                      <PremiumButton variant="secondary" icon={<Sparkles />} effect="ripple">
                        Efecto Ripple
                      </PremiumButton>
                      <PremiumButton variant="success" icon={<Heart />} effect="pulse">
                        Efecto Pulse
                      </PremiumButton>
                      <PremiumButton variant="danger" icon={<Trophy />} effect="bounce">
                        Efecto Shake
                      </PremiumButton>
                    </div>
                  </BeautifulGlassCard>

                  {/* Focus Rings */}
                  <BeautifulGlassCard variant="sunset" className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Focus Rings Mejorados</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(['default', 'vibrant', 'subtle', 'high-contrast'] as const).map(variant => (
                        <EnhancedFocusRing key={variant} variant={variant}>
                          <button className="w-full p-4 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                            {variant}
                          </button>
                        </EnhancedFocusRing>
                      ))}
                    </div>
                  </BeautifulGlassCard>

                  {/* Interactive elements */}
                  <BeautifulGlassCard variant="cosmic" className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Elementos Interactivos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 animate-pulse" />
                        <p className="text-white">Animación Pulse</p>
                      </div>
                      
                      <div className="text-center">
                        <motion.div 
                          className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-white">Rotación Continua</p>
                      </div>
                      
                      <div className="text-center">
                        <motion.div 
                          className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <p className="text-white">Efecto Respiración</p>
                      </div>
                    </div>
                  </BeautifulGlassCard>
                </div>
              </motion.div>
            )}

            {/* Games Demo */}
            {activeDemo === 'games' && (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Mini Demos de Juegos</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bingo Preview */}
                  <BeautifulGlassCard variant="aurora" className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Bingo Interactivo</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`
                            aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                            ${i === 4 
                              ? 'bg-yellow-500/30 text-yellow-300' 
                              : 'bg-purple-500/20 text-purple-300'
                            }
                          `}
                        >
                          {i === 4 ? 'FREE' : `B${i + 1}`}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-white/70">
                      5 patrones ganadores, sonidos premium, animaciones fluidas
                    </p>
                  </BeautifulGlassCard>

                  {/* Pictionary Preview */}
                  <BeautifulGlassCard variant="ocean" className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Pictionary Colaborativo</h3>
                    <div className="bg-white/10 rounded-lg aspect-video mb-4 flex items-center justify-center">
                      <Palette className="h-12 w-12 text-white/30" />
                    </div>
                    <p className="text-sm text-white/70">
                      Canvas en tiempo real, 10 colores, herramientas profesionales
                    </p>
                  </BeautifulGlassCard>

                  {/* Race Preview */}
                  <BeautifulGlassCard variant="sunset" className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Carrera de Preguntas</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm">🏃</div>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-purple-500" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm">🤖</div>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-blue-500" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">
                      Avatares 3D, power-ups, competencia contra CPU
                    </p>
                  </BeautifulGlassCard>
                </div>

                <div className="mt-8 text-center">
                  <EnhancedFocusRing variant="vibrant">
                    <PremiumButton
                      variant="primary"
                      size="lg"
                      onClick={() => window.location.href = '/games'}
                      icon={<Gamepad2 />}
                      effect="glow"
                    >
                      Ir al Centro de Juegos Completo
                    </PremiumButton>
                  </EnhancedFocusRing>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accessibility Panel */}
          {showAccessibility && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-2xl">
                <AccessibilityPanel 
                  isOpen 
                  onClose={() => setShowAccessibility(false)}
                  settings={{
                    reducedMotion: false,
                    highContrast: false,
                    largeText: false,
                    darkMode: false,
                    soundEnabled: true,
                    hapticEnabled: true,
                    colorBlind: 'none',
                    textSize: 'medium',
                    focusRing: true,
                    keyboardNav: true,
                    announcements: true,
                  }}
                  onSettingsChange={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </BeautifulTheme>
  )
}