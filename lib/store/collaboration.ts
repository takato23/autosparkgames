import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Collaborator {
  id: string
  userId: string
  name: string
  email: string
  color: string
  cursor?: {
    x: number
    y: number
    elementId?: string
  }
  lastActiveAt: string
  isActive: boolean
  role: 'owner' | 'editor' | 'viewer'
}

export interface CollaborationChange {
  id: string
  userId: string
  userName: string
  timestamp: string
  type: 'create' | 'update' | 'delete' | 'reorder'
  target: 'presentation' | 'slide' | 'content'
  targetId: string
  before?: any
  after?: any
  description: string
}

export interface CollaborationState {
  sessionId: string | null
  presentationId: string | null
  collaborators: Map<string, Collaborator>
  localUserId: string | null
  changes: CollaborationChange[]
  isConnected: boolean
  isSyncing: boolean
  lastSyncAt: string | null
  pendingChanges: CollaborationChange[]
}

interface CollaborationStore extends CollaborationState {
  // Connection actions
  initializeSession: (sessionId: string, presentationId: string, userId: string) => void
  disconnect: () => void
  setConnectionStatus: (isConnected: boolean) => void
  
  // Collaborator actions
  addCollaborator: (collaborator: Collaborator) => void
  removeCollaborator: (userId: string) => void
  updateCollaboratorCursor: (userId: string, cursor: Collaborator['cursor']) => void
  updateCollaboratorActivity: (userId: string) => void
  
  // Change tracking
  addChange: (change: Omit<CollaborationChange, 'id' | 'timestamp'>) => void
  addPendingChange: (change: Omit<CollaborationChange, 'id' | 'timestamp'>) => void
  clearPendingChanges: () => void
  
  // Sync actions
  startSync: () => void
  completeSync: () => void
  syncError: (error: string) => void
  
  // Utility
  getCollaboratorColor: (userId: string) => string
  isUserActive: (userId: string) => boolean
}

// Color palette for collaborators
const COLLABORATOR_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
]

export const useCollaborationStore = create<CollaborationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      sessionId: null,
      presentationId: null,
      collaborators: new Map(),
      localUserId: null,
      changes: [],
      isConnected: false,
      isSyncing: false,
      lastSyncAt: null,
      pendingChanges: [],
      
      // Connection actions
      initializeSession: (sessionId, presentationId, userId) => {
        set({
          sessionId,
          presentationId,
          localUserId: userId,
          isConnected: true,
          collaborators: new Map(),
          changes: [],
          pendingChanges: [],
        })
      },
      
      disconnect: () => {
        set({
          sessionId: null,
          presentationId: null,
          collaborators: new Map(),
          isConnected: false,
          isSyncing: false,
          changes: [],
          pendingChanges: [],
        })
      },
      
      setConnectionStatus: (isConnected) => set({ isConnected }),
      
      // Collaborator actions
      addCollaborator: (collaborator) => {
        set((state) => {
          const newCollaborators = new Map(state.collaborators)
          newCollaborators.set(collaborator.userId, collaborator)
          return { collaborators: newCollaborators }
        })
      },
      
      removeCollaborator: (userId) => {
        set((state) => {
          const newCollaborators = new Map(state.collaborators)
          newCollaborators.delete(userId)
          return { collaborators: newCollaborators }
        })
      },
      
      updateCollaboratorCursor: (userId, cursor) => {
        set((state) => {
          const collaborator = state.collaborators.get(userId)
          if (!collaborator) return state
          
          const newCollaborators = new Map(state.collaborators)
          newCollaborators.set(userId, {
            ...collaborator,
            cursor,
            lastActiveAt: new Date().toISOString(),
          })
          return { collaborators: newCollaborators }
        })
      },
      
      updateCollaboratorActivity: (userId) => {
        set((state) => {
          const collaborator = state.collaborators.get(userId)
          if (!collaborator) return state
          
          const newCollaborators = new Map(state.collaborators)
          newCollaborators.set(userId, {
            ...collaborator,
            lastActiveAt: new Date().toISOString(),
            isActive: true,
          })
          return { collaborators: newCollaborators }
        })
      },
      
      // Change tracking
      addChange: (change) => {
        const newChange: CollaborationChange = {
          ...change,
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        }
        
        set((state) => ({
          changes: [...state.changes, newChange].slice(-100), // Keep last 100 changes
        }))
      },
      
      addPendingChange: (change) => {
        const newChange: CollaborationChange = {
          ...change,
          id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        }
        
        set((state) => ({
          pendingChanges: [...state.pendingChanges, newChange],
        }))
      },
      
      clearPendingChanges: () => set({ pendingChanges: [] }),
      
      // Sync actions
      startSync: () => set({ isSyncing: true }),
      
      completeSync: () => {
        set({
          isSyncing: false,
          lastSyncAt: new Date().toISOString(),
          pendingChanges: [],
        })
      },
      
      syncError: (error) => {
        console.error('Sync error:', error)
        set({ isSyncing: false })
      },
      
      // Utility
      getCollaboratorColor: (userId) => {
        const collaborator = get().collaborators.get(userId)
        if (collaborator) return collaborator.color
        
        // Generate consistent color based on userId
        const colorIndex = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return COLLABORATOR_COLORS[colorIndex % COLLABORATOR_COLORS.length]
      },
      
      isUserActive: (userId) => {
        const collaborator = get().collaborators.get(userId)
        if (!collaborator) return false
        
        const lastActive = new Date(collaborator.lastActiveAt)
        const now = new Date()
        const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)
        
        return collaborator.isActive && diffMinutes < 5 // Consider active if within 5 minutes
      },
    }),
    {
      name: 'collaboration-store',
    }
  )
)