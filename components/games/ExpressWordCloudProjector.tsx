'use client'

import React from 'react'
import WordCloudDisplay from '@/components/presenter/WordCloudDisplay'

type Word = { word: string; count: number }

type Props = {
  prompt?: string
  words: Word[]
}

export default function ExpressWordCloudProjector({ prompt, words }: Props) {
  return (
    <div className="space-y-6">
      {prompt && (
        <h3 className="text-2xl font-bold text-center">{prompt}</h3>
      )}
      <WordCloudDisplay words={words} />
    </div>
  )
}