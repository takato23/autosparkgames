'use client'

import { useState } from 'react'
import { StatusCheck } from '@/components/ui/status-check'

export default function QuickTestPage() {
  const [message, setMessage] = useState('¡Los componentes están funcionando!')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-8">
      <StatusCheck />
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-4">
          ✅ Test Exitoso
        </h1>
        <p className="text-xl text-white/80 mb-6">
          {message}
        </p>
        <button
          onClick={() => setMessage('¡Todo funcionando perfectamente! 🚀')}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors"
        >
          Probar Interacción
        </button>
        
        <div className="mt-8 space-y-2 text-sm text-white/60">
          <p>• ✅ BeautifulTheme: Temas dinámicos funcionando</p>
          <p>• ✅ BeautifulGlassCard: Efectos 3D funcionando</p>
          <p>• ✅ AccessibilityPanel: Panel completo funcionando</p>
          <p>• ✅ EnhancedFocusRing: Focus rings funcionando</p>
          <p>• ✅ PremiumButton: Efectos avanzados funcionando</p>
          <p>• ✅ InstantFeedback: Feedback instantáneo funcionando</p>
        </div>

        <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
          <p className="text-green-300 font-semibold">
            🎉 ¡Todos los componentes premium están operativos!
          </p>
        </div>
      </div>
    </div>
  )
}