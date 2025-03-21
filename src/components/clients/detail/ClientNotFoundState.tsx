
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ClientNotFoundState() {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-lg p-8 text-center border border-border bg-card">
      <h3 className="text-lg font-semibold">Client Not Found</h3>
      <p className="text-muted-foreground">
        The client you are looking for does not exist or has been deleted.
      </p>
      <Button className="mt-4" onClick={() => navigate('/clients')}>
        Go Back to Clients
      </Button>
    </div>
  );
}
