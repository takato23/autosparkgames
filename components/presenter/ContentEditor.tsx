'use client'

import { useState } from 'react'
import { Card, Button, Input } from '@/lib/design-system/components'
import { ContentItem } from '@/lib/store/presenter'
import { Save, Eye, EyeOff } from 'lucide-react'

interface ContentEditorProps {
  content?: ContentItem
  onUpdate: (updates: Partial<ContentItem>) => void
  showPreview: boolean
}

export default function ContentEditor({ content, onUpdate, showPreview }: ContentEditorProps) {
  const [title, setTitle] = useState(content?.title || '')
  const [description, setDescription] = useState(content?.description || '')

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">Selecciona un elemento para editarlo</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    onUpdate({
      title,
      description,
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Editando: {content.subtype}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            >
              {showPreview ? 'Ocultar' : 'Ver'} Preview
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={handleSave}
            >
              Guardar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Título
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del contenido"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del contenido..."
              className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card className="h-full">
          <div className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                Editor de {content.subtype}
              </h3>
              <p className="text-gray-300">
                Editor específico para {content.subtype} estará aquí
              </p>
              {showPreview && (
                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Vista previa:</p>
                  <h4 className="font-medium text-white">{title || 'Sin título'}</h4>
                  {description && (
                    <p className="text-sm text-gray-300 mt-1">{description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}