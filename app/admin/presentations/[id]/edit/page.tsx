'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  getPresentation, 
  updatePresentation, 
  updateSlide,
  deleteSlide,
  reorderSlides,
  addSlide
} from '@/lib/firebase/helpers/presentations'
import { 
  Presentation as PresentationModel, 
  Slide, 
  SlideType,
  TitleSlide,
  MultipleChoiceSlide,
  WordCloudSlide,
  QASlide,
  PollSlide,
  OpenTextSlide,
  RatingSlide
} from '@/lib/types/presentation'
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  GripVertical,
  Copy,
  Trash2,
  Eye,
  Settings2,
  Type,
  MessageSquare,
  Cloud,
  BarChart,
  FileText,
  Star,
  CheckSquare
} from 'lucide-react'
import SlideEditor from '@/components/admin/SlideEditor'
import SlideTemplates from '@/components/admin/SlideTemplates'

export default function EditPresentationPage() {
  const params = useParams()
  const router = useRouter()
  const presentationId = params.id as string
  
  const [presentation, setPresentation] = useState<PresentationModel | null>(null)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadPresentation()
  }, [presentationId])

  // Auto-save functionality
  useEffect(() => {
    if (presentation && !loading) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
      
      const timeout = setTimeout(() => {
        handleSave()
      }, 2000) // Auto-save after 2 seconds of inactivity
      
      setAutoSaveTimeout(timeout)
    }
    
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
    }
  }, [presentation])

  const loadPresentation = async () => {
    try {
      const data = await getPresentation(presentationId)
      if (data) {
        const normalized = data as unknown as PresentationModel
        setPresentation(normalized)
        if (normalized.slides && normalized.slides.length > 0) {
          setSelectedSlideId(normalized.slides[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading presentation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!presentation) return
    
    setSaving(true)
    try {
      await updatePresentation(presentationId, {
        title: presentation.title,
        description: presentation.description,
        slides: presentation.slides,
        settings: presentation.settings as any
      } as any)
    } catch (error) {
      console.error('Error saving presentation:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSlide = (slideId: string, updates: Partial<Slide>) => {
    if (!presentation) return
    
    const updatedSlides = presentation.slides.map(slide =>
      slide.id === slideId ? ({ ...slide, ...updates } as Slide) : slide
    )
    
    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
  }

  const handleDeleteSlide = async (slideId: string) => {
    if (!presentation || presentation.slides.length === 1) return
    
    if (confirm('Are you sure you want to delete this slide?')) {
      const filteredSlides = (presentation.slides as Slide[])
        .filter(slide => slide.id !== slideId)
        .map((slide, index) => ({ ...slide, order: index } as Slide))
      
      setPresentation({
        ...presentation,
        slides: filteredSlides
      })
      
      if (selectedSlideId === slideId) {
        setSelectedSlideId(filteredSlides[0]?.id || null)
      }
    }
  }

  const handleDuplicateSlide = (slideId: string) => {
    if (!presentation) return
    
    const slideIndex = presentation.slides.findIndex(s => s.id === slideId)
    const slideToDuplicate = presentation.slides[slideIndex]
    
    const duplicatedSlide: Slide = {
      ...slideToDuplicate,
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${slideToDuplicate.title} (Copy)`,
      order: slideIndex + 1
    } as Slide
    
    const updatedSlides: Slide[] = [
      ...presentation.slides.slice(0, slideIndex + 1),
      duplicatedSlide,
      ...presentation.slides.slice(slideIndex + 1).map(s => ({ ...s, order: s.order + 1 } as Slide))
    ]
    
    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
    
    setSelectedSlideId(duplicatedSlide.id)
  }

  const handleAddSlide = (slideTemplate: Omit<Slide, 'id' | 'order'>) => {
    if (!presentation) return
    
    const newSlide: Slide = {
      ...slideTemplate,
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: presentation.slides.length
    } as Slide
    
    setPresentation({
      ...presentation,
      slides: [...presentation.slides, newSlide]
    })
    
    setSelectedSlideId(newSlide.id)
    setShowTemplates(false)
  }

  const handleDragStart = (e: React.DragEvent, slideId: string) => {
    setDraggedSlideId(slideId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetSlideId: string) => {
    e.preventDefault()
    
    if (!draggedSlideId || !presentation || draggedSlideId === targetSlideId) return
    
    const draggedIndex = presentation.slides.findIndex(s => s.id === draggedSlideId)
    const targetIndex = presentation.slides.findIndex(s => s.id === targetSlideId)
    
    const newSlides: Slide[] = [...presentation.slides]
    const [removed] = newSlides.splice(draggedIndex, 1)
    newSlides.splice(targetIndex, 0, removed)
    
    const reorderedSlides: Slide[] = newSlides.map((slide, index) => ({
      ...slide,
      order: index
    }))
    
    setPresentation({
      ...presentation,
      slides: reorderedSlides
    })
    
    setDraggedSlideId(null)
  }

  const getSlideIcon = (type: SlideType) => {
    switch (type) {
      case SlideType.TITLE: return <Type className="h-4 w-4" />
      case SlideType.MULTIPLE_CHOICE: return <CheckSquare className="h-4 w-4" />
      case SlideType.WORD_CLOUD: return <Cloud className="h-4 w-4" />
      case SlideType.QA: return <MessageSquare className="h-4 w-4" />
      case SlideType.POLL: return <BarChart className="h-4 w-4" />
      case SlideType.OPEN_TEXT: return <FileText className="h-4 w-4" />
      case SlideType.RATING: return <Star className="h-4 w-4" />
      default: return <Type className="h-4 w-4" />
    }
  }

  const selectedSlide = presentation?.slides.find(s => s.id === selectedSlideId)

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading presentation...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!presentation) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Presentation not found</p>
          <Button onClick={() => router.push('/admin/presentations')} className="mt-4">
            Back to Presentations
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="border-b dark:border-gray-700 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/presentations')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <Input
                  value={presentation.title}
                  onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
                  className="text-xl font-bold border-none p-0 focus:ring-0"
                  placeholder="Presentation Title"
                />
                <Input
                  value={presentation.description || ''}
                  onChange={(e) => setPresentation({ ...presentation, description: e.target.value })}
                  className="text-sm text-gray-600 border-none p-0 focus:ring-0 mt-1"
                  placeholder="Add a description..."
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Panel - Slide List */}
          <div className="w-64 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Slides</h3>
              <Button
                size="sm"
                onClick={() => setShowTemplates(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {presentation.slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  draggable
                  // framer-motion types collide with native drag events for onDragStart prop
                  // use native handlers on element instead
                  onPointerDown={() => {}}
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, slide.id)}
                  onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent)}
                  onDrop={(e) => handleDrop(e as unknown as React.DragEvent, slide.id)}
                  className={`
                    group relative p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedSlideId === slide.id 
                      ? 'bg-orange-100 dark:bg-orange-900/20 border-2 border-orange-500' 
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={() => setSelectedSlideId(slide.id)}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSlideIcon(slide.type)}
                        <span className="text-xs text-gray-500">Slide {index + 1}</span>
                      </div>
                      <p className="font-medium text-sm line-clamp-2">{slide.title}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicateSlide(slide.id)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {presentation.slides.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSlide(slide.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center - Slide Preview */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-8 overflow-y-auto">
            {selectedSlide ? (
              <div className="max-w-4xl mx-auto">
                <Card className="aspect-[16/9] flex items-center justify-center">
                  <CardContent className="text-center p-12">
                    <h2 className="text-4xl font-bold mb-4">{selectedSlide.title}</h2>
                    {/* Add slide-specific preview content here */}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a slide to preview
              </div>
            )}
          </div>

          {/* Right Panel - Slide Editor */}
          <div className="w-80">
            {selectedSlide ? (
              <SlideEditor
                slide={selectedSlide}
                onUpdate={(updates) => handleUpdateSlide(selectedSlide.id, updates)}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-gray-500">
                  Select a slide to edit
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Template Modal */}
        <AnimatePresence>
          {showTemplates && (
            <SlideTemplates
              onSelect={handleAddSlide}
              onClose={() => setShowTemplates(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}