'use client'

import { create } from 'zustand'

type ParticipantState = {
  answered: Record<string, boolean>
  markAnswered: (slideId: string) => void
  resetForSlide: (slideId: string) => void
}

export const useParticipantStore = create<ParticipantState>((set) => ({
  answered: {},
  markAnswered: (slideId: string) => set((s) => ({ answered: { ...s.answered, [slideId]: true } })),
  resetForSlide: (slideId: string) => set((s) => {
    const next = { ...s.answered }
    delete next[slideId]
    return { answered: next }
  }),
}))


