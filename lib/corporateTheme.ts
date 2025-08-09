// Corporate theme for AutoSpark gaming hub
// Adding corporate color palette while preserving existing vibrant theme

import { createTheme } from '@mui/material/styles';

const corporateTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e40af', // Corporate blue
      light: '#3b82f6', // Lighter blue accent
      dark: '#1e3a8a', // Darker blue
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#374151', // Elegant gray
      light: '#6b7280', // Lighter gray
      dark: '#1f2937', // Darker gray
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc', // Warm white background
      paper: '#ffffff'
    },
    text: {
      primary: '#1f2937', // Dark gray text
      secondary: '#374151' // Medium gray text
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1f2937'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1f2937'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#374151'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#374151'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b'
    }
  },
  shape: {
    borderRadius: 12
  }
});

export default corporateTheme;