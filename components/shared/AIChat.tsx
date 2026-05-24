'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AIChatProps {
  onSend?: (message: string) => Promise<string>
}

export const AIChat = ({ onSend }: AIChatProps) => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])

    if (onSend) {
      setLoading(true)
      try {
        const reply = await onSend(userMsg)
        setMessages(prev => [...prev, { role: 'ai', text: reply }])
      } catch {
        setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error.' }])
      }
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 space-y-2 border rounded-lg p-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Ask me anything about your exams</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-white border text-gray-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-400 text-sm text-center">Thinking...</p>}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} size="sm">Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}
