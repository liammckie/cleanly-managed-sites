
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { SiteRecord } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ContractListProps {
  sites: SiteRecord[];
  isLoading: boolean;
  filterType?: 'active' | 'pending' | 'expiring' | 'all';
}

export function ContractList({ sites, isLoading, filterType = 'all' }: ContractListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">Loading contracts...</div>
        </CardContent>
      </Card>
    );
  }

  if (sites.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">No contracts found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {filterType === 'active' && 'Active Contracts'}
          {filterType === 'pending' && 'Pending Contracts'}
          {filterType === 'expiring' && 'Expiring Contracts'}
          {filterType === 'all' && 'All Contracts'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Monthly Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => {
              const contractDetails = site.contract_details || {};
              
              return (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.client_name}</TableCell>
                  <TableCell>
                    {contractDetails.startDate ? format(new Date(contractDetails.startDate), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {contractDetails.endDate ? format(new Date(contractDetails.endDate), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={site.status === 'active' ? 'success' : 'secondary'}>
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${site.monthly_revenue?.toFixed(2) || '0.00'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
