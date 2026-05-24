'use client'

import { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const HealthSurveyModal = ({ onClose }: { onClose: () => void }) => {
  const handleSubmit = useCallback(async () => {
    onClose()
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Weekly Health Check-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">Track your mental and physical well-being.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Skip</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const MentalHealthWidget = () => {
  return (
    <Card>
      <CardContent className="py-6 text-center">
        <div className="text-3xl font-bold text-gray-900">Good</div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Mental Wellness</p>
      </CardContent>
    </Card>
  )
}
