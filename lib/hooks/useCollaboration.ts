import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useCollaborationStore } from '@/lib/store/collaboration'
import { usePresenterStore } from '@/lib/store'
import { toast } from 'sonner'

interface UseCollaborationOptions {
  presentationId: string
  userId: string
  userName: string
  userEmail: string
  onError?: (error: string) => void
}

interface CollaborationEvent {
  type: 'join' | 'leave' | 'cursor' | 'change' | 'sync'
  userId: string
  data: any
}

export function useCollaboration({
  presentationId,
  userId,
  userName,
  userEmail,
  onError,
}: UseCollaborationOptions) {
  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const {
    initializeSession,
    disconnect,
    setConnectionStatus,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorCursor,
    updateCollaboratorActivity,
    addChange,
    localUserId,
    collaborators,
  } = useCollaborationStore()
  
  const { updatePresentation } = usePresenterStore()

  // Apply remote changes to local state
  const applyRemoteChange = useCallback((change: any) => {
    const { type, target, targetId, after } = change
    
    if (target === 'presentation') {
      updatePresentation(targetId, after)
    } else if (target === 'slide' || target === 'content') {
      // Handle slide/content specific changes
      // This would depend on your specific implementation
    }
  }, [updatePresentation])

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3004', {
      transports: ['websocket'],
      query: {
        presentationId,
        userId,
        userName,
        userEmail,
      },
    })

    socketRef.current = socket

    // Connection handlers
    socket.on('connect', () => {
      console.log('Collaboration connected')
      setConnectionStatus(true)
      
      // Join collaboration session
      socket.emit('join-collaboration', {
        presentationId,
        userId,
        userName,
        userEmail,
      })
      
      // Start heartbeat
      heartbeatIntervalRef.current = setInterval(() => {
        socket.emit('heartbeat', { userId })
      }, 30000)
    })

    socket.on('disconnect', () => {
      console.log('Collaboration disconnected')
      setConnectionStatus(false)
      
      // Clear heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      
      // Attempt reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 3000)
    })

    socket.on('error', (error) => {
      console.error('Collaboration error:', error)
      onError?.(error.message || 'Connection error')
    })

    // Collaboration events
    socket.on('collaborator-joined', (data) => {
      const { userId: joinedUserId, userName, userEmail, color } = data
      
      if (joinedUserId !== userId) {
        addCollaborator({
          id: joinedUserId,
          userId: joinedUserId,
          name: userName,
          email: userEmail,
          color,
          lastActiveAt: new Date().toISOString(),
          isActive: true,
          role: 'editor',
        })
        
        toast.info(`${userName} se unió a la edición`)
      }
    })

    socket.on('collaborator-left', (data) => {
      const { userId: leftUserId, userName } = data
      
      if (leftUserId !== userId) {
        removeCollaborator(leftUserId)
        toast.info(`${userName} salió de la edición`)
      }
    })

    socket.on('collaborators-list', (data) => {
      const { collaborators: collaboratorsList } = data
      
      // Update collaborators list
      collaboratorsList.forEach((collaborator: any) => {
        if (collaborator.userId !== userId) {
          addCollaborator({
            id: collaborator.userId,
            userId: collaborator.userId,
            name: collaborator.userName,
            email: collaborator.userEmail,
            color: collaborator.color,
            lastActiveAt: collaborator.lastActiveAt,
            isActive: collaborator.isActive,
            role: collaborator.role || 'editor',
          })
        }
      })
    })

    socket.on('cursor-update', (data) => {
      const { userId: cursorUserId, cursor } = data
      
      if (cursorUserId !== userId) {
        updateCollaboratorCursor(cursorUserId, cursor)
      }
    })

    socket.on('content-change', (data) => {
      const { change, userId: changeUserId } = data
      
      if (changeUserId !== userId) {
        // Apply the change to local state
        applyRemoteChange(change)
        
        // Add to change history
        addChange({
          ...change,
          userId: changeUserId,
        })
      }
    })

    socket.on('sync-request', () => {
      // Send current state to sync
      socket.emit('sync-response', {
        userId,
        presentationId,
        // Add current presentation state
      })
    })

    // Initialize session
    initializeSession(`collab-${presentationId}`, presentationId, userId)
  }, [
    presentationId,
    userId,
    userName,
    userEmail,
    initializeSession,
    setConnectionStatus,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorCursor,
    addChange,
    onError,
    applyRemoteChange,
  ])

  // Disconnect handler
  const disconnectCollaboration = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-collaboration', {
        presentationId,
        userId,
      })
      socketRef.current.disconnect()
      socketRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    disconnect()
  }, [presentationId, userId, disconnect])

  // Send cursor position
  const sendCursorPosition = useCallback((cursor: { x: number; y: number; elementId?: string }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('cursor-move', {
        userId,
        presentationId,
        cursor,
      })
    }
  }, [userId, presentationId])

  // Send content change
  const sendContentChange = useCallback((change: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('content-change', {
        userId,
        presentationId,
        change: {
          ...change,
          userName,
        },
      })
      
      // Add to local change history
      addChange({
        ...change,
        userId,
        userName,
      })
    }
  }, [userId, presentationId, userName, addChange])

  // Setup and cleanup
  useEffect(() => {
    connect()
    
    return () => {
      disconnectCollaboration()
    }
  }, [connect, disconnectCollaboration])

  // Track mouse movement for cursor sharing
  useEffect(() => {
    let lastSent = 0
    const CURSOR_THROTTLE = 100 // ms
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastSent < CURSOR_THROTTLE) return
      
      lastSent = now
      
      // Get element under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY)
      const elementId = element?.id || element?.closest('[id]')?.id
      
      sendCursorPosition({
        x: e.clientX,
        y: e.clientY,
        elementId,
      })
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [sendCursorPosition])

  return {
    isConnected: useCollaborationStore((state) => state.isConnected),
    collaborators: Array.from(collaborators.values()),
    sendContentChange,
    sendCursorPosition,
  }
}