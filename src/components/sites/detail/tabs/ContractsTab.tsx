
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { FileIcon } from 'lucide-react';
import { ContractHistoryTable } from '../../contract/ContractHistoryTable';
import { useContractHistory } from '@/hooks/useContractHistory';
import { asJsonObject } from '@/lib/utils/json';

interface ContractsTabProps {
  site: SiteRecord;
}

export function ContractsTab({ site }: ContractsTabProps) {
  const { history, isLoading: isLoadingHistory } = useContractHistory(site.id);
  const contractDetails = asJsonObject(site.contract_details, {});
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <FileIcon size={18} className="text-primary" />
          Current Contract Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Termination Period</p>
            <p className="font-medium">{contractDetails.terminationPeriod || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Renewal Terms</p>
            <p className="font-medium line-clamp-3">{contractDetails.renewalTerms || 'Not specified'}</p>
          </div>
        </div>
      </div>
      
      <ContractHistoryTable 
        history={history} 
        isLoading={isLoadingHistory} 
        currentContractDetails={site.contract_details}
      />
    </div>
  );
}
