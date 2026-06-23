import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, info)
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-fallback">
          <p>Something went wrong. Please try again.</p>
          <button id="error-retry" onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
