import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { templates } from '@/lib/data/templates'

// Types
export interface Presentation {
  id: string
  title: string
  description?: string
  type: 'quiz' | 'game' | 'mixed'
  status: 'draft' | 'ready' | 'active' | 'archived'
  createdAt: string
  lastModified: string
  contents: ContentItem[]
  settings?: PresentationSettings
  analytics?: PresentationAnalytics
}

export interface ContentItem {
  id: string
  type: 'slide' | 'game'
  subtype: string
  title: string
  description?: string
  order: number
  data?: any
}

export interface PresentationSettings {
  allowAnonymous: boolean
  requireEmail: boolean
  showResults: boolean
  randomizeQuestions: boolean
  timeLimit?: number
  theme?: 'default' | 'dark' | 'gaming'
  gameConfig?: any // Configuration from game wizards
}

export interface PresentationAnalytics {
  views: number
  uniqueParticipants: number
  avgCompletionRate: number
  avgEngagementScore: number
  peakConcurrentUsers: number
}

export interface Session {
  id: string
  presentationId: string
  code: string
  status: 'scheduled' | 'active' | 'paused' | 'ended'
  startedAt?: string
  endedAt?: string
  participants: Participant[]
  currentSlideIndex: number
  responses: SessionResponse[]
}

export interface Participant {
  id: string
  name?: string
  email?: string
  joinedAt: string
  lastActiveAt: string
  isActive: boolean
  score?: number
}

export interface SessionResponse {
  participantId: string
  contentId: string
  response: any
  timestamp: string
  score?: number
}

// Store interface
interface PresenterStore {
  // State
  presentations: Presentation[]
  activeSessions: Session[]
  currentSession: Session | null
  isLoading: boolean
  error: string | null
  
  // Presentation actions
  createPresentation: (presentation: Omit<Presentation, 'id' | 'createdAt' | 'lastModified'>) => string
  updatePresentation: (id: string, updates: Partial<Presentation>) => void
  deletePresentation: (id: string) => void
  duplicatePresentation: (id: string) => string
  archivePresentation: (id: string) => void
  
  // Session actions
  startSession: (presentationId: string) => Session
  endSession: (sessionId: string) => void
  pauseSession: (sessionId: string) => void
  resumeSession: (sessionId: string) => void
  updateSessionSlide: (sessionId: string, slideIndex: number) => void
  
  // Participant actions
  addParticipant: (sessionId: string, participant: Omit<Participant, 'id' | 'joinedAt' | 'lastActiveAt' | 'isActive'>) => void
  removeParticipant: (sessionId: string, participantId: string) => void
  updateParticipantActivity: (sessionId: string, participantId: string) => void
  
  // Response actions
  addResponse: (sessionId: string, response: Omit<SessionResponse, 'timestamp'>) => void
  
  // Utility actions
  loadPresentations: () => void
  setError: (error: string | null) => void
  clearError: () => void
}

// Store implementation
export const usePresenterStore = create<PresenterStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        presentations: [],
        activeSessions: [],
        currentSession: null,
        isLoading: false,
        error: null,
        
        // Presentation actions
        createPresentation: (presentation) => {
          const id = Date.now().toString()
          const newPresentation: Presentation = {
            ...presentation,
            id,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            status: 'draft',
          }
          
          set((state) => ({
            presentations: [...state.presentations, newPresentation],
          }))
          
          return id
        },
        
        updatePresentation: (id, updates) => {
          set((state) => ({
            presentations: state.presentations.map((p) =>
              p.id === id
                ? { ...p, ...updates, lastModified: new Date().toISOString() }
                : p
            ),
          }))
        },
        
        deletePresentation: (id) => {
          set((state) => ({
            presentations: state.presentations.filter((p) => p.id !== id),
            activeSessions: state.activeSessions.filter((s) => s.presentationId !== id),
          }))
        },
        
        duplicatePresentation: (id) => {
          const original = get().presentations.find((p) => p.id === id)
          if (!original) return ''
          
          const duplicateId = Date.now().toString()
          const duplicate: Presentation = {
            ...original,
            id: duplicateId,
            title: `${original.title} (Copy)`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
          }
          
          set((state) => ({
            presentations: [...state.presentations, duplicate],
          }))
          
          return duplicateId
        },
        
        archivePresentation: (id) => {
          set((state) => ({
            presentations: state.presentations.map((p) =>
              p.id === id ? { ...p, status: 'archived' as const } : p
            ),
          }))
        },
        
        // Session actions
        startSession: (presentationId) => {
          const presentation = get().presentations.find((p) => p.id === presentationId)
          if (!presentation) throw new Error('Presentation not found')
          
          const session: Session = {
            id: Date.now().toString(),
            presentationId,
            code: Math.floor(100000 + Math.random() * 900000).toString(),
            status: 'active',
            startedAt: new Date().toISOString(),
            participants: [],
            currentSlideIndex: 0,
            responses: [],
          }
          
          set((state) => ({
            activeSessions: [...state.activeSessions, session],
            currentSession: session,
            presentations: state.presentations.map((p) =>
              p.id === presentationId ? { ...p, status: 'active' as const } : p
            ),
          }))
          
          return session
        },
        
        endSession: (sessionId) => {
          const session = get().activeSessions.find((s) => s.id === sessionId)
          if (!session) return
          
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId
                ? { ...s, status: 'ended' as const, endedAt: new Date().toISOString() }
                : s
            ),
            currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
            presentations: state.presentations.map((p) =>
              p.id === session.presentationId ? { ...p, status: 'ready' as const } : p
            ),
          }))
        },
        
        pauseSession: (sessionId) => {
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId ? { ...s, status: 'paused' as const } : s
            ),
          }))
        },
        
        resumeSession: (sessionId) => {
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId ? { ...s, status: 'active' as const } : s
            ),
          }))
        },
        
        updateSessionSlide: (sessionId, slideIndex) => {
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId ? { ...s, currentSlideIndex: slideIndex } : s
            ),
            currentSession:
              state.currentSession?.id === sessionId
                ? { ...state.currentSession, currentSlideIndex: slideIndex }
                : state.currentSession,
          }))
        },
        
        // Participant actions
        addParticipant: (sessionId, participant) => {
          const id = Date.now().toString()
          const newParticipant: Participant = {
            ...participant,
            id,
            joinedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            isActive: true,
          }
          
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId
                ? { ...s, participants: [...s.participants, newParticipant] }
                : s
            ),
          }))
        },
        
        removeParticipant: (sessionId, participantId) => {
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    participants: s.participants.filter((p) => p.id !== participantId),
                  }
                : s
            ),
          }))
        },
        
        updateParticipantActivity: (sessionId, participantId) => {
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    participants: s.participants.map((p) =>
                      p.id === participantId
                        ? { ...p, lastActiveAt: new Date().toISOString() }
                        : p
                    ),
                  }
                : s
            ),
          }))
        },
        
        // Response actions
        addResponse: (sessionId, response) => {
          const newResponse: SessionResponse = {
            ...response,
            timestamp: new Date().toISOString(),
          }
          
          set((state) => ({
            activeSessions: state.activeSessions.map((s) =>
              s.id === sessionId
                ? { ...s, responses: [...s.responses, newResponse] }
                : s
            ),
          }))
        },
        
        // Utility actions
        loadPresentations: () => {
          set({ isLoading: true })
          
          // Load from localStorage for now
          const stored = localStorage.getItem('presentations')
          if (stored) {
            try {
              const presentations = JSON.parse(stored)
              if (Array.isArray(presentations) && presentations.length > 0) {
                set({ presentations, isLoading: false })
              } else {
                throw new Error('empty')
              }
            } catch (error) {
              set({ error: 'Failed to load presentations', isLoading: false })
            }
          } else {
            // Seed initial sample presentations from templates for first-time users
            try {
              const seeded = templates.slice(0, 4).map((template) => {
                const allSlides = template.contents.every((c) => c.type === 'slide')
                const allGames = template.contents.every((c) => c.type === 'game')
                const derivedType: Presentation['type'] = allSlides ? 'quiz' : allGames ? 'game' : 'mixed'

                const nowIso = new Date().toISOString()
                const contents: ContentItem[] = template.contents.map((content, index) => ({
                  id: `${template.id}-content-${index + 1}`,
                  type: content.type,
                  subtype: content.subtype,
                  title: content.title,
                  description: content.description,
                  order: content.order,
                  data: (content as any).data,
                }))

                const presentation: Presentation = {
                  id: `tmpl-${template.id}`,
                  title: template.title,
                  description: template.description,
                  type: derivedType,
                  status: 'ready',
                  createdAt: nowIso,
                  lastModified: nowIso,
                  contents,
                  settings: template.settings as PresentationSettings | undefined,
                }

                return presentation
              })

              localStorage.setItem('presentations', JSON.stringify(seeded))
              set({ presentations: seeded, isLoading: false })
            } catch {
              set({ isLoading: false })
            }
          }
        },
        
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'presenter-store',
        partialize: (state) => ({
          presentations: state.presentations,
          activeSessions: state.activeSessions.filter((s) => s.status !== 'ended'),
        }),
      }
    )
  )
)