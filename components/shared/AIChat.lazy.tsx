import dynamic from 'next/dynamic'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const AIChatInner = dynamic(
  () => import('@/components/shared/AIChat').then((m) => ({ default: m.AIChat })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 border rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading AI assistant...</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
)

export default AIChatInner
