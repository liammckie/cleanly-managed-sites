
import React from 'react';
import { useContractorVersionHistory } from '@/hooks/useContractorVersionHistory';
import { formatDate } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

interface ContractorVersionHistoryProps {
  contractorId: string;
}

export function ContractorVersionHistory({ contractorId }: ContractorVersionHistoryProps) {
  const { versionHistory, isLoading, isError, error } = useContractorVersionHistory(contractorId);

  if (isLoading) {
    return <div className="p-4 text-center">Loading version history...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading version history: {error?.message}
      </div>
    );
  }

  if (!versionHistory || versionHistory.length === 0) {
    return <div className="p-4 text-center">No version history available.</div>;
  }

  return (
    <div className="space-y-8">
      {versionHistory.map((version) => {
        const contractorData = asJsonObject(version.contractor_data, {});
        
        return (
          <div key={version.id} className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  Version {version.version_number}
                </h3>
                <p className="text-muted-foreground">
                  {formatDate(jsonToString(version.created_at))}
                </p>
              </div>
              {version.notes && (
                <Badge variant="outline" className="ml-auto">
                  {version.notes}
                </Badge>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Business Information</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Business Name</dt>
                    <dd>{contractorData.business_name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Contact Name</dt>
                    <dd>{contractorData.contact_name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Status</dt>
                    <dd>
                      {contractorData.status === 'active' && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      )}
                      {contractorData.status === 'inactive' && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">Inactive</Badge>
                      )}
                      {contractorData.status === 'pending' && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      )}
                      {!contractorData.status && 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd>{contractorData.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd>{contractorData.phone || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Address</dt>
                    <dd>{contractorData.address || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
