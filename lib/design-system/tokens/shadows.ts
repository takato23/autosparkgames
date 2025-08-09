export const shadows = {
  // Elevation shadows for dark theme
  elevation: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    sm: '0 2px 4px -1px rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
  },
  
  // Glow effects for gaming theme
  glow: {
    sm: '0 0 10px rgba(59, 130, 246, 0.5)',
    md: '0 0 20px rgba(59, 130, 246, 0.5)',
    lg: '0 0 30px rgba(59, 130, 246, 0.5)',
    purple: '0 0 20px rgba(168, 85, 247, 0.5)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.5)',
    pink: '0 0 20px rgba(236, 72, 153, 0.5)',
    success: '0 0 20px rgba(16, 185, 129, 0.5)',
    error: '0 0 20px rgba(239, 68, 68, 0.5)',
  },
  
  // Inner shadows
  inner: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
    lg: 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  },
  
  // Special effects
  glass: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
  buttonHover: '0 0 0 4px rgba(59, 130, 246, 0.1)',
  focusRing: '0 0 0 3px rgba(59, 130, 246, 0.5)',
} as const