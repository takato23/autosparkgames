'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaborationStore } from '@/lib/store/collaboration'
import { Badge } from '@/lib/design-system/components'
import { Users, Circle } from 'lucide-react'

export default function CollaboratorsList() {
  const { collaborators, localUserId, isConnected } = useCollaborationStore()
  
  const activeCollaborators = Array.from(collaborators.values()).filter(
    (collaborator) => collaborator.userId !== localUserId && collaborator.isActive
  )
  
  if (!isConnected || activeCollaborators.length === 0) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs"
      >
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Colaboradores activos
          </span>
          <Badge variant="primary" size="sm">
            {activeCollaborators.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {activeCollaborators.map((collaborator) => (
              <motion.div
                key={collaborator.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Circle
                    className="w-3 h-3"
                    style={{ color: collaborator.color }}
                    fill={collaborator.color}
                  />
                  {collaborator.isActive && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    >
                      <Circle
                        className="w-3 h-3"
                        style={{ color: collaborator.color }}
                        fill={collaborator.color}
                      />
                    </motion.div>
                  )}
                </div>
                
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {collaborator.name}
                </span>
                
                {collaborator.role === 'owner' && (
                  <Badge variant="default" size="sm">
                    Owner
                  </Badge>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {!isConnected && (
          <div className="mt-2 text-xs text-red-500">
            Conexión perdida. Reconectando...
          </div>
        )}
      </motion.div>
    </div>
  )
}