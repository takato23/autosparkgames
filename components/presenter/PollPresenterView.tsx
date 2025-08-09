'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { PollSlide } from '@/lib/types/presentation'
import { SlideResponses, PollAggregated } from '@/lib/types/session'
import { Card } from '@/components/ui/card'

interface PollPresenterViewProps {
  slide: PollSlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function PollPresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: PollPresenterViewProps) {
  const aggregatedData = responses?.aggregatedData?.data as PollAggregated
  
  const chartData = slide.options.map((option, index) => ({
    name: option.text,
    value: aggregatedData?.optionCounts[option.id] || 0,
    percentage: aggregatedData?.totalVotes > 0 
      ? Math.round(((aggregatedData?.optionCounts[option.id] || 0) / aggregatedData.totalVotes) * 100)
      : 0,
    color: option.color || COLORS[index % COLORS.length]
  }))
  
  const totalResponses = aggregatedData?.totalVotes || 0
  
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
        
        {showResults && totalResponses > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-12"
          >
            <div className="h-96 w-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm">Votes: {data.value}</p>
                            <p className="text-sm font-semibold">{data.percentage}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-lg font-medium min-w-[200px]">{item.name}</span>
                  <span className="text-lg font-bold">{item.percentage}%</span>
                </motion.div>
              ))}
            </div>
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
                className="p-6 rounded-lg text-lg font-medium flex items-center gap-4"
                style={{ backgroundColor: `${option.color || COLORS[index % COLORS.length]}20` }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: option.color || COLORS[index % COLORS.length] }}
                />
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
              {responses.responseCount} of {participantCount} voted
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}