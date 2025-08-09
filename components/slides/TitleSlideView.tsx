'use client'

import { motion } from 'framer-motion'
import { TitleSlide } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface TitleSlideViewProps {
  slide: TitleSlide
  onSubmit?: () => void
  hasResponded?: boolean
  isParticipant?: boolean
}

export default function TitleSlideView({ 
  slide, 
  isParticipant = false 
}: TitleSlideViewProps) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {slide.imageUrl && (
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src={slide.imageUrl}
              alt={slide.title}
              className="mx-auto rounded-lg max-h-64 object-cover shadow-lg"
            />
          )}
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              {slide.title}
            </motion.h1>
            
            {slide.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                {slide.subtitle}
              </motion.p>
            )}
          </div>

          {isParticipant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-8"
            >
              <Sparkles className="h-4 w-4" />
              <span>Get ready for an interactive experience!</span>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}