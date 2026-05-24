'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const SCORE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const QUESTIONS: { key: string; label: string; low: string; high: string; invert?: boolean }[] = [
  { key: 'moodScore', label: 'How would you rate your mood this week?', low: 'Very Low', high: 'Excellent' },
  { key: 'sleepScore', label: 'How has your sleep been?', low: 'Poor', high: 'Great' },
  { key: 'anxietyScore', label: 'How anxious have you been feeling?', low: 'Calm', high: 'Very Anxious', invert: true },
  { key: 'motivationScore', label: 'How motivated are you to study?', low: 'Not at all', high: 'Highly Motivated' },
]

export default function HealthSurveyPageClient() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [wantsCounselor, setWantsCounselor] = useState(false)
  const [notes, setNotes] = useState('')

  const submitSurvey = trpc.health.submitSurvey.useMutation()
  const { data: latest, isLoading } = trpc.health.getLatest.useQuery()

  const allAnswered = QUESTIONS.every((q) => scores[q.key] !== undefined)

  const handleSubmit = async () => {
    if (!allAnswered) return
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    await submitSurvey.mutateAsync({
      weekStart: weekStart.toISOString().split('T')[0],
      moodScore: scores.moodScore,
      sleepScore: scores.sleepScore,
      anxietyScore: scores.anxietyScore,
      motivationScore: scores.motivationScore,
      wantsCounselor,
      notes: notes || undefined,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-3xl mx-auto">
      <Link href="/student/dashboard" className="text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</Link>

      <div className="mt-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Weekly Health Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {QUESTIONS.map((q) => (
              <div key={q.key}>
                <p className="font-medium text-gray-800 mb-2">{q.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16 text-right">{q.invert ? q.high : q.low}</span>
                  <div className="flex gap-1 flex-1 justify-center">
                    {SCORE_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setScores((prev) => ({ ...prev, [q.key]: n }))}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                          scores[q.key] === n
                            ? q.invert
                              ? 'bg-red-500 text-white scale-110'
                              : 'bg-green-500 text-white scale-110'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 w-16">{q.invert ? q.low : q.high}</span>
                </div>
              </div>
            ))}

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantsCounselor}
                  onChange={(e) => setWantsCounselor(e.target.checked)}
                  className="w-4 h-4 accent-gray-900"
                />
                <span className="text-sm text-gray-700">I&apos;d like to speak with a counselor</span>
              </label>
            </div>

            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about how you're feeling (optional)"
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 h-24 resize-none"
              />
            </div>

            <Button onClick={handleSubmit} disabled={!allAnswered || submitSurvey.isPending} className="w-full">
              {submitSurvey.isPending ? 'Submitting...' : 'Submit Health Check'}
            </Button>

            {submitSurvey.isSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
                Health check submitted successfully! Your well-being matters.
              </div>
            )}
          </CardContent>
        </Card>

        {latest && !submitSurvey.isSuccess && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Previous Check</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p>Mood: {latest.moodScore}/10 · Sleep: {latest.sleepScore}/10 · Anxiety: {latest.anxietyScore}/10 · Motivation: {latest.motivationScore}/10</p>
              <p className={`mt-1 font-medium ${latest.riskLevel === 'LOW' ? 'text-green-600' : latest.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'}`}>
                Risk Level: {latest.riskLevel}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
