'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaborationStore, CollaborationChange } from '@/lib/store/collaboration'
import { Button, Badge } from '@/lib/design-system/components'
import { 
  Clock, User, FileEdit, Plus, Trash2, 
  ArrowUpDown, ChevronRight, ChevronDown 
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ChangeHistory() {
  const { changes, collaborators } = useCollaborationStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedChange, setSelectedChange] = useState<string | null>(null)
  
  const getChangeIcon = (type: CollaborationChange['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'update':
        return <FileEdit className="w-4 h-4 text-blue-500" />
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-500" />
      case 'reorder':
        return <ArrowUpDown className="w-4 h-4 text-purple-500" />
      default:
        return <FileEdit className="w-4 h-4 text-gray-500" />
    }
  }
  
  const getChangeTypeLabel = (type: CollaborationChange['type']) => {
    switch (type) {
      case 'create':
        return 'Creado'
      case 'update':
        return 'Actualizado'
      case 'delete':
        return 'Eliminado'
      case 'reorder':
        return 'Reordenado'
      default:
        return 'Cambio'
    }
  }
  
  const getCollaboratorColor = (userId: string) => {
    const collaborator = collaborators.get(userId)
    return collaborator?.color || '#6B7280'
  }
  
  // Get last 10 changes, most recent first
  const recentChanges = [...changes].reverse().slice(0, 10)
  
  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Historial de cambios
            </span>
            {changes.length > 0 && (
              <Badge variant="default" size="sm">
                {changes.length}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {/* Change list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="max-h-80 overflow-y-auto">
                {recentChanges.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    No hay cambios recientes
                  </div>
                ) : (
                  <div className="py-2">
                    {recentChanges.map((change) => (
                      <motion.div
                        key={change.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => setSelectedChange(
                          selectedChange === change.id ? null : change.id
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Change icon */}
                          <div className="mt-0.5">
                            {getChangeIcon(change.type)}
                          </div>
                          
                          {/* Change details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getCollaboratorColor(change.userId) }}
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {change.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {getChangeTypeLabel(change.type)}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {change.description}
                            </p>
                            
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(change.timestamp), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </p>
                            
                            {/* Expanded details */}
                            <AnimatePresence>
                              {selectedChange === change.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700"
                                >
                                  <div className="text-xs space-y-1">
                                    <div>
                                      <span className="text-gray-500">Objetivo:</span>{' '}
                                      <span className="text-gray-700 dark:text-gray-300">
                                        {change.target} ({change.targetId})
                                      </span>
                                    </div>
                                    {change.before && (
                                      <div>
                                        <span className="text-gray-500">Antes:</span>{' '}
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {JSON.stringify(change.before, null, 2)}
                                        </span>
                                      </div>
                                    )}
                                    {change.after && (
                                      <div>
                                        <span className="text-gray-500">Después:</span>{' '}
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {JSON.stringify(change.after, null, 2)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}