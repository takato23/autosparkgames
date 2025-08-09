'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { CorporateBranding } from '@/components/corporate-branding'
import { GradientCard, GradientHeader } from '@/components/ui/gradient-card'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { GradientButton } from '@/components/ui/gradient-button'
import { Heading } from '@/components/ui/heading'
import { AchievementBadge, AchievementGrid } from '@/components/achievement-badge'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Palette, 
  Trophy, 
  Volume2, 
  Globe,
  Shield,
  Download,
  Upload,
  CheckCircle
} from 'lucide-react'
import { theme } from '@/lib/theme'

// Mock achievements data
const sampleAchievements = [
  {
    id: '1',
    name: 'Primeros Pasos',
    description: 'Crea tu primera sesión',
    icon: 'star' as const,
    unlocked: true,
    rarity: 'common' as const
  },
  {
    id: '2',
    name: 'Anfitrión Estrella',
    description: '10 sesiones completadas',
    icon: 'crown' as const,
    unlocked: true,
    progress: 10,
    maxProgress: 10,
    rarity: 'rare' as const
  },
  {
    id: '3',
    name: 'Engagement Master',
    description: '100+ participantes en una sesión',
    icon: 'trophy' as const,
    unlocked: false,
    progress: 75,
    maxProgress: 100,
    rarity: 'epic' as const
  },
  {
    id: '4',
    name: 'Quiz Perfecto',
    description: 'Todos responden correctamente',
    icon: 'target' as const,
    unlocked: false,
    rarity: 'legendary' as const
  },
  {
    id: '5',
    name: 'Velocidad Relámpago',
    description: 'Respuesta en <2 segundos',
    icon: 'zap' as const,
    unlocked: true,
    rarity: 'rare' as const
  },
  {
    id: '6',
    name: 'Colaborador',
    description: 'Participa en 5 encuestas',
    icon: 'sparkles' as const,
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    rarity: 'common' as const
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'branding' | 'achievements' | 'media' | 'advanced'>('branding')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'branding', label: 'Marca', icon: Palette },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'media', label: 'Multimedia', icon: Upload },
    { id: 'advanced', label: 'Avanzado', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      <AnimatedBackground variant="subtle" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Heading level={1} className="mb-3 text-white">
            Configuración
          </Heading>
          <p className="text-xl text-white/90 font-medium">
            Personaliza tu experiencia AudienceSpark
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'branding' && (
            <CorporateBranding onSave={handleSave} />
          )}

          {activeTab === 'achievements' && (
            <GradientCard gradient="warning">
              <GradientHeader gradient="warning">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Sistema de Logros
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Desbloquea insignias y celebra tus éxitos
                </CardDescription>
              </GradientHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-orange-700 mb-4">
                    Tus Logros
                  </h3>
                  <AchievementGrid 
                    achievements={sampleAchievements}
                    onBadgeClick={(achievement) => {
                      console.log('Badge clicked:', achievement)
                    }}
                  />
                </div>
                
                <div className="mt-8 p-6 bg-orange-50 rounded-2xl">
                  <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Personaliza tus Insignias
                  </h4>
                  <p className="text-sm text-orange-600 mb-4">
                    Puedes subir imágenes personalizadas para cada logro (PNG/JPG, 200x200px recomendado)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <ImagePlaceholder
                        key={i}
                        type="badge"
                        uploadable
                        label={`Insignia ${i}`}
                        description="200x200px"
                        className="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-orange-600 mt-4">
                    ⚠️ Las imágenes de insignias deben ser claras y reconocibles a tamaño pequeño
                  </p>
                </div>
              </CardContent>
            </GradientCard>
          )}

          {activeTab === 'media' && (
            <GradientCard gradient="secondary">
              <GradientHeader gradient="secondary">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Biblioteca Multimedia
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Gestiona imágenes y videos para tus presentaciones
                </CardDescription>
              </GradientHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-4">
                    Fondos de Presentación
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <ImagePlaceholder
                        key={i}
                        type="background"
                        uploadable
                        label={`Fondo ${i}`}
                        description="1920x1080 recomendado"
                        aspectRatio="video"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-blue-600 mt-4">
                    ⚠️ Los fondos deben ser sutiles para no distraer del contenido
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-teal-700 mb-4">
                    Imágenes para Preguntas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <ImagePlaceholder
                        key={i}
                        type="question"
                        uploadable
                        label={`Imagen ${i}`}
                        description="800x600 mínimo"
                        aspectRatio="square"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-teal-600 mt-4">
                    ⚠️ Las imágenes deben ser claras y relevantes para las preguntas
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl">
                  <h4 className="font-bold text-blue-700 mb-3">
                    Consejos para Multimedia
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-600">
                    <li>• Usa imágenes de alta calidad pero optimizadas (máx 2MB)</li>
                    <li>• Los videos deben ser cortos (máx 30 segundos)</li>
                    <li>• Mantén un estilo visual consistente</li>
                    <li>• Evita contenido con derechos de autor</li>
                  </ul>
                </div>
              </CardContent>
            </GradientCard>
          )}

          {activeTab === 'advanced' && (
            <GradientCard gradient="secondary">
              <GradientHeader gradient="secondary">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Configuración Avanzada
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Opciones adicionales y preferencias
                </CardDescription>
              </GradientHeader>
              <CardContent className="p-6 space-y-6">
                {/* Sound Settings */}
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Efectos de Sonido
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                      <span className="text-blue-700">Sonidos de respuesta correcta/incorrecta</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                      <span className="text-blue-700">Efectos de celebración</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                      <span className="text-blue-700">Música de fondo</span>
                    </label>
                  </div>
                  <p className="text-xs text-blue-600 mt-3">
                    💡 Los sonidos ayudan a crear una experiencia más inmersiva
                  </p>
                </div>

                {/* Language Settings */}
                <div className="p-6 bg-indigo-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Idioma y Región
                  </h3>
                  <select className="w-full p-3 rounded-lg border-2 border-indigo-300 bg-white text-indigo-700 font-medium">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                {/* Privacy Settings */}
                <div className="p-6 bg-purple-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacidad
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
                      <span className="text-purple-700">Modo anónimo para participantes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                      <span className="text-purple-700">Guardar historial de sesiones</span>
                    </label>
                  </div>
                </div>

                {/* Export/Import */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Exportar/Importar
                  </h3>
                  <div className="flex gap-3">
                    <GradientButton gradient="secondary">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Configuración
                    </GradientButton>
                    <GradientButton gradient="primary">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Configuración
                    </GradientButton>
                  </div>
                </div>
              </CardContent>
            </GradientCard>
          )}
        </motion.div>

        {/* Save Notification */}
        {saved && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
          >
            <CheckCircle className="h-6 w-6" />
            <span className="font-bold">¡Configuración guardada!</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}