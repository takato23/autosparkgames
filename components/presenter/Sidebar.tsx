'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore, usePresenterStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/lib/design-system/components'
import {
  LayoutDashboard,
  Presentation,
  Plus,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  FileText,
  Rocket,
  Archive,
  Users,
  Star,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import ConfigModal from './modals/ConfigModal'
import CreateGameModal from './modals/CreateGameModal'

const navigation = [
  {
    name: 'Dashboard',
    href: '/presenter',
    icon: LayoutDashboard,
    badge: null,
    action: null,
  },
  {
    name: 'Crear Juego',
    href: null,
    icon: Plus,
    badge: null,
    action: 'create-game',
  },
  {
    name: 'Mis Juegos',
    href: '/presenter',
    icon: Gamepad2,
    badge: 'games',
    action: null,
  },
]

const bottomNavigation = [
  {
    name: 'Configuración',
    action: 'config',
    icon: Settings,
  },
  {
    name: 'Ayuda',
    action: 'help', 
    icon: HelpCircle,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { presentations, activeSessions, createPresentation } = usePresenterStore()
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [createGameModalOpen, setCreateGameModalOpen] = useState(false)

  const getBadgeCount = (badge: string | null) => {
    switch (badge) {
      case 'games':
        return presentations.length
      case 'active':
        return activeSessions.filter(s => s.status === 'active').length
      default:
        return null
    }
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'config':
        setConfigModalOpen(true)
        break
      case 'help':
        // TODO: Abrir modal de ayuda
        console.log('Abrir ayuda')
        break
    }
  }

  const handleCreateGame = (gameData: any) => {
    // Create game content based on type and configuration
    const contents = []
    
    // For trivia games with detailed configuration from wizard
    if (gameData.type === 'trivia' && gameData.settings?.questions) {
      // Convert wizard questions to content items
      gameData.settings.questions.forEach((question: any, index: number) => {
        contents.push({
          id: `question-${index + 1}`,
          type: 'slide',
          subtype: 'multiple-choice',
          title: question.question,
          description: question.explanation || '',
          order: index,
          data: {
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            timeLimit: gameData.settings.timePerQuestion || 30,
            points: gameData.settings.pointsPerQuestion || 100
          }
        })
      })
    }
    
    // For bingo games with configuration from wizard
    if (gameData.type === 'bingo' && gameData.settings) {
      contents.push({
        id: 'bingo-game',
        type: 'game',
        subtype: 'bingo',
        title: gameData.name,
        description: gameData.description || 'Bingo Game',
        order: 0,
        data: {
          gridSize: gameData.settings.gridSize || '4x4',
          cardContent: gameData.settings.cardContent || [],
          winPatterns: gameData.settings.winPatterns || ['line'],
          freeSpace: gameData.settings.freeSpace !== false,
          autoVerify: gameData.settings.autoVerify !== false,
          multipleWinners: gameData.settings.multipleWinners || false,
          prizes: gameData.settings.prizes || {}
        }
      })
    }
    
    // For pictionary games with configuration from wizard
    if (gameData.type === 'pictionary' && gameData.settings) {
      contents.push({
        id: 'pictionary-game',
        type: 'game',
        subtype: 'pictionary',
        title: gameData.name,
        description: gameData.description || 'Pictionary Game',
        order: 0,
        data: {
          teamFormat: gameData.settings.teamFormat || 'auto',
          teamCount: gameData.settings.teamCount || 2,
          teamSize: gameData.settings.teamSize || 4,
          difficulty: gameData.settings.difficulty || 'medium',
          wordBank: gameData.settings.wordBank || [],
          drawingTime: gameData.settings.drawingTime || 60,
          pointsForGuessing: gameData.settings.pointsForGuessing || 100,
          pointsForDrawing: gameData.settings.pointsForDrawing || 50,
          speedBonus: gameData.settings.speedBonus || 20,
          enableColors: gameData.settings.enableColors !== false,
          enableEraser: gameData.settings.enableEraser !== false,
          enableHints: gameData.settings.enableHints || false,
          rounds: gameData.settings.rounds || 3,
          wordsPerRound: gameData.settings.wordsPerRound || 3
        }
      })
    }
    
    // For other games with basic configuration
    if (['memory', 'race', 'team'].includes(gameData.type) && gameData.settings) {
      contents.push({
        id: `${gameData.type}-game`,
        type: 'game',
        subtype: gameData.type,
        title: gameData.name,
        description: gameData.description || `${gameData.type} Game`,
        order: 0,
        data: gameData.settings
      })
    }
    
    // Create new presentation/game
    const newPresentationId = createPresentation({
      title: gameData.name,
      description: gameData.description,
      type: gameData.type === 'trivia' ? 'quiz' : 'game',
      contents,
      settings: {
        allowAnonymous: true,
        requireEmail: false,
        showResults: true,
        randomizeQuestions: false,
        timeLimit: gameData.estimatedTime * 60, // Convert to seconds
        theme: 'gaming',
        // Save wizard configuration for games
        gameConfig: gameData.settings || {}
      },
      status: 'draft'
    })
    
    // Navigate to edit the new game
    router.push(`/presenter/edit/${newPresentationId}`)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className={cn(
              'flex items-center gap-3 transition-opacity',
              !sidebarOpen && 'opacity-0'
            )}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gaming-purple rounded-xl flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white">AutoSpark</h2>
                <p className="text-xs text-white/60">Presenter Hub</p>
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleSidebar}
              className="h-8 w-8"
              aria-label={sidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const badgeCount = getBadgeCount(item.badge)
            
            if (item.action) {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action === 'create-game') {
                      setCreateGameModalOpen(true)
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left',
                    'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0',
                    !sidebarOpen && 'mx-auto'
                  )} />
                  
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {badgeCount !== null && badgeCount > 0 && (
                        <span className="bg-blue-600/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )
            }
            
            return (
              <Link
                key={item.name}
                href={item.href!}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                  isActive
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  !sidebarOpen && 'mx-auto'
                )} />
                
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {badgeCount !== null && badgeCount > 0 && (
                      <span className="bg-blue-600/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        {badgeCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Active Sessions */}
        {sidebarOpen && activeSessions.filter(s => s.status === 'active').length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Sesiones Activas
            </h3>
            <div className="space-y-2">
              {activeSessions
                .filter(s => s.status === 'active')
                .slice(0, 3)
                .map((session) => (
                  <button
                    key={session.id}
                    onClick={() => router.push(`/presenter/session/${session.id}`)}
                    className="w-full p-2 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-white">
                          {session.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="h-3 w-3" />
                        {session.participants.length}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="p-2 border-t border-gray-700">
          {bottomNavigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleAction(item.action)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
            >
              <item.icon className={cn(
                'h-5 w-5 flex-shrink-0',
                !sidebarOpen && 'mx-auto'
              )} />
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </div>
      
      {/* Modals */}
      <ConfigModal 
        isOpen={configModalOpen} 
        onClose={() => setConfigModalOpen(false)} 
      />
      <CreateGameModal 
        isOpen={createGameModalOpen} 
        onClose={() => setCreateGameModalOpen(false)}
        onCreateGame={handleCreateGame}
      />
    </aside>
  )
}