'use client'

import { Button } from '@/lib/design-system/components'
import { TooltipWrapper } from '@/lib/design-system/components'
import { Info, HelpCircle, Keyboard } from 'lucide-react'

// Example usage of tooltips throughout the app
export function TooltipExamples() {
  return (
    <div className="space-y-4">
      {/* Button with tooltip */}
      <TooltipWrapper content="Crea una nueva presentación interactiva">
        <Button>
          Nueva Presentación
        </Button>
      </TooltipWrapper>

      {/* Icon with tooltip */}
      <TooltipWrapper content="Más información sobre esta función">
        <button className="text-white/60 hover:text-white">
          <Info className="h-4 w-4" />
        </button>
      </TooltipWrapper>

      {/* Help icon with rich content */}
      <TooltipWrapper 
        content={
          <div className="space-y-2 max-w-xs">
            <p className="font-semibold">Atajos de teclado</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-8">
                <span className="text-white/60">Nuevo</span>
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded">⌘ N</kbd>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-white/60">Guardar</span>
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded">⌘ S</kbd>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-white/60">Preview</span>
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded">⌘ P</kbd>
              </div>
            </div>
          </div>
        }
        side="bottom"
      >
        <button className="text-white/60 hover:text-white">
          <Keyboard className="h-4 w-4" />
        </button>
      </TooltipWrapper>

      {/* Complex component with contextual help */}
      <div className="flex items-center gap-2">
        <span className="text-white">Modo de colaboración</span>
        <TooltipWrapper 
          content="Permite que otros usuarios editen la presentación contigo en tiempo real"
          side="right"
        >
          <HelpCircle className="h-4 w-4 text-white/40" />
        </TooltipWrapper>
      </div>
    </div>
  )
}

// Usage in other components:
// import { TooltipWrapper } from '@/lib/design-system/components'
// 
// <TooltipWrapper content="Texto del tooltip">
//   <Button>Hover me</Button>
// </TooltipWrapper>