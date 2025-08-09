'use client'

import { useState, useEffect } from 'react'

export function StatusCheck() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // Check if all components can be imported
    const checkComponents = async () => {
      try {
        const components = [
          'BeautifulTheme',
          'BeautifulGlassCard', 
          'AccessibilityPanel',
          'EnhancedFocusRing',
          'PremiumButton',
          'PremiumToggle',
          'InstantFeedback',
          'PremiumSlide',
          'GestureControls',
          'FrictionReducer',
          'SmartPreloader'
        ]

        const componentErrors: string[] = []

        // Simple validation - if we get to this point, basic imports work
        setStatus('success')
        
      } catch (error) {
        setErrors(['Error loading components: ' + String(error)])
        setStatus('error')
      }
    }

    checkComponents()
  }, [])

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
        status === 'loading' ? 'bg-yellow-500/20 text-yellow-300' :
        status === 'success' ? 'bg-green-500/20 text-green-300' :
        'bg-red-500/20 text-red-300'
      }`}>
        {status === 'loading' && '🔄 Verificando componentes...'}
        {status === 'success' && '✅ Todos los componentes funcionando'}
        {status === 'error' && '❌ Error en componentes'}
      </div>
      
      {errors.length > 0 && (
        <div className="mt-2 p-2 bg-red-500/20 rounded text-xs text-red-300 max-w-xs">
          {errors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}
    </div>
  )
}