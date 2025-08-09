'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Presentation as PresentationIcon, BarChart3, Settings, Shield, Database, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserPresentations } from '@/lib/firebase/helpers/presentations'
import { auth } from '@/lib/firebase/config'
import type { Presentation as PresentationType } from '@/lib/types/presentation'

export default function AdminPage() {
  const [recentPresentations, setRecentPresentations] = useState<PresentationType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecentPresentations = async () => {
      if (auth.currentUser) {
        try {
          const presentations = await getUserPresentations(auth.currentUser.uid, 5)
          setRecentPresentations(presentations)
        } catch (error) {
          console.error('Error loading presentations:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadRecentPresentations()
      }
    })

    return () => unsubscribe()
  }, [])
  const stats = [
    { title: 'Total Users', value: '2,341', icon: Users, change: '+12%' },
    { title: 'Active Presentations', value: '89', icon: PresentationIcon, change: '+5%' },
    { title: 'Total Sessions', value: '15,234', icon: BarChart3, change: '+23%' },
    { title: 'System Health', value: '99.9%', icon: Shield, change: '0%' },
  ]

  const recentActivity = [
    { id: 1, type: 'user', message: 'New user registered: john.doe@company.com', time: '2 minutes ago' },
    { id: 2, type: 'presentation', message: 'Presentation "Team Quiz" went live', time: '15 minutes ago' },
    { id: 3, type: 'system', message: 'Database backup completed successfully', time: '1 hour ago' },
    { id: 4, type: 'alert', message: 'High CPU usage detected on server-02', time: '2 hours ago' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />
      case 'presentation': return <PresentationIcon className="h-4 w-4" />
      case 'system': return <Database className="h-4 w-4" />
      case 'alert': return <AlertTriangle className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <AdminLayout>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Panel de Control
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Bienvenido de vuelta. Esto es lo que está pasando con tus presentaciones.
              </p>
            </div>
            <Link href="/admin/presentations/new">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" aria-label="Crear nueva presentación">
                <Plus className="h-5 w-5 mr-2" />
                Nueva Presentación
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change} vs. mes anterior
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Presentations */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Presentaciones Recientes</h2>
              <Link href="/admin/presentations">
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Cargando presentaciones…</div>
                ) : recentPresentations.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 mb-4">Todavía no hay presentaciones</p>
                    <Link href="/admin/presentations/new">
                      <Button>Crear tu primera presentación</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentPresentations.map((presentation) => (
                      <Link 
                        key={presentation.id} 
                        href={`/admin/presentations/${presentation.id}/edit`}
                        className="block hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {presentation.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {(presentation as any).slides?.length ?? 0} slides • {presentation.status}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {(() => {
                                const u = (presentation as any).updatedAt
                                if (!u) return ''
                                // Firestore Timestamp has toDate, Date already format-able
                                const dateObj = typeof u?.toDate === 'function' ? u.toDate() : u
                                try {
                                  return new Date(dateObj).toLocaleDateString()
                                } catch {
                                  return ''
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PresentationIcon className="h-5 w-5" />
                    Presentaciones
                  </CardTitle>
                  <CardDescription>Crea y gestiona presentaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/presentations" className="block w-full">
                    <Button className="w-full">Gestionar Presentaciones</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analíticas
                  </CardTitle>
                  <CardDescription>Ver analíticas de presentaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">Ver Analíticas</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                  <CardDescription>Ajustes de perfil y tema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/settings" className="block w-full">
                    <Button className="w-full" variant="outline">Abrir Configuración</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-4">Actividad Reciente</h2>
            <Card>
              <CardHeader>
                <CardTitle>Registro de Actividad del Sistema</CardTitle>
                <CardDescription>Últimos eventos del sistema y actividades de usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}