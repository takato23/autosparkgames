'use client'

import * as React from 'react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CorporateHeader } from './CorporateHeader'
import { CorporateSidebar } from './CorporateSidebar'
import corporateTheme from '@/lib/corporateTheme'

const LayoutRoot = styled(Box)(() => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8fafc'
}))

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})<{ sidebarOpen: boolean }>(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarOpen ? 280 : 0,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0
  }
}))

const ContentArea = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
}))

interface CorporateLayoutProps {
  children: React.ReactNode
  currentUser?: {
    name: string
    avatar: string
  }
  companyName?: string
}

export function CorporateLayout({ 
  children, 
  currentUser,
  companyName 
}: CorporateLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [selectedNavItem, setSelectedNavItem] = React.useState('dashboard')

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNavItemSelect = (itemId: string) => {
    setSelectedNavItem(itemId)
  }

  return (
    <ThemeProvider theme={corporateTheme}>
      <CssBaseline />
      <LayoutRoot>
        <CorporateSidebar
          open={sidebarOpen}
          selectedItem={selectedNavItem}
          onItemSelect={handleNavItemSelect}
        />
        
        <MainContent sidebarOpen={sidebarOpen}>
          <CorporateHeader
            onMenuClick={handleMenuClick}
            currentUser={currentUser}
            companyName={companyName}
          />
          
          <ContentArea>
            {children}
          </ContentArea>
        </MainContent>
      </LayoutRoot>
    </ThemeProvider>
  )
}