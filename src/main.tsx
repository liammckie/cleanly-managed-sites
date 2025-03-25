
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/auth';
import { ErrorBoundaryProvider } from './components/ui/error-boundary/useErrorBoundary';
import { Toaster } from 'sonner';

// Configure query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      meta: {
        // Use meta for error handling instead of onError
        errorCallback: (error: any) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      meta: {
        // Use meta for error handling instead of onError
        errorCallback: (error: any) => {
          console.error('Mutation error:', error);
        }
      }
    }
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundaryProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </ErrorBoundaryProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
