'use client'

export default function CoordinatorError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Dashboard error</h2>
        <p className="text-[#8B949E] mb-4">Something went wrong loading the control center</p>
        <button onClick={reset} className="px-4 py-2 bg-[#58A6FF] text-white rounded-lg text-sm hover:bg-[#4A90D9]">
          Try again
        </button>
      </div>
    </div>
  )
}
