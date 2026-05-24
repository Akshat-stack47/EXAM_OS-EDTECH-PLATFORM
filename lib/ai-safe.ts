import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, streamText } from 'ai'
import { AppError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import {
  AI_MAX_TOKENS,
  AI_TEMPERATURE,
  AI_TIMEOUT_SECONDS,
  AI_RETRY_ATTEMPTS,
  AI_RETRY_DELAY_MS,
} from '@/lib/constants'

interface AICallOptions {
  prompt: string
  systemPrompt?: string
  userId: string
  feature: string
  useStreaming?: boolean
  fallbackMessage?: string
}

async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = AI_RETRY_ATTEMPTS,
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === attempts - 1) throw error
      await new Promise((r) => setTimeout(r, AI_RETRY_DELAY_MS * Math.pow(2, i)))
    }
  }
  throw new Error('Max retries exceeded')
}

export async function safeAICall(options: AICallOptions): Promise<string> {
  const { prompt, systemPrompt, userId, feature, fallbackMessage } = options

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI timeout')), AI_TIMEOUT_SECONDS * 1000),
  )

  try {
    const result = await Promise.race([
      withRetry(() =>
        generateText({
          model: openai('gpt-4o'),
          prompt,
          system: systemPrompt,
          temperature: AI_TEMPERATURE,
        }),
      ),
      timeoutPromise,
    ])

    logger.info('ai call success', {
      action: `${feature}_success`,
      userId,
      metadata: { feature, promptLength: prompt.length },
    })

    return result.text
  } catch (primaryError) {
    logger.warn('ai primary failed, trying fallback', {
      action: `${feature}_primary_failed_trying_fallback`,
      userId,
      metadata: { feature, error: String(primaryError) },
    })

    try {
      const result = await Promise.race([
        withRetry(() =>
          generateText({
            model: anthropic('claude-sonnet-4-6'),
            prompt,
            system: systemPrompt,
            temperature: AI_TEMPERATURE,
          }),
        ),
        timeoutPromise,
      ])
      return result.text
    } catch (fallbackError) {
      logger.error('ai all providers failed', {
        action: `${feature}_all_providers_failed`,
        userId,
        metadata: { feature, error: String(fallbackError) },
      })

      return (
        fallbackMessage ??
        'AI mentor is temporarily unavailable. Please try again in a few minutes.'
      )
    }
  }
}

export async function safeStreamAICall(options: Omit<AICallOptions, 'useStreaming'>) {
  const { prompt, systemPrompt, userId, feature } = options

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      prompt,
      system: systemPrompt,
      temperature: AI_TEMPERATURE,
    })

    logger.info('ai stream started', {
      action: `${feature}_stream_started`,
      userId,
      metadata: { feature },
    })

    return result
  } catch (error) {
    logger.error('ai stream failed', {
      action: `${feature}_stream_failed`,
      userId,
      metadata: { error: String(error) },
    })
    throw AppError.aiError('AI service temporarily unavailable')
  }
}
