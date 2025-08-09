'use client'

import * as React from 'react'
import { createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a Modal')
  }
  return context
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  ariaLabel?: string
  labelledById?: string
  describedById?: string
}

const Modal = ({ isOpen, onClose, children, className, ariaLabel, labelledById, describedById }: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-labelledby={labelledById}
                aria-describedby={describedById}
                tabIndex={-1}
                className={cn(
                'relative w-full max-w-lg max-h-[90vh] flex flex-col',
                'bg-gray-800 border border-gray-700 rounded-xl shadow-xl',
                  className
                )}
              >
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}

const ModalHeader = ({ 
  children, 
  className,
  showCloseButton = true 
}: { 
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}) => {
  const { onClose } = useModal()
  
  return (
    <div className={cn(
      'flex items-center justify-between p-6 border-b border-gray-700',
      className
    )}>
      <div className="flex-1">
        {children}
      </div>
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-4 h-8 w-8 p-0 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

const ModalTitle = ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-xl font-semibold text-white', className)} {...props}>
    {children}
  </h2>
)

const ModalDescription = ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-gray-300 mt-2', className)} {...props}>
    {children}
  </p>
)

const ModalContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('p-6 flex-1 overflow-y-auto', className)}>
    {children}
  </div>
)

const ModalFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    'flex items-center justify-end gap-3 p-6 border-t border-gray-700',
    className
  )}>
    {children}
  </div>
)

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  useModal
}