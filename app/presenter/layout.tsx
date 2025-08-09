 'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/presenter/Sidebar'
import CommandPalette from '@/components/presenter/CommandPalette'
import { useHotkeys } from '@/lib/design-system/hooks/useHotkeys'
import { useAuth } from '@/contexts/AuthContext'

interface PresenterLayoutProps {
  children: ReactNode
}

export default function PresenterLayout({ children }: PresenterLayoutProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { 
    sidebarOpen, 
    commandPaletteOpen, 
    setCommandPaletteOpen,
    theme,
    highContrast,
    fontSize
  } = useUIStore()

  // Keyboard shortcuts
  useHotkeys('cmd+k', () => setCommandPaletteOpen(true))
  useHotkeys('cmd+/', () => setCommandPaletteOpen(true))

  // Apply theme and accessibility settings
  useEffect(() => {
    const root = document.documentElement
    
    // Theme
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    
    // Accessibility
    root.classList.toggle('high-contrast', highContrast)
    root.setAttribute('data-font-size', fontSize)
  }, [theme, highContrast, fontSize])

  // Guard de autenticación en cliente
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth/signin')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center" role="status" aria-live="polite" aria-busy="true">
        <span className="text-sm opacity-70">Redirigiendo…</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <main 
        className={cn(
          'flex-1 flex flex-col overflow-hidden transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        {children}
      </main>
      
      {/* Command Palette */}
      {commandPaletteOpen && <CommandPalette />}
    </div>
  )
}