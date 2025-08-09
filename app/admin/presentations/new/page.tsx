'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createPresentation } from '@/lib/firebase/helpers/presentations'
import { auth } from '@/lib/firebase/config'
import { ArrowLeft, Presentation } from 'lucide-react'

export default function NewPresentationPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your presentation')
      return
    }

    if (!auth.currentUser) {
      setError('You must be logged in to create a presentation')
      return
    }

    setCreating(true)
    setError('')

    try {
      const presentationId = await createPresentation(
        auth.currentUser.uid,
        title.trim(),
        description.trim()
      )
      
      // Redirect to the editor
      router.push(`/admin/presentations/${presentationId}/edit`)
    } catch (err) {
      console.error('Error creating presentation:', err)
      setError('Failed to create presentation. Please try again.')
      setCreating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/presentations')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Presentations
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Presentation className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create New Presentation</CardTitle>
                  <CardDescription>
                    Start building an interactive presentation for your audience
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Presentation Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Team Meeting Q&A, Product Launch Poll"
                  className="text-lg"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your presentation..."
                  rows={4}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreate}
                  disabled={creating || !title.trim()}
                  className="flex-1"
                >
                  {creating ? 'Creating...' : 'Create & Start Building'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/presentations')}
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>After creating your presentation, you'll be able to:</p>
            <ul className="mt-2 space-y-1">
              <li>• Add interactive slides (polls, Q&A, word clouds, and more)</li>
              <li>• Customize the look and feel with themes</li>
              <li>• Share with your audience and collect real-time responses</li>
              <li>• View analytics and export results</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}