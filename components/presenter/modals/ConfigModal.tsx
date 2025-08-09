'use client'

import { useState } from 'react'
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  Button,
  Input,
  Badge
} from '@/lib/design-system/components'
import { 
  User, 
  Palette, 
  Volume2, 
  Monitor, 
  Keyboard,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react'

interface ConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'advanced'>('profile')
  
  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'advanced', name: 'Avanzado', icon: Shield },
  ] as const

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre del Presentador
              </label>
              <Input
                placeholder="Tu nombre..."
                defaultValue="Presentador"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Organización (opcional)
              </label>
              <Input
                placeholder="Nombre de tu empresa o institución..."
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Código de Sala por Defecto
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="JUEGO123"
                  defaultValue="AUTO"
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  Generar
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Usa "AUTO" para generar códigos automáticamente
              </p>
            </div>
          </div>
        )
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Tema de Colores
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-gray-700 border border-blue-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-white">Azul (Actual)</span>
                  </div>
                </button>
                <button className="p-3 bg-gray-700 border border-gray-600 rounded-lg hover:border-violet-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-violet-500 rounded-full"></div>
                    <span className="text-white">Violeta</span>
                  </div>
                </button>
                <button className="p-3 bg-gray-700 border border-gray-600 rounded-lg hover:border-emerald-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                    <span className="text-white">Verde</span>
                  </div>
                </button>
                <button className="p-3 bg-gray-700 border border-gray-600 rounded-lg hover:border-amber-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                    <span className="text-white">Ámbar</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Tamaño de Fuente
              </label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Pequeño</Button>
                <Button variant="primary" size="sm">Normal</Button>
                <Button variant="ghost" size="sm">Grande</Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Animaciones
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-white">Efectos de transición</span>
                <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </button>
              </div>
            </div>
          </div>
        )
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-white font-medium">Participantes se unen</span>
                  <p className="text-sm text-gray-400">Sonido cuando alguien entra al juego</p>
                </div>
                <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-white font-medium">Respuestas nuevas</span>
                  <p className="text-sm text-gray-400">Notificación por cada respuesta</p>
                </div>
                <button className="w-11 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-white font-medium">Sesión completa</span>
                  <p className="text-sm text-gray-400">Cuando todos han respondido</p>
                </div>
                <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </button>
              </div>
            </div>
          </div>
        )
        
      case 'advanced':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Atajos de Teclado
              </label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span className="text-gray-300">Crear nuevo juego</span>
                  <Badge variant="default" size="sm">Cmd + N</Badge>
                </div>
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span className="text-gray-300">Buscar</span>
                  <Badge variant="default" size="sm">Cmd + K</Badge>
                </div>
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span className="text-gray-300">Iniciar sesión</span>
                  <Badge variant="default" size="sm">Space</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Configuración de Red
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Servidor WebSocket</label>
                  <Input
                    defaultValue="ws://localhost:3004"
                    className="w-full font-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Conectado</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-300 font-medium">
                    Configuración Avanzada
                  </p>
                  <p className="text-xs text-amber-400 mt-1">
                    Solo modifica estas opciones si sabes lo que haces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
      ariaLabel="Configuración del presentador"
      labelledById="config-title"
      describedById="config-desc"
    >
      <ModalHeader>
        <div>
          <ModalTitle>Configuración</ModalTitle>
          <ModalDescription>
            Personaliza tu experiencia como presentador
          </ModalDescription>
        </div>
      </ModalHeader>
      
      <ModalContent className="p-0">
        <div className="flex">
          {/* Sidebar de tabs */}
          <div className="w-48 border-r border-gray-700 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Contenido */}
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary">
          Guardar Cambios
        </Button>
      </ModalFooter>
    </Modal>
  )
}