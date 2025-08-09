'use client'

import { BeautifulTheme } from '@/components/ui/beautiful-theme'
import { BeautifulGlassCard } from '@/components/ui/beautiful-glass-card'
import { AccessibilityPanel } from '@/components/ui/accessibility-panel'
import { EnhancedFocusRing } from '@/components/ui/enhanced-focus-ring'
import { PremiumButton } from '@/components/ui/premium-button'
import { PremiumToggle } from '@/components/ui/premium-toggle'
import { InstantFeedback } from '@/components/ui/instant-feedback'
import { Heart, Star, Settings } from 'lucide-react'
import { useState } from 'react'

export default function TestComponentsPage() {
  const [accessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false)
  const [accessibilitySettings, setAccessibilitySettings] = useState({
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

  const handleAccessibilityChange = (newSettings: Partial<typeof accessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <BeautifulTheme 
      theme="aurora" 
      intensity="vibrant" 
      animated={!accessibilitySettings.reducedMotion}
      accessibility={accessibilitySettings}
    >
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            Prueba de Componentes Premium ✨
          </h1>

          {/* Beautiful Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BeautifulGlassCard variant="aurora" className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Aurora Theme</h3>
              <p className="text-white/80">Tarjeta con efecto aurora</p>
            </BeautifulGlassCard>

            <BeautifulGlassCard variant="sunset" className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Sunset Theme</h3>
              <p className="text-white/80">Tarjeta con efecto atardecer</p>
            </BeautifulGlassCard>

            <BeautifulGlassCard variant="ocean" className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Ocean Theme</h3>
              <p className="text-white/80">Tarjeta con efecto océano</p>
            </BeautifulGlassCard>
          </div>

          {/* Enhanced Focus Rings & Buttons */}
          <BeautifulGlassCard variant="cosmic" className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Botones con Focus Rings</h3>
            <div className="flex gap-4 flex-wrap">
              <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
                <InstantFeedback>
                  <PremiumButton
                    variant="primary"
                    size="lg"
                    effect="ripple"
                    icon={<Heart />}
                    aria-label="Me gusta"
                  >
                    Me Gusta
                  </PremiumButton>
                </InstantFeedback>
              </EnhancedFocusRing>

              <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
                <InstantFeedback>
                  <PremiumButton
                    variant="secondary"
                    size="lg"
                    effect="glow"
                    icon={<Star />}
                    aria-label="Favorito"
                  >
                    Favorito
                  </PremiumButton>
                </InstantFeedback>
              </EnhancedFocusRing>
            </div>
          </BeautifulGlassCard>

          {/* Premium Toggles */}
          <BeautifulGlassCard variant="rainbow" className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Toggles Premium</h3>
            <div className="space-y-4">
              <PremiumToggle
                checked={accessibilitySettings.reducedMotion}
                onCheckedChange={(checked) => handleAccessibilityChange({ reducedMotion: checked })}
                label="Reducir Movimiento"
                description="Minimiza animaciones y transiciones"
                size="lg"
                variant="warning"
              />

              <PremiumToggle
                checked={accessibilitySettings.highContrast}
                onCheckedChange={(checked) => handleAccessibilityChange({ highContrast: checked })}
                label="Alto Contraste"
                description="Aumenta el contraste para mejor legibilidad"
                size="lg"
                variant="success"
              />
            </div>
          </BeautifulGlassCard>

          {/* Accessibility Button */}
          <div className="fixed bottom-6 right-6">
            <EnhancedFocusRing variant={accessibilitySettings.highContrast ? "high-contrast" : "vibrant"}>
              <button
                onClick={() => setAccessibilityPanelOpen(true)}
                className="p-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors"
                aria-label="Abrir panel de accesibilidad"
              >
                <Settings className="w-6 h-6" />
              </button>
            </EnhancedFocusRing>
          </div>

          {/* Accessibility Panel */}
          <AccessibilityPanel
            isOpen={accessibilityPanelOpen}
            onClose={() => setAccessibilityPanelOpen(false)}
            settings={accessibilitySettings}
            onSettingsChange={handleAccessibilityChange}
          />
        </div>
      </div>
    </BeautifulTheme>
  )
}