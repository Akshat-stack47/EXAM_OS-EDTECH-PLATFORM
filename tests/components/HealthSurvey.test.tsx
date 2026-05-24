import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mockOnClose = vi.fn()

vi.mock('@/lib/trpc', () => ({
  trpc: {
    health: {
      submitSurvey: { useMutation: () => ({ mutateAsync: vi.fn() }) },
      getLatest: { useQuery: () => ({ data: null, isLoading: false }) },
    },
  },
  createTRPCReact: () => ({}),
}))

const { HealthSurveyModal } = await import('@/components/health/HealthSurveyModal')

describe('HealthSurveyModal', () => {
  it('renders survey header', () => {
    render(<HealthSurveyModal onClose={mockOnClose} />)
    expect(screen.getByText('Weekly Health Check-in')).toBeInTheDocument()
  })

  it('renders Skip and Submit buttons', () => {
    render(<HealthSurveyModal onClose={mockOnClose} />)
    expect(screen.getByText('Skip')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('calls onClose on Skip click', async () => {
    const user = userEvent.setup()
    render(<HealthSurveyModal onClose={mockOnClose} />)
    await user.click(screen.getByText('Skip'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose on Submit click', async () => {
    const user = userEvent.setup()
    render(<HealthSurveyModal onClose={mockOnClose} />)
    await user.click(screen.getByText('Submit'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
