import { describe, it, expect, vi } from 'vitest'

vi.mock('@/server/services/ai.service', () => ({
  aiService: {
    chat: vi.fn().mockResolvedValue({ reply: 'AI response here' }),
  },
}))

vi.mock('@/lib/redis', () => ({
  ratelimit: { api: { limit: vi.fn().mockResolvedValue({ success: true }) } },
}))

const { aiRouter } = await import('@/server/routers/ai')

describe('aiRouter.chat', () => {
  it('returns AI reply', async () => {
    const caller = aiRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.chat({ message: 'What is UPSC?' })
    expect(result.reply).toBeDefined()
  })
})
