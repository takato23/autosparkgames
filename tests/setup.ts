import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('next/navigation', async () => {
  return {
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  }
})


