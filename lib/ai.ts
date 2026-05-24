import { safeAICall, safeStreamAICall } from '@/lib/ai-safe'
import { EXAMOS_SYSTEM_CONTEXT } from '@/lib/constants'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string }>
}

export const ai = {
  chat: async (messages: ChatMessage[], _options?: { userId?: string; feature?: string }) => {
    const lastMessage = messages[messages.length - 1]
    const prompt = typeof lastMessage?.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage?.content)
    const hasSystem = messages.some((m) => m.role === 'system')
    return safeAICall({
      prompt,
      userId: _options?.userId ?? 'anonymous',
      feature: _options?.feature ?? 'chat',
      systemPrompt: hasSystem ? undefined : EXAMOS_SYSTEM_CONTEXT,
    })
  },
  generateStructured: async (prompt: string, _schema: any) => {
    const text = await safeAICall({ prompt, userId: 'anonymous', feature: 'structured', systemPrompt: EXAMOS_SYSTEM_CONTEXT })
    try { return JSON.parse(text) } catch { return {} }
  },
  stream: safeStreamAICall,
}
