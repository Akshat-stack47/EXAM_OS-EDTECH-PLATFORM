'use client'

import { useState, useCallback } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchBox } from '@/components/shared/SearchBox'
import Link from 'next/link'

const EXAM_CATEGORIES = ['UPSC', 'SSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'JEE', 'NEET', 'DEFENCE'] as const

export function ExamsClient() {
  const [selected, setSelected] = useState<string | null>(null)
  const { data: exams, isLoading } = trpc.exam.list.useQuery(
    selected ? { examName: selected } : undefined,
  )

  return (
    <>
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Back to Home</Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Exam Cutoff Data</h1>
            <p className="text-gray-500 mt-1">Historical cutoff marks across all major Indian exams</p>
          </div>
          <div className="w-72 hidden md:block">
            <SearchBox entity="exams" className="w-full" />
          </div>
        </div>
      </header>

      <div className="flex gap-2 flex-wrap mb-6">
        {EXAM_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(selected === cat ? null : cat)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
              selected === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Loading exam data...</div>
      ) : !exams || exams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No cutoff data yet</h2>
            <p className="text-gray-400 text-sm">Exam cutoff data will appear here once imported</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam: any) => (
            <Card key={exam.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{exam.examName} ({exam.examYear})</span>
                  <span className="text-sm font-normal text-gray-500">{exam.stage}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                  <div><span className="text-gray-400">General</span><div className="font-bold">{exam.general ?? '—'}</div></div>
                  <div><span className="text-gray-400">OBC</span><div className="font-bold">{exam.obc ?? '—'}</div></div>
                  <div><span className="text-gray-400">SC</span><div className="font-bold">{exam.sc ?? '—'}</div></div>
                  <div><span className="text-gray-400">ST</span><div className="font-bold">{exam.st ?? '—'}</div></div>
                  <div><span className="text-gray-400">EWS</span><div className="font-bold">{exam.ews ?? '—'}</div></div>
                  <div><span className="text-gray-400">PwD</span><div className="font-bold">{exam.pwd ?? '—'}</div></div>
                </div>
                <div className="mt-3 text-xs text-gray-400">Max Marks: {exam.totalMarks}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
