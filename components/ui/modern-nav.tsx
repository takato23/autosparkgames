'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { GlassCard } from './glass-card'
import { FloatingElement } from './floating-element'
import { 
  Home, 
  Gamepad2, 
  Settings, 
  Trophy,
  Users,
  BarChart3
} from 'lucide-react'

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Juegos', href: '/offline', icon: Gamepad2 },
  { name: 'Configuración', href: '/offline/settings', icon: Settings },
  { name: 'Estadísticas', href: '/stats', icon: BarChart3 }
]

export function ModernNav() {
  const pathname = usePathname()
  
  return (
    <FloatingElement duration={8} distance={15}>
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <GlassCard
          className="flex items-center gap-2 px-3 py-2"
          blur="xl"
          opacity={10}
          border
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all ${
                    isActive 
                      ? 'text-white bg-white/20' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden sm:block">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </GlassCard>
      </motion.nav>
    </FloatingElement>
  )
}