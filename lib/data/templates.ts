import type { Presentation, ContentItem } from '@/lib/store/presenter'

export interface Template {
  id: string
  title: string
  description: string
  category: 'education' | 'business' | 'gaming' | 'workshop' | 'event'
  thumbnail?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  tags: string[]
  contents: Omit<ContentItem, 'id'>[]
  settings?: Partial<Presentation['settings']>
}

export const templates: Template[] = [
  {
    id: 'quiz-basico',
    title: 'Quiz Educativo Básico',
    description: 'Plantilla perfecta para crear quizzes educativos con preguntas de opción múltiple',
    category: 'education',
    difficulty: 'beginner',
    estimatedTime: '10-15 min',
    tags: ['quiz', 'educación', 'principiante'],
    contents: [
      {
        type: 'slide',
        subtype: 'title',
        title: 'Bienvenida al Quiz',
        description: 'Prepárate para poner a prueba tus conocimientos',
        order: 0,
      },
      {
        type: 'slide',
        subtype: 'multiple-choice',
        title: 'Pregunta 1',
        description: '¿Cuál es la capital de España?',
        order: 1,
        data: {
          options: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
          correctAnswer: 0,
          timeLimit: 30,
        },
      },
      {
        type: 'slide',
        subtype: 'multiple-choice',
        title: 'Pregunta 2',
        description: '¿Cuántos continentes hay en el mundo?',
        order: 2,
        data: {
          options: ['5', '6', '7', '8'],
          correctAnswer: 2,
          timeLimit: 30,
        },
      },
      {
        type: 'slide',
        subtype: 'rating',
        title: '¿Cómo te pareció el quiz?',
        description: 'Califica tu experiencia del 1 al 5',
        order: 3,
      },
    ],
    settings: {
      showResults: true,
      allowAnonymous: true,
      theme: 'default',
    },
  },
  {
    id: 'trivia-interactiva',
    title: 'Trivia Interactiva',
    description: 'Combina preguntas con mini-juegos para una experiencia más dinámica',
    category: 'gaming',
    difficulty: 'intermediate',
    estimatedTime: '20-30 min',
    tags: ['trivia', 'juegos', 'interactivo'],
    contents: [
      {
        type: 'slide',
        subtype: 'title',
        title: 'Trivia Night',
        description: '¡Prepárate para la competencia!',
        order: 0,
      },
      {
        type: 'game',
        subtype: 'word-puzzle',
        title: 'Encuentra la palabra',
        description: 'Descubre la palabra oculta',
        order: 1,
        data: {
          word: 'TECNOLOGIA',
          hint: 'Lo que hace posible esta presentación',
        },
      },
      {
        type: 'slide',
        subtype: 'poll',
        title: 'Encuesta rápida',
        description: '¿Cuál es tu categoría favorita?',
        order: 2,
        data: {
          options: ['Historia', 'Ciencia', 'Deportes', 'Arte'],
        },
      },
      {
        type: 'game',
        subtype: 'memory-game',
        title: 'Juego de memoria',
        description: 'Encuentra las parejas',
        order: 3,
      },
    ],
    settings: {
      showResults: true,
      randomizeQuestions: true,
      theme: 'gaming',
    },
  },
  {
    id: 'brainstorming',
    title: 'Sesión de Brainstorming',
    description: 'Facilita sesiones creativas con tu equipo usando nubes de palabras y encuestas',
    category: 'business',
    difficulty: 'beginner',
    estimatedTime: '30-45 min',
    tags: ['negocios', 'creatividad', 'equipo'],
    contents: [
      {
        type: 'slide',
        subtype: 'title',
        title: 'Sesión de Ideas',
        description: 'Vamos a crear juntos',
        order: 0,
      },
      {
        type: 'slide',
        subtype: 'word-cloud',
        title: '¿Qué palabras describen nuestro proyecto?',
        description: 'Comparte tus ideas en una palabra',
        order: 1,
      },
      {
        type: 'slide',
        subtype: 'open-text',
        title: 'Describe tu idea principal',
        description: 'Comparte tu propuesta en detalle',
        order: 2,
      },
      {
        type: 'slide',
        subtype: 'poll',
        title: 'Votación de ideas',
        description: '¿Cuál idea te parece más prometedora?',
        order: 3,
      },
    ],
    settings: {
      allowAnonymous: false,
      requireEmail: true,
      theme: 'default',
    },
  },
  {
    id: 'workshop-feedback',
    title: 'Workshop con Feedback',
    description: 'Ideal para talleres interactivos con secciones de Q&A y feedback en tiempo real',
    category: 'workshop',
    difficulty: 'intermediate',
    estimatedTime: '60-90 min',
    tags: ['taller', 'feedback', 'Q&A'],
    contents: [
      {
        type: 'slide',
        subtype: 'title',
        title: 'Bienvenidos al Workshop',
        description: 'Una experiencia de aprendizaje interactiva',
        order: 0,
      },
      {
        type: 'slide',
        subtype: 'qa',
        title: 'Preguntas y Respuestas',
        description: 'Envía tus preguntas en tiempo real',
        order: 1,
      },
      {
        type: 'slide',
        subtype: 'rating',
        title: 'Evalúa esta sección',
        description: '¿Qué tan útil fue este contenido?',
        order: 2,
      },
      {
        type: 'game',
        subtype: 'team-challenge',
        title: 'Desafío en equipos',
        description: 'Trabajen juntos para resolver el reto',
        order: 3,
      },
    ],
    settings: {
      showResults: true,
      theme: 'default',
    },
  },
  {
    id: 'evento-networking',
    title: 'Evento de Networking',
    description: 'Rompe el hielo en eventos con juegos y actividades interactivas',
    category: 'event',
    difficulty: 'beginner',
    estimatedTime: '15-20 min',
    tags: ['evento', 'networking', 'icebreaker'],
    contents: [
      {
        type: 'slide',
        subtype: 'title',
        title: '¡Bienvenidos!',
        description: 'Vamos a conocernos mejor',
        order: 0,
      },
      {
        type: 'game',
        subtype: 'bingo',
        title: 'Networking Bingo',
        description: 'Encuentra personas que cumplan estas características',
        order: 1,
        data: {
          items: [
            'Habla 3 idiomas',
            'Ha viajado a Asia',
            'Toca un instrumento',
            'Es vegetariano',
            'Tiene un podcast',
            'Practica yoga',
          ],
        },
      },
      {
        type: 'slide',
        subtype: 'word-cloud',
        title: '¿De dónde eres?',
        description: 'Comparte tu ciudad',
        order: 2,
      },
      {
        type: 'slide',
        subtype: 'poll',
        title: '¿Cuál es tu industria?',
        description: 'Veamos la diversidad del grupo',
        order: 3,
        data: {
          options: ['Tech', 'Marketing', 'Educación', 'Salud', 'Otro'],
        },
      },
    ],
    settings: {
      allowAnonymous: true,
      theme: 'default',
    },
  },
]

export const templateCategories = [
  {
    id: 'education',
    name: 'Educación',
    description: 'Plantillas para clases y formación',
    icon: '🎓',
  },
  {
    id: 'business',
    name: 'Negocios',
    description: 'Para reuniones y presentaciones corporativas',
    icon: '💼',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Experiencias lúdicas e interactivas',
    icon: '🎮',
  },
  {
    id: 'workshop',
    name: 'Talleres',
    description: 'Para workshops y sesiones de trabajo',
    icon: '🛠️',
  },
  {
    id: 'event',
    name: 'Eventos',
    description: 'Ideal para conferencias y networking',
    icon: '🎉',
  },
]