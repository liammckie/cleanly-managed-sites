
import React, { useContext, useState, useCallback } from 'react';

// Create a context for the error boundary
const ErrorBoundaryContext = React.createContext<{
  showBoundary: (error: Error) => void;
} | null>(null);

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

// This state is used to trigger a re-render that will throw the error
interface ErrorBoundaryProviderState {
  hasError: boolean;
  error: Error | null;
}

export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  const [state, setState] = useState<ErrorBoundaryProviderState>({
    hasError: false,
    error: null,
  });

  const showBoundary = useCallback((error: Error) => {
    setState({ hasError: true, error });
  }, []);

  // If an error was set, throw it during render so the error boundary will catch it
  if (state.hasError) {
    throw state.error;
  }

  return (
    <ErrorBoundaryContext.Provider value={{ showBoundary }}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
}

export function useErrorBoundary() {
  const context = useContext(ErrorBoundaryContext);
  
  if (context === null) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
  }
  
  return context;
}
