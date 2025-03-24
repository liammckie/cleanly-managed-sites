
import React from 'react';
import { format } from 'date-fns';
import { ContractorVersionHistoryEntry, ContractorRecord } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { History, AlertTriangle } from 'lucide-react';

interface ContractorVersionHistoryProps {
  history: ContractorVersionHistoryEntry[];
  isLoading: boolean;
  currentContractor?: ContractorRecord;
}

export const ContractorVersionHistory: React.FC<ContractorVersionHistoryProps> = ({ 
  history, 
  isLoading,
  currentContractor 
}) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <History className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Version History</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {currentContractor ? 
              'This contractor has no previous versions. History will be created when changes are made.' :
              'No contractor data found.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Showing {history.length} version{history.length !== 1 ? 's' : ''} of this contractor
      </div>

      {history.map((entry, index) => {
        const contractorData = entry.contractor_data as ContractorRecord;
        const formattedDate = format(new Date(entry.created_at), 'PPpp');
        
        // For comparing what changed, we need the previous version
        const previousEntry = history[index + 1];
        const previousData = previousEntry?.contractor_data as ContractorRecord | undefined;
        
        // Determine what fields changed
        const changedFields: string[] = [];
        if (previousData) {
          Object.keys(contractorData).forEach(key => {
            // Skip id, created_at, etc.
            if (['id', 'created_at', 'updated_at', 'user_id'].includes(key)) return;
            
            // Compare values
            const currentValue = (contractorData as any)[key];
            const prevValue = (previousData as any)[key];
            
            // Special handling for array comparison
            if (Array.isArray(currentValue) && Array.isArray(prevValue)) {
              if (JSON.stringify(currentValue) !== JSON.stringify(prevValue)) {
                changedFields.push(key);
              }
            } else if (currentValue !== prevValue) {
              changedFields.push(key);
            }
          });
        }
        
        return (
          <Card key={entry.id} className="overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <div className="font-medium">Version {entry.version_number}</div>
                <div className="text-sm text-muted-foreground">{formattedDate}</div>
              </div>
              {changedFields.length > 0 && (
                <div className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs">
                  {changedFields.length} field{changedFields.length !== 1 ? 's' : ''} changed
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Business Name:</span> {contractorData.business_name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contact Name:</span> {contractorData.contact_name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span> {contractorData.email || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span> {contractorData.phone || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span> {contractorData.status}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span> {contractorData.contractor_type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">ABN:</span> {contractorData.abn || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax ID:</span> {contractorData.tax_id || 'N/A'}
                    </div>
                    {contractorData.hourly_rate && (
                      <div>
                        <span className="text-muted-foreground">Hourly Rate:</span> ${contractorData.hourly_rate.toFixed(2)}
                      </div>
                    )}
                    {contractorData.day_rate && (
                      <div>
                        <span className="text-muted-foreground">Day Rate:</span> ${contractorData.day_rate.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {changedFields.length > 0 && previousData && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Changes</h4>
                  <div className="space-y-2">
                    {changedFields.map(field => {
                      const currentValue = (contractorData as any)[field];
                      const prevValue = (previousData as any)[field];
                      
                      // Format values for display
                      const formatValue = (val: any) => {
                        if (val === null || val === undefined) return 'None';
                        if (Array.isArray(val)) return val.join(', ') || 'None';
                        if (typeof val === 'object') return JSON.stringify(val);
                        return String(val);
                      };
                      
                      return (
                        <div key={field} className="text-sm bg-muted p-2 rounded">
                          <div className="font-medium capitalize">{field.replace('_', ' ')}</div>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="text-xs">
                              <div className="text-muted-foreground">Previous:</div>
                              <div>{formatValue(prevValue)}</div>
                            </div>
                            <div className="text-xs">
                              <div className="text-muted-foreground">New:</div>
                              <div>{formatValue(currentValue)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {entry.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm">{entry.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
