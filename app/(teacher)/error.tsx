'use client'

export default function TeacherError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1B3A5C] mb-2">Dashboard error</h2>
        <p className="text-gray-500 mb-4">Something went wrong loading your dashboard</p>
        <button onClick={reset} className="px-4 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm hover:bg-[#2C5F8A]">
          Try again
        </button>
      </div>
    </div>
  )
}
