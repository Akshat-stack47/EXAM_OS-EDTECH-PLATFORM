import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mockUseQuery = vi.fn()

vi.mock('@/lib/trpc', () => ({
  trpc: {
    exam: {
      list: { useQuery: (...args: any[]) => mockUseQuery(...args) },
    },
    search: {
      search: { useQuery: () => ({ data: { hits: [], found: 0 }, isLoading: false }) },
      suggest: { useQuery: () => ({ data: [], isLoading: false }) },
    },
  },
  createTRPCReact: () => ({}),
}))

const { ExamsClient } = await import('@/app/(public)/exams/ExamsClient')

describe('ExamsClient', () => {
  it('renders filter buttons', () => {
    mockUseQuery.mockReturnValue({ data: [], isLoading: false })
    render(<ExamsClient />)
    expect(screen.getByText('UPSC')).toBeInTheDocument()
    expect(screen.getByText('SSC')).toBeInTheDocument()
    expect(screen.getByText('BANKING')).toBeInTheDocument()
    expect(screen.getByText('RAILWAY')).toBeInTheDocument()
    expect(screen.getByText('STATE PSC')).toBeInTheDocument()
    expect(screen.getByText('JEE')).toBeInTheDocument()
    expect(screen.getByText('NEET')).toBeInTheDocument()
    expect(screen.getByText('DEFENCE')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    mockUseQuery.mockReturnValue({ data: [], isLoading: false })
    render(<ExamsClient />)
    expect(screen.getByText('No cutoff data yet')).toBeInTheDocument()
  })

  it('displays exam data', () => {
    mockUseQuery.mockReturnValue({
      data: [{ id: '1', examName: 'UPSC', examYear: 2024, stage: 'Prelims', general: 98, totalMarks: 200 }],
      isLoading: false,
    })
    render(<ExamsClient />)
    expect(screen.getByText(/UPSC/)).toBeInTheDocument()
  })
})
