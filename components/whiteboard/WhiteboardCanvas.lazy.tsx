import dynamic from 'next/dynamic'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const WhiteboardCanvasInner = dynamic(
  () => import('@/components/whiteboard/WhiteboardCanvas').then((m) => ({ default: m.WhiteboardCanvas })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Whiteboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center animate-pulse">
            <p className="text-gray-400 text-sm">Loading whiteboard...</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
)

export default WhiteboardCanvasInner
