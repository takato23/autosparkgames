'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GradientCard, GradientHeader } from '@/components/ui/gradient-card'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { Input } from '@/components/ui/input'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { GradientButton } from '@/components/ui/gradient-button'
import { Badge } from '@/components/ui/badge'
import { Palette, Type, Sparkles, Building2 } from 'lucide-react'
import { theme } from '@/lib/theme'

interface BrandingConfig {
  companyName: string
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  backgroundUrl?: string
  font: 'modern' | 'classic' | 'playful'
}

export function CorporateBranding({ 
  onSave 
}: { 
  onSave?: (config: BrandingConfig) => void 
}) {
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    font: 'modern'
  })

  const colorPresets = [
    { name: 'Vibrante', primary: '#7c3aed', secondary: '#ec4899' },
    { name: 'Profesional', primary: '#3b82f6', secondary: '#10b981' },
    { name: 'Elegante', primary: '#1f2937', secondary: '#f59e0b' },
    { name: 'Energético', primary: '#ef4444', secondary: '#f97316' },
    { name: 'Natural', primary: '#059669', secondary: '#14b8a6' },
    { name: 'Creativo', primary: '#8b5cf6', secondary: '#f472b6' }
  ]

  const fontOptions = [
    { value: 'modern', label: 'Moderno', className: 'font-sans' },
    { value: 'classic', label: 'Clásico', className: 'font-serif' },
    { value: 'playful', label: 'Divertido', className: 'font-mono' }
  ]

  const handleLogoUpload = (file: File) => {
    // Aquí el usuario implementará la lógica de subida
    console.log('Logo subido:', file.name)
    // TODO: Implementar subida real y obtener URL
  }

  const handleBackgroundUpload = (file: File) => {
    // Aquí el usuario implementará la lógica de subida
    console.log('Fondo subido:', file.name)
    // TODO: Implementar subida real y obtener URL
  }

  return (
    <GradientCard gradient="primary">
      <GradientHeader gradient="primary">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Palette className="h-6 w-6" aria-hidden="true" />
          Personalización Corporativa
        </CardTitle>
        <CardDescription className="text-white/90 text-lg">
          Personaliza la experiencia con tu marca
        </CardDescription>
      </GradientHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-sm font-bold text-purple-700 mb-2 block">
            Nombre de la Empresa
          </label>
          <Input
            value={config.companyName}
            onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
            placeholder="Ej: Tech Corp"
            className="text-lg p-6 border-2 border-purple-300 bg-purple-50"
          />
        </motion.div>

        {/* Logo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="text-sm font-bold text-purple-700 mb-2 block">
              Logo de la Empresa
            </label>
            <ImagePlaceholder
              type="logo"
              uploadable
              label="Logo Principal"
              description="PNG/JPG, máx 2MB"
              onUpload={handleLogoUpload}
            />
            <p className="text-xs text-purple-600 mt-2">
              ⚠️ Necesitarás subir tu logo aquí
            </p>
          </div>
          
          <div>
            <label className="text-sm font-bold text-purple-700 mb-2 block">
              Imagen de Fondo
            </label>
            <ImagePlaceholder
              type="background"
              uploadable
              label="Fondo Personalizado"
              description="Opcional - 1920x1080 recomendado"
              onUpload={handleBackgroundUpload}
            />
            <p className="text-xs text-purple-600 mt-2">
              ⚠️ Puedes agregar un fondo corporativo
            </p>
          </div>
        </motion.div>

        {/* Color Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="text-sm font-bold text-purple-700 mb-3 block">
            Esquema de Colores
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setConfig({
                  ...config,
                  primaryColor: preset.primary,
                  secondaryColor: preset.secondary
                })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  config.primaryColor === preset.primary
                    ? 'border-purple-500 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
                aria-label={`Seleccionar esquema ${preset.name}`}
              >
                <div className="flex gap-2 justify-center mb-2">
                  <div 
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: preset.primary }}
                    aria-hidden="true"
                  />
                  <div 
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: preset.secondary }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">{preset.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Font Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="text-sm font-bold text-purple-700 mb-3 block flex items-center gap-2">
            <Type className="h-4 w-4" aria-hidden="true" />
            Tipografía
          </label>
          <div className="grid grid-cols-3 gap-3">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => setConfig({ ...config, font: font.value as any })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  config.font === font.value
                    ? 'border-purple-500 shadow-lg scale-105 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-300 bg-white'
                } ${font.className}`}
                aria-label={`Seleccionar tipografía ${font.label}`}
              >
                <p className="text-lg font-bold mb-1">Aa</p>
                <p className="text-sm">{font.label}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-purple-600 text-white">Vista Previa</Badge>
            <Sparkles className="h-5 w-5 text-purple-600" aria-hidden="true" />
          </div>
          
          <div 
            className="p-6 rounded-xl bg-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${config.primaryColor}20 0%, ${config.secondaryColor}20 100%)`
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center">
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                ) : (
                  <Building2 className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <h3 
                className={`text-2xl font-bold ${
                  config.font === 'modern' ? 'font-sans' :
                  config.font === 'classic' ? 'font-serif' :
                  'font-mono'
                }`}
                style={{ color: config.primaryColor }}
              >
                {config.companyName || 'Tu Empresa'}
              </h3>
            </div>
            <div className="flex gap-2">
              <div 
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: config.primaryColor }}
              >
                Botón Principal
              </div>
              <div 
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: config.secondaryColor }}
              >
                Botón Secundario
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <GradientButton
            onClick={() => onSave?.(config)}
            gradient="primary"
            size="lg"
            className="w-full"
          >
            Guardar Personalización
          </GradientButton>
        </motion.div>
      </CardContent>
    </GradientCard>
  )
}