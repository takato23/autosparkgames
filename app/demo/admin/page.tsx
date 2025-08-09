'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Presentation, 
  Users, 
  Trophy,
  Sparkles,
  Plus,
  Play,
  Edit,
  Copy
} from 'lucide-react'
import { mockPresentations } from '@/lib/mockData'

const stats = [
  { label: 'Presentaciones', value: '2', icon: Presentation, color: 'text-blue-600' },
  { label: 'Sesiones Activas', value: '1', icon: Play, color: 'text-green-600' },
  { label: 'Participantes', value: '14', icon: Users, color: 'text-purple-600' },
  { label: 'Juegos Disponibles', value: '5', icon: Trophy, color: 'text-orange-600' }
]

export default function DemoAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Dashboard Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora las funciones de administración de AudienceSpark
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Presentations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mis Presentaciones</CardTitle>
                    <CardDescription>
                      Gestiona tus presentaciones y juegos
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPresentations.map((presentation) => (
                  <div
                    key={presentation.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{presentation.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {presentation.slides.length} diapositivas
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {presentation.settings.gameMode === 'trivia' ? 'Trivia' : 'Ice Breaker'}
                      </Badge>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Templates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plantillas de Juegos</CardTitle>
                    <CardDescription>
                      Comienza rápido con plantillas prediseñadas
                    </CardDescription>
                  </div>
                  <Link href="/demo">
                    <Button size="sm" variant="outline">
                      Ver Todas
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Trophy className="h-8 w-8 mb-2 text-purple-600" />
                      <h5 className="font-medium">Trivia General</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">15-20 min</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Users className="h-8 w-8 mb-2 text-blue-600" />
                      <h5 className="font-medium">Ice Breakers</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">10-15 min</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Sparkles className="h-8 w-8 mb-2 text-orange-600" />
                      <h5 className="font-medium">Team Building</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">20-30 min</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Trophy className="h-8 w-8 mb-2 text-green-600" />
                      <h5 className="font-medium">Tech Trivia</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">15-20 min</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Esta es una versión demo. Para guardar presentaciones y acceder a todas las funciones, 
            configura Firebase siguiendo las instrucciones en el README.
          </p>
        </motion.div>
      </div>
    </div>
  )
}