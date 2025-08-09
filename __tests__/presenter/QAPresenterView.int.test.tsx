import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import QAPresenterView from '@/components/presenter/QAPresenterView'

describe('QAPresenterView integración básica', () => {
  const slide = {
    id: 'qa1',
    type: 'qa',
    prompt: 'Preguntas y Respuestas',
    allowUpvoting: true,
    moderationEnabled: true,
    anonymousAllowed: true
  } as any

  const responses = {
    slideId: 'qa1',
    responseCount: 3,
    responses: [
      { type: 'qa', question: '¿Horario?', upvotes: [], isApproved: true, isAnswered: false, participantId: 'p1', slideId: 'qa1', timestamp: { toMillis: () => Date.now() } },
      { type: 'qa', question: '¿Dresscode?', upvotes: [{}, {}], isApproved: false, isAnswered: true, participantId: 'p2', slideId: 'qa1', timestamp: { toMillis: () => Date.now() - 1000 } },
      { type: 'qa', question: '¿Breaks?', upvotes: [{}], isApproved: false, isAnswered: false, participantId: 'p3', slideId: 'qa1', timestamp: { toMillis: () => Date.now() - 2000 } }
    ]
  }

  it('muestra chips con contadores y lista top', () => {
    render(<QAPresenterView slide={slide} responses={responses as any} showResults participantCount={10} />)

    expect(screen.getByRole('button', { name: /todas: 3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /aprobadas: 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /respondidas: 1/i })).toBeInTheDocument()

    expect(screen.getByText(/preguntas y respuestas/i)).toBeInTheDocument()
  })
})


