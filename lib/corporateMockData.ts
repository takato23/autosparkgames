// Corporate mock data for AutoSpark gaming hub
export const mockStore = {
  corporateSettings: {
    theme: 'professional' as const,
    animationsEnabled: true,
    colorScheme: 'blue-corporate' as const
  },
  user: {
    role: 'admin' as const,
    permissions: ['dashboard', 'games', 'analytics', 'users']
  }
};

export const mockQuery = {
  dashboardMetrics: {
    totalUsers: 1247,
    activeSessions: 23,
    engagementRate: 87.5,
    avgResponseTime: 2.3
  },
  recentGames: [
    {
      id: 'game-1',
      title: 'Trivia Corporativa Q4',
      participants: 156,
      status: 'active' as const,
      completionRate: 92,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'game-2', 
      title: 'Encuesta de Satisfacción',
      participants: 89,
      status: 'completed' as const,
      completionRate: 100,
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'game-3',
      title: 'Quiz de Onboarding',
      participants: 234,
      status: 'pending' as const,
      completionRate: 0,
      createdAt: new Date('2024-01-20')
    }
  ],
  teamPerformance: [
    { team: 'Ventas', score: 94, engagement: 89 },
    { team: 'Marketing', score: 87, engagement: 92 },
    { team: 'IT', score: 91, engagement: 85 },
    { team: 'RRHH', score: 88, engagement: 94 }
  ]
};

export const mockRootProps = {
  currentUser: {
    id: 'user-1',
    name: 'Santiago Balosky',
    role: 'admin' as const,
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  corporateConfig: {
    companyName: 'AutoSpark Games',
    brandColor: '#1e40af',
    logo: '/assets/logo-corporate.png'
  }
};