
import React, { useState } from 'react';
import { useContractorVersionHistory } from '@/hooks/useContractorVersionHistory';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, ChevronDown, ChevronUp, History } from 'lucide-react';
import { ContractorRecord, ContractorVersionHistoryEntry } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ContractorVersionHistoryProps {
  contractorId: string;
}

export const ContractorVersionHistory: React.FC<ContractorVersionHistoryProps> = ({ contractorId }) => {
  const { history, isLoading, isError } = useContractorVersionHistory(contractorId);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  
  const toggleExpand = (versionId: string) => {
    if (expandedVersion === versionId) {
      setExpandedVersion(null);
    } else {
      setExpandedVersion(versionId);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading version history</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!history || history.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No version history available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((version) => (
            <div key={version.id} className="border rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer bg-muted/30"
                onClick={() => toggleExpand(version.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Version {version.version_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {version.created_at && format(new Date(version.created_at), 'PPP p')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(version.id);
                  }}
                >
                  {expandedVersion === version.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {expandedVersion === version.id && (
                <div className="p-4 border-t">
                  <p className="text-sm font-medium mb-2">Changes:</p>
                  <div className="space-y-2 text-sm">
                    {version.notes && (
                      <p className="text-muted-foreground">{version.notes}</p>
                    )}
                    <Separator />
                    <p className="font-medium mt-2">Previous Data:</p>
                    {version.contractor_data && renderContractorData(version.contractor_data)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to render contractor data nicely
function renderContractorData(data: ContractorRecord) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      <div>
        <span className="text-muted-foreground">Business Name:</span> {data.business_name}
      </div>
      <div>
        <span className="text-muted-foreground">Contact:</span> {data.contact_name}
      </div>
      <div>
        <span className="text-muted-foreground">Email:</span> {data.email || 'N/A'}
      </div>
      <div>
        <span className="text-muted-foreground">Phone:</span> {data.phone || 'N/A'}
      </div>
      <div>
        <span className="text-muted-foreground">Status:</span> {data.status}
      </div>
      <div>
        <span className="text-muted-foreground">Type:</span> {data.contractor_type}
      </div>
    </div>
  );
}
