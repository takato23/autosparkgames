'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Palette, 
  Save, 
  Eye,
  Monitor,
  Moon,
  Sun,
  Sparkles,
  Briefcase,
  Zap
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { auth } from '@/lib/firebase/config'
import { getCurrentUserData } from '@/lib/firebase/helpers/auth'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { User as UserType } from '@/lib/types'

const themes = [
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional and clean design for business presentations',
    icon: Briefcase,
    preview: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  {
    id: 'tech-neon',
    name: 'Tech Neon',
    description: 'Modern neon accents perfect for tech presentations',
    icon: Zap,
    preview: {
      primary: '#a855f7',
      secondary: '#ec4899',
      background: '#0f172a',
      text: '#f1f5f9'
    }
  },
  {
    id: 'elegant-minimal',
    name: 'Elegant Minimal',
    description: 'Minimalist design with subtle elegance',
    icon: Sparkles,
    preview: {
      primary: '#525252',
      secondary: '#737373',
      background: '#fafaf9',
      text: '#171717'
    }
  }
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'theme'>('profile')
  const [selectedPresentationTheme, setSelectedPresentationTheme] = useState('corporate')
  
  // Profile form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    if (auth.currentUser) {
      try {
        const userData = await getCurrentUserData(auth.currentUser)
        if (userData) {
          setUser(userData)
          setName(userData.name || '')
          setEmail(userData.email || '')
          setBio(userData.bio || '')
          setSelectedPresentationTheme(userData.presentationTheme || 'corporate')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveProfile = async () => {
    if (!auth.currentUser || !user) return

    setSaving(true)
    try {
      // Update display name in Auth
      if (name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name })
      }

      // Update user document in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
        bio,
        updatedAt: new Date()
      })

      setUser({ ...user, name, bio })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTheme = async () => {
    if (!auth.currentUser || !user) return

    setSaving(true)
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        presentationTheme: selectedPresentationTheme,
        updatedAt: new Date()
      })

      setUser({ ...user, presentationTheme: selectedPresentationTheme })
    } catch (error) {
      console.error('Error updating theme:', error)
    } finally {
      setSaving(false)
    }
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />
    if (theme === 'dark') return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile and customize your experience
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'theme' ? 'default' : 'outline'}
            onClick={() => setActiveTab('theme')}
          >
            <Palette className="h-4 w-4 mr-2" />
            Themes
          </Button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                  <p className="text-sm text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Interface Theme */}
            <Card>
              <CardHeader>
                <CardTitle>Interface Theme</CardTitle>
                <CardDescription>
                  Choose how the admin dashboard appears to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getThemeIcon()}
                    <span className="capitalize">{theme} Mode</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Presentation Themes */}
            <Card>
              <CardHeader>
                <CardTitle>Presentation Themes</CardTitle>
                <CardDescription>
                  Choose the default theme for your presentations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {themes.map((themeOption) => (
                    <div
                      key={themeOption.id}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedPresentationTheme === themeOption.id 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                      onClick={() => setSelectedPresentationTheme(themeOption.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                          <themeOption.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{themeOption.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {themeOption.description}
                          </p>
                          <div className="flex gap-2">
                            <div 
                              className="w-8 h-8 rounded-full border"
                              style={{ backgroundColor: themeOption.preview.primary }}
                            />
                            <div 
                              className="w-8 h-8 rounded-full border"
                              style={{ backgroundColor: themeOption.preview.secondary }}
                            />
                            <div 
                              className="w-8 h-8 rounded-full border"
                              style={{ backgroundColor: themeOption.preview.background }}
                            />
                            <div 
                              className="w-8 h-8 rounded-full border"
                              style={{ backgroundColor: themeOption.preview.text }}
                            />
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveTheme} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Theme'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}