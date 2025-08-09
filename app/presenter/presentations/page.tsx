 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, Search, Grid, List, Filter, MoreVertical,
  Gamepad2, FileText, Clock, Users, TrendingUp,
  Star, Copy, Edit, Trash2, Archive, Play, Eye
} from 'lucide-react'

// Mock data - en producción vendría del store
const mockPresentations = [
  {
    id: '1',
    title: 'Quiz de Cultura General',
    description: 'Preguntas sobre historia, geografía y arte',
    type: 'quiz',
    status: 'ready',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    participants: 45,
    duration: '15 min',
    slides: 8,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Bingo Interactivo',
    description: 'Bingo con números aleatorios y premios',
    type: 'game',
    status: 'active',
    createdAt: '2024-01-10',
    lastModified: '2024-01-18',
    participants: 23,
    duration: '20 min',
    slides: 5,
    rating: 4.9
  },
  {
    id: '3',
    title: 'Team Building Q1',
    description: 'Actividades para fortalecer el equipo',
    type: 'mixed',
    status: 'draft',
    createdAt: '2024-01-05',
    lastModified: '2024-01-12',
    participants: 0,
    duration: '30 min',
    slides: 12,
    rating: 0
  }
]

export default function PresentationsPage() {
  const router = useRouter()
  const [presentations, setPresentations] = useState(mockPresentations)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredPresentations = presentations.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || p.type === filterType
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500'
      case 'active': return 'bg-blue-500'
      case 'draft': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Listo'
      case 'active': return 'Activo'
      case 'draft': return 'Borrador'
      case 'archived': return 'Archivado'
      default: return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return FileText
      case 'game': return Gamepad2
      case 'mixed': return TrendingUp
      default: return FileText
    }
  }

  const handleDuplicate = (id: string) => {
    const presentation = presentations.find(p => p.id === id)
    if (presentation) {
      const newPresentation = {
        ...presentation,
        id: Date.now().toString(),
        title: `${presentation.title} (Copia)`,
        status: 'draft',
        participants: 0,
        rating: 0
      }
      setPresentations([...presentations, newPresentation])
    }
  }

  const handleArchive = (id: string) => {
    setPresentations(presentations.map(p => 
      p.id === id ? { ...p, status: 'archived' } : p
    ))
  }

  const handleDelete = (id: string) => {
    setPresentations(presentations.filter(p => p.id !== id))
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/10 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-background/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Mis presentaciones</h1>
            <p className="text-sm text-foreground/70">Gestiona y organiza tus presentaciones interactivas</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" onClick={() => router.push('/presenter/templates')} aria-label="Ver templates">
              Ver templates
            </Button>
            <Button size="lg" onClick={() => router.push('/presenter/new')} aria-label="Nueva presentación">
              <Plus className="h-5 w-5 mr-2" aria-hidden />
              Nueva presentación
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden />
                <span className="text-lg font-semibold">{presentations.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-emerald-400" aria-hidden />
                <span className="text-lg font-semibold">{presentations.filter(p => p.status === 'ready').length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Listas</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" aria-hidden />
                <span className="text-lg font-semibold">{presentations.reduce((acc, p) => acc + p.participants, 0)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Participantes</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" aria-hidden />
                <span className="text-lg font-semibold">{(presentations.reduce((acc, p) => acc + p.rating, 0) / presentations.filter(p => p.rating > 0).length || 0).toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating promedio</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar presentaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Buscar presentaciones"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filtrar por tipo"
            >
              <option value="all">Todos los tipos</option>
              <option value="quiz">Quiz</option>
              <option value="game">Juego</option>
              <option value="mixed">Mixto</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filtrar por estado"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="ready">Listo</option>
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} aria-label="Cambiar vista">
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {filteredPresentations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/5">
              <Search className="h-12 w-12 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="text-lg font-medium mb-2">No se encontraron presentaciones</h3>
            <p className="text-sm text-muted-foreground mb-4">Crea tu primera presentación o ajusta los filtros</p>
            <Button onClick={() => router.push('/presenter/new')} aria-label="Crear presentación">
              <Plus className="h-4 w-4 mr-2" aria-hidden />
              Crear presentación
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredPresentations.map((presentation) => {
              const TypeIcon = getTypeIcon(presentation.type)
              return (
                <Card key={presentation.id} className="h-full rounded-2xl border-white/10 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TypeIcon className="h-6 w-6 text-primary" aria-hidden />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-medium">{presentation.title}</CardTitle>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(presentation.status)}`} aria-hidden />
                          </div>
                          <CardDescription className="text-sm mt-1">{presentation.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" aria-label="Más opciones">
                          <MoreVertical className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-foreground/70">
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden /><span>{presentation.duration}</span></div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4" aria-hidden /><span>{presentation.participants}</span></div>
                      <div className="flex items-center gap-2"><FileText className="h-4 w-4" aria-hidden /><span>{presentation.slides} slides</span></div>
                      <div className="flex items-center gap-2"><Star className="h-4 w-4" aria-hidden /><span>{presentation.rating}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{getStatusText(presentation.status)}</Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/presenter/edit/${presentation.id}`)} aria-label="Ver">
                          <Eye className="h-4 w-4 mr-1" aria-hidden />
                          Ver
                        </Button>
                        <Button size="sm" onClick={() => router.push(`/presenter/edit/${presentation.id}`)} aria-label="Editar">
                          <Edit className="h-4 w-4 mr-1" aria-hidden />
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <Button variant="ghost" size="sm" onClick={() => handleDuplicate(presentation.id)} aria-label="Duplicar">
                        <Copy className="h-4 w-4 mr-1" aria-hidden />
                        Duplicar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleArchive(presentation.id)} aria-label="Archivar">
                        <Archive className="h-4 w-4 mr-1" aria-hidden />
                        Archivar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(presentation.id)} className="text-red-600 hover:text-red-700" aria-label="Eliminar">
                        <Trash2 className="h-4 w-4 mr-1" aria-hidden />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
} 