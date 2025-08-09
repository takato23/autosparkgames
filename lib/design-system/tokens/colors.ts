export const colors = {
  // Brand colors with semantic meaning
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Gaming-inspired accent colors
  gaming: {
    cyan: '#06b6d4',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    green: '#10b981',
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Neutral colors with better contrast
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  
  // Special UI colors
  ui: {
    background: {
      primary: '#09090b',
      secondary: '#18181b',
      elevated: '#27272a',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      default: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.2)',
    },
  },
} as const

// Gradient presets for consistent usage
export const gradients = {
  brand: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
  gaming: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  warm: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
  dark: 'linear-gradient(135deg, #27272a 0%, #09090b 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
} as const