'use client'

import * as React from "react"
import { motion } from "framer-motion"

interface ZeroLatencyLoaderProps {
  children: React.ReactNode
  preloadRoutes?: string[]
  enablePrefetch?: boolean
  enableServiceWorker?: boolean
}

export function ZeroLatencyLoader({
  children,
  preloadRoutes = [],
  enablePrefetch = true,
  enableServiceWorker = true
}: ZeroLatencyLoaderProps) {
  const [isOptimized, setIsOptimized] = React.useState(false)
  
  React.useEffect(() => {
    // Preload critical routes
    if (enablePrefetch && typeof window !== 'undefined') {
      preloadRoutes.forEach(route => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      })
    }
    
    // Register service worker for instant loading
    if (enableServiceWorker && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, continue without it
      })
    }
    
    // Preload critical CSS and JS
    const criticalResources = [
      '/css/critical.css',
      '/js/vendor.js'
    ]
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      if (resource.endsWith('.css')) {
        link.as = 'style'
      } else if (resource.endsWith('.js')) {
        link.as = 'script'
      }
      link.href = resource
      document.head.appendChild(link)
    })
    
    // DNS prefetch for external resources
    const externalDomains = [
      'fonts.googleapis.com',
      'cdn.jsdelivr.net'
    ]
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })
    
    setIsOptimized(true)
  }, [preloadRoutes, enablePrefetch, enableServiceWorker])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOptimized ? 1 : 0.95 }}
      transition={{ duration: 0.1 }}
      className="will-change-opacity"
    >
      {children}
    </motion.div>
  )
}