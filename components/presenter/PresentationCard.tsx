'use client'

import { Card, Button, Badge } from '@/lib/design-system/components'
import { 
  Play, Edit, Copy, Trash2, Archive, MoreVertical,
  Gamepad2, FileText, Rocket, Users, Clock, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Presentation } from '@/lib/store/presenter'
import { usePresenterStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface PresentationCardProps {
  presentation: Presentation
  viewMode: 'grid' | 'list'
  onSelect: () => void
  onQuickLaunch: (id: string) => void
  isSelected: boolean
}

export default function PresentationCard({ 
  presentation, 
  viewMode, 
  onSelect,
  onQuickLaunch,
  isSelected 
}: PresentationCardProps) {
  const router = useRouter()
  const { duplicatePresentation, deletePresentation, archivePresentation } = usePresenterStore()
  const [showMenu, setShowMenu] = useState(false)

  const getTypeIcon = () => {
    switch (presentation.type) {
      case 'quiz': return FileText
      case 'game': return Gamepad2
      case 'mixed': return Rocket
      default: return FileText // Default fallback
    }
  }

  const getTypeColor = () => {
    switch (presentation.type) {
      case 'quiz': return 'from-blue-500 to-cyan-500'
      case 'game': return 'from-purple-500 to-pink-500'
      case 'mixed': return 'from-orange-500 to-red-500'
      default: return 'from-blue-500 to-cyan-500' // Default fallback
    }
  }

  const getStatusInfo = () => {
    switch (presentation.status) {
      case 'draft': 
        return { 
          color: 'bg-amber-600/20 text-amber-300 border-amber-500/30', 
          text: '📝 Borrador',
          description: 'En desarrollo'
        }
      case 'ready': 
        return { 
          color: 'bg-green-600/20 text-green-300 border-green-500/30', 
          text: '🚀 Listo',
          description: 'Listo para lanzar'
        }
      case 'active': 
        return { 
          color: 'bg-blue-600/20 text-blue-300 border-blue-500/30', 
          text: '🔴 En vivo',
          description: 'Sesión activa'
        }
      case 'archived': 
        return { 
          color: 'bg-gray-600/20 text-gray-300 border-gray-500/30', 
          text: '📦 Archivado',
          description: 'Guardado'
        }
      default: 
        return { 
          color: 'bg-gray-600/20 text-gray-300 border-gray-500/30', 
          text: '❓ Sin estado',
          description: 'Estado desconocido'
        }
    }
  }

  const handleDuplicate = () => {
    const newId = duplicatePresentation(presentation.id)
    toast.success('Presentación duplicada')
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta presentación?')) {
      deletePresentation(presentation.id)
      toast.success('Presentación eliminada')
    }
    setShowMenu(false)
  }

  const handleArchive = () => {
    archivePresentation(presentation.id)
    toast.success('Presentación archivada')
    setShowMenu(false)
  }

  const TypeIcon = getTypeIcon()

  if (viewMode === 'list') {
    return (
      <Card 
        variant={isSelected ? 'elevated' : 'default'}
        hover
        interactive
        onClick={onSelect}
        className="relative"
      >
        <div className="flex items-center gap-4 p-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor()} flex items-center justify-center flex-shrink-0`}>
            <TypeIcon className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {presentation.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusInfo().color}`}>
                {getStatusInfo().text}
              </span>
            </div>
            {presentation.description && (
              <p className="text-sm text-gray-300 truncate">
                {presentation.description}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{presentation.contents.length} items</span>
            <span>•</span>
            <span>{new Date(presentation.lastModified).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {presentation.status === 'ready' && (
              <Button
                size="sm"
                variant="success"
                leftIcon={<Play className="h-4 w-4" />}
                onClick={(e) => {
                  e.stopPropagation()
                  onQuickLaunch(presentation.id)
                }}
              >
                Lanzar
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Eye className="h-4 w-4" />}
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              Preview
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view
  return (
    <Card 
      variant={isSelected ? 'elevated' : 'default'}
      hover
      interactive
      onClick={onSelect}
      className="relative group"
    >
      {/* Preview Area */}
      <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-t-xl overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor()} opacity-20`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="h-16 w-16 text-white/30" />
        </div>
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {presentation.status === 'ready' && (
            <Button
              size="sm"
              variant="success"
              leftIcon={<Play className="h-4 w-4" />}
              onClick={(e) => {
                e.stopPropagation()
                onQuickLaunch(presentation.id)
              }}
            >
              Lanzar
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/presenter/edit/${presentation.id}`)
            }}
          >
            Editar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white truncate flex-1">
            {presentation.title}
          </h3>
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10"
              >
                <button
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDuplicate()
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Duplicar
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleArchive()
                  }}
                >
                  <Archive className="h-4 w-4" />
                  Archivar
                </button>
                <hr className="my-1 border-gray-600" />
                <button
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {presentation.description && (
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {presentation.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusInfo().color}`}>
            {getStatusInfo().text}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span>{presentation.contents.length} items</span>
            {presentation.analytics && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {presentation.analytics.uniqueParticipants}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}