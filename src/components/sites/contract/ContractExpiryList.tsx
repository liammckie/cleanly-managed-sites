
import React, { useMemo } from 'react';
import { format, differenceInDays, parseISO, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SiteRecord } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getJsonProperty } from '@/lib/utils/json';

interface ContractExpiryListProps {
  sites: SiteRecord[];
  isLoading: boolean;
}

export function ContractExpiryList({ sites, isLoading }: ContractExpiryListProps) {
  const today = new Date();
  
  const contractsWithExpiry = useMemo(() => {
    if (!sites) return [];
    
    return sites
      .filter(site => {
        const endDate = getJsonProperty<string>(site.contract_details, 'endDate', '');
        return !!endDate;
      })
      .map(site => {
        const endDate = parseISO(getJsonProperty<string>(site.contract_details, 'endDate', ''));
        const daysUntilExpiry = differenceInDays(endDate, today);
        return {
          ...site,
          daysUntilExpiry,
        };
      })
      .filter(site => site.daysUntilExpiry < 180) // Show contracts expiring within 6 months
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  }, [sites, today]);

  const getExpiryStatusClass = (days: number) => {
    if (days < 0) return 'bg-destructive text-destructive-foreground';
    if (days < 30) return 'bg-red-100 text-red-800 border-red-200';
    if (days < 90) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contracts Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (contractsWithExpiry.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contracts Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No contracts are expiring within the next 6 months.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>Contract #</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Review By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractsWithExpiry.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>{getJsonProperty(site.contract_details, 'contractNumber', 'N/A')}</TableCell>
                <TableCell>{format(parseISO(getJsonProperty<string>(site.contract_details, 'endDate', '')), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge className={getExpiryStatusClass(site.daysUntilExpiry)}>
                    {site.daysUntilExpiry < 0
                      ? 'Expired'
                      : `${site.daysUntilExpiry} days left`}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(addDays(parseISO(getJsonProperty<string>(site.contract_details, 'endDate', '')), -90), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Link to={`/sites/${site.id}`} className="text-primary hover:underline">
                    View Site
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
