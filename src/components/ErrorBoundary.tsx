import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught component error:', error, errorInfo);

    // Detect dynamic chunk import failures (e.g. after a new Vercel deployment)
    const isChunkLoadError =
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch') ||
      error?.name === 'ChunkLoadError' ||
      error?.name === 'TypeError';

    if (isChunkLoadError) {
      const retryKey = 'avirena_eb_reload_' + window.location.pathname;
      const lastRetry = sessionStorage.getItem(retryKey);
      if (!lastRetry) {
        sessionStorage.setItem(retryKey, 'true');
        console.warn('[ErrorBoundary] Auto-reloading to fetch updated application assets...');
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    // Clear retry flags and reload fresh
    sessionStorage.removeItem('avirena_eb_reload_' + window.location.pathname);
    sessionStorage.removeItem('avirena_preload_retry');
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#E7E4D5] text-[#413C23] select-none font-sans-body">
          <div className="max-w-md space-y-5 bg-[#FAF8F5] border border-[#D8D2C2] p-8 sm:p-10 rounded-xs shadow-md">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8F896D] block">
              AVIRENA • Studio Notice
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-light text-[#413C23]">
              New Collection Updates Available
            </h2>
            <p className="text-xs sm:text-sm text-[#413C23]/80 leading-relaxed">
              We just published new jewelry items and platform updates. Please refresh your page to load the latest high-resolution pieces.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all cursor-pointer shadow-xs"
              >
                Refresh Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-[#D8D2C2] text-[#413C23] hover:border-black text-xs uppercase tracking-wider font-semibold rounded-xs transition-all cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
