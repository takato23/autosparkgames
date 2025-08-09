'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { MultipleChoiceSlide } from '@/lib/types/presentation'
import { SlideResponses, MultipleChoiceAggregated } from '@/lib/types/session'
import { Card } from '@/components/ui/card'

interface MultipleChoicePresenterViewProps {
  slide: MultipleChoiceSlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function MultipleChoicePresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: MultipleChoicePresenterViewProps) {
  const aggregatedData = responses?.aggregatedData?.data as MultipleChoiceAggregated
  
  const chartData = slide.options.map((option, index) => ({
    name: option.text,
    value: aggregatedData?.optionCounts[option.id] || 0,
    percentage: participantCount > 0 
      ? Math.round(((aggregatedData?.optionCounts[option.id] || 0) / participantCount) * 100)
      : 0,
    color: COLORS[index % COLORS.length],
    isCorrect: slide.correctAnswers?.includes(option.id)
  }))
  
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
          {slide.question}
        </motion.h1>
        
        {showResults && responses && responses.responseCount > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 14 }}
                />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">Responses: {data.value}</p>
                          <p className="text-sm">{data.percentage}%</p>
                          {data.isCorrect && (
                            <p className="text-sm text-green-600 font-semibold">✓ Correct</p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isCorrect ? '#10b981' : entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {slide.options.map((option, index) => (
              <motion.div
                key={option.id}
                className="p-6 bg-muted rounded-lg text-lg font-medium flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <span className="text-2xl font-bold text-muted-foreground">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option.text}</span>
              </motion.div>
            ))}
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