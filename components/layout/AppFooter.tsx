export function AppFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/60">
      <div className="container mx-auto px-4 py-8 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AutoSpark. Todos los derechos reservados.</p>
        </div>
        <nav aria-label="Secundaria" className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <a href="/navigation-map" className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1">Mapa</a>
          <a href="/docs" className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1">Docs</a>
          <a href="/admin" className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1">Admin</a>
        </nav>
        <div className="text-right text-sm text-muted-foreground">
          <span>Hecho con React, Tailwind y shadcn/ui</span>
        </div>
      </div>
    </footer>
  )
}
