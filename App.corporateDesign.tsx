import React from 'react'
import { CorporateLayout } from './components/corporate/CorporateLayout'
import { CorporateDashboard } from './components/corporate/CorporateDashboard'
import { CorporateGlassCard } from './components/corporate/CorporateGlassCard'
import { DashboardMetricCard } from './components/corporate/DashboardMetricCard'
import { CorporateGameCard } from './components/corporate/CorporateGameCard'
import { TeamPerformanceChart } from './components/corporate/TeamPerformanceChart'
import { mockQuery, mockRootProps } from './lib/corporateMockData'
import { Box, Typography, Stack, Grid } from '@mui/material'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

function CorporateDesignShowcase() {
  const handleGamePlay = (gameId: string) => {
    console.log('Playing game:', gameId)
  }

  const handleGameEdit = (gameId: string) => {
    console.log('Editing game:', gameId)
  }

  const handleGameDelete = (gameId: string) => {
    console.log('Deleting game:', gameId)
  }

  return (
    <CorporateLayout
      currentUser={mockRootProps.currentUser}
      companyName={mockRootProps.corporateConfig.companyName}
    >
      <Box sx={{ p: 3 }}>
        <Stack spacing={4}>
          {/* Corporate Dashboard */}
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Dashboard Corporativo Completo
            </Typography>
            <CorporateDashboard
              data={{
                metrics: mockQuery.dashboardMetrics,
                recentGames: mockQuery.recentGames,
                teamPerformance: mockQuery.teamPerformance
              }}
              onGamePlay={handleGamePlay}
              onGameEdit={handleGameEdit}
              onGameDelete={handleGameDelete}
            />
          </Box>

          {/* Corporate Glass Card Variants */}
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Variantes de Glass Cards Corporativas
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <CorporateGlassCard variant="professional">
                  <Typography variant="h6" sx={{ mb: 2 }}>Profesional</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Diseño sobrio y elegante para presentaciones corporativas formales.
                  </Typography>
                </CorporateGlassCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CorporateGlassCard variant="executive">
                  <Typography variant="h6" sx={{ mb: 2 }}>Ejecutivo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estilo premium para reuniones de alto nivel y directivos.
                  </Typography>
                </CorporateGlassCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CorporateGlassCard variant="standard">
                  <Typography variant="h6" sx={{ mb: 2 }}>Estándar</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Diseño versátil para uso general en el entorno corporativo.
                  </Typography>
                </CorporateGlassCard>
              </Grid>
            </Grid>
          </Box>

          {/* Individual Components Showcase */}
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Componentes Individuales
            </Typography>
            
            <Stack spacing={4}>
              {/* Metric Cards */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Tarjetas de Métricas</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardMetricCard
                      title="Usuarios Activos"
                      value="1,247"
                      icon={<PeopleOutlinedIcon />}
                      trend={{
                        direction: 'up',
                        value: '+12%',
                        label: 'vs mes anterior'
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardMetricCard
                      title="Engagement Rate"
                      value="87.5%"
                      icon={<TrendingUpIcon />}
                      trend={{
                        direction: 'up',
                        value: '+3.2%',
                        label: 'esta semana'
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Game Cards */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Tarjetas de Juegos</Typography>
                <Grid container spacing={3}>
                  {mockQuery.recentGames.map((game) => (
                    <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <CorporateGameCard
                        game={game}
                        onPlay={handleGamePlay}
                        onEdit={handleGameEdit}
                        onDelete={handleGameDelete}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Team Performance Chart */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Gráfico de Rendimiento</Typography>
                <TeamPerformanceChart data={mockQuery.teamPerformance} />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </CorporateLayout>
  )
}

export default CorporateDesignShowcase