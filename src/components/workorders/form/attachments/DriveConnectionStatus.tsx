
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DriveConnectionStatusProps {
  isConnected: boolean;
  isCheckingConnection: boolean;
}

export const DriveConnectionStatus = ({
  isConnected,
  isCheckingConnection
}: DriveConnectionStatusProps) => {
  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Alert className="mb-4">
        <AlertTitle>Google Drive not connected</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            To upload and manage files for work orders, you need to connect your Google Drive account.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/integrations?tab=google-drive'}
          >
            Connect Google Drive
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
