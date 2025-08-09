export interface User {
  id: string
  email: string
  name: string
  bio?: string
  role: 'participant' | 'presenter' | 'admin'
  createdAt: Date
  updatedAt: Date
  profile?: UserProfile
  presentations?: string[] // Array of presentation IDs
  presentationTheme?: string // Selected theme for presentations
}

export interface UserProfile {
  avatar?: string
  bio?: string
  organization?: string
  location?: string
  website?: string
}

export interface Presentation {
  id: string
  title: string
  description?: string
  presenterId: string
  status: 'draft' | 'live' | 'paused' | 'completed'
  participants: string[]
  createdAt: Date
  updatedAt: Date
  settings: PresentationSettings
}

export interface PresentationSettings {
  allowAnonymous: boolean
  maxParticipants?: number
  timeLimit?: number
  showLeaderboard: boolean
  enableChat: boolean
}

export interface GameSession {
  id: string
  presentationId: string
  participantId: string
  score: number
  responses: GameResponse[]
  completedAt?: Date
  startedAt: Date
}

export interface GameResponse {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  timeSpent: number
  timestamp: Date
}