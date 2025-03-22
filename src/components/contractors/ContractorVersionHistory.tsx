
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Info } from 'lucide-react';
import { ContractorVersionHistoryEntry } from '@/lib/types';

interface ContractorVersionHistoryProps {
  history: ContractorVersionHistoryEntry[];
  isLoading: boolean;
  currentContractor: any;
}

export function ContractorVersionHistory({ 
  history, 
  isLoading, 
  currentContractor 
}: ContractorVersionHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 glass-card p-6">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Version History</h3>
        <p className="text-muted-foreground">
          When contractor details are updated, versions will be stored and displayed here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="bg-muted/50 p-4 flex items-center gap-2 border-b">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Contractor Version History</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Date Modified</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Badge variant="outline" className="bg-primary text-primary-foreground">Current</Badge>
            </TableCell>
            <TableCell>Current Version</TableCell>
            <TableCell>{currentContractor?.business_name || 'N/A'}</TableCell>
            <TableCell>{currentContractor?.contact_name || 'N/A'}</TableCell>
            <TableCell>
              <Badge variant={
                currentContractor?.status === 'active' ? 'success' :
                currentContractor?.status === 'inactive' ? 'destructive' : 'default'
              }>
                {currentContractor?.status || 'N/A'}
              </Badge>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{currentContractor?.notes || '-'}</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs px-2 py-1 rounded hover:bg-muted flex items-center ml-auto">
                    <Info className="h-4 w-4 mr-1" />
                    View
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Contractor Details (Current Version)</DialogTitle>
                  </DialogHeader>
                  <ContractorVersionDetails contractor={currentContractor} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Badge variant="outline">v{entry.version_number}</Badge>
              </TableCell>
              <TableCell>{format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
              <TableCell>{entry.contractor_data.business_name}</TableCell>
              <TableCell>{entry.contractor_data.contact_name}</TableCell>
              <TableCell>
                <Badge variant={
                  entry.contractor_data.status === 'active' ? 'success' :
                  entry.contractor_data.status === 'inactive' ? 'destructive' : 'default'
                }>
                  {entry.contractor_data.status || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{entry.notes || '-'}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-xs px-2 py-1 rounded hover:bg-muted flex items-center ml-auto">
                      <Info className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Contractor Details (Version {entry.version_number})</DialogTitle>
                    </DialogHeader>
                    <ContractorVersionDetails contractor={entry.contractor_data} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Component to display contractor version details in the dialog
interface ContractorVersionDetailsProps {
  contractor: any;
}

function ContractorVersionDetails({ contractor }: ContractorVersionDetailsProps) {
  if (!contractor) {
    return <div className="text-center py-4">No contractor details available</div>;
  }

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Information</h3>
          <div className="space-y-2 bg-muted/50 p-4 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Business Name</p>
              <p className="font-medium">{contractor.business_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Name</p>
              <p className="font-medium">{contractor.contact_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{contractor.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contractor Type</p>
              <p className="font-medium capitalize">{contractor.contractor_type?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="bg-muted/50 p-4 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{contractor.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{contractor.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{contractor.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                {[contractor.city, contractor.state, contractor.postcode]
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-md">
          <div>
            <p className="text-sm text-muted-foreground">Hourly Rate</p>
            <p className="font-medium">{contractor.hourly_rate ? `$${contractor.hourly_rate}` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Day Rate</p>
            <p className="font-medium">{contractor.day_rate ? `$${contractor.day_rate}` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ABN</p>
            <p className="font-medium">{contractor.abn || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax ID</p>
            <p className="font-medium">{contractor.tax_id || 'N/A'}</p>
          </div>
        </div>
      </div>

      {contractor.notes && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notes</h3>
          <div className="bg-muted/50 p-4 rounded-md">
            <p className="whitespace-pre-line">{contractor.notes}</p>
          </div>
        </div>
      )}

      {contractor.specialty && contractor.specialty.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Specialties</h3>
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex flex-wrap gap-2">
              {contractor.specialty.map((spec: string) => (
                <Badge key={spec} variant="secondary" className="capitalize">
                  {spec.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
