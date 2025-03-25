
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { asJsonObject } from '@/lib/utils/json';

interface ContractsTabProps {
  site: SiteRecord;
}

export function ContractsTab({ site }: ContractsTabProps) {
  const contractDetails = asJsonObject(site.contract_details, {
    contractNumber: '',
    startDate: '',
    endDate: '',
    terminationPeriod: '',
    renewalTerms: ''
  });
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Contract Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Contract Number</p>
          <p className="font-medium">{contractDetails.contractNumber || 'Not specified'}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Start Date</p>
          <p className="font-medium">{contractDetails.startDate || 'Not specified'}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">End Date</p>
          <p className="font-medium">{contractDetails.endDate || 'Not specified'}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Termination Period</p>
          <p className="font-medium">{contractDetails.terminationPeriod || 'Not specified'}</p>
        </div>
        
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Renewal Terms</p>
          <p className="font-medium">{contractDetails.renewalTerms || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
