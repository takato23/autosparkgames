import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JoinPage from '@/app/join/page'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
}))

describe('JoinPage (integración)', () => {
  it('muestra error accesible con código inválido', async () => {
    render(<JoinPage />)
    const input = screen.getByLabelText('Código de sesión') as HTMLInputElement
    fireEvent.change(input, { target: { value: '111111' } })
    const submit = screen.getByRole('button', { name: 'Unirse al juego' })
    fireEvent.click(submit)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})


