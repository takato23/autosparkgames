"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface GamePickerProps {
  onConfirm?: () => void
}

export default function GamePicker({ onConfirm }: GamePickerProps) {
  const router = useRouter()

  const handleContinue = useCallback(() => {
    router.push("/presenter/new?type=quiz")
    onConfirm?.()
  }, [router, onConfirm])

  return (
    <DialogContent className="rounded-2xl" aria-describedby="game-picker-desc">
      <DialogHeader>
        <DialogTitle>Crear nuevo</DialogTitle>
        <DialogDescription id="game-picker-desc">
          Elige el tipo de experiencia. Por ahora, el quiz está disponible.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
        <label className="inline-flex items-center gap-3 rounded-xl border p-4">
          <input
            type="radio"
            name="picker"
            defaultChecked
            aria-label="Seleccionar Quiz de Preguntas"
          />
          <div className="flex-1">
            <div className="text-sm font-medium">Quiz de Preguntas</div>
            <div className="text-xs text-muted-foreground">Opción múltiple con resultados en vivo</div>
          </div>
          <span className="sr-only">Seleccionado</span>
        </label>

        <label aria-disabled className="inline-flex items-center gap-3 rounded-xl border p-4 opacity-60 pointer-events-none">
          <input type="radio" name="picker" disabled aria-label="Bingo próximamente" />
          <div className="flex-1">
            <div className="text-sm font-medium">Bingo Interactivo</div>
            <div className="text-xs text-muted-foreground">Próximamente</div>
          </div>
        </label>

        <label aria-disabled className="inline-flex items-center gap-3 rounded-xl border p-4 opacity-60 pointer-events-none">
          <input type="radio" name="picker" disabled aria-label="Pictionary próximamente" />
          <div className="flex-1">
            <div className="text-sm font-medium">Pictionary Colaborativo</div>
            <div className="text-xs text-muted-foreground">Próximamente</div>
          </div>
        </label>
      </div>

      <DialogFooter>
        <Button onClick={handleContinue} aria-label="Continuar" className="rounded-xl">
          Continuar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}


