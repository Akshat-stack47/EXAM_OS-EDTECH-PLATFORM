'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Loader2 } from 'lucide-react'

interface InfiniteScrollListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  loadMore: () => void
  hasMore: boolean
  isLoading: boolean
  estimateSize?: number
  overscan?: number
  className?: string
  maxHeight?: string | number
  emptyMessage?: string
  loadingComponent?: React.ReactNode
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  estimateSize = 64,
  overscan = 5,
  className = '',
  maxHeight = '70vh',
  emptyMessage = 'No items found',
  loadingComponent,
}: InfiniteScrollListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  const handleScroll = useCallback(() => {
    const el = parentRef.current
    if (!el || !hasMore || isLoading) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 400) {
      loadMore()
    }
  }, [hasMore, isLoading, loadMore])

  useEffect(() => {
    if (!loadingRef.current || !hasMore || isLoading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(loadingRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoading, loadMore])

  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ maxHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={loadingRef} className="flex items-center justify-center py-4">
          {loadingComponent || (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="py-4 text-center text-xs text-muted-foreground">
          All {items.length} items loaded
        </div>
      )}
    </div>
  )
}
