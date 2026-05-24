'use client'

import React, { useEffect } from 'react'
import { useStudyTimerStore } from '@/stores/useStudyTimerStore'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const StudyTimer = React.memo(() => {
  const { timeLeft, isActive, startTimer, pauseTimer, resetTimer, tick } = useStudyTimerStore()

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isActive, tick])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">Study Timer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-mono text-center mb-4 text-gray-900">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex gap-2 justify-center">
          {!isActive ? (
            <Button onClick={startTimer}>Start</Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline">Pause</Button>
          )}
          <Button onClick={resetTimer} variant="outline">Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
})
