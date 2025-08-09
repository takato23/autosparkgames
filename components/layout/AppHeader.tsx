"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import CreateButton from "@/app/(shared)/CreateButton"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl px-1">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          <span className="font-semibold tracking-tight">AutoSpark</span>
        </Link>

        <nav aria-label="Principal" className="hidden gap-2 sm:flex">
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/presenter">Presentar</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/join">Unirse</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/games">Juegos</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CreateButton label="Crear" />
        </div>
      </div>
    </header>
  )
}
