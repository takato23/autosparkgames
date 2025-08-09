import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/page'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('HomePage', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  it('muestra CTA principal y permite unirse a demo', async () => {
    render(<HomePage />)
    const joinBtn = screen.getByRole('button', { name: /unirse a demo/i })
    await userEvent.click(joinBtn)
    expect(mockPush).toHaveBeenCalledWith('/join?code=123456')
  })

  it('abre el diálogo para ingresar código', async () => {
    render(<HomePage />)
    const openDialog = screen.getByRole('button', { name: /abrir diálogo para unirse/i })
    await userEvent.click(openDialog)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/código de 6 dígitos/i)).toBeInTheDocument()
  })
})




