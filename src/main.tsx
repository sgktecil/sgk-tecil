import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 text-slate-800">
          <div className="max-w-md p-6 bg-white rounded-2xl shadow-xl border border-slate-200 text-center space-y-4">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-lg font-bold">Uygulama Yüklenirken Bir Hata Oluştu</h2>
            <p className="text-xs text-slate-500 font-mono bg-slate-100 p-3 rounded-lg text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Bilinmeyen bir hata'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-700 transition-colors"
            >
              Yeniden Yükle
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
