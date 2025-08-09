"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface IndexRequiredBannerProps {
  href: string
}

export default function IndexRequiredBanner({ href }: IndexRequiredBannerProps) {
  return (
    <Card role="alert" aria-live="polite" className="rounded-2xl border-amber-300/30 bg-amber-500/10">
      <CardHeader>
        <CardTitle>Esta vista requiere un índice de Firestore</CardTitle>
        <CardDescription>Para continuar, crea el índice solicitado.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="rounded-xl" aria-label="Crear índice en Firestore">
          <a href={href} target="_blank" rel="noreferrer">Crear índice</a>
        </Button>
      </CardContent>
    </Card>
  )
}


