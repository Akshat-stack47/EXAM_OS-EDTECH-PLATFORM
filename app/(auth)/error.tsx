'use client'

export default function AuthError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-4">Please try again</p>
        <button onClick={reset} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
          Try again
        </button>
      </div>
    </div>
  )
}
