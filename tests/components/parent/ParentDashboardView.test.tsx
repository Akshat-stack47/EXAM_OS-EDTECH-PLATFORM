import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/trpc', () => ({
  trpc: {
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

const { ParentDashboardView } = await import('@/components/parent/ParentDashboardView')

const MOCK_PROFILE = {
  name: 'Amit Sharma',
  children: [
    {
      id: 'c1', name: 'Riya', targetExam: 'UPSC', targetYear: 2025,
      currentStreak: 12, totalStudyMins: 3600, nationalRank: 1847,
      burnoutRisk: 'LOW', isVerified: true,
      subjectScores: [
        { subject: 'History', score: 78 },
        { subject: 'Polity', score: 82 },
      ],
    },
  ],
}

describe('ParentDashboardView', () => {
  it('renders parent name', () => {
    render(<ParentDashboardView profile={MOCK_PROFILE} alerts={[]} />)
    expect(screen.getByText(/Amit Sharma/)).toBeInTheDocument()
  })

  it('shows alert count', () => {
    render(<ParentDashboardView profile={MOCK_PROFILE} alerts={[{ id: 'a1', title: 'Alert', body: 'Test' }]} />)
    expect(screen.getByText('1 Alerts')).toBeInTheDocument()
  })

  it('shows no alerts text when empty', () => {
    render(<ParentDashboardView profile={MOCK_PROFILE} alerts={[]} />)
    expect(screen.getByText('No Alerts')).toBeInTheDocument()
  })
})
