'use client'

import { motion } from 'framer-motion'
import { TitleSlide } from '@/lib/types/presentation'
import { SlideResponses } from '@/lib/types/session'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface TitlePresenterViewProps {
  slide: TitleSlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

export default function TitlePresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: TitlePresenterViewProps) {
  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-16 shadow-2xl bg-gradient-to-br from-background to-muted">
        {slide.imageUrl && (
          <motion.div 
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}
        
        <motion.h1 
          className="text-6xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {slide.title}
        </motion.h1>
        
        {slide.subtitle && (
          <motion.p 
            className="text-2xl text-center text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-lg font-medium">
              {participantCount} participants connected
            </span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}