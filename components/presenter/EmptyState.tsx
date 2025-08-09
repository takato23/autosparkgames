'use client'

import { Button } from '@/lib/design-system/components'
import { Plus, Search, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  searchQuery: string
  filterType: string
  filterStatus: string
  onReset: () => void
}

export default function EmptyState({ searchQuery, filterType, filterStatus, onReset }: EmptyStateProps) {
  const router = useRouter()
  const hasFilters = searchQuery || filterType !== 'all' || filterStatus !== 'all'

  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-white/40" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-white/60 text-center max-w-md mb-6">
          No hay presentaciones que coincidan con tus filtros de búsqueda.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={onReset}
          >
            Limpiar filtros
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => router.push('/presenter/new')}
          >
            Crear nueva
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-primary-500/20 to-gaming-purple/20 rounded-full flex items-center justify-center mb-6">
        <Plus className="h-16 w-16 text-white/60" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">
        Crea tu primera presentación
      </h3>
      <p className="text-white/60 text-center max-w-md mb-8">
        Comienza a crear presentaciones interactivas que cautiven a tu audiencia
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          variant="primary"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => router.push('/presenter/new')}
        >
          Crear desde cero
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => router.push('/presenter/templates')}
        >
          Explorar plantillas
        </Button>
      </div>
    </motion.div>
  )
}