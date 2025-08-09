'use client'

import { motion } from 'framer-motion'
import { Card } from '@/lib/design-system/components'
import { cn } from '@/lib/utils'
import { HelpCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export interface WizardStepProps {
  step: number
  totalSteps: number
  title: string
  description: string
  isValid?: boolean
  isOptional?: boolean
  children: React.ReactNode
  className?: string
}

export interface FieldGroupProps {
  title: string
  description?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export interface TooltipHelpProps {
  content: string | React.ReactNode
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  type?: 'info' | 'tip' | 'warning' | 'help'
}

// Componente principal WizardStep
export default function WizardStep({ 
  step, 
  totalSteps, 
  title, 
  description, 
  isValid = true,
  isOptional = false,
  children, 
  className 
}: WizardStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("h-full flex flex-col", className)}
    >
      {/* Header opcional si queremos mostrar info del step */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            {isOptional && (
              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                Opcional
              </span>
            )}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
              isValid ? "bg-green-600/20 text-green-300" : "bg-amber-600/20 text-amber-300"
            )}>
              {isValid ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Completo
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3" />
                  Pendiente
                </>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Contenido del step */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  )
}

// Componente para agrupar campos relacionados
export function FieldGroup({ 
  title, 
  description, 
  required = false, 
  children, 
  className 
}: FieldGroupProps) {
  return (
    <Card variant="default" className={cn("p-6 space-y-4", className)}>
      <div className="border-b border-gray-700 pb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {title}
          {required && (
            <span className="text-red-400 text-sm">*</span>
          )}
        </h3>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  )
}

// Componente para tooltips de ayuda contextuales
export function TooltipHelp({ 
  content, 
  title, 
  placement = 'top', 
  type = 'info' 
}: TooltipHelpProps) {
  const getIcon = () => {
    switch (type) {
      case 'tip': return '💡'
      case 'warning': return '⚠️'
      case 'help': return '❓'
      default: return 'ℹ️'
    }
  }

  const getColors = () => {
    switch (type) {
      case 'tip': return 'text-yellow-400 hover:text-yellow-300'
      case 'warning': return 'text-amber-400 hover:text-amber-300'
      case 'help': return 'text-blue-400 hover:text-blue-300'
      default: return 'text-gray-400 hover:text-gray-300'
    }
  }

  return (
    <div className="relative group inline-block">
      <button 
        type="button"
        className={cn(
          "p-1 rounded-full transition-colors",
          getColors()
        )}
        aria-label="Ayuda"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200",
        placement === 'top' && "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        placement === 'bottom' && "top-full left-1/2 transform -translate-x-1/2 mt-2",
        placement === 'left' && "right-full top-1/2 transform -translate-y-1/2 mr-2",
        placement === 'right' && "left-full top-1/2 transform -translate-y-1/2 ml-2"
      )}>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl max-w-xs">
          {title && (
            <div className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
              <span>{getIcon()}</span>
              {title}
            </div>
          )}
          <div className="text-gray-300 text-sm">
            {typeof content === 'string' ? content : content}
          </div>
          
          {/* Arrow */}
          <div className={cn(
            "absolute w-2 h-2 bg-gray-800 border-gray-600 rotate-45",
            placement === 'top' && "top-full left-1/2 transform -translate-x-1/2 -mt-1 border-r border-b",
            placement === 'bottom' && "bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-l border-t",
            placement === 'left' && "left-full top-1/2 transform -translate-y-1/2 -ml-1 border-t border-r",
            placement === 'right' && "right-full top-1/2 transform -translate-y-1/2 -mr-1 border-b border-l"
          )} />
        </div>
      </div>
    </div>
  )
}

// Hook para validación de steps
export function useWizardValidation(validationRules: Record<string, (value: any) => boolean>) {
  const validateStep = (data: Record<string, any>): boolean => {
    return Object.entries(validationRules).every(([field, rule]) => {
      const value = data[field]
      return rule(value)
    })
  }

  const getFieldErrors = (data: Record<string, any>): Record<string, boolean> => {
    const errors: Record<string, boolean> = {}
    Object.entries(validationRules).forEach(([field, rule]) => {
      errors[field] = !rule(data[field])
    })
    return errors
  }

  return { validateStep, getFieldErrors }
}