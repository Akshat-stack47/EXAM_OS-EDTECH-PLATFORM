import { Suspense } from 'react'
import { SearchPageClient } from './SearchPageClient'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading search...</div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}
