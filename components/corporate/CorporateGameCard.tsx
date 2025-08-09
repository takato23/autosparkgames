'use client'

import * as React from 'react'
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, IconButton, Menu, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { CorporateGlassCard } from './CorporateGlassCard'

const GameIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  marginBottom: theme.spacing(2)
}))

const StatusChip = styled(Chip)<{ status: 'active' | 'completed' | 'pending' | 'draft' }>(({ theme, status }) => {
  const statusColors = {
    active: { bg: theme.palette.success.light, color: theme.palette.success.dark },
    completed: { bg: theme.palette.info.light, color: theme.palette.info.dark },
    pending: { bg: theme.palette.warning.light, color: theme.palette.warning.dark },
    draft: { bg: theme.palette.grey[200], color: theme.palette.grey[700] }
  }
  
  return {
    backgroundColor: statusColors[status].bg,
    color: statusColors[status].color,
    fontSize: '0.75rem',
    height: 24,
    '& .MuiChip-label': {
      fontWeight: 500
    }
  }
})

const ParticipantInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem'
}))

interface GameData {
  id: string
  title: string
  participants: number
  status: 'active' | 'completed' | 'pending' | 'draft'
  completionRate: number
  createdAt: Date
}

interface CorporateGameCardProps {
  game: GameData
  onPlay?: (gameId: string) => void
  onEdit?: (gameId: string) => void
  onDelete?: (gameId: string) => void
}

const statusLabels = {
  active: 'Activo',
  completed: 'Completado', 
  pending: 'Pendiente',
  draft: 'Borrador'
}

export function CorporateGameCard({ game, onPlay, onEdit, onDelete }: CorporateGameCardProps) {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleEdit = () => {
    onEdit?.(game.id)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDelete?.(game.id)
    handleMenuClose()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <CorporateGlassCard variant="professional" className="h-full">
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <GameIcon>
            <SportsEsportsOutlinedIcon />
          </GameIcon>
          
          <Box display="flex" alignItems="center" gap={1}>
            <StatusChip 
              status={game.status}
              label={statusLabels[game.status]}
              size="small"
            />
            <IconButton 
              size="small" 
              onClick={handleMenuClick}
              sx={{ color: 'text.secondary' }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 1,
            lineHeight: 1.3
          }}
        >
          {game.title}
        </Typography>

        <ParticipantInfo sx={{ mb: 2 }}>
          <PeopleOutlinedIcon fontSize="small" />
          <span>{game.participants} participantes</span>
        </ParticipantInfo>

        {game.status !== 'draft' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Tasa de finalización
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  flex: 1, 
                  height: 6, 
                  backgroundColor: 'grey.200', 
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    height: '100%', 
                    backgroundColor: 'primary.main',
                    width: `${game.completionRate}%`,
                    transition: 'width 0.3s ease'
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 'fit-content' }}>
                {game.completionRate}%
              </Typography>
            </Box>
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={<PlayArrowIcon />}
          onClick={() => onPlay?.(game.id)}
          disabled={game.status === 'draft'}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          {game.status === 'draft' ? 'Configurar Juego' : 'Iniciar Juego'}
        </Button>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>
      </CorporateGlassCard>
    </motion.div>
  )
}