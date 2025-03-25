
import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface LoadingErrorStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: any;
  onRetry?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LoadingErrorState({
  isLoading,
  isError,
  error,
  onRetry,
  loadingMessage = 'Loading data...',
  errorTitle = 'Error loading data',
  errorMessage,
  children,
  className = ''
}: LoadingErrorStateProps) {
  // Parse error message if available
  const parsedErrorMessage = errorMessage || (error?.message || 'An unexpected error occurred');
  
  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-lg font-medium text-center">{loadingMessage}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">{errorTitle}</h3>
            <p className="text-muted-foreground">{parsedErrorMessage}</p>
          </div>
        </CardContent>
        {onRetry && (
          <CardFooter className="flex justify-center border-t pt-4">
            <Button onClick={onRetry}>
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
  
  return <>{children}</>;
}

export default LoadingErrorState;
