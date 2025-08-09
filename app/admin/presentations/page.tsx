'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Presentation, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2,
  Filter,
  Calendar,
  Clock,
  Users
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { getUserPresentations, deletePresentation, createPresentation } from '@/lib/firebase/helpers/presentations'
import { auth } from '@/lib/firebase/config'
import type { Presentation as PresentationType } from '@/lib/types/presentation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<PresentationType[]>([])
  const [filteredPresentations, setFilteredPresentations] = useState<PresentationType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')

  useEffect(() => {
    loadPresentations()
  }, [])

  useEffect(() => {
    filterPresentations()
  }, [presentations, searchTerm, statusFilter])

  const loadPresentations = async () => {
    if (auth.currentUser) {
      try {
        const userPresentations = await getUserPresentations(auth.currentUser.uid)
        setPresentations(userPresentations)
      } catch (error) {
        console.error('Error loading presentations:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const filterPresentations = () => {
    let filtered = presentations

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    setFilteredPresentations(filtered)
  }

  const handleDelete = async (presentationId: string) => {
    if (confirm('Are you sure you want to delete this presentation?')) {
      try {
        await deletePresentation(presentationId, auth.currentUser!.uid)
        setPresentations(presentations.filter(p => p.id !== presentationId))
      } catch (error) {
        console.error('Error deleting presentation:', error)
      }
    }
  }

  const handleDuplicate = async (presentation: PresentationType) => {
    try {
      const newId = await createPresentation(
        auth.currentUser!.uid,
        `${presentation.title} (Copy)`,
        presentation.description
      )
      // TODO: Copy slides and settings
      loadPresentations()
    } catch (error) {
      console.error('Error duplicating presentation:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800'
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
                Presentations
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create and manage your interactive presentations
              </p>
            </div>
            <Link href="/admin/presentations/new">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-5 w-5 mr-2" />
                New Presentation
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search presentations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('draft')}
            >
              Draft
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('published')}
            >
              Published
            </Button>
            <Button
              variant={statusFilter === 'archived' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('archived')}
            >
              Archived
            </Button>
          </div>
        </div>

        {/* Presentations Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading presentations...</p>
          </div>
        ) : filteredPresentations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No presentations found' : 'No presentations yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first presentation to get started'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link href="/admin/presentations/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Presentation
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresentations.map((presentation, index) => (
              <motion.div
                key={presentation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">
                          {presentation.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {presentation.description || 'No description'}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href={`/admin/presentations/${presentation.id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDuplicate(presentation)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(presentation.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Slides</span>
                        <span className="font-medium">{(presentation as any).slides?.length ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(presentation.status)}`}>
                          {presentation.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Updated</span>
                        <span className="font-medium">
                          {(() => {
                            const u = (presentation as any).updatedAt
                            if (!u) return ''
                            const dateObj = typeof u?.toDate === 'function' ? u.toDate() : u
                            try { return new Date(dateObj).toLocaleDateString() } catch { return '' }
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/admin/presentations/${presentation.id}/edit`} className="flex-1">
                        <Button className="w-full" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/presenter/session/${encodeURIComponent(presentation.id)}`} className="flex-1">
                        <Button className="w-full">
                          <Presentation className="h-4 w-4 mr-2" />
                          Present
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}