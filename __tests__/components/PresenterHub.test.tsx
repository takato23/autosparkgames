import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PresenterHub from '@/components/presenter/PresenterHub'

vi.mock('@/lib/firebase/helpers/presentations', () => ({
  getUserPresentations: vi.fn(async () => ([
    { id: '1', title: 'A', description: '', userId: 'u', createdAt: { toDate: () => new Date() }, updatedAt: { toDate: () => new Date() }, slides: [], settings: {}, status: 'published' },
  ])),
  createPresentation: vi.fn(async () => 'new-id'),
}))
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'u', email: 'e' }, loading: false }) }))

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('PresenterHub (unit)', () => {
  beforeEach(() => {
    mockPush.mockReset()
    window.localStorage.clear()
  })

  it('renderiza encabezado, KPIs y acciones rápidas', () => {
    render(<PresenterHub />)
    expect(screen.getByText('¡Hola! 👋')).toBeInTheDocument()
    expect(screen.getByText('Total Presentaciones')).toBeInTheDocument()
    expect(screen.getByLabelText('Crear nueva presentación')).toBeInTheDocument()
    expect(screen.getByLabelText('Crear Juego Rápido')).toBeInTheDocument()
  })

  it('permite cambiar la vista y persiste en localStorage', () => {
    render(<PresenterHub />)
    const listBtn = screen.getByLabelText('Vista de lista')
    fireEvent.click(listBtn)
    expect(window.localStorage.getItem('presenter:view')).toBe('list')
  })
})


