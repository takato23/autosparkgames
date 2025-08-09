// Theme configuration for AudienceSpark
export const theme = {
  colors: {
    // Primary gradients with better contrast
    gradients: {
      primary: 'from-purple-600 to-pink-600',
      secondary: 'from-blue-600 to-teal-600',
      success: 'from-green-600 to-emerald-600',
      warning: 'from-yellow-500 to-orange-600',
      danger: 'from-red-600 to-pink-600',
      
      // Lighter versions for backgrounds
      primaryLight: 'from-purple-100 to-pink-100',
      secondaryLight: 'from-blue-100 to-teal-100',
      successLight: 'from-green-100 to-emerald-100',
      warningLight: 'from-yellow-100 to-orange-100',
      
      // Background gradient
      background: 'from-purple-600 via-pink-500 to-orange-400',
      backgroundSubtle: 'from-purple-50 via-pink-50 to-orange-50'
    },
    
    // Team colors with accessibility in mind
    teams: [
      { name: 'Rojo', bg: 'bg-red-500', text: 'text-white', light: 'bg-red-100', emoji: '🔴' },
      { name: 'Azul', bg: 'bg-blue-500', text: 'text-white', light: 'bg-blue-100', emoji: '🔵' },
      { name: 'Verde', bg: 'bg-green-500', text: 'text-white', light: 'bg-green-100', emoji: '🟢' },
      { name: 'Amarillo', bg: 'bg-yellow-500', text: 'text-gray-900', light: 'bg-yellow-100', emoji: '🟡' }
    ],
    
    // Answer options with good contrast
    answers: [
      { bg: 'from-purple-500 to-purple-600', hover: 'from-purple-600 to-purple-700', text: 'text-white' },
      { bg: 'from-blue-500 to-blue-600', hover: 'from-blue-600 to-blue-700', text: 'text-white' },
      { bg: 'from-green-500 to-green-600', hover: 'from-green-600 to-green-700', text: 'text-white' },
      { bg: 'from-orange-500 to-orange-600', hover: 'from-orange-600 to-orange-700', text: 'text-white' }
    ],
    
    // High contrast text colors for accessibility
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      light: 'text-gray-600',
      onDark: 'text-white',
      onDarkSecondary: 'text-white/90',
    }
  },
  
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    vibrant: '0 20px 25px -5px rgb(147 51 234 / 0.1), 0 10px 10px -5px rgb(236 72 153 / 0.04)'
  },
  
  animations: {
    float: 'float 6s ease-in-out infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    spin: 'spin 20s linear infinite',
    wiggle: 'wiggle 1s ease-in-out infinite'
  },
  
  typography: {
    heading: {
      h1: 'text-6xl md:text-7xl lg:text-8xl font-black',
      h2: 'text-4xl md:text-5xl lg:text-6xl font-bold',
      h3: 'text-2xl md:text-3xl lg:text-4xl font-bold',
      h4: 'text-xl md:text-2xl font-bold'
    },
    body: {
      large: 'text-lg md:text-xl',
      base: 'text-base md:text-lg',
      small: 'text-sm md:text-base'
    }
  },
  
  spacing: {
    section: 'py-12 md:py-16 lg:py-20',
    card: 'p-6 md:p-8',
    button: 'px-6 py-3 md:px-8 md:py-4'
  },
  
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  }
}

// Accessibility helpers
export const a11y = {
  // Ensure minimum contrast ratios
  getContrastColor: (bgColor: string): string => {
    // For gradients, we'll default to white text on dark backgrounds
    if (bgColor.includes('500') || bgColor.includes('600')) return 'text-white'
    if (bgColor.includes('400')) return 'text-gray-900'
    return 'text-gray-900' // Light backgrounds
  },
  
  // Focus styles for keyboard navigation
  focusRing: 'focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 focus:ring-offset-2',
  focusRingDark: 'focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-purple-600',
  
  // Screen reader utilities
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
  
  // Reduced motion support
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
  
  // High contrast mode support
  highContrast: {
    border: 'contrast-more:border-2 contrast-more:border-gray-900',
    text: 'contrast-more:text-gray-900 contrast-more:font-bold',
    bg: 'contrast-more:bg-white',
  },
  
  // Skip to content link for keyboard navigation
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-purple-600 focus:rounded-lg focus:shadow-lg',
  
  // ARIA live regions
  liveRegion: {
    polite: 'aria-live="polite" aria-atomic="true"',
    assertive: 'aria-live="assertive" aria-atomic="true"',
    off: 'aria-live="off"'
  }
}

// Animation keyframes for custom animations
export const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) }
    50% { transform: translateY(-20px) }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg) }
    50% { transform: rotate(3deg) }
  }
`