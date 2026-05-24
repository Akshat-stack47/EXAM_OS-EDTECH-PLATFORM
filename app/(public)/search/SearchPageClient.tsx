'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { SearchResultsView } from '@/components/shared/SearchResultsView'

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const initialEntity = searchParams.get('entity') || undefined

  const { query, setQuery, results, totalFound, isLoading, hasMore, loadMore } = useSearch({
    entity: initialEntity,
    perPage: 20,
  })

  useMemo(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      router.replace(`/search?${params.toString()}`)
    },
    [query, router],
  )

  const handleItemClick = useCallback(
    (item: any) => {
      const doc = item.document || item
      if (doc.id) {
        const base = item.collection === 'exams' ? '/exams' : `/search`
        router.push(`${base}?id=${doc.id}`)
      }
    },
    [router],
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Search</h1>
          <p className="text-sm text-muted-foreground">
            Search across exams, students, whiteboards, and health surveys
          </p>
        </header>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="pl-10 py-6 text-base"
            autoFocus
          />
        </form>

        <SearchResultsView
          query={query}
          results={results}
          totalFound={totalFound}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  )
}
