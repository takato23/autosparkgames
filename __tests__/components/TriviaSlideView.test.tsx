import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import TriviaSlideView from '@/components/slides/TriviaSlideView'

describe('TriviaSlideView', () => {
  const slide = {
    id: 's1',
    type: 'trivia',
    question: 'Capital de Francia?',
    options: [
      { id: 'a', text: 'Madrid' },
      { id: 'b', text: 'París' },
      { id: 'c', text: 'Roma' }
    ],
    correctOptionId: 'b',
    timeLimit: 15
  } as const

  it('envía la respuesta seleccionada', () => {
    const onSubmit = vi.fn()
    render(
      <TriviaSlideView slide={slide as any} onSubmit={onSubmit as any} hasResponded={false} />
    )

    fireEvent.click(screen.getByRole('button', { name: /opción: parís/i }))
    fireEvent.click(screen.getByRole('button', { name: /enviar respuesta/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const payload = onSubmit.mock.calls[0][0]
    expect(payload.type).toBe('trivia')
    expect(payload.selectedOption).toBe('b')
  })
})


