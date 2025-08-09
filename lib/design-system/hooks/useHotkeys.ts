'use client'

import { useEffect, useCallback } from 'react'

type KeyboardModifiers = {
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

type HotkeyCallback = (event: KeyboardEvent) => void

export function useHotkeys(
  keys: string,
  callback: HotkeyCallback,
  deps: any[] = []
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const keyCombo = keys.toLowerCase().split('+')
    const pressedKey = event.key.toLowerCase()
    
    // Parse modifiers from the hotkey string
    const requiredModifiers: KeyboardModifiers = {
      ctrlKey: keyCombo.includes('ctrl'),
      shiftKey: keyCombo.includes('shift'),
      altKey: keyCombo.includes('alt'),
      metaKey: keyCombo.includes('cmd') || keyCombo.includes('meta'),
    }
    
    // Get the actual key (last item in the combo)
    const targetKey = keyCombo[keyCombo.length - 1]
    
    // Check if all required modifiers are pressed
    const modifiersMatch = 
      event.ctrlKey === requiredModifiers.ctrlKey &&
      event.shiftKey === requiredModifiers.shiftKey &&
      event.altKey === requiredModifiers.altKey &&
      event.metaKey === requiredModifiers.metaKey
    
    // Check if the key matches
    const keyMatches = pressedKey === targetKey || 
      (targetKey === 'esc' && pressedKey === 'escape') ||
      (targetKey === 'return' && pressedKey === 'enter')
    
    if (modifiersMatch && keyMatches) {
      event.preventDefault()
      callback(event)
    }
  }, [keys, callback, ...deps])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

// Utility hook for common shortcuts
export function useCommonHotkeys() {
  const hotkeys = {
    'cmd+k': 'Open command palette',
    'cmd+/': 'Toggle help',
    'cmd+s': 'Save',
    'cmd+n': 'New presentation',
    'esc': 'Close modal/Cancel',
    'cmd+enter': 'Submit/Confirm',
  }
  
  return hotkeys
}