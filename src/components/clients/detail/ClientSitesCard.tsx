
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteCard } from '@/components/sites/SiteCard';
import { SiteRecord } from '@/lib/types';
import { Building2, Plus, LayoutGrid, List } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ClientSitesCardProps {
  clientId: string;
  sites: SiteRecord[];
}

export function ClientSitesCard({ clientId, sites }: ClientSitesCardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  // Calculate annual billing amount
  const getAnnualBilling = (site: SiteRecord) => {
    if (!site.monthly_revenue) return null;
    return site.monthly_revenue * 12;
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "—";
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sites</CardTitle>
          <CardDescription>Sites managed for this client</CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          {sites.length > 0 && (
            <div className="flex border rounded-md overflow-hidden mr-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                className="rounded-none border-0 h-8 w-8 p-0"
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={14} />
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                className="rounded-none border-0 h-8 w-8 p-0"
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List size={14} />
              </Button>
            </div>
          )}
          
          <Button asChild size="sm" className="gap-1">
            <Link to={`/sites/create?client=${clientId}`}>
              <Plus size={16} />
              <span>Add Site</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {sites.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sites.map(site => (
                <SiteCard
                  key={site.id}
                  id={site.id}
                  name={site.name}
                  address={site.address}
                  city={site.city}
                  status={site.status as any}
                  representative={site.representative}
                  phone={site.phone}
                  annualBilling={getAnnualBilling(site)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Representative</TableHead>
                    <TableHead>Annual Billing</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map(site => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/sites/${site.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {site.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>{site.address}</div>
                        <div className="text-muted-foreground text-sm">{site.city}</div>
                      </TableCell>
                      <TableCell>{site.representative}</TableCell>
                      <TableCell>{formatCurrency(getAnnualBilling(site))}</TableCell>
                      <TableCell>
                        <StatusBadge status={site.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-medium">No Sites Yet</h3>
            <p className="text-muted-foreground">
              This client doesn't have any sites yet.
            </p>
            <Button asChild className="mt-4">
              <Link to={`/sites/create?client=${clientId}`}>
                Add First Site
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
