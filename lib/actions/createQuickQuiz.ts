import { addSlide, createPresentation } from "@/lib/firebase/helpers/presentations"
import { SlideType, type TriviaSlide } from "@/lib/types/presentation"

interface CreateQuickQuizInput {
  userId: string
  question: string
  options: string[]
  time: number
  title?: string
  description?: string
  correctIndex?: number
}

export async function createQuickQuiz({
  userId,
  question,
  options,
  time,
  title = "Quiz rápido",
  description = "Creado desde asistente rápido",
  correctIndex = 0,
}: CreateQuickQuizInput): Promise<string> {
  // Crea una presentación mínima con una sola pregunta tipo trivia
  const presentationId = await createPresentation(userId, title, description)

  const slide: Omit<TriviaSlide, 'id' | 'order'> = {
    type: SlideType.TRIVIA,
    title: "Pregunta 1",
    question,
    options: options.map((t, i) => ({ id: String(i), text: t })),
    correctAnswer: String(correctIndex),
    points: 100,
    difficulty: "easy",
    timeLimit: time,
  }

  await addSlide(presentationId, slide)
  return presentationId
}


