'use client'

import * as React from 'react'
import { Box, Typography, Stack, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DashboardMetricCard } from './DashboardMetricCard'
import { CorporateGameCard } from './CorporateGameCard'
import { TeamPerformanceChart } from './TeamPerformanceChart'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SpeedIcon from '@mui/icons-material/Speed'

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh'
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2)
}))

interface DashboardData {
  metrics: {
    totalUsers: number
    activeSessions: number
    engagementRate: number
    avgResponseTime: number
  }
  recentGames: Array<{
    id: string
    title: string
    participants: number
    status: 'active' | 'completed' | 'pending' | 'draft'
    completionRate: number
    createdAt: Date
  }>
  teamPerformance: Array<{
    team: string
    score: number
    engagement: number
  }>
}

interface CorporateDashboardProps {
  data: DashboardData
  onGamePlay?: (gameId: string) => void
  onGameEdit?: (gameId: string) => void
  onGameDelete?: (gameId: string) => void
}

export function CorporateDashboard({ 
  data, 
  onGamePlay, 
  onGameEdit, 
  onGameDelete 
}: CorporateDashboardProps) {
  const formatMetricValue = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`
  }

  const formatResponseTime = (value: number): string => {
    return `${value.toFixed(1)}s`
  }

  return (
    <DashboardContainer>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              mb: 1
            }}
          >
            Dashboard Corporativo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitorea el rendimiento y engagement de tu equipo
          </Typography>
        </Box>

        {/* Metrics Cards */}
        <Box>
          <SectionTitle>Métricas Principales</SectionTitle>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <DashboardMetricCard
                title="Total Usuarios"
                value={formatMetricValue(data.metrics.totalUsers)}
                icon={<PeopleOutlinedIcon />}
                trend={{
                  direction: 'up',
                  value: '+12%',
                  label: 'vs mes anterior'
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <DashboardMetricCard
                title="Sesiones Activas"
                value={data.metrics.activeSessions}
                icon={<PlayCircleOutlineIcon />}
                trend={{
                  direction: 'up',
                  value: '+5',
                  label: 'desde ayer'
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <DashboardMetricCard
                title="Tasa de Engagement"
                value={formatPercentage(data.metrics.engagementRate)}
                icon={<TrendingUpIcon />}
                trend={{
                  direction: 'up',
                  value: '+3.2%',
                  label: 'esta semana'
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <DashboardMetricCard
                title="Tiempo de Respuesta"
                value={formatResponseTime(data.metrics.avgResponseTime)}
                icon={<SpeedIcon />}
                trend={{
                  direction: 'down',
                  value: '-0.5s',
                  label: 'mejora'
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Charts and Games Section */}
        <Grid container spacing={4}>
          {/* Team Performance Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <TeamPerformanceChart data={data.teamPerformance} />
          </Grid>

          {/* Recent Games */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box>
              <SectionTitle>Juegos Recientes</SectionTitle>
              <Stack spacing={2}>
                {data.recentGames.slice(0, 3).map((game) => (
                  <CorporateGameCard
                    key={game.id}
                    game={game}
                    onPlay={onGamePlay}
                    onEdit={onGameEdit}
                    onDelete={onGameDelete}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </DashboardContainer>
  )
}