'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Search, X, Loader2, FileText, User, Monitor, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSearch } from '@/hooks/useSearch'
import { useTranslation } from '@/hooks/useTranslation'
import { useVirtualizer } from '@tanstack/react-virtual'

const ICON_MAP: Record<string, typeof FileText> = {
  exams: FileText,
  students: User,
  whiteboards: Monitor,
  health_surveys: Heart,
}

const LABEL_MAP: Record<string, string> = {
  exams: 'Exams',
  students: 'Students',
  whiteboards: 'Whiteboards',
  health_surveys: 'Health',
}

interface SearchBoxProps {
  entity?: string
  placeholder?: string
  autoFocus?: boolean
  className?: string
  onSelect?: (item: any) => void
}

export function SearchBox({ entity, placeholder, autoFocus, className = '', onSelect }: SearchBoxProps) {
  const { query, setQuery, results, isLoading, hasMore, loadMore, reset } = useSearch({
    entity,
    perPage: 20,
  })
  const { t } = useTranslation()
  const parentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const virtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  })

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus()
  }, [autoFocus])

  const handleScroll = useCallback(() => {
    const el = parentRef.current
    if (!el || !hasMore || isLoading) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
      loadMore()
    }
  }, [hasMore, isLoading, loadMore])

  const handleSelect = useCallback(
    (item: any) => {
      onSelect?.(item)
      setQuery('')
    },
    [onSelect, setQuery],
  )

  const showDropdown = query.length >= 2

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('exam.search')}
          className="pl-9 pr-8"
        />
        {query && (
          <button
            onClick={reset}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-card rounded-xl border shadow-lg overflow-hidden">
          {isLoading && results.length === 0 ? (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found
            </div>
          ) : (
            <div
              ref={parentRef}
              className="max-h-80 overflow-auto"
              onScroll={handleScroll}
            >
              <div
                style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = results[virtualItem.index]
                  const doc = item.document || item
                  const col = item.collection || entity || 'exams'
                  const Icon = ICON_MAP[col] || FileText
                  const label = LABEL_MAP[col] || col

                  return (
                    <button
                      key={virtualItem.key}
                      onClick={() => handleSelect(item)}
                      className="absolute left-0 w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <Icon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {doc.examName || doc.title || doc.name || doc.notes?.slice(0, 60)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {label}
                          {doc.examYear ? ` · ${doc.examYear}` : ''}
                          {doc.stage ? ` · ${doc.stage}` : ''}
                          {doc.status ? ` · ${doc.status}` : ''}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              {isLoading && results.length > 0 && (
                <div className="flex items-center justify-center p-3 border-t border-border/50">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
