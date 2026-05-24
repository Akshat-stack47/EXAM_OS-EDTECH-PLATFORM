import { create } from 'zustand'

interface TimerState {
  isActive: boolean
  timeLeft: number // seconds
  mode: 'pomodoro' | 'short_break' | 'long_break'
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  setMode: (mode: 'pomodoro' | 'short_break' | 'long_break') => void
}

export const useStudyTimerStore = create<TimerState>((set) => ({
  isActive: false,
  timeLeft: 25 * 60,
  mode: 'pomodoro',
  startTimer: () => set({ isActive: true }),
  pauseTimer: () => set({ isActive: false }),
  resetTimer: () => set({ isActive: false, timeLeft: 25 * 60 }),
  tick: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  setMode: (mode) => {
    let time = 25 * 60
    if (mode === 'short_break') time = 5 * 60
    if (mode === 'long_break') time = 15 * 60
    set({ mode, timeLeft: time, isActive: false })
  },
}))
