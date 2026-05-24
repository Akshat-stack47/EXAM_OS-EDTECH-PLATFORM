import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

vi.mock('@/lib/trpc', () => ({
  trpc: {
    notification: {
      list: { useQuery: () => ({ data: [], refetch: vi.fn() }) },
      markRead: { useMutation: () => ({ mutateAsync: vi.fn() }) },
    },
  },
  createTRPCReact: () => ({}),
}))

const { NotificationBell } = await import('@/components/shared/NotificationBell')

describe('NotificationBell', () => {
  it('renders bell button', () => {
    render(<NotificationBell />)
    const button = document.querySelector('button')
    expect(button).toBeInTheDocument()
  })

  it('does not show badge with no unread', () => {
    render(<NotificationBell />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
