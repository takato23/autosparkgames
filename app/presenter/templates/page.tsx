'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, Palette, Gamepad2, Users, Brain, Target,
  Star, Clock, Zap, ArrowRight, Plus, Eye, Search
} from 'lucide-react'

const templates = [
  {
    id: 'trivia',
    name: 'Trivia Rápida',
    description: 'Preguntas y respuestas interactivas con puntuación',
    icon: Trophy,
    color: 'bg-blue-500',
    time: '2 min',
    difficulty: 'Fácil',
    participants: '5-50',
    rating: 4.8,
    uses: 1247,
    badge: 'Popular'
  },
  {
    id: 'pictionary',
    name: 'Pictionary',
    description: 'Dibuja y adivina en tiempo real',
    icon: Palette,
    color: 'bg-green-500',
    time: '3 min',
    difficulty: 'Medio',
    participants: '3-20',
    rating: 4.6,
    uses: 892,
    badge: 'Nuevo'
  },
  {
    id: 'bingo',
    name: 'Bingo Interactivo',
    description: 'Bingo con números aleatorios y premios',
    icon: Gamepad2,
    color: 'bg-purple-500',
    time: '1 min',
    difficulty: 'Fácil',
    participants: '10-100',
    rating: 4.9,
    uses: 2156,
    badge: 'Top'
  },
  {
    id: 'team-challenge',
    name: 'Desafío de Equipos',
    description: 'Competencia colaborativa por equipos',
    icon: Users,
    color: 'bg-orange-500',
    time: '5 min',
    difficulty: 'Medio',
    participants: '6-30',
    rating: 4.7,
    uses: 567,
    badge: 'Teams'
  },
  {
    id: 'memory-game',
    name: 'Juego de Memoria',
    description: 'Encuentra las parejas ocultas',
    icon: Brain,
    color: 'bg-pink-500',
    time: '4 min',
    difficulty: 'Medio',
    participants: '2-15',
    rating: 4.5,
    uses: 334,
    badge: 'Brain'
  },
  {
    id: 'target-practice',
    name: 'Práctica de Objetivos',
    description: 'Apunta y acierta para ganar puntos',
    icon: Target,
    color: 'bg-red-500',
    time: '3 min',
    difficulty: 'Difícil',
    participants: '1-10',
    rating: 4.4,
    uses: 189,
    badge: 'Skill'
  }
]

export default function TemplatesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'Todos', count: templates.length },
    { id: 'popular', name: 'Populares', count: templates.filter(t => t.badge === 'Popular' || t.badge === 'Top').length },
    { id: 'new', name: 'Nuevos', count: templates.filter(t => t.badge === 'Nuevo').length },
    { id: 'easy', name: 'Fáciles', count: templates.filter(t => t.difficulty === 'Fácil').length },
    { id: 'teams', name: 'Equipos', count: templates.filter(t => t.badge === 'Teams').length }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' ||
      (selectedCategory === 'popular' && (template.badge === 'Popular' || template.badge === 'Top')) ||
      (selectedCategory === 'new' && template.badge === 'Nuevo') ||
      (selectedCategory === 'easy' && template.difficulty === 'Fácil') ||
      (selectedCategory === 'teams' && template.badge === 'Teams')
    
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (templateId: string) => {
    router.push(`/presenter/new?template=${templateId}`)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-gray-900 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Templates
              </h1>
              <p className="text-gray-300 mt-1">
                Plantillas predefinidas para crear juegos rápidamente
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/presenter/new')}
              >
                Crear desde Cero
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-semibold">{templates.length}</span>
              </div>
              <p className="text-gray-400 text-sm">Templates</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-white font-semibold">5,385</span>
              </div>
              <p className="text-gray-400 text-sm">Usos totales</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-400" />
                <span className="text-white font-semibold">3 min</span>
              </div>
              <p className="text-gray-400 text-sm">Promedio setup</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <span className="text-white font-semibold">4.7</span>
              </div>
              <p className="text-gray-400 text-sm">Rating promedio</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${template.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <template.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {template.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{template.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{template.participants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{template.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-600">{template.rating}</span>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {template.uses.toLocaleString()} usos
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Vista previa
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Usar
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No se encontraron templates
              </h3>
              <p className="text-gray-400 mb-4">
                Intenta con otros términos de búsqueda o categorías
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}