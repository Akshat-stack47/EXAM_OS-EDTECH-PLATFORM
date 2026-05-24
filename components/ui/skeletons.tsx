export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
      </div>
    </div>
  )
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl bg-gray-900 p-4 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-16 mb-2" />
          <div className="h-3 bg-gray-700 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-8 bg-gray-200 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded" />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-48 bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-64 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    </div>
  )
}
