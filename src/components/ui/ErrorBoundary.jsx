import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-tazo-bg p-6 text-center">
          <div className="w-20 h-20 bg-tazo-red/10 rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="text-2xl font-display text-tazo-text mb-2">Oups ! Quelque chose a mal tourné.</h1>
          <p className="text-tazo-muted2 mb-8 max-w-md">
            L'application a rencontré une erreur inattendue. Essaie de recharger la page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-tazo-accent text-white rounded-xl font-medium hover:bg-tazo-accent/90 transition-colors"
          >
            Recharger la page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-black/40 rounded-lg text-left text-xs text-tazo-red overflow-auto max-w-full font-mono">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
