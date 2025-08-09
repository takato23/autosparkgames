'use client'

import * as React from 'react'
import { AppBar, Toolbar, Typography, Avatar, IconButton, Stack, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'

const CorporateAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  color: theme.palette.text.primary
}))

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& .logo-icon': {
    width: 40,
    height: 40,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  }
}))

const BrandText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  '& .company-name': {
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.2,
    color: '#1f2937'
  },
  '& .tagline': {
    fontSize: '0.75rem',
    color: '#64748b',
    lineHeight: 1
  }
}))

interface CorporateHeaderProps {
  onMenuClick?: () => void
  currentUser?: {
    name: string
    avatar: string
  }
  companyName?: string
}

export function CorporateHeader({ 
  onMenuClick, 
  currentUser = { name: 'Usuario', avatar: 'https://i.pravatar.cc/150?img=1' },
  companyName = 'AutoSpark'
}: CorporateHeaderProps) {
  return (
    <CorporateAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <LogoContainer>
            <div className="logo-icon">
              <AutoAwesomeOutlinedIcon sx={{ fontSize: 24 }} />
            </div>
            <BrandText>
              <Typography className="company-name">
                {companyName}
              </Typography>
              <Typography className="tagline">
                Gaming Hub Corporativo
              </Typography>
            </BrandText>
          </LogoContainer>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            color="inherit"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <SettingsIcon />
          </IconButton>
          
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            sx={{ 
              width: 36, 
              height: 36,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          />
        </Stack>
      </Toolbar>
    </CorporateAppBar>
  )
}