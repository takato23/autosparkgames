import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { SkipToContent } from '@/components/ui/skip-to-content'
import BrandRibbon from '@/components/corporate/BrandRibbon'
import { SeamlessTransition } from '@/components/ui/seamless-transition'
import { BeautifulTheme } from '@/components/ui/beautiful-theme'
import QuickNav from '@/components/ui/quick-nav'
import { Toaster } from 'sonner'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoSpark — Juegos interactivos simples',
  description: 'Crea, comparte y juega experiencias interactivas. Diseño moderno, accesible y rápido.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} custom-scrollbar`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="autospark-theme" disableTransitionOnChange>
            <SkipToContent />
            <main id="main-content" className="relative min-h-screen grid grid-rows-[auto_1fr_auto]">
              <BeautifulTheme theme="galaxy" intensity="subtle" animated>
                <SeamlessTransition>
                  <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,hsl(var(--primary)/0.12),transparent_60%)]" />
                    <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-500/12 blur-3xl animate-blob" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/12 blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-pink-500/12 blur-3xl animate-blob animation-delay-4000" />
                  </div>
                  <div className="relative z-10">
                    <AppHeader />
                    <BrandRibbon sponsorName="Tu Marca Aquí" primaryColor="#0ea5e9" />
                    <div className="min-h-0">
                      {children}
                    </div>
                    <AppFooter />
                  </div>
                </SeamlessTransition>
              </BeautifulTheme>
            </main>
            <QuickNav />
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}