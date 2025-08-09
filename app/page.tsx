
'use client'

import Link from 'next/link'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Gamepad2, Play, Sparkles, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Página de inicio moderna (2025): semántica, accesible y responsive
type JoinCode = `${number}${number}${number}${number}${number}${number}`
const DEMO_CODE: JoinCode = '123456'

export default function HomePage(): ReactElement {
  const router = useRouter()

  async function handleJoinDemo(): Promise<void> {
    try {
      router.push(`/join?code=${DEMO_CODE}`)
    } catch (error) {
      // Log claro en consola y UX amigable
      // eslint-disable-next-line no-console
      console.error('[Home] Error al unirse a demo', error)
      alert('No se pudo abrir la demo. Intenta nuevamente.')
    }
  }

  return (
    <div className="relative min-h-[calc(100svh-0px)] overflow-hidden">
      {/* Fondo moderno con gradient sutil y frosted blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/10 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <section aria-labelledby="hero-title" className="container mx-auto grid gap-8 px-4 py-16 sm:py-20 md:grid-cols-2 md:gap-12 lg:py-24">
        <div className="flex flex-col items-start justify-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/70 backdrop-blur-md ring-1 ring-inset ring-white/10 motion-safe:animate-fade-in-up" aria-label="Etiqueta de producto">
            <Sparkles className="size-3.5" aria-hidden />
            <span>Experiencias interactivas en vivo</span>
          </div>
          <h1 id="hero-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            AutoSpark
            <span className="block text-gradient">Crea, comparte y juega</span>
          </h1>
          <p className="max-w-prose text-pretty text-base text-foreground/80 sm:text-lg">
            Diseña juegos y dinámicas colaborativas en segundos. Minimalista, accesible y listo para cualquier evento.
          </p>

          <div className="flex w-full flex-wrap items-center gap-3">
            <Button aria-label="Crear juego rápido" asChild size="lg" className="rounded-xl">
              <Link href="/presenter/new">
                <Zap className="mr-2 size-4" aria-hidden />
                Crear juego rápido
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </Link>
            </Button>
            <Button aria-label="Unirse a demo" size="lg" variant="outline" className="rounded-xl" onClick={handleJoinDemo}>
              <Play className="mr-2 size-4" aria-hidden />
              Unirse a demo (123456)
            </Button>
          </div>
          <p className="text-sm text-foreground/60">Acceso directo: 1 clic para empezar</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" aria-hidden />
          <Card className="rounded-2xl border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-2xl shadow-2xl motion-safe:animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gamepad2 className="size-5 text-primary" aria-hidden />
                Accesos rápidos
              </CardTitle>
              <CardDescription>Elige cómo quieres empezar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/presenter" className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Ir a crear juego">
                  <div className="mb-3 inline-flex size-12 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                    <Gamepad2 className="size-5" aria-hidden />
                  </div>
                  <div className="text-base font-medium">Crear juego</div>
                  <div className="text-sm text-foreground/70">Diseña y dirige juegos interactivos</div>
                </Link>
                <Link href="/join" className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Ir a unirse a un juego">
                  <div className="mb-3 inline-flex size-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <Users className="size-5" aria-hidden />
                  </div>
                  <div className="text-base font-medium">Unirse</div>
                  <div className="text-sm text-foreground/70">Participa con código</div>
                </Link>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild variant="ghost" aria-label="Ver todo">
                <Link href="/navigation-map">Ver todo</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA secundaria con diálogo accesible para ingresar código */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl motion-safe:animate-fade-in-up">
          <CardHeader>
            <CardTitle>Unirse con código</CardTitle>
            <CardDescription>Ingresa el código de sesión para participar</CardDescription>
          </CardHeader>
          <CardFooter className="justify-start gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button aria-label="Abrir diálogo para unirse" className="rounded-xl">
                  Ingresar código
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl" aria-describedby="join-desc">
                <DialogHeader>
                  <DialogTitle>Unirse a una sesión</DialogTitle>
                  <DialogDescription id="join-desc">Escribe el código de 6 dígitos para entrar.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="code">Código</Label>
                  <Input id="code" inputMode="numeric" pattern="[0-9]*" placeholder="000000" aria-label="Código de 6 dígitos" className="rounded-xl" />
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl" aria-label="Unirse ahora">
                    Unirse ahora
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button asChild variant="outline" className="rounded-xl" aria-label="Ver juegos disponibles">
              <Link href="/games">Juegos disponibles</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Estados de ejemplo: vacío, cargando, error */}
      <section aria-labelledby="states-title" className="container mx-auto grid gap-4 px-4 pb-24 md:grid-cols-3">
        <h2 id="states-title" className="sr-only">Estados de ejemplo</h2>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Estado vacío</CardTitle>
            <CardDescription>No hay elementos por ahora</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground/70">Cuando no existan datos, muestra un mensaje claro y una acción recomendada.</div>
          </CardContent>
          <CardFooter>
            <Button asChild aria-label="Crear nuevo">
              <Link href="/presenter/new">Crear nuevo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl" role="status" aria-live="polite">
          <CardHeader>
            <CardTitle>Cargando</CardTitle>
            <CardDescription>Preparando datos…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-foreground/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-foreground/10" />
              <div className="h-32 w-full animate-pulse rounded-lg bg-foreground/10" />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled aria-label="Cargando…">Cargando…</Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl" role="alert">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Algo salió mal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">No se pudieron cargar los datos. Intenta nuevamente.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button aria-label="Reintentar">Reintentar</Button>
            <Button variant="outline" aria-label="Ver estado del sistema">Ver estado</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}