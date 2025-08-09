'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Users, 
  Target, 
  Zap,
  Clock,
  Users2,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { gameTemplates, createPresentationFromTemplate } from '@/lib/templates/gameTemplates'
import { createPresentation } from '@/lib/firebase/helpers/presentations'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const categoryIcons = {
  trivia: Trophy,
  ice_breaker: Users,
  team_building: Target,
  mixed: Sparkles
}

const categoryColors = {
  trivia: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  ice_breaker: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  team_building: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  mixed: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
}

export default function GameTemplatesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)

  const filteredTemplates = selectedCategory === 'all' 
    ? gameTemplates 
    : gameTemplates.filter(t => t.category === selectedCategory)

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      toast.error('Please sign in to use templates')
      return
    }

    setLoading(templateId)
    try {
      const template = gameTemplates.find(t => t.id === templateId)
      if (!template) throw new Error('Template not found')

      const presentationId = await createPresentation(user.uid, template.name, template.description)
      
      toast.success('Presentation created from template!')
      router.push(`/admin/presentations/${presentationId}/edit`)
    } catch (error) {
      console.error('Error creating presentation:', error)
      toast.error('Failed to create presentation')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Game Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready-to-use interactive games for meetings, events, and team building
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 flex-wrap"
        >
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All Templates
          </Button>
          <Button
            variant={selectedCategory === 'trivia' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('trivia')}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Trivia
          </Button>
          <Button
            variant={selectedCategory === 'ice_breaker' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('ice_breaker')}
          >
            <Users className="h-4 w-4 mr-2" />
            Ice Breakers
          </Button>
          <Button
            variant={selectedCategory === 'team_building' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('team_building')}
          >
            <Target className="h-4 w-4 mr-2" />
            Team Building
          </Button>
          <Button
            variant={selectedCategory === 'mixed' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('mixed')}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Mixed
          </Button>
        </motion.div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => {
            const Icon = categoryIcons[template.category]
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${categoryColors[template.category]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {template.difficulty && (
                        <Badge variant="secondary" className="capitalize">
                          {template.difficulty}
                        </Badge>
                      )}
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {template.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users2 className="h-4 w-4" />
                        {template.participants}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {template.slides.length} slides
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleUseTemplate(template.id)}
                      disabled={loading === template.id}
                    >
                      {loading === template.id ? (
                        'Creating...'
                      ) : (
                        <>
                          Use This Template
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Zap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No templates found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}