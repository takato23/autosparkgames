'use client'

import { motion } from 'framer-motion'
import type { Slide, SlideType, MultipleChoiceSlide, PollSlide, WordCloudSlide, RatingSlide, TriviaSlide } from '@/lib/types/presentation'
import type { SlideResponses, ParticipantResponse, RatingResponse, MultipleChoiceResponse, PollResponse, WordCloudResponse, TriviaResponse } from '@/lib/types/session'

interface SlideResultsPanelProps {
  slide: Slide
  responses?: SlideResponses
  participantCount: number
}

export default function SlideResultsPanel({ slide, responses, participantCount }: SlideResultsPanelProps) {
  if (!responses || !responses.responses || responses.responses.length === 0) {
    return (
      <div className="rounded-lg border p-6" role="status" aria-live="polite">
        <p className="text-sm text-muted-foreground">Aún no hay respuestas para esta diapositiva.</p>
      </div>
    )
  }

  switch (slide.type as SlideType) {
    case 'multiple_choice':
      return (
        <MultipleChoiceResults
          slide={slide as MultipleChoiceSlide}
          responses={responses.responses as ParticipantResponse[]}
        />
      )
    case 'poll':
      return (
        <PollResults
          slide={slide as PollSlide}
          responses={responses.responses as ParticipantResponse[]}
        />
      )
    case 'word_cloud':
      return (
        <WordCloudResults
          slide={slide as WordCloudSlide}
          responses={responses.responses as ParticipantResponse[]}
        />
      )
    case 'rating':
      return (
        <RatingResults
          slide={slide as RatingSlide}
          responses={responses.responses as ParticipantResponse[]}
          participantCount={participantCount}
        />
      )
    case 'trivia':
      return (
        <TriviaResults
          slide={slide as TriviaSlide}
          responses={responses.responses as ParticipantResponse[]}
        />
      )
    default:
      return null
  }
}

function MultipleChoiceResults({ slide, responses }: { slide: MultipleChoiceSlide, responses: ParticipantResponse[] }) {
  const optionCounts: Record<string, number> = {}
  slide.options.forEach((opt) => { optionCounts[opt.id] = 0 })

  responses.forEach((r) => {
    const resp = r as MultipleChoiceResponse
    if (resp && Array.isArray(resp.selectedOptions)) {
      resp.selectedOptions.forEach((optId) => {
        if (optId in optionCounts) optionCounts[optId]++
      })
    }
  })

  const items = slide.options.map((opt) => ({
    id: opt.id,
    label: opt.text,
    count: optionCounts[opt.id] || 0,
  }))

  const total = items.reduce((acc, it) => acc + it.count, 0)
  const max = Math.max(1, ...items.map((it) => it.count))

  return (
    <div className="space-y-4" role="region" aria-label="Resultados de opción múltiple">
      {items.map((it, idx) => {
        const percentage = total > 0 ? Math.round((it.count / total) * 100) : 0
        const width = Math.round((it.count / max) * 100)
        return (
          <div key={it.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{it.label}</span>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold mr-2">{percentage}%</span>
                <span>({it.count})</span>
              </div>
            </div>
            <div className="h-3 rounded bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TriviaResults({ slide, responses }: { slide: TriviaSlide, responses: ParticipantResponse[] }) {
  let correct = 0
  let incorrect = 0
  let totalTime = 0
  let correctTime = 0
  const optionCounts: Record<string, number> = {}
  slide.options.forEach((opt) => { optionCounts[opt.id] = 0 })

  responses.forEach((r) => {
    const resp = r as TriviaResponse
    if (!resp || resp.type !== 'trivia') return
    optionCounts[resp.selectedOption] = (optionCounts[resp.selectedOption] || 0) + 1
    if (resp.isCorrect) {
      correct++
      correctTime += resp.timeSpent || 0
    } else {
      incorrect++
    }
    totalTime += resp.timeSpent || 0
  })

  const total = correct + incorrect
  const avgTime = total > 0 ? Math.round(totalTime / total) : 0
  const avgCorrectTime = correct > 0 ? Math.round(correctTime / correct) : 0

  return (
    <div className="space-y-6" role="region" aria-label="Resultados de trivia">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Correctas</div>
          <div className="text-2xl font-bold text-green-600">{correct}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Incorrectas</div>
          <div className="text-2xl font-bold text-red-600">{incorrect}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Tiempo promedio</div>
          <div className="text-2xl font-bold">{avgTime} ms</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Tiempo prom. correctas</div>
          <div className="text-2xl font-bold">{avgCorrectTime} ms</div>
        </div>
      </div>

      <div className="space-y-3">
        {slide.options.map((opt, idx) => {
          const count = optionCounts[opt.id] || 0
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={opt.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{opt.text}</span>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold mr-2">{percentage}%</span>
                  <span>({count})</span>
                </div>
              </div>
              <div className="h-3 rounded bg-muted overflow-hidden">
                <motion.div
                  className={`h-full ${opt.id === slide.correctAnswer ? 'bg-green-500' : 'bg-primary/60'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  aria-label={`${opt.text}: ${count} respuestas`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PollResults({ slide, responses }: { slide: PollSlide, responses: ParticipantResponse[] }) {
  const optionCounts: Record<string, number> = {}
  slide.options.forEach((opt) => { optionCounts[opt.id] = 0 })

  responses.forEach((r) => {
    const resp = r as PollResponse
    if (resp && Array.isArray(resp.selectedOptions)) {
      resp.selectedOptions.forEach((optId) => {
        if (optId in optionCounts) optionCounts[optId]++
      })
    }
  })

  const items = slide.options.map((opt) => ({ id: opt.id, label: opt.text, count: optionCounts[opt.id] || 0 }))
  const total = items.reduce((acc, it) => acc + it.count, 0)
  const max = Math.max(1, ...items.map((it) => it.count))

  return (
    <div className="space-y-4" role="region" aria-label="Resultados de encuesta">
      {items.map((it, idx) => {
        const percentage = total > 0 ? Math.round((it.count / total) * 100) : 0
        const width = Math.round((it.count / max) * 100)
        return (
          <div key={it.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{it.label}</span>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold mr-2">{percentage}%</span>
                <span>({it.count})</span>
              </div>
            </div>
            <div className="h-3 rounded bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function WordCloudResults({ slide, responses }: { slide: WordCloudSlide, responses: ParticipantResponse[] }) {
  const counts: Record<string, number> = {}
  responses.forEach((r) => {
    const resp = r as WordCloudResponse
    if (resp && Array.isArray(resp.words)) {
      resp.words.forEach((w) => {
        const key = w.trim().toLowerCase()
        if (!key) return
        counts[key] = (counts[key] || 0) + 1
      })
    }
  })

  const words = Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 24)

  const max = Math.max(1, ...words.map((w) => Number(w.count)))

  return (
    <div className="relative w-full min-h-[12rem] sm:min-h-[16rem]">
      {words.map((item, index) => {
        const fontSize = 14 + (Number(item.count) / max) * 32
        const opacity = 0.5 + (Number(item.count) / max) * 0.5
        const row = Math.floor(index / 6)
        const col = index % 6
        const x = 12 + col * 16
        const y = 20 + row * 18
        return (
          <motion.span
            key={`${item.word}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="absolute font-semibold"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${fontSize}px`,
            }}
          >
            {item.word}
          </motion.span>
        )
      })}
    </div>
  )
}

function RatingResults({ slide, responses, participantCount }: { slide: RatingSlide, responses: ParticipantResponse[], participantCount: number }) {
  const distribution: Record<number, number> = {}
  for (let v = slide.minValue; v <= slide.maxValue; v += slide.step) {
    distribution[v] = 0
  }
  let sum = 0
  let count = 0

  responses.forEach((r) => {
    const resp = r as RatingResponse
    if (typeof (resp as RatingResponse).value === 'number') {
      const value = (resp as RatingResponse).value
      if (value in distribution) {
        distribution[value] += 1
        sum += value
        count += 1
      }
    }
  })

  const average = count > 0 ? sum / count : 0

  return (
    <div className="space-y-6" role="region" aria-label="Resultados de puntuación">
      <div>
        <div className="text-sm text-muted-foreground mb-1">Promedio</div>
        <div className="text-4xl font-bold">{average.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground">{count} respuestas{participantCount ? ` de ${participantCount}` : ''}</div>
      </div>
      <div className="flex items-end gap-2 h-40">
        {Object.entries(distribution).map(([rating, c]) => {
          const height = count > 0 ? Math.round((Number(c) / count) * 100) : 0
          return (
            <div key={rating} className="flex flex-col items-center">
              <motion.div
                className="w-8 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6 }}
                aria-label={`Valor ${rating}: ${c} respuestas`}
              />
              <span className="mt-1 text-xs text-muted-foreground">{rating}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


