import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mockStartTimer = vi.fn()
const mockPauseTimer = vi.fn()
const mockResetTimer = vi.fn()
const mockTick = vi.fn()

vi.mock('@/stores/useStudyTimerStore', () => ({
  useStudyTimerStore: () => ({
    timeLeft: 1500,
    isActive: false,
    startTimer: mockStartTimer,
    pauseTimer: mockPauseTimer,
    resetTimer: mockResetTimer,
    tick: mockTick,
  }),
}))

const { StudyTimer } = await import('@/components/student/StudyTimer')

describe('StudyTimer', () => {
  it('renders timer at 25:00', () => {
    render(<StudyTimer />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('shows Start button when not active', () => {
    render(<StudyTimer />)
    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  it('calls startTimer on Start click', async () => {
    const user = userEvent.setup()
    render(<StudyTimer />)
    await user.click(screen.getByText('Start'))
    expect(mockStartTimer).toHaveBeenCalled()
  })

  it('calls resetTimer on Reset click', async () => {
    const user = userEvent.setup()
    render(<StudyTimer />)
    await user.click(screen.getByText('Reset'))
    expect(mockResetTimer).toHaveBeenCalled()
  })
})
