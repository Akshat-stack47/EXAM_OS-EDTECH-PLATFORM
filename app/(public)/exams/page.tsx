import { Suspense } from 'react'
import { ExamsClient } from './ExamsClient'

export const revalidate = 86400

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <Suspense fallback={<ExamsSkeleton />}>
          <ExamsClient />
        </Suspense>
      </div>
    </div>
  )
}

function ExamsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full w-24" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-xl" />
      ))}
    </div>
  )
}
