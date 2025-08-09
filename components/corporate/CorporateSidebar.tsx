'use client'

import * as React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

const CorporateDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.grey[900],
    color: 'white',
    borderRight: 'none'
  }
}))

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: `1px solid ${theme.palette.grey[800]}`
}))

const NavListItem = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.grey[800]
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlinedIcon />,
    href: '/dashboard'
  },
  {
    id: 'games',
    label: 'Juegos',
    icon: <SportsEsportsOutlinedIcon />,
    href: '/games'
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: <PeopleOutlinedIcon />,
    href: '/users'
  },
  {
    id: 'analytics',
    label: 'Análisis',
    icon: <AnalyticsOutlinedIcon />,
    href: '/analytics'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: <SettingsOutlinedIcon />,
    href: '/settings'
  }
]

interface CorporateSidebarProps {
  open: boolean
  onClose?: () => void
  selectedItem?: string
  onItemSelect?: (itemId: string) => void
}

export function CorporateSidebar({ 
  open, 
  onClose, 
  selectedItem = 'dashboard',
  onItemSelect 
}: CorporateSidebarProps) {
  const handleItemClick = (itemId: string) => {
    onItemSelect?.(itemId)
  }

  return (
    <CorporateDrawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <SidebarHeader>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
          Navegación
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400', mt: 0.5 }}>
          Panel de Control
        </Typography>
      </SidebarHeader>

      <List sx={{ px: 1, py: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <NavListItem
              selected={selectedItem === item.id}
              onClick={() => handleItemClick(item.id)}
            >
              <ListItemIcon sx={{ 
                color: selectedItem === item.id ? 'white' : 'grey.400',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: selectedItem === item.id ? 600 : 400
                  }
                }}
              />
            </NavListItem>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'grey.800', mx: 2 }} />
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" sx={{ color: 'grey.500' }}>
          AutoSpark v2.0
        </Typography>
      </Box>
    </CorporateDrawer>
  )
}