// Mock data for demo without Firebase
import { Presentation, SlideType } from './types/presentation'
import { Session, SessionStatus } from './types/session'

export const mockPresentations: Presentation[] = [
  {
    id: 'demo-trivia-1',
    title: 'Trivia de Conocimiento General',
    description: 'Un juego de trivia divertido para eventos corporativos',
    userId: 'demo-user',
    createdAt: null as any,
    updatedAt: null as any,
    status: 'published',
    settings: {
      allowAnonymous: true,
      requireEmail: false,
      showResults: true,
      allowSkip: false,
      randomizeQuestions: false,
      showCorrectAnswers: true,
      gameMode: 'trivia',
      enableLeaderboard: true,
      enableTimer: true,
      pointsSystem: true,
      soundEffects: true,
      celebrateCorrectAnswers: true
    },
    slides: [
      {
        id: 'slide-1',
        type: SlideType.TITLE,
        title: 'Trivia de Conocimiento General',
        subtitle: '¡Prepárate para poner a prueba tu conocimiento! 🎯',
        order: 0
      },
      {
        id: 'slide-2',
        type: SlideType.TRIVIA,
        title: 'Pregunta de Calentamiento',
        question: '¿Cuál es el planeta más grande de nuestro sistema solar?',
        options: [
          { id: '1', text: 'Tierra' },
          { id: '2', text: 'Marte' },
          { id: '3', text: 'Júpiter' },
          { id: '4', text: 'Saturno' }
        ],
        correctAnswer: '3',
        points: 50,
        difficulty: 'easy',
        category: 'Ciencia',
        timeLimit: 15,
        explanation: 'Júpiter es el planeta más grande, con un diámetro de aproximadamente 142,984 km.',
        order: 1
      },
      {
        id: 'slide-3',
        type: SlideType.TRIVIA,
        title: 'Historia',
        question: '¿En qué año llegó Cristóbal Colón a América?',
        options: [
          { id: '1', text: '1490' },
          { id: '2', text: '1491' },
          { id: '3', text: '1492' },
          { id: '4', text: '1493' }
        ],
        correctAnswer: '3',
        points: 100,
        difficulty: 'medium',
        category: 'Historia',
        timeLimit: 20,
        explanation: 'Cristóbal Colón llegó a América el 12 de octubre de 1492.',
        order: 2
      },
      {
        id: 'slide-4',
        type: SlideType.LEADERBOARD,
        title: 'Clasificación Actual',
        showTop: 5,
        displayMode: 'individual',
        animateReveal: true,
        order: 3
      }
    ]
  },
  {
    id: 'demo-icebreaker-1',
    title: 'Ice Breakers para Reuniones',
    description: 'Actividades divertidas para romper el hielo',
    userId: 'demo-user',
    createdAt: null as any,
    updatedAt: null as any,
    status: 'published',
    settings: {
      allowAnonymous: true,
      requireEmail: false,
      showResults: true,
      allowSkip: true,
      randomizeQuestions: false,
      showCorrectAnswers: false,
      gameMode: 'ice_breaker',
      enableLeaderboard: false,
      enableTimer: false,
      pointsSystem: false
    },
    slides: [
      {
        id: 'slide-1',
        type: SlideType.TITLE,
        title: '¡Rompamos el Hielo! ❄️',
        subtitle: 'Actividades divertidas para conocernos mejor',
        order: 0
      },
      {
        id: 'slide-2',
        type: SlideType.ICE_BREAKER,
        title: '¿Qué Preferirías?',
        prompt: '¡Hora de tomar decisiones difíciles!',
        questionType: 'would_you_rather',
        options: [
          { id: '1', text: 'Trabajar desde la playa por un mes', emoji: '🏖️' },
          { id: '2', text: 'Trabajar desde una cabaña en la montaña por un mes', emoji: '🏔️' }
        ],
        allowComments: true,
        showNames: true,
        order: 1
      },
      {
        id: 'slide-3',
        type: SlideType.ICE_BREAKER,
        title: 'Esto o Aquello',
        prompt: '¡Decisiones rápidas!',
        questionType: 'this_or_that',
        options: [
          { id: '1', text: 'Café', emoji: '☕' },
          { id: '2', text: 'Té', emoji: '🍵' }
        ],
        allowComments: false,
        showNames: true,
        order: 2
      }
    ]
  }
]

export const mockSession: Session = {
  id: 'demo-session-1',
  presentationId: 'demo-trivia-1',
  code: '123456',
  status: SessionStatus.ACTIVE,
  currentSlideId: 'slide-1',
  currentSlideIndex: 0,
  startedAt: null as any,
  participants: {},
  responses: {},
  settings: {
    lockLateJoining: false,
    showParticipantCount: true,
    showLeaderboard: true,
    anonymousNicknames: false
  },
  leaderboard: []
}

// Mock functions to simulate Firebase operations
export const mockFirebase = {
  getPresentations: async () => mockPresentations,
  getPresentation: async (id: string) => mockPresentations.find(p => p.id === id),
  createPresentation: async (data: any) => ({ ...data, id: `demo-${Date.now()}` }),
  updatePresentation: async (id: string, data: any) => ({ id, ...data }),
  deletePresentation: async (id: string) => {},
  
  getSession: async (code: string) => mockSession,
  createSession: async (presentationId: string) => ({
    ...mockSession,
    id: `session-${Date.now()}`,
    presentationId,
    code: Math.floor(100000 + Math.random() * 900000).toString()
  }),
  
  joinSession: async (code: string, name: string) => ({
    participantId: `participant-${Date.now()}`,
    sessionId: mockSession.id
  })
}