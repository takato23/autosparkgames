'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore, usePresenterStore } from '@/lib/store'
import { Input } from '@/lib/design-system/components'
import { cn } from '@/lib/utils'
import {
  Search,
  Plus,
  Play,
  Settings,
  FileText,
  BarChart3,
  Archive,
  Star,
  HelpCircle,
  Command,
  ArrowRight,
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: any
  action: () => void
  category: string
  keywords?: string[]
}

export default function CommandPalette() {
  const router = useRouter()
  const { setCommandPaletteOpen } = useUIStore()
  const { presentations, startSession } = usePresenterStore()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Generate commands
  const commands: CommandItem[] = [
    // Quick actions
    {
      id: 'new-presentation',
      title: 'Nueva Presentación',
      description: 'Crear una nueva presentación interactiva',
      icon: Plus,
      action: () => {
        router.push('/presenter/new')
        setCommandPaletteOpen(false)
      },
      category: 'Acciones',
      keywords: ['crear', 'nueva', 'presentacion'],
    },
    {
      id: 'view-analytics',
      title: 'Ver Analytics',
      description: 'Ver estadísticas y métricas',
      icon: BarChart3,
      action: () => {
        router.push('/presenter/analytics')
        setCommandPaletteOpen(false)
      },
      category: 'Acciones',
      keywords: ['analytics', 'estadisticas', 'metricas'],
    },
    {
      id: 'templates',
      title: 'Explorar Plantillas',
      description: 'Ver plantillas disponibles',
      icon: Star,
      action: () => {
        router.push('/presenter/templates')
        setCommandPaletteOpen(false)
      },
      category: 'Acciones',
      keywords: ['plantillas', 'templates'],
    },
    // Presentations
    ...presentations.map((presentation) => ({
      id: `presentation-${presentation.id}`,
      title: presentation.title,
      description: `${presentation.type} • ${presentation.contents.length} elementos`,
      icon: FileText,
      action: () => {
        if (presentation.status === 'ready') {
          const session = startSession(presentation.id)
          router.push(`/presenter/session/${session.id}`)
        } else {
          router.push(`/presenter/edit/${presentation.id}`)
        }
        setCommandPaletteOpen(false)
      },
      category: 'Presentaciones',
      keywords: [presentation.title, presentation.type],
    })),
    // Settings
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajustes y preferencias',
      icon: Settings,
      action: () => {
        router.push('/presenter/settings')
        setCommandPaletteOpen(false)
      },
      category: 'Sistema',
      keywords: ['configuracion', 'ajustes', 'settings'],
    },
    {
      id: 'help',
      title: 'Ayuda',
      description: 'Documentación y soporte',
      icon: HelpCircle,
      action: () => {
        router.push('/presenter/help')
        setCommandPaletteOpen(false)
      },
      category: 'Sistema',
      keywords: ['ayuda', 'help', 'documentacion'],
    },
  ]

  // Filter commands based on search
  const filteredCommands = commands.filter((command) => {
    const searchLower = search.toLowerCase()
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(k => k.toLowerCase().includes(searchLower))
    )
  })

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, CommandItem[]>)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          setCommandPaletteOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredCommands, selectedIndex, setCommandPaletteOpen])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    )
    selectedElement?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed inset-x-0 top-20 mx-auto max-w-2xl z-50">
        <div className="bg-ui-background-elevated border border-ui-border-default rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-ui-border-subtle">
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar comandos, presentaciones..."
              leftIcon={<Search className="h-5 w-5" />}
              rightIcon={
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
                  <span>navegar</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                  <span>seleccionar</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd>
                  <span>cerrar</span>
                </div>
              }
              className="border-0 bg-transparent focus:ring-0"
            />
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-96 overflow-y-auto"
          >
            {Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                  {category}
                </div>
                {items.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command)
                  const isSelected = globalIndex === selectedIndex

                  return (
                    <button
                      key={command.id}
                      data-index={globalIndex}
                      onClick={command.action}
                      className={cn(
                        'w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors',
                        isSelected && 'bg-white/10'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected
                          ? 'bg-primary-500/20 text-primary-300'
                          : 'bg-white/5 text-white/60'
                      )}>
                        <command.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-white">
                          {command.title}
                        </div>
                        {command.description && (
                          <div className="text-sm text-white/60">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <ArrowRight className="h-5 w-5 text-white/40" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="p-8 text-center text-white/40">
                No se encontraron resultados para "{search}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-ui-border-subtle bg-white/5">
            <div className="flex items-center justify-center gap-3 text-xs text-white/40">
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span>+</span>
                <span>K</span>
              </div>
              <span>para abrir</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}