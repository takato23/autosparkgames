'use client'

import { Card } from '@/lib/design-system/components'
import { Presentation, Users, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface QuickStatsProps {
  stats: {
    totalPresentations: number
    readyToLaunch: number
    activeSessions: number
    totalParticipants: number
  }
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      title: 'Total Presentaciones',
      value: stats.totalPresentations,
      icon: Presentation,
      color: 'from-blue-500 to-cyan-500',
      change: null,
    },
    {
      title: 'Listas para Lanzar',
      value: stats.readyToLaunch,
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      change: null,
    },
    {
      title: 'Sesiones Activas',
      value: stats.activeSessions,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: null,
    },
    {
      title: 'Participantes Ahora',
      value: stats.totalParticipants,
      icon: Users,
      color: 'from-orange-500 to-red-500',
      change: '+12%',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card variant="default" className="relative overflow-hidden">
            <div className="relative z-10 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                {stat.change && (
                  <span className="text-xs text-green-400 font-medium">
                    {stat.change}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-300">
                  {stat.title}
                </p>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 blur-xl`} />
          </Card>
        </motion.div>
      ))}
    </div>
  )
}