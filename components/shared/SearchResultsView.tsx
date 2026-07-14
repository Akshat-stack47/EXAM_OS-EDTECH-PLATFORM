'use client'

import { Search, FileText, User, Monitor, Heart, ExternalLink } from 'lucide-react'
import { InfiniteScrollList } from './InfiniteScrollList'

interface SearchResultsViewProps {
  query: string
  results: any[]
  totalFound: number
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
  onItemClick?: (item: any) => void
}

const ICON_MAP: Record<string, typeof FileText> = {
  exams: FileText,
  students: User,
  whiteboards: Monitor,
  health_surveys: Heart,
}

const LABEL_MAP: Record<string, string> = {
  exams: 'Exam Cutoff',
  students: 'Student',
  whiteboards: 'Whiteboard',
  health_surveys: 'Health Survey',
}

const COLOR_MAP: Record<string, string> = {
  exams: 'border-l-blue-500 bg-blue-50/50',
  students: 'border-l-green-500 bg-green-50/50',
  whiteboards: 'border-l-purple-500 bg-purple-50/50',
  health_surveys: 'border-l-rose-500 bg-rose-50/50',
}

export function SearchResultsView({
  query,
  results,
  totalFound,
  isLoading,
  hasMore,
  loadMore,
  onItemClick,
}: SearchResultsViewProps) {
  if (!query || query.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Search className="size-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">Search across exams, students, whiteboards &amp; more</p>
        <p className="text-sm mt-1">Type at least 2 characters to start searching</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{totalFound}</span>
        <span>results for</span>
        <span className="font-medium text-foreground">&quot;{query}&quot;</span>
      </div>

      <InfiniteScrollList
        items={results}
        renderItem={(item, idx) => {
          const doc = item.document || item
          const col = item.collection || 'exams'
          const Icon = ICON_MAP[col] || FileText
          const label = LABEL_MAP[col] || col
          const colors = COLOR_MAP[col] || COLOR_MAP.exams

          return (
            <button
              onClick={() => onItemClick?.(item)}
              className={`w-full flex items-start gap-4 px-4 py-3 border-l-4 ${colors} hover:brightness-95 transition-all text-left border-b border-border/50 last:border-0`}
            >
              <Icon className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {doc.examName || doc.title || doc.name || doc.notes?.slice(0, 80) || 'Untitled'}
                  </p>
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground/50" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                    {label}
                  </span>
                  {doc.examYear && (
                    <span className="text-xs text-muted-foreground">{doc.examYear}</span>
                  )}
                  {doc.stage && (
                    <span className="text-xs text-muted-foreground">· {doc.stage}</span>
                  )}
                  {doc.status && (
                    <span className="text-xs text-muted-foreground">· {doc.status}</span>
                  )}
                  {doc.targetExam && (
                    <span className="text-xs text-muted-foreground">· {doc.targetExam}</span>
                  )}
                </div>
              </div>
            </button>
          )
        }}
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        estimateSize={72}
        emptyMessage={`No results found for "${query}"`}
        className="rounded-xl border"
      />

      {isLoading && results.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Searching...</span>
          </div>
        </div>
      )}
    </div>
  )
}
