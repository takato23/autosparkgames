'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  Users, 
  Presentation, 
  Settings, 
  Gamepad2, 
  Eye,
  Sparkles
} from 'lucide-react'

interface RouteItem {
  title: string
  description: string
  href: string
  icon: any
  category: 'main' | 'demo' | 'admin' | 'auth' | 'development'
  status: 'active' | 'demo' | 'dev' | 'planned'
}

const routes: RouteItem[] = [
  // Rutas principales
  {
    title: 'Inicio',
    description: 'Página principal con landing',
    href: '/',
    icon: Home,
    category: 'main',
    status: 'active'
  },
  {
    title: 'Unirse a Sesión',
    description: 'Participar en una presentación',
    href: '/join',
    icon: Users,
    category: 'main',
    status: 'active'
  },
  {
    title: 'Presentador',
    description: 'Dashboard para crear y controlar sesiones',
    href: '/presenter',
    icon: Presentation,
    category: 'main',
    status: 'active'
  },
  {
    title: 'Nueva Presentación',
    description: 'Crear una nueva presentación',
    href: '/presenter/new',
    icon: Sparkles,
    category: 'main',
    status: 'active'
  },
  {
    title: 'Participante',
    description: 'Vista de participante',
    href: '/participant',
    icon: Users,
    category: 'main',
    status: 'active'
  },
  {
    title: 'Modo Offline',
    description: 'Funcionalidad sin internet',
    href: '/offline',
    icon: Gamepad2,
    category: 'main',
    status: 'active'
  },

  // Rutas de demo
  {
    title: 'Demo Principal',
    description: 'Página de demostración',
    href: '/demo',
    icon: Eye,
    category: 'demo',
    status: 'demo'
  },
  {
    title: 'Demo - Participante',
    description: 'Probar como participante',
    href: '/demo/join',
    icon: Users,
    category: 'demo',
    status: 'demo'
  },
  {
    title: 'Demo - Presentador',
    description: 'Probar como presentador',
    href: '/demo/presenter',
    icon: Presentation,
    category: 'demo',
    status: 'demo'
  },
  {
    title: 'Demo - Admin',
    description: 'Panel de administración demo',
    href: '/demo/admin',
    icon: Settings,
    category: 'demo',
    status: 'demo'
  },

  // Rutas de administración
  {
    title: 'Admin Principal',
    description: 'Panel de administración',
    href: '/admin',
    icon: Settings,
    category: 'admin',
    status: 'active'
  },
  {
    title: 'Admin - Presentaciones',
    description: 'Gestionar presentaciones',
    href: '/admin/presentations',
    icon: Presentation,
    category: 'admin',
    status: 'active'
  },
  {
    title: 'Admin - Templates',
    description: 'Plantillas de presentaciones',
    href: '/admin/templates',
    icon: Sparkles,
    category: 'admin',
    status: 'active'
  },
  {
    title: 'Admin - Configuración',
    description: 'Configuración del sistema',
    href: '/admin/settings',
    icon: Settings,
    category: 'admin',
    status: 'active'
  },
  {
    title: 'Admin - Moderación',
    description: 'Herramientas de moderación',
    href: '/admin/moderation',
    icon: Eye,
    category: 'admin',
    status: 'active'
  },

  // Rutas de autenticación
  {
    title: 'Iniciar Sesión',
    description: 'Login de usuario',
    href: '/auth/signin',
    icon: Users,
    category: 'auth',
    status: 'active'
  },
  {
    title: 'Registrarse',
    description: 'Registro de usuario',
    href: '/auth/signup',
    icon: Users,
    category: 'auth',
    status: 'active'
  },
  {
    title: 'Admin - Login',
    description: 'Login de administrador',
    href: '/admin/signin',
    icon: Settings,
    category: 'auth',
    status: 'active'
  },
  {
    title: 'Admin - Registro',
    description: 'Registro de administrador',
    href: '/admin/signup',
    icon: Settings,
    category: 'auth',
    status: 'active'
  },

  // Rutas de desarrollo
  {
    title: 'Juegos',
    description: 'Página de juegos',
    href: '/games',
    icon: Gamepad2,
    category: 'development',
    status: 'dev'
  },
  {
    title: 'Quick Test',
    description: 'Pruebas rápidas',
    href: '/quick-test',
    icon: Gamepad2,
    category: 'development',
    status: 'dev'
  },
  {
    title: 'Test Components',
    description: 'Componentes de prueba',
    href: '/test-components',
    icon: Eye,
    category: 'development',
    status: 'dev'
  },
  {
    title: 'Demo Slides',
    description: 'Slides de demostración',
    href: '/demo-slides',
    icon: Presentation,
    category: 'development',
    status: 'dev'
  },
  {
    title: 'Showcase',
    description: 'Vitrina de componentes',
    href: '/showcase',
    icon: Eye,
    category: 'development',
    status: 'dev'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'demo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'dev': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'planned': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'main': return 'border-blue-200 dark:border-blue-800'
    case 'demo': return 'border-green-200 dark:border-green-800'
    case 'admin': return 'border-purple-200 dark:border-purple-800'
    case 'auth': return 'border-orange-200 dark:border-orange-800'
    case 'development': return 'border-gray-200 dark:border-gray-800'
    default: return 'border-gray-200 dark:border-gray-800'
  }
}

export default function NavigationMap() {
  const categories = ['main', 'demo', 'admin', 'auth', 'development']
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🗺️ Mapa de Navegación</h1>
        <p className="text-muted-foreground">
          Todas las rutas disponibles en AutoSpark Games
        </p>
      </div>

      {categories.map((category) => {
        const categoryRoutes = routes.filter(route => route.category === category)
        const categoryNames = {
          main: 'Rutas Principales',
          demo: 'Demo y Pruebas',
          admin: 'Administración',
          auth: 'Autenticación',
          development: 'Desarrollo'
        }

        return (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{categoryNames[category as keyof typeof categoryNames]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryRoutes.map((route) => {
                const Icon = route.icon
                return (
                  <Card key={route.href} className={`${getCategoryColor(route.category)} hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-lg">{route.title}</CardTitle>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(route.status)}`}>
                          {route.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">
                        {route.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {route.href}
                        </code>
                        <Link href={route.href}>
                          <Button size="sm" variant="outline">
                            Ir →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Sección de Rutas Dinámicas */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">🔗 Rutas Dinámicas (Requieren Parámetros)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Sesión con Código</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Participar en sesión específica
              </CardDescription>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Patrón:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    /session/[code]
                  </code>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Ejemplo:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    /session/123456
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Sesión Presentador</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Controlar sesión específica
              </CardDescription>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Patrón:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    /presenter/session/[sessionId]
                  </code>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Ejemplo:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    /presenter/session/abc123
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">📋 Leyenda de Estados:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Active - Funcionando completamente</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Demo - Con datos de prueba</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Dev - En desarrollo</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span>Planned - Planeado</span>
          </span>
        </div>
      </div>
    </div>
  )
} 