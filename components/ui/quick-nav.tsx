'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Users, 
  Presentation, 
  Settings, 
  Gamepad2, 
  Eye,
  X,
  Map,
  Sparkles
} from 'lucide-react'

const quickRoutes = [
  { title: 'Inicio', href: '/', icon: Home },
  { title: 'Demo', href: '/demo', icon: Eye },
  { title: 'Unirse', href: '/join', icon: Users },
  { title: 'Presentador', href: '/presenter', icon: Presentation },
  { title: 'Admin', href: '/admin', icon: Settings },
  { title: 'Juegos', href: '/games', icon: Gamepad2 },
  { title: 'Mapa Completo', href: '/navigation-map', icon: Map },
]

export default function QuickNav() {
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Botón flotante */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        aria-label="Abrir navegación rápida"
      >
        <Sparkles className="h-5 w-5" />
      </Button>

      {/* Overlay de navegación */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">🚀 Navegación Rápida</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar navegación"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {quickRoutes.map((route) => {
                const Icon = route.icon
                return (
                  <Link key={route.href} href={route.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-left"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                      {route.title}
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Presiona <kbd className="px-2 py-1 text-xs bg-muted rounded">ESC</kbd> para cerrar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cerrar con ESC */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 