'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

// Keep only motion/typography helpers here to avoid overriding Tailwind tokens
const ThemeCSS = () => (
  <style jsx global>{`
    html {
      font-feature-settings: "ss01" on, "cv01" on, "cv02" on;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 1ms !important;
        scroll-behavior: auto !important;
      }
    }
  `}</style>
)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="autospark-theme"
      {...props}
    >
      <ThemeCSS />
      {children}
    </NextThemesProvider>
  )
}