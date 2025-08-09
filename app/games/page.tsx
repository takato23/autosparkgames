"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Palette, Ticket } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import GamePicker from "@/components/games/GamePicker"
import { useState, useCallback } from "react"

export default function GamesPage() {
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Elige tu experiencia</h1>
        <p className="mt-2 text-muted-foreground">Un camino claro para crear tu quiz en segundos</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quiz habilitado */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" aria-hidden />
              Quiz de Preguntas
            </CardTitle>
            <CardDescription>Opción múltiple con resultados en vivo</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Listo para usar</span>
            <Button aria-label="Crear Quiz ahora" className="rounded-xl" onClick={handleOpen}>
              Crear Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Bingo deshabilitado */}
        <Card className="opacity-60 pointer-events-none rounded-2xl" aria-disabled>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" aria-hidden />
                Bingo Interactivo
              </CardTitle>
              <span className="text-xs rounded-full border px-2 py-0.5">Próximamente</span>
            </div>
            <CardDescription>Cartones dinámicos y animaciones</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">No disponible</span>
            <Button disabled className="rounded-xl" aria-label="Bingo próximamente">Crear</Button>
          </CardContent>
        </Card>

        {/* Pictionary deshabilitado */}
        <Card className="opacity-60 pointer-events-none rounded-2xl" aria-disabled>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" aria-hidden />
                Pictionary Colaborativo
              </CardTitle>
              <span className="text-xs rounded-full border px-2 py-0.5">Próximamente</span>
            </div>
            <CardDescription>Dibuja y adivina en tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">No disponible</span>
            <Button disabled className="rounded-xl" aria-label="Pictionary próximamente">Crear</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <GamePicker onConfirm={handleClose} />
      </Dialog>
    </div>
  )
}