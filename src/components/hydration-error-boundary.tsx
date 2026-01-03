'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary component to catch and gracefully handle hydration errors.
 * 
 * Hydration errors occur when the server-rendered HTML doesn't match the
 * client-side React tree. This can happen due to:
 * - Browser extensions injecting attributes
 * - Time-based content (Date.now(), Math.random())
 * - Locale-specific date formatting
 * - Invalid HTML nesting
 * 
 * This boundary provides a user-friendly error message and option to reload.
 */
export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[DEBUG HydrationErrorBoundary] Error caught:', error.message)
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.group('[Hydration Error Boundary]')
    console.error('Hydration error caught:', error)
    console.error('Error info:', errorInfo)
    console.groupEnd()

    // Update state with error info
    this.setState({
      errorInfo,
    })

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  handleReload = () => {
    // Reload the page to recover from hydration error
    window.location.reload()
  }

  handleDismiss = () => {
    // Attempt to recover by resetting error state
    // This might work if the error was transient
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Hydration Error</CardTitle>
                  <CardDescription>
                    There was a mismatch between the server and client rendering
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This error is usually caused by browser extensions injecting attributes
                  into the page. It's not a bug in the application itself.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Error Details (Development Only):</h4>
                  <pre className="text-xs overflow-auto bg-gray-100 dark:bg-gray-900 p-2 rounded">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs font-semibold cursor-pointer">
                        Component Stack
                      </summary>
                      <pre className="text-xs overflow-auto bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={this.handleReload}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  Try to Continue
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                If this error persists, try disabling browser extensions or using incognito mode.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * HOC to wrap a component with the HydrationErrorBoundary
 */
export function withHydrationErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithHydrationErrorBoundary(props: P) {
    return (
      <HydrationErrorBoundary fallback={fallback}>
        <Component {...props} />
      </HydrationErrorBoundary>
    )
  }
}
