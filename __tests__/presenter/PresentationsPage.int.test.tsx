import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PresentationsPage from '@/app/presenter/presentations/page'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('PresentationsPage (integración)', () => {
  it('filtra por texto y navega a nueva presentación', () => {
    render(<PresentationsPage />)
    const input = screen.getByLabelText('Buscar presentaciones') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Bingo' } })
    expect(input.value).toBe('Bingo')

    const newBtn = screen.getByRole('button', { name: /nueva presentación/i })
    fireEvent.click(newBtn)
    expect(mockPush).toHaveBeenCalledWith('/presenter/new')
  })
})




