
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { AssignmentType } from '../contactSchema';

interface BulkAssignmentNoticeProps {
  assignmentType: AssignmentType;
}

export function BulkAssignmentNotice({ assignmentType }: BulkAssignmentNoticeProps) {
  if (assignmentType === 'single') {
    return null;
  }

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        This contact will be associated with {assignmentType === 'all_sites' ? 'all sites' : 'all clients'}.
      </AlertDescription>
    </Alert>
  );
}
