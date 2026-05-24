import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { AIChat } from '@/components/shared/AIChat'

describe('AIChat', () => {
  it('renders empty state', () => {
    render(<AIChat />)
    expect(screen.getByText('Ask me anything about your exams')).toBeInTheDocument()
  })

  it('renders input and send button', () => {
    render(<AIChat />)
    expect(screen.getByPlaceholderText('Type your question...')).toBeInTheDocument()
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('disables send button when input is empty', () => {
    render(<AIChat />)
    const button = screen.getByText('Send')
    expect(button).toBeDisabled()
  })

  it('calls onSend when message is sent', async () => {
    const onSend = vi.fn().mockResolvedValue('Reply')
    const user = userEvent.setup()
    render(<AIChat onSend={onSend} />)

    const input = screen.getByPlaceholderText('Type your question...')
    await user.type(input, 'Hello')
    await user.click(screen.getByText('Send'))

    expect(onSend).toHaveBeenCalledWith('Hello')
  })

  it('displays user message and AI response', async () => {
    const onSend = vi.fn().mockResolvedValue('This is the AI reply')
    const user = userEvent.setup()
    render(<AIChat onSend={onSend} />)

    const input = screen.getByPlaceholderText('Type your question...')
    await user.type(input, 'What is UPSC?')
    await user.click(screen.getByText('Send'))

    expect(await screen.findByText('What is UPSC?')).toBeInTheDocument()
    expect(await screen.findByText('This is the AI reply')).toBeInTheDocument()
  })

  it('clears input after sending', async () => {
    const onSend = vi.fn().mockResolvedValue('Reply')
    const user = userEvent.setup()
    render(<AIChat onSend={onSend} />)

    const input = screen.getByPlaceholderText('Type your question...')
    await user.type(input, 'Hello')
    await user.click(screen.getByText('Send'))

    expect(input).toHaveValue('')
  })
})
