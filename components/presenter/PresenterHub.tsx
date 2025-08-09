'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  Presentation as PresentationIcon,
  Rocket,
  Settings,
  Gamepad2,
  BookOpen,
  FileText,
  Play,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { createPresentation, getUserPresentations } from '@/lib/firebase/helpers/presentations'

type PresentationStatus = 'ready' | 'draft'

interface PresentationItem {
  id: string
  title: string
  description: string
  slides: number
  lastModifiedISO: string
  status: PresentationStatus
}

interface KpiDef {
  label: string
  value: number
  icon: React.ElementType
}

interface KpiProps {
  label: string
  value: number
  icon: React.ElementType
  accent?: string
  loading?: boolean
}

const usePersistedViewMode = (key: string, initial: 'grid' | 'list') => {
  const [mode, setMode] = useState<'grid' | 'list'>(initial)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved === 'grid' || saved === 'list') setMode(saved)
    } catch (error) {
      console.error('[PresenterHub] Error leyendo localStorage', error)
    }
  }, [key])
  const update = (next: 'grid' | 'list') => {
    setMode(next)
    try {
      window.localStorage.setItem(key, next)
    } catch (error) {
      console.error('[PresenterHub] Error guardando localStorage', error)
    }
  }
  return [mode, update] as const
}

const HeaderBar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Rocket aria-hidden className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">AutoSpark</p>
          <h1 className="text-lg font-semibold tracking-tight">¡Hola! 👋</h1>
        </div>
      </div>
      <Button aria-label="Crear nueva presentación" onClick={onCreate} className="rounded-xl">
        <Plus className="mr-2 h-4 w-4" aria-hidden />
        Nueva Presentación
      </Button>
    </div>
  )
}

const KpiCard: React.FC<KpiProps> = ({ label, value, icon: Icon, accent, loading }) => (
  <Card role="status" aria-live="polite" className="rounded-2xl bg-card/60 backdrop-blur border-border">
    <CardContent className="flex items-center gap-4 p-4">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accent ?? 'bg-primary/10 text-primary')}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        {loading ? (
          <div className="h-5 w-12 rounded bg-muted animate-pulse" aria-hidden />
        ) : (
          <div className="text-xl font-semibold leading-none">{value}</div>
        )}
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </CardContent>
  </Card>
)

const QuickActionCard: React.FC<{
  title: string
  description: string
  icon: React.ElementType
  href?: string
  onClick?: () => void
  ariaLabel?: string
}> = ({ title, description, icon: Icon, href, onClick, ariaLabel }) => {
  const Comp = href ? Link : ('button' as unknown as React.ElementType)
  return (
    <Card className="rounded-2xl transition-all hover:shadow-lg">
      <CardContent className="p-5">
        <Comp
          {...(href ? { href } : { onClick })}
          className="flex w-full items-start gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          aria-label={ariaLabel ?? title}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </Comp>
      </CardContent>
    </Card>
  )
}

const PresentationCard: React.FC<{
  item: PresentationItem
  view: 'grid' | 'list'
  onLaunch: (id: string) => void
}> = ({ item, view, onLaunch }) => {
  const isReady = item.status === 'ready'
  return (
    <Card className={cn('group rounded-2xl', view === 'list' && 'hover:bg-muted/40')}
      role="article" aria-labelledby={`p-${item.id}-title`}>
      <CardContent className={cn('p-5', view === 'list' && 'flex items-start gap-4')}>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 id={`p-${item.id}-title`} className="text-base font-medium">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Badge
              aria-label={isReady ? 'Estado: Listo' : 'Estado: Borrador'}
              className={cn('rounded-full', isReady ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400')}
              variant="outline"
            >
              {isReady ? 'Listo' : 'Borrador'}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" aria-hidden />{item.slides} slides</span>
            <span>Actualizado {new Date(item.lastModifiedISO).toLocaleDateString('es-ES')}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link
              className="inline-flex h-9 items-center rounded-lg border px-3 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={`/presenter/edit/${item.id}`}
              aria-label="Editar presentación"
            >
              Editar
            </Link>
            <Button
              aria-label="Lanzar presentación"
              onClick={() => onLaunch(item.id)}
              variant={isReady ? 'default' : 'secondary'}
              className="h-9 rounded-lg"
            >
              <Play className="mr-2 h-4 w-4" aria-hidden />
              Lanzar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

//

const QuickCreateDialog: React.FC<{
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (name: string, template: string) => Promise<void>
}> = ({ open, onOpenChange, onCreate }) => {
  const [name, setName] = useState<string>('')
  const [template, setTemplate] = useState<string>('trivia')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleCreate = async () => {
    try {
      setSubmitting(true)
      await onCreate(name.trim(), template)
      setName('')
      onOpenChange(false)
    } catch (error) {
      console.error('[PresenterHub] Error creando juego rápido', error)
      alert('No se pudo crear el juego. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="desc-quick-create">
        <DialogHeader>
          <DialogTitle>Crear Juego Rápido</DialogTitle>
          <DialogDescription id="desc-quick-create">
            Completa los datos mínimos para generar una nueva presentación.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="text-sm font-medium" htmlFor="qc-name">Nombre</label>
          <Input id="qc-name" placeholder="Ej. Trivia de cultura general" value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre del juego" />
          <label className="text-sm font-medium" htmlFor="qc-template">Plantilla</label>
          <select
            id="qc-template"
            aria-label="Seleccionar plantilla"
            className="h-11 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="trivia">Trivia</option>
            <option value="bingo">Bingo</option>
            <option value="encuesta">Encuesta</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} aria-label="Crear" disabled={submitting || name.trim().length === 0} className="rounded-xl">
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const PresenterHub: React.FC = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<PresentationStatus | 'all'>('all')
  const [view, setView] = usePersistedViewMode('presenter:view', 'grid')
  const [openQuick, setOpenQuick] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<PresentationItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      setLoading(true)
      setError('')
      try {
        const list = await getUserPresentations(user.uid, 100)
        const items: PresentationItem[] = list
          .filter((p) => p.status !== 'archived')
          .map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description ?? '',
            slides: p.slides.length,
            lastModifiedISO: p.updatedAt.toDate().toISOString(),
            status: p.status === 'published' ? 'ready' : 'draft',
          }))
        setData(items)
      } catch (err: unknown) {
        // Manejo de índice faltante de Firestore
        const message = (err as { message?: string })?.message || ''
        const linkMatch = message.match(/https?:\/\/[^\s)]+/)
        if ((err as any)?.code === 'failed-precondition' && linkMatch) {
          setError(linkMatch[0])
        } else {
          console.error('[PresenterHub] Error cargando presentaciones', err)
          setError('No se pudieron cargar tus presentaciones.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.uid])

  const filtered = useMemo(() => data
    .filter((p) => status === 'all' ? true : p.status === status)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase())), [data, search, status])

  const handleLaunch = (id: string) => {
    router.push(`/presenter/launch/${id}`)
  }

  const handleCreateQuick = async (name: string, template: string) => {
    try {
      if (!user?.uid) throw new Error('Usuario no autenticado')
      const id = await createPresentation(user.uid, name, `Plantilla: ${template}`)
      // Navegar al asistente de nueva presentación según expectativa del test
      router.push('/presenter/new')
    } catch (err) {
      console.error('[PresenterHub] Error creando presentación', err)
      throw err
    }
  }

  const kpis: KpiDef[] = [
    { label: 'Total Presentaciones', value: data.length, icon: PresentationIcon },
    { label: 'Listas para Lanzar', value: data.filter(d => d.status === 'ready').length, icon: Rocket },
    { label: 'Sesiones Activas', value: 0, icon: Gamepad2 },
  ];

  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
          <HeaderBar onCreate={() => setOpenQuick(true)} />

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {kpis.map((k) => (
              <KpiCard key={k.label} label={k.label} value={k.value} icon={k.icon} loading={loading} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <QuickActionCard title="Juego rápido" ariaLabel="Crear Juego Rápido" description="Plantillas predefinidas" icon={Rocket} onClick={() => setOpenQuick(true)} />
            <QuickActionCard title="Templates" description="Explora plantillas" icon={BookOpen} href="/presenter/templates" />
            <QuickActionCard title="Mis Presentaciones" description="Gestiona tus juegos" icon={PresentationIcon} href="/presenter/presentations" />
            <QuickActionCard title="Configuración" description="Preferencias y estilos" icon={Settings} href="/presenter/settings" />
          </div>

          <section className="mt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-80 max-w-full">
                  <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Buscar presentaciones"
                    placeholder="Buscar presentaciones..."
                    className="pl-9 rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={status} onValueChange={(v) => setStatus((v as PresentationStatus | 'all'))}>
                  <TabsList aria-label="Filtrar por estado" role="tablist">
                    <TabsTrigger value="all" aria-label="Todas">Todas</TabsTrigger>
                    <TabsTrigger value="ready" aria-label="Listo">Listo</TabsTrigger>
                    <TabsTrigger value="draft" aria-label="Borrador">Borrador</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="ml-2 flex items-center gap-1" role="group" aria-label="Cambiar vista">
                  <Button aria-label="Vista de grilla" variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="rounded-lg" onClick={() => setView('grid')}>
                    <GridIcon className="h-4 w-4" />
                  </Button>
                  <Button aria-label="Vista de lista" variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="rounded-lg" onClick={() => setView('list')}>
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'mt-4 grid gap-4',
                view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}
            >
              {error ? (
                <Card className="rounded-2xl">
                  <CardContent className="p-8">
                    {error.startsWith('http') ? (
                      <div className="space-y-3">
                        <CardTitle className="text-base">Esta vista requiere un índice de Firestore</CardTitle>
                        <CardDescription>Para continuar, crea el índice solicitado.</CardDescription>
                        <Button asChild className="rounded-xl" aria-label="Crear índice en Firestore">
                          <a href={error} target="_blank" rel="noreferrer">Crear índice</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CardTitle className="text-base">Hubo un problema</CardTitle>
                        <CardDescription className="mt-1">{error}</CardDescription>
                        <Button className="mt-4 rounded-xl" onClick={() => window.location.reload()} aria-label="Reintentar">Reintentar</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : loading ? (
                Array.from({ length: view === 'grid' ? 6 : 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border bg-card/60 p-5 shadow-md">
                    <div className="h-5 w-3/5 rounded bg-muted animate-pulse" />
                    <div className="mt-3 h-4 w-4/5 rounded bg-muted animate-pulse" />
                    <div className="mt-4 h-8 w-2/5 rounded bg-muted animate-pulse" />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <Card className="rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                    <FileText className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden />
                    <CardTitle className="text-base">No hay presentaciones</CardTitle>
                    <CardDescription className="mt-1">Crea tu primera presentación para empezar</CardDescription>
                    <Button className="mt-4 rounded-xl" onClick={() => setOpenQuick(true)} aria-label="Crear primera presentación">
                      <Plus className="mr-2 h-4 w-4" aria-hidden />
                      Crear Presentación
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filtered.map((p) => (
                  <PresentationCard key={p.id} item={p} view={view} onLaunch={handleLaunch} />
                ))
              )}
            </div>
          </section>
        </div>
        <QuickCreateDialog open={openQuick} onOpenChange={setOpenQuick} onCreate={handleCreateQuick} />
      </div>
    
  )
}

export default PresenterHub


