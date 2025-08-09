'use client'

import { useState } from 'react'
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalContent, 
  ModalFooter,
  Button,
  Input
} from '@/lib/design-system/components'
import { Presentation, PresentationSettings as SettingsType } from '@/lib/store/presenter'
import { X } from 'lucide-react'

interface PresentationSettingsProps {
  presentation: Presentation
  onUpdate: (settings: SettingsType) => void
  onClose: () => void
}

export default function PresentationSettings({ 
  presentation, 
  onUpdate, 
  onClose 
}: PresentationSettingsProps) {
  const [settings, setSettings] = useState<SettingsType>(
    presentation.settings || {
      allowAnonymous: true,
      requireEmail: false,
      showResults: true,
      randomizeQuestions: false,
      timeLimit: undefined,
      theme: 'default'
    }
  )

  const handleSave = () => {
    onUpdate(settings)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-2xl">
      <ModalHeader>
        <ModalTitle>Configuración de Presentación</ModalTitle>
      </ModalHeader>
      
      <ModalContent>
        <div className="space-y-6">
          {/* Participantes */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Participantes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-white">Permitir participación anónima</label>
                  <p className="text-sm text-gray-400">Los participantes pueden unirse sin registrarse</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, allowAnonymous: !s.allowAnonymous }))}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.allowAnonymous ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.allowAnonymous ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-white">Requerir email</label>
                  <p className="text-sm text-gray-400">Pedir email al unirse</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, requireEmail: !s.requireEmail }))}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.requireEmail ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.requireEmail ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Juego */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Configuración del Juego</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-white">Mostrar resultados</label>
                  <p className="text-sm text-gray-400">Mostrar respuestas correctas después de cada pregunta</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, showResults: !s.showResults }))}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.showResults ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.showResults ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-white">Aleatorizar preguntas</label>
                  <p className="text-sm text-gray-400">Mostrar preguntas en orden aleatorio</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, randomizeQuestions: !s.randomizeQuestions }))}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.randomizeQuestions ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.randomizeQuestions ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block font-medium text-white mb-2">
                  Tiempo límite por pregunta (segundos)
                </label>
                <Input
                  type="number"
                  value={settings.timeLimit || ''}
                  onChange={(e) => setSettings(s => ({ 
                    ...s, 
                    timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="Sin límite"
                  min="5"
                  max="300"
                />
              </div>
            </div>
          </div>

          {/* Tema */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Apariencia</h3>
            <div>
              <label className="block font-medium text-white mb-2">Tema</label>
              <select
                value={settings.theme || 'default'}
                onChange={(e) => setSettings(s => ({ ...s, theme: e.target.value as any }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="default">Por defecto</option>
                <option value="dark">Oscuro</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>
          </div>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Configuración
        </Button>
      </ModalFooter>
    </Modal>
  )
}