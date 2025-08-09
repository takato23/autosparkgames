'use client'

import * as React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { styled } from '@mui/material/styles'

const ChartCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
}))

interface TeamPerformance {
  team: string
  score: number
  engagement: number
}

interface TeamPerformanceChartProps {
  data: TeamPerformance[]
  title?: string
}

export function TeamPerformanceChart({ 
  data, 
  title = 'Rendimiento por Equipo' 
}: TeamPerformanceChartProps) {
  const chartData = data.map(item => ({
    team: item.team,
    score: item.score,
    engagement: item.engagement
  }))

  return (
    <ChartCard>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 3
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ width: '100%', height: 300 }}>
          <BarChart
            dataset={chartData}
            xAxis={[{ 
              scaleType: 'band', 
              dataKey: 'team',
              tickLabelStyle: {
                fontSize: 12,
                fill: '#64748b'
              }
            }]}
            yAxis={[{
              tickLabelStyle: {
                fontSize: 12,
                fill: '#64748b'
              }
            }]}
            series={[
              {
                dataKey: 'score',
                label: 'Puntuación',
                color: '#1e40af'
              },
              {
                dataKey: 'engagement',
                label: 'Engagement',
                color: '#3b82f6'
              }
            ]}
            width={undefined}
            height={300}
            margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
            slotProps={{
              legend: {
                position: { vertical: 'top', horizontal: 'end' }
              }
            }}
          />
        </Box>
      </CardContent>
    </ChartCard>
  )
}