
import React, { useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Create a context for the error boundary
const ErrorBoundaryContext = React.createContext<{
  showBoundary: (error: Error) => void;
  clearError: () => void;
  lastError: Error | null;
} | null>(null);

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
  logErrors?: boolean;
  showToasts?: boolean;
}

// This state is used to trigger a re-render that will throw the error
interface ErrorBoundaryProviderState {
  hasError: boolean;
  error: Error | null;
}

export function ErrorBoundaryProvider({ 
  children, 
  logErrors = true,
  showToasts = true 
}: ErrorBoundaryProviderProps) {
  const [state, setState] = useState<ErrorBoundaryProviderState>({
    hasError: false,
    error: null,
  });

  // Show error in toast if enabled
  useEffect(() => {
    if (state.hasError && state.error && showToasts) {
      toast.error(`Error: ${state.error.message}`, {
        description: 'The application encountered an error.',
        duration: 5000,
      });
    }
  }, [state.hasError, state.error, showToasts]);

  // Log error if enabled
  useEffect(() => {
    if (state.hasError && state.error && logErrors) {
      console.error('Error from useErrorBoundary:', state.error);
    }
  }, [state.hasError, state.error, logErrors]);

  const showBoundary = useCallback((error: Error) => {
    setState({ hasError: true, error });
  }, []);

  const clearError = useCallback(() => {
    setState({ hasError: false, error: null });
  }, []);

  // If an error was set, throw it during render so the error boundary will catch it
  if (state.hasError) {
    throw state.error;
  }

  return (
    <ErrorBoundaryContext.Provider value={{ 
      showBoundary, 
      clearError,
      lastError: state.error 
    }}>
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
