import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/trpc', () => ({
  trpc: {
    ai: { chat: { useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }) } },
    student: { logSession: { useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }) } },
    search: {
      search: { useQuery: () => ({ data: { hits: [], found: 0 }, isLoading: false }) },
      suggest: { useQuery: () => ({ data: [], isLoading: false }) },
    },
  },
  createTRPCReact: () => ({}),
}))

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getTotalSize: () => 0,
    getVirtualItems: () => [],
  }),
}))

const { StudentDashboardView } = await import('@/components/student/StudentDashboardView')

const DEMO_DATA = {
  profile: { name: 'Riya', streak: 12, nationalRank: 100, totalStudyMins: 3600, todayMinutes: 45 },
  scores: [
    { subject: 'History', score: 78 },
    { subject: 'Polity', score: 82 },
    { subject: 'Geography', score: 65 },
    { subject: 'Economy', score: 71 },
    { subject: 'Science', score: 88 },
  ],
  recentSessions: [
    { duration: 45, createdAt: new Date().toISOString() },
  ],
}

describe('StudentDashboardView', () => {
  it('renders welcome with name', () => {
    render(<StudentDashboardView data={DEMO_DATA} />)
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
  })

  it('shows stat cards', () => {
    render(<StudentDashboardView data={DEMO_DATA} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('#100')).toBeInTheDocument()
  })

  it('shows subject scores', () => {
    render(<StudentDashboardView data={DEMO_DATA} />)
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Polity')).toBeInTheDocument()
  })

  it('shows Log 25min Study button', () => {
    render(<StudentDashboardView data={DEMO_DATA} />)
    expect(screen.getByText('Log 25min Study')).toBeInTheDocument()
  })
})
