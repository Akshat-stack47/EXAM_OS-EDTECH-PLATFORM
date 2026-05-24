import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/trpc', () => ({
  trpc: {
    search: {
      search: {
        useQuery: () => ({
          data: { hits: [], found: 0 },
          isLoading: false,
          isFetching: false,
          error: null,
          refetch: vi.fn(),
        }),
      },
      suggest: {
        useQuery: () => ({
          data: [],
          isLoading: false,
        }),
      },
    },
  },
  createTRPCReact: () => ({}),
}))

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    lang: 'en',
    changeLanguage: vi.fn(),
  }),
}))

vi.mock('@/hooks/useSearch', () => ({
  useSearch: () => ({
    query: '',
    setQuery: vi.fn(),
    results: [],
    totalFound: 0,
    isLoading: false,
    isFetchingMore: false,
    isFetching: false,
    error: null,
    hasMore: false,
    loadMore: vi.fn(),
    reset: vi.fn(),
    refetch: vi.fn(),
    page: 1,
    debouncedQuery: '',
  }),
  useSuggestions: () => ({
    query: '',
    setQuery: vi.fn(),
    suggestions: [],
  }),
}))

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getTotalSize: () => 0,
    getVirtualItems: () => [],
  }),
}))

const { SearchBox } = await import('@/components/shared/SearchBox')

describe('SearchBox', () => {
  it('renders search input', () => {
    render(<SearchBox />)
    const input = screen.getByPlaceholderText('exam.search')
    expect(input).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<SearchBox placeholder="Custom search..." />)
    expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument()
  })

  it('renders search icon', () => {
    render(<SearchBox />)
    const svg = document.querySelector('svg.lucide-search')
    expect(svg).toBeInTheDocument()
  })
})
