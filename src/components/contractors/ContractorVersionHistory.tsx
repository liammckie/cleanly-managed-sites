
import React from 'react';
import { useContractorVersionHistory } from '@/hooks/useContractorVersionHistory';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, FileText } from 'lucide-react';
import { jsonToString } from '@/lib/utils/json';

interface ContractorVersionHistoryProps {
  contractorId: string;
}

export function ContractorVersionHistory({ contractorId }: ContractorVersionHistoryProps) {
  const { versionHistory, isLoading } = useContractorVersionHistory(contractorId);
  const [selectedVersion, setSelectedVersion] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (versionHistory.length > 0 && !selectedVersion) {
      setSelectedVersion(versionHistory[0].id);
    }
  }, [versionHistory, selectedVersion]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (versionHistory.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No version history available for this contractor.</p>
      </div>
    );
  }
  
  const selectedVersionData = versionHistory.find(v => v.id === selectedVersion);
  const contractorData = selectedVersionData?.contractor_data || {};
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={selectedVersion || ''} onValueChange={setSelectedVersion}>
        <TabsList className="mb-4 flex overflow-x-auto pb-2">
          {versionHistory.map((version) => (
            <TabsTrigger key={version.id} value={version.id} className="flex-shrink-0">
              Version {version.version_number}
              <span className="ml-2 text-xs opacity-70">
                {format(new Date(version.created_at), 'MMM d, yyyy')}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {versionHistory.map((version) => (
          <TabsContent key={version.id} value={version.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Version {version.version_number}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(version.created_at), 'PPP')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {version.notes && (
                  <div className="mb-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm whitespace-pre-line">{jsonToString(version.notes)}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Business Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Business Name</p>
                        <p>{contractorData.business_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Contact Name</p>
                        <p>{contractorData.contact_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={
                          contractorData.status === 'active' ? 'default' :
                          contractorData.status === 'pending' ? 'outline' : 'secondary'
                        }>
                          {contractorData.status || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p>{contractorData.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p>{contractorData.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p>{contractorData.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
