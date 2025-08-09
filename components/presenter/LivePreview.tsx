'use client'

import { useState, useEffect } from 'react'
import { usePresenterStore } from '@/lib/store'
import { Button, Badge, Card } from '@/lib/design-system/components'
import { X, Play, Edit, Maximize2, ChevronLeft, ChevronRight, Layers, Eye, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { ContentItem } from '@/lib/store/presenter'

interface LivePreviewProps {
  presentationId: string
  onClose: () => void
  onLaunch: (id: string) => void
}

export default function LivePreview({ presentationId, onClose, onLaunch }: LivePreviewProps) {
  const router = useRouter()
  const { presentations } = usePresenterStore()
  const presentation = presentations.find(p => p.id === presentationId)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [viewMode, setViewMode] = useState<'presenter' | 'audience'>('presenter')

  if (!presentation) return null

  const currentContent = presentation.contents[currentSlide]

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleNext = () => {
    if (currentSlide < presentation.contents.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-ui-border-subtle p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">
              {presentation.title}
            </h2>
            {presentation.description && (
              <p className="text-sm text-white/60">
                {presentation.description}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm">
              {presentation.type}
            </Badge>
            <Badge variant={presentation.status === 'ready' ? 'success' : 'default'} size="sm">
              {presentation.status}
            </Badge>
            <span className="text-sm text-white/60">
              {presentation.contents.length} elementos
            </span>
          </div>

          <div className="flex items-center gap-2">
            {presentation.status === 'ready' && (
              <Button
                size="sm"
                variant="success"
                leftIcon={<Play className="h-4 w-4" />}
                onClick={() => onLaunch(presentation.id)}
              >
                Lanzar
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => router.push(`/presenter/edit/${presentation.id}`)}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex-shrink-0 p-4 border-b border-ui-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex bg-white/5 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'presenter' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('presenter')}
              className="px-3"
              leftIcon={<Eye className="h-4 w-4" />}
            >
              Vista Presentador
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'audience' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('audience')}
              className="px-3"
              leftIcon={<Users className="h-4 w-4" />}
            >
              Vista Audiencia
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Maximize2 className="h-4 w-4" />}
          >
            Pantalla completa
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-ui-background-primary to-ui-background-secondary p-6">
        <div className="h-full flex flex-col">
          {/* Slide Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">
                Slide {currentSlide + 1} de {presentation.contents.length}
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleNext}
              disabled={currentSlide === presentation.contents.length - 1}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Siguiente
            </Button>
          </div>

          {/* Slide Content */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card variant="elevated" className="h-full flex items-center justify-center">
                  {currentContent ? (
                    <div className="text-center p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {currentContent.title}
                      </h3>
                      {currentContent.description && (
                        <p className="text-lg text-white/70">
                          {currentContent.description}
                        </p>
                      )}
                      <div className="mt-6">
                        <Badge variant="gaming" size="lg">
                          {currentContent.type} - {currentContent.subtype}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Layers className="h-16 w-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/60">
                        Sin contenido de vista previa
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {presentation.contents.map((content, index) => (
              <button
                key={content.id}
                onClick={() => setCurrentSlide(index)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg border-2 transition-all ${
                  index === currentSlide
                    ? 'border-primary-500 ring-2 ring-primary-500/50'
                    : 'border-ui-border-subtle hover:border-ui-border-default'
                }`}
              >
                <div className="w-full h-full bg-white/5 rounded-md flex items-center justify-center">
                  <span className="text-xs text-white/60">
                    {index + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with metadata */}
      <div className="flex-shrink-0 border-t border-ui-border-subtle p-4">
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>Última modificación: {new Date(presentation.lastModified).toLocaleDateString()}</span>
          {presentation.analytics && (
            <div className="flex items-center gap-4">
              <span>{presentation.analytics.views} vistas</span>
              <span>•</span>
              <span>{presentation.analytics.uniqueParticipants} participantes únicos</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}