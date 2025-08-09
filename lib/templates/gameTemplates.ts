import { 
  Presentation, 
  SlideType, 
  TitleSlide, 
  TriviaSlide, 
  IceBreakerSlide, 
  TeamChallengeSlide,
  LeaderboardSlide,
  Slide
} from '@/lib/types/presentation'
import { Timestamp } from 'firebase/firestore'

export interface GameTemplate {
  id: string
  name: string
  description: string
  category: 'trivia' | 'ice_breaker' | 'team_building' | 'mixed'
  duration: string // e.g., "15-20 min"
  participants: string // e.g., "10-50"
  difficulty?: 'easy' | 'medium' | 'hard'
  tags: string[]
  thumbnail?: string
  slides: Omit<Slide, 'id' | 'order'>[]
}

// Helper to create IDs
const createId = () => Math.random().toString(36).substr(2, 9)

export const gameTemplates: GameTemplate[] = [
  {
    id: 'general-knowledge-trivia',
    name: 'General Knowledge Trivia',
    description: 'A fun mix of trivia questions covering various topics. Perfect for team meetings and social events.',
    category: 'trivia',
    duration: '15-20 min',
    participants: '10-100',
    difficulty: 'medium',
    tags: ['trivia', 'knowledge', 'competitive', 'fun'],
    slides: [
      {
        type: SlideType.TITLE,
        title: 'General Knowledge Trivia',
        subtitle: 'Test your knowledge and compete for the top spot! 🏆'
      } as Omit<TitleSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Warm Up Question',
        question: 'What is the largest planet in our solar system?',
        options: [
          { id: '1', text: 'Earth' },
          { id: '2', text: 'Mars' },
          { id: '3', text: 'Jupiter' },
          { id: '4', text: 'Saturn' }
        ],
        correctAnswer: '3',
        points: 50,
        difficulty: 'easy',
        category: 'Science',
        timeLimit: 15,
        explanation: 'Jupiter is the largest planet, with a diameter of about 88,846 miles.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'History Question',
        question: 'In which year did World War II end?',
        options: [
          { id: '1', text: '1943' },
          { id: '2', text: '1944' },
          { id: '3', text: '1945' },
          { id: '4', text: '1946' }
        ],
        correctAnswer: '3',
        points: 100,
        difficulty: 'medium',
        category: 'History',
        timeLimit: 20,
        explanation: 'World War II ended in 1945 with the surrender of Japan.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Geography Challenge',
        question: 'Which country has the most time zones?',
        options: [
          { id: '1', text: 'Russia' },
          { id: '2', text: 'United States' },
          { id: '3', text: 'China' },
          { id: '4', text: 'France' }
        ],
        correctAnswer: '4',
        points: 150,
        difficulty: 'hard',
        category: 'Geography',
        timeLimit: 25,
        hint: 'Think about overseas territories!',
        explanation: 'France has 12 time zones due to its overseas territories around the world.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.LEADERBOARD,
        title: 'Current Standings',
        showTop: 5,
        displayMode: 'individual',
        animateReveal: true
      } as Omit<LeaderboardSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Pop Culture',
        question: 'Which movie won the Academy Award for Best Picture in 2020?',
        options: [
          { id: '1', text: 'Joker' },
          { id: '2', text: 'Parasite' },
          { id: '3', text: '1917' },
          { id: '4', text: 'Once Upon a Time in Hollywood' }
        ],
        correctAnswer: '2',
        points: 100,
        difficulty: 'medium',
        category: 'Entertainment',
        timeLimit: 20,
        explanation: 'Parasite was the first non-English film to win Best Picture.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Final Question - Double Points!',
        question: 'What is the smallest country in the world by area?',
        options: [
          { id: '1', text: 'Monaco' },
          { id: '2', text: 'Vatican City' },
          { id: '3', text: 'San Marino' },
          { id: '4', text: 'Liechtenstein' }
        ],
        correctAnswer: '2',
        points: 200,
        difficulty: 'medium',
        category: 'Geography',
        timeLimit: 30,
        explanation: 'Vatican City is only 0.17 square miles (0.44 km²).'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.LEADERBOARD,
        title: 'Final Results! 🎉',
        showTop: 10,
        displayMode: 'individual',
        animateReveal: true
      } as Omit<LeaderboardSlide, 'id' | 'order'>
    ]
  },
  {
    id: 'corporate-ice-breakers',
    name: 'Corporate Ice Breakers',
    description: 'Perfect for starting meetings, team building sessions, or onboarding new employees.',
    category: 'ice_breaker',
    duration: '10-15 min',
    participants: '5-50',
    tags: ['ice breaker', 'team building', 'corporate', 'fun'],
    slides: [
      {
        type: SlideType.TITLE,
        title: 'Let\'s Get to Know Each Other!',
        subtitle: 'Fun ice breakers to start our session 🎯'
      } as Omit<TitleSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'Would You Rather...',
        prompt: 'Time for a tough choice!',
        questionType: 'would_you_rather',
        options: [
          { id: '1', text: 'Work from a beach for a month', emoji: '🏖️' },
          { id: '2', text: 'Work from a mountain cabin for a month', emoji: '🏔️' }
        ],
        allowComments: true,
        showNames: true
      } as Omit<IceBreakerSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'Two Truths and a Lie',
        prompt: 'Share two truths and one lie about yourself. Others will guess which is the lie!',
        questionType: 'two_truths_one_lie',
        allowComments: true,
        showNames: true
      } as Omit<IceBreakerSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'This or That',
        prompt: 'Quick decisions!',
        questionType: 'this_or_that',
        options: [
          { id: '1', text: 'Coffee', emoji: '☕' },
          { id: '2', text: 'Tea', emoji: '🍵' }
        ],
        allowComments: false,
        showNames: true
      } as Omit<IceBreakerSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'Superpower Selection',
        prompt: 'If you could have any superpower for work, which would you choose?',
        questionType: 'would_you_rather',
        options: [
          { id: '1', text: 'Read minds in meetings', emoji: '🧠' },
          { id: '2', text: 'Teleport to avoid commute', emoji: '✨' },
          { id: '3', text: 'Pause time for deadlines', emoji: '⏰' },
          { id: '4', text: 'Clone yourself for multitasking', emoji: '👥' }
        ],
        allowComments: true,
        showNames: true
      } as Omit<IceBreakerSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'Fun Fact Friday',
        prompt: 'Share a fun fact about yourself that most colleagues don\'t know!',
        questionType: 'fun_fact',
        allowComments: true,
        showNames: true
      } as Omit<IceBreakerSlide, 'id' | 'order'>
    ]
  },
  {
    id: 'team-building-challenges',
    name: 'Team Building Challenges',
    description: 'Collaborative activities to strengthen team bonds and improve communication.',
    category: 'team_building',
    duration: '20-30 min',
    participants: '10-40',
    tags: ['team building', 'collaboration', 'corporate', 'creative'],
    slides: [
      {
        type: SlideType.TITLE,
        title: 'Team Building Challenge',
        subtitle: 'Work together, win together! 🤝'
      } as Omit<TitleSlide, 'id' | 'order'>,
      {
        type: SlideType.TEAM_CHALLENGE,
        title: 'Creative Company Slogan',
        challenge: 'Each team has 3 minutes to create the most creative and memorable slogan for our company. Be creative and have fun!',
        challengeType: 'creative',
        teams: ['Innovation Squad', 'Dream Team', 'Success Makers', 'Vision Masters'],
        scoringMethod: 'voting',
        timeLimit: 180
      } as Omit<TeamChallengeSlide, 'id' | 'order'>,
      {
        type: SlideType.TEAM_CHALLENGE,
        title: 'Problem Solving Challenge',
        challenge: 'Your team is stranded on a desert island with only 5 items. Decide together which 5 items would be most useful for survival and explain why.',
        challengeType: 'problem_solving',
        teams: ['Innovation Squad', 'Dream Team', 'Success Makers', 'Vision Masters'],
        scoringMethod: 'voting',
        timeLimit: 240
      } as Omit<TeamChallengeSlide, 'id' | 'order'>,
      {
        type: SlideType.LEADERBOARD,
        title: 'Team Standings',
        showTop: 4,
        displayMode: 'team',
        animateReveal: true
      } as Omit<LeaderboardSlide, 'id' | 'order'>,
      {
        type: SlideType.TEAM_CHALLENGE,
        title: 'Speed Round: Company Values',
        challenge: 'List as many examples as possible of how your team demonstrates our company values in daily work. Most examples wins!',
        challengeType: 'speed',
        teams: ['Innovation Squad', 'Dream Team', 'Success Makers', 'Vision Masters'],
        scoringMethod: 'points',
        maxPoints: 50,
        timeLimit: 120
      } as Omit<TeamChallengeSlide, 'id' | 'order'>,
      {
        type: SlideType.TEAM_CHALLENGE,
        title: 'Knowledge Share',
        challenge: 'Each team shares one unique skill or piece of knowledge that could benefit other teams. Best knowledge share wins!',
        challengeType: 'knowledge',
        teams: ['Innovation Squad', 'Dream Team', 'Success Makers', 'Vision Masters'],
        scoringMethod: 'voting',
        timeLimit: 300
      } as Omit<TeamChallengeSlide, 'id' | 'order'>,
      {
        type: SlideType.LEADERBOARD,
        title: 'Final Team Results! 🏆',
        showTop: 4,
        displayMode: 'team',
        animateReveal: true
      } as Omit<LeaderboardSlide, 'id' | 'order'>
    ]
  },
  {
    id: 'tech-trivia',
    name: 'Tech Industry Trivia',
    description: 'Test your knowledge of technology, programming, and tech history.',
    category: 'trivia',
    duration: '15-20 min',
    participants: '10-100',
    difficulty: 'medium',
    tags: ['trivia', 'technology', 'programming', 'competitive'],
    slides: [
      {
        type: SlideType.TITLE,
        title: 'Tech Trivia Challenge',
        subtitle: 'How well do you know the tech world? 💻'
      } as Omit<TitleSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Programming Languages',
        question: 'Which programming language was created by Guido van Rossum?',
        options: [
          { id: '1', text: 'Java' },
          { id: '2', text: 'Python' },
          { id: '3', text: 'Ruby' },
          { id: '4', text: 'JavaScript' }
        ],
        correctAnswer: '2',
        points: 100,
        difficulty: 'easy',
        category: 'Programming',
        timeLimit: 15,
        explanation: 'Python was created by Guido van Rossum and first released in 1991.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Tech History',
        question: 'In what year was the first iPhone released?',
        options: [
          { id: '1', text: '2005' },
          { id: '2', text: '2006' },
          { id: '3', text: '2007' },
          { id: '4', text: '2008' }
        ],
        correctAnswer: '3',
        points: 100,
        difficulty: 'medium',
        category: 'Tech History',
        timeLimit: 20,
        explanation: 'Steve Jobs announced the first iPhone on January 9, 2007.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Internet & Web',
        question: 'What does "HTTP" stand for?',
        options: [
          { id: '1', text: 'HyperText Transfer Protocol' },
          { id: '2', text: 'High Tech Transfer Process' },
          { id: '3', text: 'HyperText Technical Platform' },
          { id: '4', text: 'High Transfer Text Protocol' }
        ],
        correctAnswer: '1',
        points: 150,
        difficulty: 'medium',
        category: 'Internet',
        timeLimit: 20,
        explanation: 'HTTP is the foundation of data communication for the World Wide Web.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.LEADERBOARD,
        title: 'Halftime Scores',
        showTop: 5,
        displayMode: 'individual',
        animateReveal: true
      } as Omit<LeaderboardSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Tech Companies',
        question: 'Which company\'s original name was "BackRub"?',
        options: [
          { id: '1', text: 'Facebook' },
          { id: '2', text: 'Google' },
          { id: '3', text: 'Amazon' },
          { id: '4', text: 'Microsoft' }
        ],
        correctAnswer: '2',
        points: 200,
        difficulty: 'hard',
        category: 'Tech Companies',
        timeLimit: 25,
        hint: 'This company is known for its search engine.',
        explanation: 'Google was originally called BackRub when it was a research project at Stanford.'
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.LEADERBOARD,
        title: 'Final Tech Trivia Results! 💻',
        showTop: 10,
        displayMode: 'individual',
        animateReveal: true
      } as Omit<LeaderboardSlide, 'id' | 'order'>
    ]
  },
  {
    id: 'quick-energizer',
    name: 'Quick Meeting Energizer',
    description: 'A 5-minute energy boost to wake up your meeting participants.',
    category: 'mixed',
    duration: '5 min',
    participants: '5-30',
    tags: ['quick', 'energizer', 'meeting', 'ice breaker'],
    slides: [
      {
        type: SlideType.TITLE,
        title: 'Quick Energy Boost! ⚡',
        subtitle: '5 minutes to energize our meeting'
      } as Omit<TitleSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'Speed Round',
        prompt: 'Morning person or night owl?',
        questionType: 'this_or_that',
        options: [
          { id: '1', text: 'Early Bird', emoji: '🌅' },
          { id: '2', text: 'Night Owl', emoji: '🦉' }
        ],
        allowComments: false,
        showNames: false
      } as Omit<IceBreakerSlide, 'id' | 'order'>,
      {
        type: SlideType.TRIVIA,
        title: 'Quick Brain Teaser',
        question: 'What gets wet while drying?',
        options: [
          { id: '1', text: 'A sponge' },
          { id: '2', text: 'A towel' },
          { id: '3', text: 'A mop' },
          { id: '4', text: 'Paper' }
        ],
        correctAnswer: '2',
        points: 50,
        difficulty: 'easy',
        category: 'Brain Teaser',
        timeLimit: 10
      } as Omit<TriviaSlide, 'id' | 'order'>,
      {
        type: SlideType.ICE_BREAKER,
        title: 'Energy Check',
        prompt: 'Rate your current energy level!',
        questionType: 'this_or_that',
        options: [
          { id: '1', text: 'Need coffee! ☕', emoji: '😴' },
          { id: '2', text: 'Feeling good! 👍', emoji: '😊' },
          { id: '3', text: 'Ready to conquer! 💪', emoji: '🚀' },
          { id: '4', text: 'Super energized! ⚡', emoji: '🎉' }
        ],
        allowComments: false,
        showNames: false
      } as Omit<IceBreakerSlide, 'id' | 'order'>
    ]
  }
]

// Function to create a presentation from a template
export function createPresentationFromTemplate(
  template: GameTemplate,
  userId: string,
  title?: string
): Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: title || template.name,
    description: template.description,
    userId,
    slides: template.slides.map((slide, index) => ({
      ...slide,
      id: createId(),
      order: index
    })) as Slide[],
    settings: {
      allowAnonymous: true,
      requireEmail: false,
      showResults: true,
      allowSkip: false,
      randomizeQuestions: false,
      showCorrectAnswers: true,
      gameMode: template.category === 'trivia' ? 'trivia' : 
                template.category === 'ice_breaker' ? 'ice_breaker' : 
                template.category === 'team_building' ? 'team_building' : 'standard',
      enableLeaderboard: template.category === 'trivia' || template.category === 'team_building',
      enableTimer: true,
      pointsSystem: template.category === 'trivia',
      teamMode: template.category === 'team_building',
      maxTeams: 4,
      soundEffects: true,
      celebrateCorrectAnswers: template.category === 'trivia'
    },
    status: 'draft'
  }
}