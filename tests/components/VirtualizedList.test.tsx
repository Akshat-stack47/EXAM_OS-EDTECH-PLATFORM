import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getTotalSize: () => 180,
    getVirtualItems: () => [
      { key: 0, index: 0, start: 0, size: 60 },
      { key: 1, index: 1, start: 60, size: 60 },
      { key: 2, index: 2, start: 120, size: 60 },
    ],
  }),
}))

const { VirtualizedList } = await import('@/components/ui/VirtualizedList')

describe('VirtualizedList', () => {
  it('renders virtualized items', () => {
    const items = ['a', 'b', 'c']
    render(
      <VirtualizedList
        items={items}
        renderItem={(item) => <div>{item as string}</div>}
        estimateSize={60}
      />,
    )
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
    expect(screen.getByText('c')).toBeInTheDocument()
  })
})
