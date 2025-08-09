'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { OpenTextSlide } from '@/lib/types/presentation'
import { SlideResponses, OpenTextResponse } from '@/lib/types/session'
import { Card } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

interface OpenTextPresenterViewProps {
  slide: OpenTextSlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

export default function OpenTextPresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: OpenTextPresenterViewProps) {
  const textResponses = responses?.responses.filter(r => r.type === 'open_text') as OpenTextResponse[]
  
  // Get last 10 responses for display
  const displayResponses = textResponses?.slice(-10).reverse() || []
  
  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-12 shadow-2xl">
        <motion.h1 
          className="text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {slide.prompt}
        </motion.h1>
        
        {showResults && displayResponses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 max-h-[500px] overflow-y-auto"
          >
            <AnimatePresence mode="popLayout">
              {displayResponses.map((response, index) => (
                <motion.div
                  key={`${response.participantId}-${response.timestamp.toMillis()}`}
                  className="bg-muted rounded-lg p-6"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <p className="text-lg leading-relaxed">{response.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {textResponses.length > 10 && (
              <motion.p 
                className="text-center text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Showing latest 10 of {textResponses.length} responses
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MessageSquare className="w-24 h-24 text-muted-foreground mb-6" />
            <p className="text-2xl text-muted-foreground">
              Waiting for responses...
            </p>
            {slide.minLength && (
              <p className="text-lg text-muted-foreground mt-2">
                Minimum {slide.minLength} characters
              </p>
            )}
            {slide.maxLength && (
              <p className="text-lg text-muted-foreground">
                Maximum {slide.maxLength} characters
              </p>
            )}
          </motion.div>
        )}
        
        {showResults && responses && (
          <motion.div 
            className="mt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg">
              {responses.responseCount} of {participantCount} responded
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}