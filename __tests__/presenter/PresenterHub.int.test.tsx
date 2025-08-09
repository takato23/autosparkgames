import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PresenterHub from '@/components/presenter/PresenterHub'

vi.mock('@/lib/firebase/helpers/presentations', () => ({
  getUserPresentations: vi.fn(async () => ([])),
  createPresentation: vi.fn(async () => 'gen-1'),
}))
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'u', email: 'e' }, loading: false }) }))

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('PresenterHub (integración)', () => {
  beforeEach(() => {
    mockPush.mockReset()
    window.localStorage.clear()
  })

  it('abre el diálogo de Crear Juego Rápido y navega al crear', async () => {
    render(<PresenterHub />)

    const quick = screen.getByLabelText('Crear Juego Rápido')
    fireEvent.click(quick)

    expect(await screen.findByText('Crear Juego Rápido')).toBeInTheDocument()

    const name = screen.getByLabelText('Nombre del juego') as HTMLInputElement
    fireEvent.change(name, { target: { value: 'Demo' } })

    const createBtn = screen.getByRole('button', { name: 'Crear' })
    fireEvent.click(createBtn)

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/presenter/new'))
  })
})


