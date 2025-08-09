import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Minimal neutral palette driven by CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Remove extra surface elevations to keep visuals minimal
      },
      borderRadius: {
        // Density-aware radii
        xl: "calc(var(--radius) + 2px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Minimal low-elevation shadows
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 2px -1px rgb(0 0 0 / 0.10)",
        md: "0 2px 6px -2px rgb(0 0 0 / 0.12)",
      },
      spacing: {
        // Density tokens aligned to 4px grid
        'dx-0': '0.875rem',
        'dx-1': '1rem',
        'dx-2': '1.25rem',
      },
      transitionTimingFunction: {
        // Subtle motion curves
        'ease-out-productive': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 200ms var(--motion-ease, ease-out)",
      },
    },
  },
  safelist: [
    // Ensure critical semantic utilities are kept for dynamic themes
    { pattern: /(bg|text|border)-(primary|secondary|accent|destructive|muted|card|popover|background|foreground)/ },
    { pattern: /shadow-(sm|md)/ },
    // Dynamic gradient utilities composed at runtime (keep in build)
    { pattern: /bg-gradient-to-(r|br|b|tr)/ },
    { pattern: /(from|to|via)-(purple|pink|blue|teal|green|emerald|yellow|orange|red)-(100|200|300|400|500|600|700)/ },
    // Opacity variants commonly used with white/black
    { pattern: /(bg|text|border|ring)-(white|black)\/(5|10|15|20|30|40|50|60|70|80|90|95)/ },
    // Blur/backdrop utilities for glass effects
    { pattern: /backdrop-blur-(sm|md|lg|xl)/ },
    { pattern: /blur-(sm|md|lg|xl|2xl|3xl)/ },
    // Ring offsets used dynamically
    { pattern: /ring-offset-(0|1|2|4)/ },
  ],
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addVariant }) {
      // Respect reduced motion
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)')
      addVariant('motion-reduce', '@media (prefers-reduced-motion: reduce)')
    }),
  ],
}
export default config