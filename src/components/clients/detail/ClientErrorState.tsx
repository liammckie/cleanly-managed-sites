
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ClientErrorStateProps {
  error: any;
}

export function ClientErrorState({ error }: ClientErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-lg p-8 text-center border border-border bg-card">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
      <h3 className="mt-4 text-lg font-semibold">Error Loading Client</h3>
      <p className="text-muted-foreground">
        {error?.message || 'Could not load client details.'}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/clients')}>
          Go Back to Clients
        </Button>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
