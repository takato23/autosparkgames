// Re-export all types from individual files
export type { User, UserProfile } from './user'
export type { Presentation, PresentationSettings, Slide, SlideType, MultipleChoiceSlide, WordCloudSlide, QASlide, PollSlide, OpenTextSlide, RatingSlide, TitleSlide, TriviaSlide, IceBreakerSlide, TeamChallengeSlide, LeaderboardSlide } from './presentation'
export * from './session'

// Additional utility types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}