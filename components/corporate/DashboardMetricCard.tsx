'use client'

import * as React from 'react'
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const MetricCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.15)',
    transform: 'translateY(-2px)'
  }
}))

const MetricIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white'
}))

const TrendIndicator = styled(Box)<{ trend: 'up' | 'down' | 'neutral' }>(({ theme, trend }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: trend === 'up' ? theme.palette.success.main : 
         trend === 'down' ? theme.palette.error.main : 
         theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500
}))

interface DashboardMetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
    label?: string
  }
  onClick?: () => void
  onMenuClick?: () => void
}

export function DashboardMetricCard({
  title,
  value,
  icon,
  trend,
  onClick,
  onMenuClick
}: DashboardMetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <MetricCard onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <MetricIcon>
              {icon}
            </MetricIcon>
            {onMenuClick && (
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation()
                  onMenuClick()
                }}
                sx={{ color: 'text.secondary' }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {title}
          </Typography>

          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              mb: trend ? 1 : 0
            }}
          >
            {value}
          </Typography>

          {trend && (
            <TrendIndicator trend={trend.direction}>
              {trend.direction === 'up' && <TrendingUpIcon fontSize="small" />}
              {trend.direction === 'down' && <TrendingDownIcon fontSize="small" />}
              <span>{trend.value}</span>
              {trend.label && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  {trend.label}
                </Typography>
              )}
            </TrendIndicator>
          )}
        </CardContent>
      </MetricCard>
    </motion.div>
  )
}