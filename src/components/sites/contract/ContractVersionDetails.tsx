
import React from 'react';
import { Calendar, PencilRuler, FileTerminal } from 'lucide-react';

// Import the ContractDetails type from the correct location
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

interface ContractVersionDetailsProps {
  contractDetails: any; // Use any for now to avoid type errors
}

export function ContractVersionDetails({ contractDetails }: ContractVersionDetailsProps) {
  if (!contractDetails) {
    return <div className="text-center py-4">No contract details available</div>;
  }

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Calendar className="h-5 w-5" />
            <h3>Contract Dates</h3>
          </div>
          
          <div className="space-y-2 bg-muted/50 p-4 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Contract Number</p>
              <p className="font-medium">{contractDetails.contractNumber || 'Not specified'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{contractDetails.startDate || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{contractDetails.endDate || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <PencilRuler className="h-5 w-5" />
            <h3>Term Information</h3>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Termination Period</p>
              <p className="font-medium">{contractDetails.terminationPeriod || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-medium">
          <FileTerminal className="h-5 w-5" />
          <h3>Renewal Terms</h3>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-md">
          <p className="whitespace-pre-line">{contractDetails.renewalTerms || 'No renewal terms specified'}</p>
        </div>
      </div>
    </div>
  );
}
