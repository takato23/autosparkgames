'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { db } from '@/lib/firebase/config'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Save,
  Play,
  Plus,
  Settings,
  Share2,
  Users,
  Clock,
  CheckCircle2
} from 'lucide-react'

export default function EditPresentationPage() {
  const router = useRouter()
  const params = useParams()
  const presentationId = params.id as string
  
  const [presentation, setPresentation] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPresentation()
  }, [presentationId])

  const loadPresentation = async () => {
    try {
      const docRef = doc(db, 'presentations', presentationId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setPresentation({ id: docSnap.id, ...data })
        setTitle(data.title || '')
        setDescription(data.description || '')
      } else {
        toast.error('Presentación no encontrada')
        router.push('/presenter')
      }
    } catch (error) {
      console.error('Error loading presentation:', error)
      toast.error('Error al cargar la presentación')
    } finally {
      setIsLoading(false)
    }
  }

  const savePresentation = async () => {
    if (!title.trim()) {
      toast.error('El título es requerido')
      return
    }

    setIsSaving(true)
    try {
      const docRef = doc(db, 'presentations', presentationId)
      await updateDoc(docRef, {
        title: title.trim(),
        description: description.trim(),
        updatedAt: serverTimestamp()
      })
      
      toast.success('Cambios guardados')
    } catch (error) {
      console.error('Error saving presentation:', error)
      toast.error('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  const launchPresentation = async () => {
    // TODO: Implementar lanzamiento de presentación
    toast.info('Función de lanzamiento próximamente')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/presenter')}
            className="mb-4 bg-white/15 text-white border-white/40 hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 drop-shadow">Editar Presentación</h1>
              <p className="text-white/90">Modifica y gestiona tu contenido interactivo</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={savePresentation}
                disabled={isSaving}
                className="bg-white/15 text-white border-white/40 hover:bg-white/25"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                size="lg"
                onClick={launchPresentation}
                className="shadow-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Lanzar Presentación
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="bg-white/12 backdrop-blur-md border-white/25">
              <CardHeader>
                <CardTitle className="text-white">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/20 border-white/40 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Descripción</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/20 border-white/40 text-white placeholder:text-white/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="bg-white/12 backdrop-blur-md border-white/25">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Contenido</span>
                  <Button size="sm" className="shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </CardTitle>
                <CardDescription className="text-white/80">
                  {presentation?.contents?.length || 0} elementos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {presentation?.contents?.length > 0 ? (
                  <div className="space-y-3">
                    {presentation.contents.map((content: any, index: number) => (
                      <div 
                        key={content.id}
                        className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white/60 font-medium">#{index + 1}</span>
                          <span className="text-white font-medium">{content.title}</span>
                          {content.type === 'game' && (
                            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-200 rounded-full">Juego</span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/60 hover:text-white hover:bg-white/20"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <p>No hay contenido aún</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="bg-white/12 backdrop-blur-md border-white/25">
              <CardHeader>
                <CardTitle className="text-white">Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-white">Guardado automáticamente</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-white/60" />
                  <span className="text-white/80">{presentation?.participantCount || 0} participantes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-white/60" />
                  <span className="text-white/80">Creado {new Date(presentation?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/12 backdrop-blur-md border-white/25">
              <CardHeader>
                <CardTitle className="text-white">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled
                  onClick={() => {}}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push('/presenter')}
                >
                  Volver al Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}