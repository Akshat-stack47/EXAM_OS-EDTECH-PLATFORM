import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { WhiteboardCanvas } from '@/components/whiteboard/WhiteboardCanvas'

describe('WhiteboardCanvas', () => {
  it('renders canvas area', () => {
    render(<WhiteboardCanvas />)
    expect(screen.getByText('Collaborative whiteboard area')).toBeInTheDocument()
  })

  it('displays session id when provided', () => {
    render(<WhiteboardCanvas sessionId="abc12345xyz" />)
    expect(screen.getByText(/Session abc12345/)).toBeInTheDocument()
  })
})
