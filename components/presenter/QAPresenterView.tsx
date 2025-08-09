'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QASlide } from '@/lib/types/presentation'
import { SlideResponses, QAResponse } from '@/lib/types/session'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, ThumbsUp, CheckCircle, Clock } from 'lucide-react'

interface QAPresenterViewProps {
  slide: QASlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

export default function QAPresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: QAPresenterViewProps) {
  const [filter, setFilter] = React.useState<'todas' | 'aprobadas' | 'respondidas'>('todas')
  const [sort, setSort] = React.useState<'upvotes' | 'recientes'>('upvotes')
  const qaResponses = responses?.responses.filter(r => r.type === 'qa') as QAResponse[]
  const totalCount = qaResponses?.length ?? 0
  const approvedCount = qaResponses?.filter(q => q.isApproved)?.length ?? 0
  const answeredCount = qaResponses?.filter(q => q.isAnswered)?.length ?? 0
  
  // Filtrar por estado
  const filtered = (qaResponses || []).filter((q) => {
    if (filter === 'aprobadas') return Boolean(q.isApproved)
    if (filter === 'respondidas') return Boolean(q.isAnswered)
    return true
  })

  // Ordenar
  const sortedQuestions = filtered.sort((a, b) => {
    if (sort === 'recientes') {
      return b.timestamp.toMillis() - a.timestamp.toMillis()
    }
    // upvotes por defecto
    if (a.isApproved && !b.isApproved) return -1
    if (!a.isApproved && b.isApproved) return 1
    return b.upvotes.length - a.upvotes.length
  })
  
  // Get top questions for display
  const displayQuestions = sortedQuestions.slice(0, 10)
  
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
        
        {/* Controles de filtro/orden + chips contadores */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex flex-col gap-2">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList aria-label="Filtrar preguntas">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
                <TabsTrigger value="respondidas">Respondidas</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap items-center gap-2" aria-label="Resumen de categorías">
              <Button
                variant={filter === 'todas' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('todas')}
                aria-pressed={filter === 'todas'}
                aria-label={`Todas: ${totalCount}`}
                className="rounded-full"
              >
                Todas <span className="ml-2 inline-flex items-center justify-center rounded-full bg-background/60 px-1.5 text-xs">{totalCount}</span>
              </Button>
              <Button
                variant={filter === 'aprobadas' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('aprobadas')}
                aria-pressed={filter === 'aprobadas'}
                aria-label={`Aprobadas: ${approvedCount}`}
                className="rounded-full"
              >
                Aprobadas <span className="ml-2 inline-flex items-center justify-center rounded-full bg-background/60 px-1.5 text-xs">{approvedCount}</span>
              </Button>
              <Button
                variant={filter === 'respondidas' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('respondidas')}
                aria-pressed={filter === 'respondidas'}
                aria-label={`Respondidas: ${answeredCount}`}
                className="rounded-full"
              >
                Respondidas <span className="ml-2 inline-flex items-center justify-center rounded-full bg-background/60 px-1.5 text-xs">{answeredCount}</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground" aria-live="polite" role="status">
              <span className="font-medium">{filtered.length}</span> de {totalCount} preguntas
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por</span>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="w-[180px]" aria-label="Ordenar preguntas">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upvotes">Más votadas</SelectItem>
                  <SelectItem value="recientes">Más recientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {showResults && displayQuestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 max-h-[500px] overflow-y-auto"
          >
            <AnimatePresence mode="popLayout">
              {displayQuestions.map((question, index) => (
                <motion.div
                  key={`${question.participantId}-${question.timestamp.toMillis()}`}
                  className={`rounded-lg p-6 flex items-start gap-4 ${
                    question.isApproved 
                      ? 'bg-green-50 dark:bg-green-950/20 border-2 border-green-500' 
                      : question.isAnswered
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-500'
                      : 'bg-muted'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="flex flex-col items-center gap-2">
                    <motion.div 
                      className="bg-primary/10 rounded-full px-3 py-1 flex items-center gap-1"
                      whileHover={{ scale: 1.1 }}
                      aria-label={`Votos a favor: ${question.upvotes.length}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-semibold">{question.upvotes.length}</span>
                    </motion.div>
                    {question.isApproved && (
                      <CheckCircle className="w-5 h-5 text-green-600" aria-label="Aprobada" />
                    )}
                    {question.isAnswered && !question.isApproved && (
                      <MessageCircle className="w-5 h-5 text-blue-600" aria-label="Respondida" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed">{question.question}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(question.timestamp.toMillis()).toLocaleTimeString()}
                      </span>
                      {question.isApproved && (
                        <span className="text-green-600 font-semibold">Aprobada</span>
                      )}
                      {question.isAnswered && (
                        <span className="text-blue-600 font-semibold">Respondida</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {qaResponses.length > 10 && (
              <motion.p 
                className="text-center text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Mostrando top 10 de {qaResponses.length} preguntas
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
            <MessageCircle className="w-24 h-24 text-muted-foreground mb-6" />
            <p className="text-2xl text-muted-foreground">
              Esperando preguntas…
            </p>
            <div className="mt-6 space-y-2 text-center text-muted-foreground">
              {slide.allowUpvoting && (
                <p className="text-lg">Los participantes pueden votar preguntas</p>
              )}
              {slide.moderationEnabled && (
                <p className="text-lg">Las preguntas requieren aprobación</p>
              )}
              {slide.anonymousAllowed && (
                <p className="text-lg">Se permiten preguntas anónimas</p>
              )}
            </div>
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
              {responses.responseCount} preguntas de {participantCount} participantes
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}