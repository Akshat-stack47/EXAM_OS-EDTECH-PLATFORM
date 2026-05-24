declare module 'posthog-js' {
  interface PostHogConfig {
    api_host?: string
    person_profiles?: 'identified_only' | 'always'
    loaded?: (ph: PostHog) => void
  }

  interface PostHog {
    init(apiKey: string, options?: PostHogConfig): void
    capture(event: string, properties?: Record<string, unknown>): void
    identify(userId: string, properties?: Record<string, unknown>): void
    reset(): void
    debug(): void
  }

  const posthog: PostHog
  export default posthog
}
