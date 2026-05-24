'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useDebounce } from './useDebounce'

interface SearchOptions {
  entity?: string
  filterBy?: string
  sortBy?: string
  perPage?: number
}

interface SearchResult {
  hits: any[]
  found: number
  page: number
}

export function useSearch(options?: SearchOptions) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [allHits, setAllHits] = useState<any[]>([])
  const debouncedQuery = useDebounce(query, 300)
  const hasMoreRef = useRef(true)
  const totalFoundRef = useRef(0)

  const perPage = options?.perPage || 20

  const { data, isLoading, isFetching, error, refetch } = trpc.search.search.useQuery(
    {
      query: debouncedQuery,
      entity: options?.entity,
      filterBy: options?.filterBy,
      sortBy: options?.sortBy,
      perPage,
      page,
    },
    {
      enabled: debouncedQuery.length >= 2,
      staleTime: 30_000,
    },
  )

  useEffect(() => {
    if (data) {
      totalFoundRef.current = data.found
      if (page === 1) {
        setAllHits(data.hits || [])
      } else {
        setAllHits((prev) => [...prev, ...(data.hits || [])])
      }
      hasMoreRef.current = (data.hits || []).length >= perPage
    }
  }, [data, page, perPage])

  const search = useCallback((q: string) => {
    setQuery(q)
    setPage(1)
    setAllHits([])
    hasMoreRef.current = true
  }, [])

  const loadMore = useCallback(() => {
    if (!isFetching && hasMoreRef.current) {
      setPage((p) => p + 1)
    }
  }, [isFetching])

  const reset = useCallback(() => {
    setQuery('')
    setPage(1)
    setAllHits([])
    hasMoreRef.current = true
    totalFoundRef.current = 0
  }, [])

  return {
    query,
    setQuery: search,
    results: allHits,
    totalFound: totalFoundRef.current,
    isLoading: isLoading && page === 1,
    isFetchingMore: isFetching && page > 1,
    isFetching,
    error,
    hasMore: hasMoreRef.current,
    loadMore,
    reset,
    refetch,
    page,
    debouncedQuery,
  }
}

export function useSuggestions() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 250)

  const { data } = trpc.search.suggest.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2, staleTime: 60_000 },
  )

  return {
    query,
    setQuery,
    suggestions: data || [],
  }
}

export function useSearchReindex() {
  const utils = trpc.useUtils()
  const reindexMut = trpc.search.reindex.useMutation({
    onSuccess: () => {
      utils.search.search.invalidate()
    },
  })
  const syncMut = trpc.search.sync.useMutation()
  const initMut = trpc.search.init.useMutation()

  return {
    reindexAll: () => reindexMut.mutateAsync({ entity: 'all' }),
    reindexEntity: (entity: 'exams' | 'students' | 'whiteboards' | 'health_surveys') =>
      reindexMut.mutateAsync({ entity }),
    syncDocument: (entity: any, action: 'upsert' | 'delete', id: string) =>
      syncMut.mutateAsync({ entity, action, id }),
    initCollections: () => initMut.mutateAsync(),
    isReindexing: reindexMut.isPending,
  }
}
