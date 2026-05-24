'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  section?: string
}

interface State {
  hasError: boolean
  errorId?: string
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      extra: {
        componentStack: info.componentStack,
        section: this.props.section,
      },
    })
    this.setState({ errorId: eventId })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400 font-medium">
            {this.props.section
              ? `${this.props.section} is temporarily unavailable`
              : 'Something went wrong'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Our team has been notified.
            {this.state.errorId && (
              <span className="font-mono ml-1">(#{this.state.errorId.slice(0, 8)})</span>
            )}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-xs text-blue-400 underline"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
