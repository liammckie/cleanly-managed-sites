
import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  fullPage?: boolean;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  showHomeButton = true,
  showBackButton = true,
  fullPage = false
}: ErrorFallbackProps) {
  const navigate = useNavigate();
  
  // Extract error code if available
  const errorCode = (error as any).status || (error as any).code || 'ERR';
  const isNetworkError = error.message.includes('network') || error.message.includes('fetch');
  
  const handleRetry = () => {
    resetErrorBoundary();
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const errorContent = (
    <Card className={fullPage ? "mx-auto max-w-lg shadow-lg" : "w-full"}>
      <CardHeader className="bg-destructive/10">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error {errorCode}</AlertTitle>
          <AlertDescription>
            {isNetworkError 
              ? 'Unable to connect to the server. Please check your internet connection.'
              : error.message || 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
        
        {process.env.NODE_ENV !== 'production' && error.stack && (
          <div className="rounded-md bg-muted p-4 mt-2">
            <p className="text-sm font-medium text-foreground">Error details (development only):</p>
            <pre className="mt-1 text-xs overflow-auto whitespace-pre-wrap text-muted-foreground">
              {error.stack}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 border-t bg-muted/50 px-6 py-4">
        {showBackButton && (
          <Button 
            onClick={handleGoBack} 
            variant="outline"
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        )}
        
        {showHomeButton && (
          <Button 
            onClick={handleGoHome} 
            variant="outline"
            className="gap-1"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        )}
        
        <Button 
          onClick={handleRetry}
          className="gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
  
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        {errorContent}
      </div>
    );
  }
  
  return errorContent;
}
