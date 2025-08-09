'use client'

import React from 'react'

type BarChartProps = {
  labels: string[]
  counts: number[]
  total: number
  reveal?: boolean
  correctIndex?: number
}

export default function BarChart({ labels, counts, total, reveal = false, correctIndex }: BarChartProps) {
  const safeCounts = Array.isArray(counts) ? counts : []
  const maxCount = Math.max(1, ...safeCounts)

  return (
    <div role="region" aria-label="Resultados en vivo" className="w-full max-w-3xl mx-auto">
      <ul className="space-y-2" aria-describedby="total-votos">
        {labels.map((label, i) => {
          const count = safeCounts[i] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const widthPct = Math.max(3, Math.round((count / maxCount) * 100))
          const isCorrect = reveal && typeof correctIndex === 'number' && correctIndex === i
          return (
            <li key={i} className="flex items-center gap-3" aria-label={`Opción ${i + 1}: ${label}, ${count} votos, ${pct}%`}>
              <div className="w-10 text-right text-sm tabular-nums">{pct}%</div>
              <div className="flex-1 relative h-8 rounded-md overflow-hidden border border-white/20" aria-hidden>
                <div
                  className={`h-full ${isCorrect ? 'bg-emerald-500' : 'bg-white/30'} transition-[width] duration-200`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className="w-10 text-right text-sm tabular-nums">{count}</div>
              <div className="flex-1 pl-2 text-sm truncate" title={label}>{label}</div>
            </li>
          )
        })}
      </ul>
      <div id="total-votos" className="mt-3 text-center text-sm opacity-80">
        Total: {total}
      </div>
    </div>
  )
}


