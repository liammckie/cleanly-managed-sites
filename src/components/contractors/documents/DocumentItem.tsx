
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, ExternalLink, FileText } from 'lucide-react';
import { ContractorDocument } from '@/lib/api/contractors/contractorHistoryApi';
import { DOCUMENT_TYPES } from './documentTypes';

interface DocumentItemProps {
  document: ContractorDocument;
  onEdit: () => void;
  onDelete: () => void;
}

export const DocumentItem = ({ document, onEdit, onDelete }: DocumentItemProps) => {
  // Find the document type label
  const documentType = DOCUMENT_TYPES.find(type => type.value === document.document_type)?.label || document.document_type;
  
  // Format dates
  const formattedIssueDate = document.issue_date 
    ? format(new Date(document.issue_date), 'PPP') 
    : 'Not specified';
  
  const formattedExpiryDate = document.expiry_date 
    ? format(new Date(document.expiry_date), 'PPP') 
    : 'Not specified';
  
  // Determine if document is expired or expiring soon
  const isExpired = document.expiry_date && new Date(document.expiry_date) < new Date();
  const isExpiringSoon = document.expiry_date && !isExpired && 
    new Date(document.expiry_date) < new Date(Date.now() + (document.reminder_days || 30) * 86400000);

  return (
    <div className={`border rounded-lg p-4 ${
      isExpired 
        ? 'border-destructive/50 bg-destructive/5' 
        : isExpiringSoon 
          ? 'border-amber-500/50 bg-amber-50' 
          : 'border-border'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            isExpired 
              ? 'bg-destructive/10 text-destructive' 
              : isExpiringSoon 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-primary/10 text-primary'
          }`}>
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{document.name}</h3>
            <p className="text-sm text-muted-foreground">{documentType}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit document">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete document">
            <Trash2 className="h-4 w-4" />
          </Button>
          {document.file_path && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.open(document.file_path, '_blank')}
              title="Open document"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Issue Date:</p>
          <p>{formattedIssueDate}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Expiry Date:</p>
          <p className={`${isExpired ? 'text-destructive font-medium' : isExpiringSoon ? 'text-amber-700 font-medium' : ''}`}>
            {formattedExpiryDate}
            {isExpired && ' (Expired)'}
            {isExpiringSoon && !isExpired && ' (Expiring soon)'}
          </p>
        </div>
      </div>
      
      {document.notes && (
        <div className="mt-2 pt-2 border-t text-sm">
          <p className="text-muted-foreground">Notes:</p>
          <p>{document.notes}</p>
        </div>
      )}
    </div>
  );
};
