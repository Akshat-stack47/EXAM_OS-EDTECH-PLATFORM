'use client'

export default function ParentError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Dashboard error</h2>
        <p className="text-gray-500 mb-4">Something went wrong loading your dashboard</p>
        <button onClick={reset} className="px-4 py-2 bg-[#E88D2A] text-white rounded-lg text-sm hover:bg-[#D67A1E]">
          Try again
        </button>
      </div>
    </div>
  )
}
