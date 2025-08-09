'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePresenterStore } from '@/lib/store'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'

interface UseAutoSaveOptions {
  presentationId: string
  interval?: number // milliseconds
  enabled?: boolean
  onSave?: () => void
  onError?: (error: Error) => void
}

interface Version {
  id: string
  presentationId: string
  timestamp: string
  changes: string
  snapshot: any
}

export function useAutoSave({
  presentationId,
  interval = 30000, // 30 seconds default
  enabled = true,
  onSave,
  onError,
}: UseAutoSaveOptions) {
  const { presentations, updatePresentation } = usePresenterStore()
  const lastSavedRef = useRef<string>('')
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const versionHistoryRef = useRef<Version[]>([])

  const presentation = presentations.find(p => p.id === presentationId)

  // Load version history from localStorage
  useEffect(() => {
    const storedVersions = localStorage.getItem(`versions_${presentationId}`)
    if (storedVersions) {
      versionHistoryRef.current = JSON.parse(storedVersions)
    }
  }, [presentationId])

  // Save version to history
  const saveVersion = useCallback((changes: string) => {
    if (!presentation) return

    const version: Version = {
      id: Date.now().toString(),
      presentationId,
      timestamp: new Date().toISOString(),
      changes,
      snapshot: JSON.stringify(presentation),
    }

    // Keep only last 10 versions
    versionHistoryRef.current = [
      version,
      ...versionHistoryRef.current.slice(0, 9),
    ]

    localStorage.setItem(
      `versions_${presentationId}`,
      JSON.stringify(versionHistoryRef.current)
    )
  }, [presentation, presentationId])

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((currentPresentation: any) => {
      try {
        const serialized = JSON.stringify(currentPresentation)
        
        // Check if content has changed
        if (serialized === lastSavedRef.current) {
          return
        }

        // Save to localStorage
        const allPresentations = JSON.parse(
          localStorage.getItem('presentations') || '[]'
        )
        const index = allPresentations.findIndex((p: any) => p.id === presentationId)
        
        if (index !== -1) {
          allPresentations[index] = {
            ...currentPresentation,
            lastModified: new Date().toISOString(),
          }
          localStorage.setItem('presentations', JSON.stringify(allPresentations))
          
          // Save version
          saveVersion('Auto-save')
          
          lastSavedRef.current = serialized
          
          // Show subtle notification
          toast.success('Guardado automático', {
            duration: 2000,
            position: 'bottom-right',
          })
          
          onSave?.()
        }
      } catch (error) {
        console.error('Auto-save error:', error)
        onError?.(error as Error)
        toast.error('Error al guardar automáticamente')
      }
    }, 3000), // 3 second debounce
    [presentationId, saveVersion, onSave, onError]
  )

  // Watch for changes and trigger auto-save
  useEffect(() => {
    if (!enabled || !presentation) return

    // Initial save of current state
    lastSavedRef.current = JSON.stringify(presentation)

    // Set up interval save
    const intervalId = setInterval(() => {
      debouncedSave(presentation)
    }, interval)

    return () => {
      clearInterval(intervalId)
      debouncedSave.cancel()
    }
  }, [presentation, enabled, interval, debouncedSave])

  // Manual save function
  const save = useCallback(() => {
    if (!presentation) return

    try {
      updatePresentation(presentationId, {
        lastModified: new Date().toISOString(),
      })
      
      saveVersion('Manual save')
      
      toast.success('Guardado exitosamente')
      onSave?.()
    } catch (error) {
      console.error('Save error:', error)
      onError?.(error as Error)
      toast.error('Error al guardar')
    }
  }, [presentation, presentationId, updatePresentation, saveVersion, onSave, onError])

  // Get version history
  const getVersionHistory = useCallback(() => {
    return versionHistoryRef.current
  }, [])

  // Restore version
  const restoreVersion = useCallback((versionId: string) => {
    const version = versionHistoryRef.current.find(v => v.id === versionId)
    if (!version) {
      toast.error('Versión no encontrada')
      return
    }

    try {
      const restoredPresentation = JSON.parse(version.snapshot)
      updatePresentation(presentationId, restoredPresentation)
      
      saveVersion(`Restaurado desde versión ${new Date(version.timestamp).toLocaleString()}`)
      
      toast.success('Versión restaurada exitosamente')
    } catch (error) {
      console.error('Restore error:', error)
      toast.error('Error al restaurar versión')
    }
  }, [presentationId, updatePresentation, saveVersion])

  // Status info
  const lastSaved = presentation?.lastModified
    ? new Date(presentation.lastModified)
    : null

  return {
    save,
    isSaving: false, // Could be enhanced with actual saving state
    lastSaved,
    getVersionHistory,
    restoreVersion,
    hasUnsavedChanges: lastSavedRef.current !== JSON.stringify(presentation),
  }
}

// Hook for warning about unsaved changes
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])
}