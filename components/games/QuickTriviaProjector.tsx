"use client"

import React from 'react'
import BarChart from '@/components/ui/BarChart'

type TriviaOption = { id: string; text: string }

type Props = {
  slide: { id: string; question: string; options: TriviaOption[]; correctAnswer?: string; correctIndex?: number }
  counts: number[]
  total: number
  slideState: 'show' | 'locked' | 'reveal' | 'lobby'
}

export default function QuickTriviaProjector({ slide, counts, total, slideState }: Props) {
  const labels = (slide.options || []).map(o => o.text)
  const correctIndex = (() => {
    if (slideState !== 'reveal') return undefined
    if (typeof slide.correctIndex === 'number') return slide.correctIndex
    if (slide.correctAnswer) {
      const idx = (slide.options || []).findIndex(o => o.id === slide.correctAnswer)
      return idx >= 0 ? idx : undefined
    }
    return undefined
  })()

  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold">{slide.question}</h3>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        {(slide.options || []).map((opt) => (
          <div key={opt.id} className="p-4 rounded-lg bg-white/10 border border-white/20">
            {opt.text}
          </div>
        ))}
      </div>
      {(slideState === 'reveal' || slideState === 'show') && (
        <div className="mt-8">
          <BarChart labels={labels} counts={counts} total={total} reveal={slideState === 'reveal'} correctIndex={correctIndex} />
        </div>
      )}
    </div>
  )
}