// Paleta de colores definitiva para AutoSpark Games
// Tema oscuro y moderno con acentos vibrantes

export const theme = {
  // Colores base
  colors: {
    // Fondos principales
    background: {
      primary: '#111827',    // gray-900 - Fondo principal
      secondary: '#1f2937',  // gray-800 - Elementos elevados
      tertiary: '#374151',   // gray-700 - Componentes interactivos
    },
    
    // Bordes y divisores
    border: {
      default: '#4b5563',    // gray-600
      subtle: '#6b7280',     // gray-500
      interactive: '#9ca3af', // gray-400
    },
    
    // Texto
    text: {
      primary: '#ffffff',    // Texto principal
      secondary: '#d1d5db',  // gray-300 - Texto secundario
      tertiary: '#9ca3af',   // gray-400 - Texto terciario
      muted: '#6b7280',      // gray-500 - Texto deshabilitado
    },
    
    // Colores de marca/funcionales
    brand: {
      primary: '#3b82f6',    // blue-500
      secondary: '#8b5cf6',  // violet-500
      accent: '#f59e0b',     // amber-500
    },
    
    // Estados semánticos
    semantic: {
      success: '#10b981',    // emerald-500
      warning: '#f59e0b',    // amber-500
      error: '#ef4444',      // red-500
      info: '#3b82f6',       // blue-500
    },
    
    // Colores de juegos (vibrantes)
    games: {
      trivia: '#8b5cf6',     // violet-500
      bingo: '#f59e0b',      // amber-500
      pictionary: '#ec4899', // pink-500
      memory: '#10b981',     // emerald-500
      race: '#ef4444',       // red-500
      team: '#3b82f6',       // blue-500
    }
  },
  
  // Espaciado
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Radios de borde
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  // Animaciones
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const

// Utility types
export type ThemeColors = typeof theme.colors
export type BackgroundColor = keyof ThemeColors['background']
export type TextColor = keyof ThemeColors['text']
export type GameColor = keyof ThemeColors['games']

// CSS custom properties helper
export const cssVars = {
  '--bg-primary': theme.colors.background.primary,
  '--bg-secondary': theme.colors.background.secondary,
  '--bg-tertiary': theme.colors.background.tertiary,
  '--border-default': theme.colors.border.default,
  '--text-primary': theme.colors.text.primary,
  '--text-secondary': theme.colors.text.secondary,
  '--brand-primary': theme.colors.brand.primary,
} as const