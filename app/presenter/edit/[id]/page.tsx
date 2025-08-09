'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePresenterStore, useUIStore } from '@/lib/store'
import { useAutoSave, useUnsavedChangesWarning } from '@/lib/hooks/useAutoSave'
import { useCollaboration } from '@/lib/hooks/useCollaboration'
import { Button, Input, Card, Badge } from '@/lib/design-system/components'
import CollaboratorCursors from '@/components/collaboration/CollaboratorCursors'
import CollaboratorsList from '@/components/collaboration/CollaboratorsList'
import ChangeHistory from '@/components/collaboration/ChangeHistory'
import { 
  ArrowLeft, Save, Play, Clock, RotateCcw, 
  Plus, Trash2, GripVertical, Eye, Settings,
  CheckCircle2, AlertCircle, Users
} from 'lucide-react'
import { toast } from 'sonner'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import ContentEditor from '@/components/presenter/ContentEditor'
import ContentList from '@/components/presenter/ContentList'
import PresentationSettings from '@/components/presenter/PresentationSettings'

export default function EditPresentationPage() {
  const router = useRouter()
  const params = useParams()
  const presentationId = params.id as string
  
  const { presentations, updatePresentation } = usePresenterStore()
  const { showPreview, togglePreview } = useUIStore()
  
  const presentation = presentations.find(p => p.id === presentationId)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(true)
  
  // Mock user data - in real app this would come from auth
  const [currentUser] = useState(() => ({
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    name: 'Usuario ' + Math.floor(Math.random() * 100),
    email: 'user@example.com',
  }))

  // Auto-save setup
  const {
    save,
    isSaving,
    lastSaved,
    getVersionHistory,
    restoreVersion,
    hasUnsavedChanges,
  } = useAutoSave({
    presentationId,
    enabled: true,
    interval: 30000, // 30 seconds
    onSave: () => {
      console.log('Auto-saved successfully')
    },
    onError: (error) => {
      console.error('Auto-save error:', error)
      toast.error('Error al guardar automáticamente')
    },
  })

  // Warn about unsaved changes
  useUnsavedChangesWarning(hasUnsavedChanges)
  
  // Set up real-time collaboration
  const { isConnected, collaborators, sendContentChange } = useCollaboration({
    presentationId,
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    onError: (error) => {
      toast.error(`Error de colaboración: ${error}`)
    },
  })

  // Load presentation data
  useEffect(() => {
    if (presentation) {
      setTitle(presentation.title)
      setDescription(presentation.description || '')
    } else {
      toast.error('Presentación no encontrada')
      router.push('/presenter')
    }
  }, [presentation, router])

  const handleTitleChange = (newTitle: string) => {
    const oldTitle = title
    setTitle(newTitle)
    updatePresentation(presentationId, { title: newTitle })
    
    // Send collaboration change
    sendContentChange({
      type: 'update',
      target: 'presentation',
      targetId: presentationId,
      before: { title: oldTitle },
      after: { title: newTitle },
      description: `Cambió el título a "${newTitle}"`,
    })
  }

  const handleDescriptionChange = (newDescription: string) => {
    const oldDescription = description
    setDescription(newDescription)
    updatePresentation(presentationId, { description: newDescription })
    
    // Send collaboration change
    sendContentChange({
      type: 'update',
      target: 'presentation',
      targetId: presentationId,
      before: { description: oldDescription },
      after: { description: newDescription },
      description: `Actualizó la descripción`,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id && presentation) {
      const oldIndex = presentation.contents.findIndex((item) => item.id === active.id)
      const newIndex = presentation.contents.findIndex((item) => item.id === over.id)
      
      const newContents = arrayMove(presentation.contents, oldIndex, newIndex)
        .map((item, index) => ({ ...item, order: index }))
      
      updatePresentation(presentationId, { contents: newContents })
      
      // Send collaboration change
      sendContentChange({
        type: 'reorder',
        target: 'content',
        targetId: active.id as string,
        before: { order: oldIndex },
        after: { order: newIndex },
        description: `Reordenó el contenido`,
      })
    }
  }

  const addContent = (type: 'slide' | 'game', subtype: string) => {
    if (!presentation) return
    
    const newContent = {
      id: `content-${Date.now()}`,
      type,
      subtype,
      title: `Nuevo ${type === 'game' ? 'Juego' : 'Slide'}`,
      order: presentation.contents.length,
    }
    
    updatePresentation(presentationId, {
      contents: [...presentation.contents, newContent],
    })
    
    setSelectedContent(newContent.id)
    toast.success('Contenido añadido')
    
    // Send collaboration change
    sendContentChange({
      type: 'create',
      target: 'content',
      targetId: newContent.id,
      after: newContent,
      description: `Agregó ${type === 'slide' ? 'una diapositiva' : 'un juego'} ${subtype}`,
    })
  }

  const removeContent = (contentId: string) => {
    if (!presentation) return
    
    const contentToRemove = presentation.contents.find(c => c.id === contentId)
    const newContents = presentation.contents
      .filter(c => c.id !== contentId)
      .map((item, index) => ({ ...item, order: index }))
    
    updatePresentation(presentationId, { contents: newContents })
    
    if (selectedContent === contentId) {
      setSelectedContent(null)
    }
    
    toast.success('Contenido eliminado')
    
    // Send collaboration change
    if (contentToRemove) {
      sendContentChange({
        type: 'delete',
        target: 'content',
        targetId: contentId,
        before: contentToRemove,
        description: `Eliminó ${contentToRemove.type === 'slide' ? 'una diapositiva' : 'un juego'}`,
      })
    }
  }

  const updateContent = (contentId: string, updates: any) => {
    if (!presentation) return
    
    const oldContent = presentation.contents.find(c => c.id === contentId)
    const newContents = presentation.contents.map(c =>
      c.id === contentId ? { ...c, ...updates } : c
    )
    
    updatePresentation(presentationId, { contents: newContents })
    
    // Send collaboration change
    if (oldContent) {
      sendContentChange({
        type: 'update',
        target: 'content',
        targetId: contentId,
        before: oldContent,
        after: { ...oldContent, ...updates },
        description: `Actualizó ${oldContent.type === 'slide' ? 'la diapositiva' : 'el juego'} "${oldContent.title}"`,
      })
    }
  }

  const markAsReady = () => {
    updatePresentation(presentationId, { status: 'ready' })
    save()
    toast.success('Presentación lista para lanzar')
    router.push('/presenter')
  }

  if (!presentation) return null

  // Helper function to format time
  const getTimeSince = (timestamp: string | Date) => {
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push('/presenter')}
              >
                Volver
              </Button>
              
              <div className="flex items-center gap-3">
                <Badge variant={presentation.status === 'ready' ? 'success' : 'default'}>
                  {presentation.status}
                </Badge>
                
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  {isSaving ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <span>Guardando...</span>
                    </>
                  ) : hasUnsavedChanges ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Cambios sin guardar</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Guardado {lastSaved && `hace ${getTimeSince(new Date(lastSaved))}`}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Collaboration indicator */}
              {isConnected && collaborators.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                  <Users className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/80">
                    {collaborators.length + 1} editando
                  </span>
                </div>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Users className="h-4 w-4" />}
                onClick={() => setShowCollaboration(!showCollaboration)}
                className={showCollaboration && isConnected ? 'bg-white/10' : ''}
              >
                Colaboración
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={() => setShowVersionHistory(true)}
              >
                Historial
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Settings className="h-4 w-4" />}
                onClick={() => setShowSettings(true)}
              >
                Configuración
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Eye className="h-4 w-4" />}
                onClick={togglePreview}
              >
                {showPreview ? 'Ocultar' : 'Ver'} Preview
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Save className="h-4 w-4" />}
                onClick={save}
                disabled={!hasUnsavedChanges}
              >
                Guardar
              </Button>
              
              {presentation.status === 'draft' && (
                <Button
                  size="sm"
                  variant="success"
                  leftIcon={<Play className="h-4 w-4" />}
                  onClick={markAsReady}
                >
                  Marcar como lista
                </Button>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título de la presentación"
              className="text-2xl font-bold h-auto py-2"
            />
            <Input
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Descripción (opcional)"
              className="text-white/70"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content List */}
        <div className="w-80 border-r border-gray-700 overflow-y-auto">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={presentation.contents.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <ContentList
                contents={presentation.contents}
                selectedContent={selectedContent}
                onSelectContent={setSelectedContent}
                onAddContent={addContent}
                onRemoveContent={removeContent}
                onUpdateContent={updateContent}
              />
            </SortableContext>
          </DndContext>
        </div>

        {/* Content Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedContent ? (
            <ContentEditor
              content={presentation.contents.find(c => c.id === selectedContent)}
              onUpdate={(updates) => updateContent(selectedContent, updates)}
              showPreview={showPreview}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-10 w-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Selecciona o añade contenido
                </h3>
                <p className="text-white/60">
                  Comienza añadiendo slides o juegos a tu presentación
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <PresentationSettings
          presentation={presentation}
          onUpdate={(settings) => updatePresentation(presentationId, { settings })}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistoryModal
          versions={getVersionHistory()}
          onRestore={restoreVersion}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
      
      {/* Collaboration Components */}
      {showCollaboration && isConnected && (
        <>
          <CollaboratorCursors />
          <CollaboratorsList />
          <ChangeHistory />
        </>
      )}
    </div>
  )
}

// Version History Modal Component
function VersionHistoryModal({ versions, onRestore, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Historial de versiones</h2>
          <p className="text-white/60 mt-1">Restaura versiones anteriores de tu presentación</p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {versions.length === 0 ? (
            <p className="text-center text-white/60 py-8">
              No hay versiones guardadas aún
            </p>
          ) : (
            <div className="space-y-3">
              {versions.map((version: any) => (
                <Card key={version.id} variant="default" className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {version.changes}
                      </p>
                      <p className="text-sm text-white/60">
                        {new Date(version.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        onRestore(version.id)
                        onClose()
                      }}
                    >
                      Restaurar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  )
}

function getTimeSince(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}