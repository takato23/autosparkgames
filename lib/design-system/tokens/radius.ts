export const radius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const

// Component-specific radius
export const componentRadius = {
  button: radius.lg,
  card: radius.xl,
  modal: radius['2xl'],
  input: radius.lg,
  badge: radius.full,
  tooltip: radius.md,
  dropdown: radius.lg,
} as const