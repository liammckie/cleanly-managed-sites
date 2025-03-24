
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Something went wrong'
}: ErrorFallbackProps) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm font-medium text-foreground">Error details:</p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t bg-muted/50 px-6 py-4">
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Reload Page
        </Button>
        <Button 
          onClick={resetErrorBoundary}
          className="gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
}
