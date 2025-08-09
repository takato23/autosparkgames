'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { GlassCard } from "./glass-card"
import { PremiumToggle } from "./premium-toggle"
import { PremiumButton } from "./premium-button"
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  Type, 
  Palette, 
  Zap, 
  Moon, 
  Sun, 
  Settings,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  Contrast,
  MousePointer
} from "lucide-react"

interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  darkMode: boolean
  soundEnabled: boolean
  hapticEnabled: boolean
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  textSize: 'small' | 'medium' | 'large' | 'xlarge'
  focusRing: boolean
  keyboardNav: boolean
  announcements: boolean
}

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: AccessibilitySettings
  onSettingsChange: (settings: Partial<AccessibilitySettings>) => void
}

export function AccessibilityPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}: AccessibilityPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'visual' | 'motor' | 'cognitive' | 'audio'>('visual')
  
  const tabs = [
    { id: 'visual', label: 'Visual', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { id: 'motor', label: 'Motor', icon: MousePointer, color: 'from-green-500 to-emerald-500' },
    { id: 'cognitive', label: 'Cognitivo', icon: Type, color: 'from-purple-500 to-pink-500' },
    { id: 'audio', label: 'Audio', icon: Volume2, color: 'from-orange-500 to-red-500' }
  ]
  
  const colorBlindOptions = [
    { value: 'none', label: 'Normal', description: 'Visión normal de colores' },
    { value: 'protanopia', label: 'Protanopia', description: 'Dificultad con rojos' },
    { value: 'deuteranopia', label: 'Deuteranopia', description: 'Dificultad con verdes' },
    { value: 'tritanopia', label: 'Tritanopia', description: 'Dificultad con azules' }
  ]
  
  const textSizeOptions = [
    { value: 'small', label: 'Pequeño', size: 'text-sm' },
    { value: 'medium', label: 'Mediano', size: 'text-base' },
    { value: 'large', label: 'Grande', size: 'text-lg' },
    { value: 'xlarge', label: 'Extra Grande', size: 'text-xl' }
  ]
  
  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    onSettingsChange({ [key]: value })
    
    // Announce changes for screen readers
    if (settings.announcements) {
      const announcement = `${key} ${value ? 'activado' : 'desactivado'}`
      announceToScreenReader(announcement)
    }
  }
  
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  const resetToDefaults = () => {
    const defaults: AccessibilitySettings = {
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
      announcements: true
    }
    onSettingsChange(defaults)
    announceToScreenReader('Configuración restaurada a valores predeterminados')
  }
  
  const renderVisualTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Configuración Visual</h3>
        
        <PremiumToggle
          checked={settings.highContrast}
          onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
          label="Alto Contraste"
          description="Aumenta el contraste para mejor legibilidad"
          icon={<Contrast className="h-4 w-4" />}
          variant="success"
        />
        
        <PremiumToggle
          checked={settings.darkMode}
          onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
          label="Modo Oscuro"
          description="Reduce la fatiga visual en ambientes oscuros"
          icon={settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          variant="default"
        />
        
        <PremiumToggle
          checked={settings.largeText}
          onCheckedChange={(checked) => handleSettingChange('largeText', checked)}
          label="Texto Grande"
          description="Aumenta el tamaño del texto globalmente"
          icon={<Type className="h-4 w-4" />}
          variant="warning"
        />
        
        <PremiumToggle
          checked={settings.focusRing}
          onCheckedChange={(checked) => handleSettingChange('focusRing', checked)}
          label="Indicador de Foco"
          description="Muestra bordes visibles al navegar con teclado"
          icon={<Eye className="h-4 w-4" />}
          variant="success"
        />
      </div>
      
      {/* Text size selector */}
      <div className="space-y-3">
        <label className="text-white font-medium">Tamaño de Texto</label>
        <div className="grid grid-cols-2 gap-2">
          {textSizeOptions.map((option) => (
            <PremiumButton
              key={option.value}
              variant={settings.textSize === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleSettingChange('textSize', option.value)}
              className={cn("justify-center", option.size)}
            >
              {option.label}
            </PremiumButton>
          ))}
        </div>
      </div>
      
      {/* Color blind support */}
      <div className="space-y-3">
        <label className="text-white font-medium">Soporte para Daltonismo</label>
        <div className="space-y-2">
          {colorBlindOptions.map((option) => (
            <PremiumButton
              key={option.value}
              variant={settings.colorBlind === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleSettingChange('colorBlind', option.value)}
              className="w-full justify-start text-left"
            >
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-70">{option.description}</div>
              </div>
            </PremiumButton>
          ))}
        </div>
      </div>
    </div>
  )
  
  const renderMotorTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Configuración Motora</h3>
      
      <PremiumToggle
        checked={settings.reducedMotion}
        onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
        label="Reducir Movimiento"
        description="Minimiza animaciones y transiciones"
        icon={<Zap className="h-4 w-4" />}
        variant="warning"
      />
      
      <PremiumToggle
        checked={settings.keyboardNav}
        onCheckedChange={(checked) => handleSettingChange('keyboardNav', checked)}
        label="Navegación por Teclado"
        description="Habilita navegación completa con teclado"
        icon={<MousePointer className="h-4 w-4" />}
        variant="success"
      />
      
      <PremiumToggle
        checked={settings.hapticEnabled}
        onCheckedChange={(checked) => handleSettingChange('hapticEnabled', checked)}
        label="Retroalimentación Háptica"
        description="Vibraciones en dispositivos compatibles"
        icon={<Zap className="h-4 w-4" />}
        variant="default"
      />
      
      <div className="bg-white/10 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Atajos de Teclado</h4>
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex justify-between">
            <span>Siguiente slide:</span>
            <code className="bg-white/20 px-2 py-1 rounded">→ o Espacio</code>
          </div>
          <div className="flex justify-between">
            <span>Slide anterior:</span>
            <code className="bg-white/20 px-2 py-1 rounded">←</code>
          </div>
          <div className="flex justify-between">
            <span>Pausar/Reproducir:</span>
            <code className="bg-white/20 px-2 py-1 rounded">P</code>
          </div>
          <div className="flex justify-between">
            <span>Ir al inicio:</span>
            <code className="bg-white/20 px-2 py-1 rounded">Home</code>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderCognitiveTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Configuración Cognitiva</h3>
      
      <PremiumToggle
        checked={settings.announcements}
        onCheckedChange={(checked) => handleSettingChange('announcements', checked)}
        label="Anuncios de Pantalla"
        description="Anuncia cambios para lectores de pantalla"
        icon={<Volume2 className="h-4 w-4" />}
        variant="success"
      />
      
      <div className="bg-white/10 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Consejos de Navegación</h4>
        <ul className="space-y-2 text-sm text-white/80">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-400" />
            <span>Usa Tab para navegar entre elementos</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-400" />
            <span>Enter o Espacio para activar botones</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-400" />
            <span>Esc para cerrar modales y menús</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-400" />
            <span>Alt + A para abrir panel de accesibilidad</span>
          </li>
        </ul>
      </div>
    </div>
  )
  
  const renderAudioTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Configuración de Audio</h3>
      
      <PremiumToggle
        checked={settings.soundEnabled}
        onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
        label="Efectos de Sonido"
        description="Reproducir sonidos de interacción"
        icon={settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        variant="success"
      />
      
      <div className="bg-white/10 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Información de Audio</h4>
        <p className="text-sm text-white/80">
          Los efectos de sonido proporcionan retroalimentación auditiva para las interacciones. 
          Esto incluye sonidos sutiles para navegación, éxito, error y notificaciones.
        </p>
      </div>
    </div>
  )
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50"
            role="dialog"
            aria-label="Panel de configuración de accesibilidad"
            aria-modal="true"
          >
            <GlassCard className="h-full rounded-none border-l border-white/20" blur="xl" opacity={15}>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Accesibilidad</h2>
                      <p className="text-sm text-white/60">Personaliza tu experiencia</p>
                    </div>
                  </div>
                  <PremiumButton
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Cerrar panel de accesibilidad"
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </PremiumButton>
                </div>
                
                {/* Tabs */}
                <div className="flex p-4 gap-2 border-b border-white/10">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <PremiumButton
                        key={tab.id}
                        variant={activeTab === tab.id ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id as any)}
                        className="flex-1"
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </PremiumButton>
                    )
                  })}
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'visual' && renderVisualTab()}
                  {activeTab === 'motor' && renderMotorTab()}
                  {activeTab === 'cognitive' && renderCognitiveTab()}
                  {activeTab === 'audio' && renderAudioTab()}
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-white/10 space-y-3">
                  <PremiumButton
                    variant="secondary"
                    size="sm"
                    onClick={resetToDefaults}
                    className="w-full"
                  >
                    Restaurar Predeterminados
                  </PremiumButton>
                  <p className="text-xs text-white/60 text-center">
                    Las configuraciones se guardan automáticamente
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}