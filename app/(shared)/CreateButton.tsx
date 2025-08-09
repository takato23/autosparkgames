"use client"

import { useState, useCallback } from "react"
import { Dialog } from "@/components/ui/dialog"
import GamePicker from "@/components/games/GamePicker"
import { Button } from "@/components/ui/button"

interface CreateButtonProps {
  label?: string
}

export default function CreateButton({ label = "Crear" }: CreateButtonProps) {
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button onClick={handleOpen} aria-label={label} className="rounded-xl">
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <GamePicker onConfirm={handleClose} />
      </Dialog>
    </>
  )
}


