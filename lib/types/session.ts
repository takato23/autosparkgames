import { Timestamp } from 'firebase/firestore'

// Align response types with string literal slide types
export type SlideTypeString =
  | 'multiple_choice'
  | 'word_cloud'
  | 'qa'
  | 'poll'
  | 'open_text'
  | 'rating'
  | 'trivia'
  | 'ice_breaker'
  | 'team_challenge'
  | 'leaderboard'

// Live session for a presentation
export interface Session {
  id: string
  presentationId: string
  code: string // 6-digit join code
  status: SessionStatus
  currentSlideId?: string
  currentSlideIndex: number
  startedAt: Timestamp
  endedAt?: Timestamp
  participants: Record<string, SessionParticipant>
  responses: Record<string, SlideResponses> // slideId -> responses
  settings: SessionSettings
  teams?: Record<string, Team> // For team-based games
  leaderboard?: LeaderboardEntry[]
}

// Team for team-based games
export interface Team {
  id: string
  name: string
  color: string
  members: string[] // participant IDs
  score: number
  lastActiveAt: Timestamp
}

// Leaderboard entry
export interface LeaderboardEntry {
  participantId?: string
  teamId?: string
  name: string
  score: number
  streak?: number
  rank: number
}

export enum SessionStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended'
}

export interface SessionSettings {
  lockLateJoining: boolean
  showParticipantCount: boolean
  showLeaderboard: boolean
  anonymousNicknames: boolean
}

// Participant in a session
export interface SessionParticipant {
  id: string
  userId?: string // Optional for anonymous participants
  name: string
  email?: string
  joinedAt: Timestamp
  lastActiveAt: Timestamp
  isActive: boolean
  score: number
  teamId?: string // For team-based games
  streak?: number // Consecutive correct answers
  rank?: number // Current position in leaderboard
  responses: Record<string, ParticipantResponse> // slideId -> response
}

// Base response interface
export interface BaseResponse {
  participantId: string
  slideId: string
  timestamp: Timestamp
  timeSpent?: number // in milliseconds
}

// Response types for different slide types
export interface MultipleChoiceResponse extends BaseResponse {
  type: 'multiple_choice'
  selectedOptions: string[] // option IDs
  isCorrect?: boolean
  points?: number
}

export interface WordCloudResponse extends BaseResponse {
  type: 'word_cloud'
  words: string[]
}

export interface QAResponse extends BaseResponse {
  type: 'qa'
  question: string
  upvotes: string[] // participant IDs who upvoted
  isApproved?: boolean
  isAnswered?: boolean
}

export interface PollResponse extends BaseResponse {
  type: 'poll'
  selectedOptions: string[] // option IDs
}

export interface OpenTextResponse extends BaseResponse {
  type: 'open_text'
  text: string
}

export interface RatingResponse extends BaseResponse {
  type: 'rating'
  value: number
}

export interface TriviaResponse extends BaseResponse {
  type: 'trivia'
  selectedOption: string // option ID
  timeSpent: number // milliseconds
  isCorrect: boolean
  pointsEarned: number
}

export interface IceBreakerResponse extends BaseResponse {
  type: 'ice_breaker'
  response: string | string[] // Depends on question type
  comment?: string // Optional comment for some types
}

export interface TeamChallengeResponse extends BaseResponse {
  type: 'team_challenge'
  teamId: string
  submission: string
  submittedBy: string // participant ID who submitted for team
}

// Union type for all responses
export type ParticipantResponse = 
  | MultipleChoiceResponse
  | WordCloudResponse
  | QAResponse
  | PollResponse
  | OpenTextResponse
  | RatingResponse
  | TriviaResponse
  | IceBreakerResponse
  | TeamChallengeResponse

// Aggregated responses for a slide
export interface SlideResponses {
  slideId: string
  responseCount: number
  responses: ParticipantResponse[]
  aggregatedData?: AggregatedSlideData
}

// Aggregated data for different slide types
export interface AggregatedSlideData {
  type: SlideTypeString
  data: any // Type-specific aggregated data
}

export interface MultipleChoiceAggregated {
  optionCounts: Record<string, number>
  correctCount: number
  incorrectCount: number
  averageTimeSpent?: number
}

export interface WordCloudAggregated {
  wordFrequency: Record<string, number>
  totalWords: number
  uniqueWords: number
}

export interface PollAggregated {
  optionCounts: Record<string, number>
  totalVotes: number
}

export interface RatingAggregated {
  average: number
  min: number
  max: number
  distribution: Record<number, number>
}

// Participant-side data structure
export interface Participant {
  id: string
  sessionId: string
  userId?: string
  name: string
  email?: string
  reactions: Reaction[]
  currentSlideId?: string
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting'
  lastPingAt: Timestamp
}

export interface Reaction {
  type: ReactionType
  timestamp: Timestamp
  slideId?: string
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  CONFUSED = 'confused',
  MIND_BLOWN = 'mind_blown',
  CLAP = 'clap',
  RAISE_HAND = 'raise_hand'
}