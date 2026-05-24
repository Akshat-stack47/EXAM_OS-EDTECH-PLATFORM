'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const WhiteboardCanvas = ({ sessionId }: { sessionId?: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Whiteboard {sessionId ? `— Session ${sessionId.slice(0, 8)}` : ''}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-96 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">Collaborative whiteboard area</p>
      </div>
    </CardContent>
  </Card>
)
