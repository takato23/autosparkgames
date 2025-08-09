'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Type,
  MessageSquare,
  Cloud,
  BarChart,
  FileText,
  Star,
  CheckSquare,
  X,
  Trophy,
  Users,
  Target,
  Medal
} from 'lucide-react'
import { 
  Slide, 
  SlideType,
  TitleSlide,
  MultipleChoiceSlide,
  WordCloudSlide,
  QASlide,
  PollSlide,
  OpenTextSlide,
  RatingSlide,
  TriviaSlide,
  IceBreakerSlide,
  TeamChallengeSlide,
  LeaderboardSlide
} from '@/lib/types/presentation'

interface SlideTemplatesProps {
  onSelect: (slide: Omit<Slide, 'id' | 'order'>) => void
  onClose: () => void
}

const slideTemplates = [
  {
    type: SlideType.TITLE,
    icon: Type,
    title: 'Title Slide',
    description: 'Welcome participants with a title and optional subtitle',
    template: {
      type: SlideType.TITLE,
      title: 'Welcome',
      subtitle: 'Let\'s get started!'
    } as Omit<TitleSlide, 'id' | 'order'>
  },
  {
    type: SlideType.MULTIPLE_CHOICE,
    icon: CheckSquare,
    title: 'Multiple Choice',
    description: 'Ask questions with predefined answer options',
    template: {
      type: SlideType.MULTIPLE_CHOICE,
      title: 'Multiple Choice Question',
      question: 'What is your question?',
      options: [
        { id: 'opt1', text: 'Option A' },
        { id: 'opt2', text: 'Option B' },
        { id: 'opt3', text: 'Option C' },
        { id: 'opt4', text: 'Option D' }
      ],
      allowMultiple: false
    } as Omit<MultipleChoiceSlide, 'id' | 'order'>
  },
  {
    type: SlideType.WORD_CLOUD,
    icon: Cloud,
    title: 'Word Cloud',
    description: 'Collect words or short phrases to create a visual cloud',
    template: {
      type: SlideType.WORD_CLOUD,
      title: 'Word Cloud',
      prompt: 'Share a word that describes...',
      maxWords: 3
    } as Omit<WordCloudSlide, 'id' | 'order'>
  },
  {
    type: SlideType.QA,
    icon: MessageSquare,
    title: 'Q&A',
    description: 'Collect questions from your audience',
    template: {
      type: SlideType.QA,
      title: 'Q&A Session',
      prompt: 'What questions do you have?',
      allowUpvoting: true,
      moderationEnabled: false,
      anonymousAllowed: true
    } as Omit<QASlide, 'id' | 'order'>
  },
  {
    type: SlideType.POLL,
    icon: BarChart,
    title: 'Poll',
    description: 'Quick polls with live results',
    template: {
      type: SlideType.POLL,
      title: 'Quick Poll',
      question: 'What\'s your opinion on...?',
      options: [
        { id: 'opt1', text: 'Option 1', color: '#FF6B6B' },
        { id: 'opt2', text: 'Option 2', color: '#4ECDC4' },
        { id: 'opt3', text: 'Option 3', color: '#45B7D1' }
      ],
      allowMultiple: false,
      showResultsLive: true
    } as Omit<PollSlide, 'id' | 'order'>
  },
  {
    type: SlideType.OPEN_TEXT,
    icon: FileText,
    title: 'Open Text',
    description: 'Collect detailed text responses',
    template: {
      type: SlideType.OPEN_TEXT,
      title: 'Share Your Thoughts',
      prompt: 'Please share your thoughts on...',
      minLength: 10,
      maxLength: 500
    } as Omit<OpenTextSlide, 'id' | 'order'>
  },
  {
    type: SlideType.RATING,
    icon: Star,
    title: 'Rating',
    description: 'Collect ratings on a scale',
    template: {
      type: SlideType.RATING,
      title: 'Rate Your Experience',
      question: 'How would you rate...?',
      minValue: 1,
      maxValue: 5,
      step: 1,
      labels: {
        min: 'Poor',
        max: 'Excellent'
      }
    } as Omit<RatingSlide, 'id' | 'order'>
  },
  {
    type: SlideType.TRIVIA,
    icon: Trophy,
    title: 'Trivia Question',
    description: 'Competitive quiz questions with points and timer',
    template: {
      type: SlideType.TRIVIA,
      title: 'Trivia Time!',
      question: 'What is the capital of France?',
      options: [
        { id: 'opt1', text: 'London' },
        { id: 'opt2', text: 'Paris' },
        { id: 'opt3', text: 'Berlin' },
        { id: 'opt4', text: 'Madrid' }
      ],
      correctAnswer: 'opt2',
      points: 100,
      difficulty: 'easy',
      category: 'Geography',
      timeLimit: 20,
      explanation: 'Paris has been the capital of France since 987 AD.'
    } as Omit<TriviaSlide, 'id' | 'order'>
  },
  {
    type: SlideType.ICE_BREAKER,
    icon: Users,
    title: 'Ice Breaker',
    description: 'Fun activities to get people talking and engaged',
    template: {
      type: SlideType.ICE_BREAKER,
      title: 'Let\'s Break the Ice!',
      prompt: 'Would you rather...',
      questionType: 'would_you_rather',
      options: [
        { id: 'opt1', text: 'Have the ability to fly', emoji: '✈️' },
        { id: 'opt2', text: 'Be invisible on command', emoji: '👻' }
      ],
      allowComments: true,
      showNames: true
    } as Omit<IceBreakerSlide, 'id' | 'order'>
  },
  {
    type: SlideType.TEAM_CHALLENGE,
    icon: Target,
    title: 'Team Challenge',
    description: 'Collaborative activities for team building',
    template: {
      type: SlideType.TEAM_CHALLENGE,
      title: 'Team Challenge',
      challenge: 'Work together to come up with the most creative company slogan in 2 minutes!',
      challengeType: 'creative',
      teams: ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta'],
      scoringMethod: 'voting',
      timeLimit: 120
    } as Omit<TeamChallengeSlide, 'id' | 'order'>
  },
  {
    type: SlideType.LEADERBOARD,
    icon: Medal,
    title: 'Leaderboard',
    description: 'Display current standings and scores',
    template: {
      type: SlideType.LEADERBOARD,
      title: 'Current Standings',
      showTop: 10,
      displayMode: 'individual',
      animateReveal: true
    } as Omit<LeaderboardSlide, 'id' | 'order'>
  }
]

export default function SlideTemplates({ onSelect, onClose }: SlideTemplatesProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Choose a Slide Type</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Select a template to add to your presentation
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slideTemplates.map((template, index) => (
              <motion.div
                key={template.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onSelect(template.template)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                        <template.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{template.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}