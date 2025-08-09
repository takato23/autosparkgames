'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaborationStore } from '@/lib/store/collaboration'

interface CursorPosition {
  userId: string
  x: number
  y: number
  lastUpdate: number
}

export default function CollaboratorCursors() {
  const { collaborators, localUserId } = useCollaborationStore()
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map())
  
  // Update cursor positions
  useEffect(() => {
    const updateCursors = () => {
      const now = Date.now()
      
      setCursors(prevCursors => {
        const newCursors = new Map<string, CursorPosition>()
        
        collaborators.forEach((collaborator, userId) => {
          if (userId !== localUserId && collaborator.cursor && collaborator.isActive) {
            const existingCursor = prevCursors.get(userId)
            const lastUpdate = existingCursor?.lastUpdate || now
            
            // Update position if cursor moved or keep existing if still within 5 seconds
            if (collaborator.cursor.x !== existingCursor?.x || 
                collaborator.cursor.y !== existingCursor?.y) {
              newCursors.set(userId, {
                userId,
                x: collaborator.cursor.x,
                y: collaborator.cursor.y,
                lastUpdate: now,
              })
            } else if (now - lastUpdate < 5000) {
              newCursors.set(userId, existingCursor)
            }
          }
        })
        
        return newCursors
      })
    }
    
    updateCursors()
    const interval = setInterval(updateCursors, 100)
    
    return () => clearInterval(interval)
  }, [collaborators, localUserId])
  
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {Array.from(cursors.values()).map((cursor) => {
          const collaborator = collaborators.get(cursor.userId)
          if (!collaborator) return null
          
          return (
            <motion.div
              key={cursor.userId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                left: cursor.x,
                top: cursor.y,
                transform: 'translate(-8px, -8px)',
              }}
              className="flex items-start"
            >
              {/* Cursor SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))` }}
              >
                <path
                  d="M5.5 3.5L20.5 12L12 12L12 20.5L5.5 3.5Z"
                  fill={collaborator.color}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              
              {/* User label */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.1 }}
                className="ml-2 mt-5"
              >
                <div
                  className="rounded-full px-2 py-1 text-xs font-medium text-white shadow-md"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}