import { Timestamp } from 'firebase/firestore'

// Core presentation type
export interface Presentation {
  id: string
  title: string
  description?: string
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  slides: Slide[]
  settings: PresentationSettings
  status: 'draft' | 'published' | 'archived'
}

// Presentation settings
export interface PresentationSettings {
  allowAnonymous: boolean
  requireEmail: boolean
  showResults: boolean
  allowSkip: boolean
  randomizeQuestions: boolean
  showCorrectAnswers: boolean
  timePerQuestion?: number // in seconds
  // Game settings
  gameMode?: 'standard' | 'trivia' | 'ice_breaker' | 'team_building'
  enableLeaderboard?: boolean
  enableTimer?: boolean
  pointsSystem?: boolean
  teamMode?: boolean
  maxTeams?: number
  soundEffects?: boolean
  celebrateCorrectAnswers?: boolean
}

// Base slide interface
export interface BaseSlide {
  id: string
  type: SlideType
  title: string
  order: number
  timeLimit?: number // in seconds
}

// Slide types enum
export enum SlideType {
  MULTIPLE_CHOICE = 'multiple_choice',
  WORD_CLOUD = 'word_cloud',
  QA = 'qa',
  POLL = 'poll',
  OPEN_TEXT = 'open_text',
  RATING = 'rating',
  TITLE = 'title',
  TRIVIA = 'trivia',
  ICE_BREAKER = 'ice_breaker',
  TEAM_CHALLENGE = 'team_challenge',
  LEADERBOARD = 'leaderboard'
}

// Multiple choice slide
export interface MultipleChoiceSlide extends BaseSlide {
  type: SlideType.MULTIPLE_CHOICE
  question: string
  options: MultipleChoiceOption[]
  correctAnswers?: string[] // IDs of correct options
  allowMultiple: boolean
  points?: number
}

export interface MultipleChoiceOption {
  id: string
  text: string
  imageUrl?: string
}

// Word cloud slide
export interface WordCloudSlide extends BaseSlide {
  type: SlideType.WORD_CLOUD
  prompt: string
  maxWords?: number
  minWordLength?: number
  maxWordLength?: number
}

// Q&A slide
export interface QASlide extends BaseSlide {
  type: SlideType.QA
  prompt: string
  allowUpvoting: boolean
  moderationEnabled: boolean
  anonymousAllowed: boolean
}

// Poll slide
export interface PollSlide extends BaseSlide {
  type: SlideType.POLL
  question: string
  options: PollOption[]
  allowMultiple: boolean
  showResultsLive: boolean
}

export interface PollOption {
  id: string
  text: string
  color?: string
}

// Open text slide
export interface OpenTextSlide extends BaseSlide {
  type: SlideType.OPEN_TEXT
  prompt: string
  maxLength?: number
  minLength?: number
}

// Rating slide
export interface RatingSlide extends BaseSlide {
  type: SlideType.RATING
  question: string
  minValue: number
  maxValue: number
  step: number
  labels?: {
    min?: string
    max?: string
  }
}

// Title slide
export interface TitleSlide extends BaseSlide {
  type: SlideType.TITLE
  subtitle?: string
  imageUrl?: string
}

// Trivia slide - competitive quiz with points and time pressure
export interface TriviaSlide extends BaseSlide {
  type: SlideType.TRIVIA
  question: string
  options: TriviaOption[]
  correctAnswer: string // ID of correct option
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
  hint?: string
  explanation?: string // Show after answer
}

export interface TriviaOption {
  id: string
  text: string
}

// Ice breaker slide - fun questions to get people talking
export interface IceBreakerSlide extends BaseSlide {
  type: SlideType.ICE_BREAKER
  prompt: string
  questionType: 'would_you_rather' | 'two_truths_one_lie' | 'fun_fact' | 'this_or_that'
  options?: IceBreakerOption[] // For would_you_rather or this_or_that
  allowComments: boolean
  showNames: boolean
}

export interface IceBreakerOption {
  id: string
  text: string
  emoji?: string
}

// Team challenge slide - collaborative activities
export interface TeamChallengeSlide extends BaseSlide {
  type: SlideType.TEAM_CHALLENGE
  title: string
  challenge: string
  challengeType: 'creative' | 'problem_solving' | 'speed' | 'knowledge'
  teams?: string[] // Predefined team names
  scoringMethod: 'points' | 'voting' | 'time'
  maxPoints?: number
}

// Leaderboard slide - show current standings
export interface LeaderboardSlide extends BaseSlide {
  type: SlideType.LEADERBOARD
  title: string
  showTop?: number // How many to show (default 10)
  displayMode: 'individual' | 'team'
  animateReveal: boolean
}

// Union type for all slides
export type Slide = 
  | MultipleChoiceSlide 
  | WordCloudSlide 
  | QASlide 
  | PollSlide 
  | OpenTextSlide 
  | RatingSlide 
  | TitleSlide
  | TriviaSlide
  | IceBreakerSlide
  | TeamChallengeSlide
  | LeaderboardSlide