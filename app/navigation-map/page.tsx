'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sparkles, 
  Gamepad2, 
  Plus, 
  Edit, 
  Play, 
  Settings, 
  QrCode, 
  Users, 
  Smartphone, 
  Eye, 
  Zap, 
  BarChart3, 
  ArrowRight 
} from 'lucide-react'

export default function NavigationMap() {
  const sections = [
    {
      title: "🏠 Principal",
      description: "Páginas principales de la aplicación",
      routes: [
        { name: "Home", path: "/", icon: Sparkles, description: "Página principal" },
        { name: "Juegos", path: "/games", icon: Gamepad2, description: "Juegos disponibles" }
      ]
    },
    {
      title: "🎮 Presentador",
      description: "Área para crear y dirigir juegos",
      routes: [
        { name: "Dashboard", path: "/presenter", icon: Gamepad2, description: "Panel principal del presentador" },
        { name: "Crear Juego Rápido", path: "/presenter/new", icon: Plus, description: "Crear nueva presentación" },
        { name: "Templates", path: "/presenter/templates", icon: Edit, description: "Plantillas disponibles" },
        { name: "Configuración", path: "/presenter/settings", icon: Settings, description: "Configuración del presentador" }
      ]
    },
    {
      title: "👥 Participante",
      description: "Área para unirse y participar",
      routes: [
        { name: "Unirse", path: "/join", icon: QrCode, description: "Unirse con código o QR" },
        { name: "Unirse a Demo", path: "/join?code=123456", icon: Play, description: "Unirse directamente al demo" },
        { name: "Participante", path: "/participant", icon: Users, description: "Panel del participante" }
      ]
    },
    {
      title: "🎯 Demos y Testing",
      description: "Áreas de demostración y pruebas",
      routes: [
        { name: "Demo", path: "/demo", icon: Eye, description: "Demo interactiva" },
        { name: "Showcase", path: "/showcase", icon: Sparkles, description: "Muestra de funcionalidades" },
        { name: "Quick Test", path: "/quick-test", icon: Zap, description: "Pruebas rápidas" },
        { name: "Test Components", path: "/test-components", icon: BarChart3, description: "Testing de componentes" }
      ]
    },
    {
      title: "⚙️ Administración",
      description: "Herramientas administrativas",
      routes: [
        { name: "Admin", path: "/admin", icon: Settings, description: "Panel administrativo" },
        { name: "Moderación", path: "/admin/moderation", icon: Eye, description: "Herramientas de moderación" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-lg">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Mapa de Navegación
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Todas las rutas disponibles en AutoSpark
          </p>
        </div>

        {/* Secciones */}
        <div className="grid gap-8">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{section.title}</h2>
                <p className="text-white/80">{section.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.routes.map((route, routeIndex) => (
                  <Link key={routeIndex} href={route.path}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/95 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <route.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{route.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {route.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {route.path}
                          </code>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Volver al inicio */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              ← Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 