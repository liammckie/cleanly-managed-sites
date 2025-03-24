
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

interface EmptyDocumentStateProps {
  onAddClick: () => void;
}

export const EmptyDocumentState = ({ onAddClick }: EmptyDocumentStateProps) => {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-20" />
      <h3 className="text-lg font-medium mb-2">No Documents Added</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Add documents such as Public Liability Insurance, WorkCover, and Labour Hire Licence to keep track of 
        important certifications and their expiry dates.
      </p>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Document
      </Button>
    </div>
  );
};
