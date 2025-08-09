'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { RatingSlide } from '@/lib/types/presentation'
import { SlideResponses, RatingAggregated } from '@/lib/types/session'
import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface RatingPresenterViewProps {
  slide: RatingSlide
  responses?: SlideResponses
  showResults: boolean
  participantCount: number
}

export default function RatingPresenterView({
  slide,
  responses,
  showResults,
  participantCount
}: RatingPresenterViewProps) {
  const aggregatedData = responses?.aggregatedData?.data as RatingAggregated
  
  // Create chart data for rating distribution
  const chartData = []
  if (aggregatedData?.distribution) {
    for (let i = slide.minValue; i <= slide.maxValue; i += slide.step) {
      chartData.push({
        rating: i,
        count: aggregatedData.distribution[i] || 0,
        percentage: responses && responses.responseCount > 0
          ? Math.round(((aggregatedData.distribution[i] || 0) / responses.responseCount) * 100)
          : 0
      })
    }
  }
  
  const averageRating = aggregatedData?.average || 0
  const isStarRating = slide.minValue === 1 && slide.maxValue === 5 && slide.step === 1
  
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
          >
            {/* Average rating display */}
            <div className="text-center mb-8">
              <motion.div 
                className="text-7xl font-bold text-primary mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {averageRating.toFixed(1)}
              </motion.div>
              
              {isStarRating && (
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-center gap-8 text-lg text-muted-foreground">
                {slide.labels?.min && (
                  <span>{slide.minValue} - {slide.labels.min}</span>
                )}
                {slide.labels?.max && (
                  <span>{slide.maxValue} - {slide.labels.max}</span>
                )}
              </div>
            </div>
            
            {/* Distribution chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="rating" 
                    tick={{ fontSize: 14 }}
                    label={{ value: 'Rating', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 14 }}
                    label={{ value: 'Responses', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">Rating: {data.rating}</p>
                            <p className="text-sm">Responses: {data.count}</p>
                            <p className="text-sm">{data.percentage}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.rating === Math.round(averageRating) ? '#10b981' : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-semibold">{slide.minValue}</span>
              {isStarRating ? (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-12 h-12 text-gray-300" />
                  ))}
                </div>
              ) : (
                <div className="w-96 h-2 bg-gray-200 rounded-full" />
              )}
              <span className="text-2xl font-semibold">{slide.maxValue}</span>
            </div>
            
            {(slide.labels?.min || slide.labels?.max) && (
              <div className="flex items-center justify-center gap-64 text-lg text-muted-foreground">
                {slide.labels?.min && <span>{slide.labels.min}</span>}
                {slide.labels?.max && <span>{slide.labels.max}</span>}
              </div>
            )}
            
            <p className="text-2xl text-muted-foreground mt-8">
              Waiting for ratings...
            </p>
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
              {responses.responseCount} of {participantCount} rated
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}