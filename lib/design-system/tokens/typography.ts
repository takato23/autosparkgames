export const typography = {
  // Font families
  fonts: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Consolas, "Courier New", monospace',
    display: 'Cal Sans, Inter, system-ui, sans-serif',
  },
  
  // Font sizes with line heights
  sizes: {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },      // 12px
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },  // 14px
    base: { fontSize: '1rem', lineHeight: '1.5rem' },     // 16px
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },  // 18px
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },   // 20px
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },    // 24px
    '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' }, // 30px
    '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },  // 36px
    '5xl': { fontSize: '3rem', lineHeight: '1' },          // 48px
    '6xl': { fontSize: '3.75rem', lineHeight: '1' },       // 60px
    '7xl': { fontSize: '4.5rem', lineHeight: '1' },        // 72px
    '8xl': { fontSize: '6rem', lineHeight: '1' },          // 96px
    '9xl': { fontSize: '8rem', lineHeight: '1' },          // 128px
  },
  
  // Font weights
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text styles presets
  styles: {
    // Headings
    h1: {
      fontSize: '3rem',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      lineHeight: '1.5',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      lineHeight: '1.6',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      lineHeight: '1.6',
      fontWeight: 600,
    },
    
    // Body text
    body: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontWeight: 400,
    },
    bodyLarge: {
      fontSize: '1.125rem',
      lineHeight: '1.6',
      fontWeight: 400,
    },
    bodySmall: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: 400,
    },
    
    // Special text
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0.025em',
    },
    button: {
      fontSize: '0.875rem',
      lineHeight: '1',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    code: {
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: 400,
    },
  },
} as const