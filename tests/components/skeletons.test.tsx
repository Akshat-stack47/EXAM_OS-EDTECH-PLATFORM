import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { CardSkeleton, StatsSkeleton, PageSkeleton } from '@/components/ui/skeletons'

describe('CardSkeleton', () => {
  it('renders animated placeholder', () => {
    const { container } = render(<CardSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})

describe('StatsSkeleton', () => {
  it('renders stat placeholders', () => {
    const { container } = render(<StatsSkeleton count={3} />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})

describe('PageSkeleton', () => {
  it('renders full page skeleton', () => {
    const { container } = render(<PageSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
