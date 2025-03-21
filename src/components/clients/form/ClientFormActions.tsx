
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ClientFormActionsProps {
  mode: 'create' | 'edit';
  isLoading: boolean;
  onCancel: () => void;
}

export function ClientFormActions({ mode, isLoading, onCancel }: ClientFormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {mode === 'create' ? 'Creating...' : 'Updating...'}
          </>
        ) : (
          mode === 'create' ? 'Create Client' : 'Update Client'
        )}
      </Button>
    </div>
  );
}
