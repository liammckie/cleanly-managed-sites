
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface GlobalErrorPageProps {
  error?: Error;
  statusCode?: string;
  message?: string;
}

export function GlobalErrorPage({ 
  error,
  statusCode = 'Error',
  message = 'An unexpected error occurred'
}: GlobalErrorPageProps) {
  const navigate = useNavigate();
  
  // Use provided error message or default
  const errorMessage = error?.message || message;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="mx-auto max-w-lg shadow-lg">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {statusCode === '404' ? 'Page Not Found' : 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-muted rounded-full">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">{statusCode}</h2>
            <p className="text-lg text-muted-foreground">{errorMessage}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-2 border-t bg-muted/50 px-6 py-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="gap-1"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default GlobalErrorPage;
