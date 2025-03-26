
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle } from 'lucide-react';

interface QuotesEmptyStateProps {
  onCreateNew: () => void;
}

export function QuotesEmptyState({ onCreateNew }: QuotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No quotes found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have any quotes yet. Create your first quote to get started with labor planning and cost estimation.
      </p>
      <Button onClick={onCreateNew}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create New Quote
      </Button>
    </div>
  );
}
