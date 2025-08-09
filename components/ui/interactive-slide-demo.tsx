'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { PremiumSlide } from "./premium-slide"
import { PremiumButton } from "./premium-button"
import { PremiumToggle } from "./premium-toggle"
import { GestureControls } from "./gesture-controls"
import { GlassCard } from "./glass-card"
import { FloatingElement } from "./floating-element"
import { FrictionReducer } from "./friction-reducer"
import { InstantFeedback } from "./instant-feedback"
import { SmartPreloader } from "./smart-preloader"
import { BeautifulTheme } from "./beautiful-theme"
import { BeautifulGlassCard } from "./beautiful-glass-card"
import { AccessibilityPanel } from "./accessibility-panel"
import { EnhancedFocusRing, SkipLinks } from "./enhanced-focus-ring"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Heart, 
  Star, 
  Sparkles,
  Gamepad2,
  Trophy,
  Users,
  Settings
} from "lucide-react"

export function InteractiveSlideDemo() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [autoPlay, setAutoPlay] = React.useState(false)
  const [transition, setTransition] = React.useState<'slide' | 'fade' | 'scale' | 'rotate' | 'flip' | 'cube'>('slide')
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal')
  const [showGestures, setShowGestures] = React.useState(true)
  const [theme, setTheme] = React.useState<'aurora' | 'sunset' | 'ocean' | 'forest' | 'galaxy' | 'rainbow'>('aurora')
  const [accessibilityPanelOpen, setAccessibilityPanelOpen] = React.useState(false)
  const [accessibilitySettings, setAccessibilitySettings] = React.useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    darkMode: false,
    soundEnabled: true,
    hapticEnabled: true,
    colorBlind: 'none' as const,
    textSize: 'medium' as const,
    focusRing: true,
    keyboardNav: true,
    announcements: true
  })

  const slides = [
    {
      id: 1,
      title: "🎮 Slide Interactivo",
      content: "Esta es una demostración de los componentes premium con gestos y animaciones avanzadas.",
      color: "from-purple-600 to-pink-600",
      icon: Gamepad2
    },
    {
      id: 2,
      title: "⚡ Efectos Premium",
      content: "Botones con efectos de ripple, glow, shine, magnetic y particle para una experiencia única.",
      color: "from-blue-600 to-cyan-600",
      icon: Zap
    },
    {
      id: 3,
      title: "🏆 Controles Avanzados",
      content: "Navegación por gestos: deslizar, pellizcar, rotar, toques largos y dobles toques.",
      color: "from-green-600 to-emerald-600",
      icon: Trophy
    },
    {
      id: 4,
      title: "👥 Experiencia Fluida",
      content: "Transiciones suaves entre slides con múltiples efectos y configuraciones personalizables.",
      color: "from-yellow-500 to-orange-500",
      icon: Users
    }
  ]

  const transitions = [
    { value: 'slide', label: 'Deslizar', icon: '↔️' },
    { value: 'fade', label: 'Desvanecer', icon: '🌫️' },
    { value: 'scale', label: 'Escalar', icon: '🔍' },
    { value: 'rotate', label: 'Rotar', icon: '🔄' },
    { value: 'flip', label: 'Voltear', icon: '🔃' },
    { value: 'cube', label: 'Cubo', icon: '📦' }
  ]
  
  const themes = [
    { value: 'aurora', label: 'Aurora', icon: '🌌' },
    { value: 'sunset', label: 'Atardecer', icon: '🌅' },
    { value: 'ocean', label: 'Océano', icon: '🌊' },
    { value: 'forest', label: 'Bosque', icon: '🌲' },
    { value: 'galaxy', label: 'Galaxia', icon: '🌌' },
    { value: 'rainbow', label: 'Arcoíris', icon: '🌈' }
  ]

  const handleGesture = (action: string) => {
    console.log(`Gesture detected: ${action}`)
    
    switch (action) {
      case 'swipe-left':
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        break
      case 'swipe-right':
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        break
      case 'double-tap':
        setAutoPlay(!autoPlay)
        break
      case 'long-press':
        // Reset to first slide
        setCurrentSlide(0)
        break
    }
  }

  const handleAccessibilityChange = (newSettings: Partial<typeof accessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <SmartPreloader minimumDelay={800}>
      <BeautifulTheme 
        theme={theme} 
        intensity="vibrant" 
        animated={!accessibilitySettings.reducedMotion}
        accessibility={accessibilitySettings}
      >
        <SkipLinks />
        <div id="main-content" className="w-full h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '4px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>

      {/* Main slide container */}
      <div className="h-full relative">
        {showGestures ? (
          <FrictionReducer intensity="minimal" enablePredictive enableMagnetism>
            <GestureControls
            onSwipeLeft={() => handleGesture('swipe-left')}
            onSwipeRight={() => handleGesture('swipe-right')}
            onDoubleTap={() => handleGesture('double-tap')}
            onLongPress={() => handleGesture('long-press')}
            className="h-full"
          >
            <PremiumSlide
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
              autoPlay={autoPlay}
              autoPlayInterval={3000}
              transition={transition}
              direction={direction}
              className="h-full"
            >
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className="h-full flex items-center justify-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <BeautifulGlassCard 
                    variant={theme === 'forest' || theme === 'galaxy' ? 'cosmic' : theme} 
                    intensity="vibrant" 
                    className="max-w-4xl w-full text-center p-12"
                    animated={!accessibilitySettings.reducedMotion}
                    tilt={!accessibilitySettings.reducedMotion}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}
                    >
                      <slide.icon className="h-12 w-12 text-white" />
                    </motion.div>

                    <motion.h1
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-6xl font-black text-white mb-8"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl text-white/80 mb-12 leading-relaxed"
                    >
                      {slide.content}
                    </motion.p>

                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex gap-4 justify-center flex-wrap"
                    >
                      <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
                        <InstantFeedback responsiveness="instant" feedbackType="all">
                          <PremiumButton
                            variant="primary"
                            size="lg"
                            effect="ripple"
                            icon={<Heart />}
                            className="px-8"
                            aria-label="Me gusta este slide"
                          >
                            Me Gusta
                          </PremiumButton>
                        </InstantFeedback>
                      </EnhancedFocusRing>

                      <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
                        <InstantFeedback responsiveness="instant" feedbackType="all">
                          <PremiumButton
                            variant="secondary"
                            size="lg"
                            effect="glow"
                            icon={<Star />}
                            className="px-8"
                            aria-label="Marcar como favorito"
                          >
                            Favorito
                          </PremiumButton>
                        </InstantFeedback>
                      </EnhancedFocusRing>

                      <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
                        <InstantFeedback responsiveness="instant" feedbackType="all">
                          <PremiumButton
                            variant="glass"
                            size="lg"
                            effect="magnetic"
                            icon={<Sparkles />}
                            className="px-8"
                            aria-label="Compartir contenido"
                          >
                            Compartir
                          </PremiumButton>
                        </InstantFeedback>
                      </EnhancedFocusRing>
                    </motion.div>
                  </BeautifulGlassCard>
                </motion.div>
              ))}
            </PremiumSlide>
            </GestureControls>
          </FrictionReducer>
        ) : (
          <PremiumSlide
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            autoPlay={autoPlay}
            autoPlayInterval={3000}
            transition={transition}
            direction={direction}
            className="h-full"
          >
            {slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                className="h-full flex items-center justify-center p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="max-w-4xl w-full text-center p-12" blur="xl" opacity={10}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}
                  >
                    <slide.icon className="h-12 w-12 text-white" />
                  </motion.div>

                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-black text-white mb-8"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl text-white/80 mb-12 leading-relaxed"
                  >
                    {slide.content}
                  </motion.p>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4 justify-center flex-wrap"
                  >
                    <PremiumButton
                      variant="primary"
                      size="lg"
                      effect="ripple"
                      icon={<Heart />}
                      className="px-8"
                    >
                      Me Gusta
                    </PremiumButton>

                    <PremiumButton
                      variant="secondary"
                      size="lg"
                      effect="glow"
                      icon={<Star />}
                      className="px-8"
                    >
                      Favorito
                    </PremiumButton>

                    <PremiumButton
                      variant="glass"
                      size="lg"
                      effect="magnetic"
                      icon={<Sparkles />}
                      className="px-8"
                    >
                      Compartir
                    </PremiumButton>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ))}
          </PremiumSlide>
        )}
      </div>

      {/* Control panel */}
      <motion.div
        className="absolute bottom-8 left-8 right-8"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <BeautifulGlassCard variant={theme === 'forest' || theme === 'galaxy' ? 'cosmic' : theme} className="p-6" animated={!accessibilitySettings.reducedMotion}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Auto-play toggle */}
            <div className="flex items-center gap-3">
              <PremiumToggle
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
                label="Auto-play"
                icon={autoPlay ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                size="md"
                variant="success"
              />
            </div>

            {/* Direction toggle */}
            <div className="flex items-center gap-3">
              <PremiumToggle
                checked={direction === 'vertical'}
                onCheckedChange={(checked) => setDirection(checked ? 'vertical' : 'horizontal')}
                label="Vertical"
                icon={<RotateCcw className="h-4 w-4" />}
                size="md"
                variant="default"
              />
            </div>

            {/* Gestures toggle */}
            <div className="flex items-center gap-3">
              <PremiumToggle
                checked={showGestures}
                onCheckedChange={setShowGestures}
                label="Gestos"
                icon={<Settings className="h-4 w-4" />}
                size="md"
                variant="warning"
              />
            </div>

            {/* Theme selector */}
            <div className="flex gap-2 flex-wrap">
              {themes.slice(0, 3).map((t) => (
                <EnhancedFocusRing key={t.value} variant={accessibilitySettings.highContrast ? "high-contrast" : "default"}>
                  <PremiumButton
                    variant={theme === t.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setTheme(t.value as any)}
                    className="px-3"
                    aria-label={`Cambiar a tema ${t.label}`}
                  >
                    {t.icon} {t.label}
                  </PremiumButton>
                </EnhancedFocusRing>
              ))}
            </div>

            {/* Transition selector */}
            <div className="flex gap-2 flex-wrap">
              {transitions.slice(0, 3).map((t) => (
                <EnhancedFocusRing key={t.value} variant={accessibilitySettings.highContrast ? "high-contrast" : "default"}>
                  <PremiumButton
                    variant={transition === t.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setTransition(t.value as any)}
                    className="px-3"
                    aria-label={`Cambiar transición a ${t.label}`}
                  >
                    {t.icon} {t.label}
                  </PremiumButton>
                </EnhancedFocusRing>
              ))}
            </div>
          </div>
        </BeautifulGlassCard>
      </motion.div>

      {/* Accessibility button */}
      <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
        <motion.button
          className="fixed bottom-4 right-4 p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white z-40 hover:bg-white/20 transition-colors"
          whileHover={!accessibilitySettings.reducedMotion ? { scale: 1.1 } : {}}
          whileTap={!accessibilitySettings.reducedMotion ? { scale: 0.95 } : {}}
          onClick={() => setAccessibilityPanelOpen(true)}
          aria-label="Abrir panel de opciones de accesibilidad"
          id="accessibility-panel"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a7 7 0 0 1-7 7v-1.27c.6-.34 1-.99 1-1.73a2 2 0 0 1-4 0c0 .74.4 1.39 1 1.73V21a7 7 0 0 1-7-7H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M9 9a1 1 0 1 0 0 2a1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-3 4c-2 0-2 3-2 3s0 3 2 3s2-3 2-3s0-3-2-3Z"/>
          </svg>
        </motion.button>
      </EnhancedFocusRing>

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={accessibilityPanelOpen}
        onClose={() => setAccessibilityPanelOpen(false)}
        settings={accessibilitySettings}
        onSettingsChange={handleAccessibilityChange}
      />
    </div>
    </BeautifulTheme>
    </SmartPreloader>
  )
}