'use client'

export default function StudentError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard error</h2>
        <p className="text-gray-500 mb-4">Something went wrong loading your data</p>
        <button onClick={reset} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
          Try again
        </button>
      </div>
    </div>
  )
}
