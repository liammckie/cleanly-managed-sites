
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

interface ContractsTabProps {
  site: SiteRecord;
}

export function ContractsTab({ site }: ContractsTabProps) {
  const contractDetails = asJsonObject(site.contract_details, { 
    startDate: '', 
    endDate: '', 
    contractNumber: '',
    terminationPeriod: '',
    renewalTerms: '' 
  });
  
  // Access properties safely with optional chaining and defaults
  const terminationPeriod = contractDetails.terminationPeriod || 'Not specified';
  const renewalTerms = contractDetails.renewalTerms || 'Not specified';
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Contract Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Contract Number</p>
            <p className="font-medium">{jsonToString(contractDetails.contractNumber) || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-medium">{jsonToString(contractDetails.startDate) || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-medium">{jsonToString(contractDetails.endDate) || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Termination Period</p>
            <p className="font-medium">{jsonToString(terminationPeriod)}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Renewal Terms</p>
            <p className="font-medium">{jsonToString(renewalTerms)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
