import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mockChangeLanguage = vi.fn()

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    lang: 'en',
    changeLanguage: mockChangeLanguage,
  }),
}))

const { LanguageToggle } = await import('@/components/shared/LanguageToggle')

describe('LanguageToggle', () => {
  it('shows Hindi text when lang is en', () => {
    render(<LanguageToggle />)
    expect(screen.getByText('हिं')).toBeInTheDocument()
  })

  it('calls changeLanguage on click', async () => {
    const user = userEvent.setup()
    render(<LanguageToggle />)
    await user.click(screen.getByText('हिं'))
    expect(mockChangeLanguage).toHaveBeenCalledWith('hi')
  })
})
