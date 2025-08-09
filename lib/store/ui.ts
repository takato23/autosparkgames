import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIStore {
  // Sidebar state
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  
  // Theme
  theme: 'dark' | 'light' | 'system'
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  
  // View preferences
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  
  // Presentation editor
  editorLayout: 'default' | 'focus' | 'preview'
  setEditorLayout: (layout: 'default' | 'focus' | 'preview') => void
  showPreview: boolean
  togglePreview: () => void
  
  // Accessibility
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  setHighContrast: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  
  // Onboarding
  hasCompletedOnboarding: boolean
  onboardingStep: number
  setOnboardingComplete: () => void
  setOnboardingStep: (step: number) => void
  
  // Notifications
  notificationsEnabled: boolean
  soundEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // Sidebar state
        sidebarOpen: true,
        sidebarCollapsed: false,
        toggleSidebar: () => set((state) => ({ 
          sidebarOpen: !state.sidebarOpen 
        })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        // Command palette
        commandPaletteOpen: false,
        setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
        
        // Theme
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        
        // View preferences
        viewMode: 'grid',
        setViewMode: (mode) => set({ viewMode: mode }),
        
        // Presentation editor
        editorLayout: 'default',
        setEditorLayout: (layout) => set({ editorLayout: layout }),
        showPreview: true,
        togglePreview: () => set((state) => ({ 
          showPreview: !state.showPreview 
        })),
        
        // Accessibility
        highContrast: false,
        reducedMotion: false,
        fontSize: 'medium',
        setHighContrast: (enabled) => set({ highContrast: enabled }),
        setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
        setFontSize: (size) => set({ fontSize: size }),
        
        // Onboarding
        hasCompletedOnboarding: false,
        onboardingStep: 0,
        setOnboardingComplete: () => set({ 
          hasCompletedOnboarding: true,
          onboardingStep: 0 
        }),
        setOnboardingStep: (step) => set({ onboardingStep: step }),
        
        // Notifications
        notificationsEnabled: true,
        soundEnabled: true,
        setNotificationsEnabled: (enabled) => set({ 
          notificationsEnabled: enabled 
        }),
        setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      }),
      {
        name: 'ui-preferences',
      }
    )
  )
)