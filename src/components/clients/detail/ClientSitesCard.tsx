
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
import { TabulatorView } from '@/components/ui/data-table/TabulatorView';
import { ViewToggle } from '@/components/ui/data-table/ViewToggle';

interface ClientSitesCardProps {
  clientId: string;
  sites: SiteRecord[];
}

export function ClientSitesCard({ clientId, sites }: ClientSitesCardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'simple-table'>('grid');

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

  // Prepare site data for tabulator
  const enhancedSiteData = sites.map(site => {
    let serviceDeliveryType = 'direct';
    if (site.billing_details) {
      try {
        const billingDetails = typeof site.billing_details === 'string' 
          ? JSON.parse(site.billing_details) 
          : site.billing_details;
          
        serviceDeliveryType = billingDetails.serviceDeliveryType || 'direct';
      } catch (e) {
        // Default to direct if parsing fails
      }
    }
    
    return {
      ...site,
      annual_revenue: site.monthly_revenue ? site.monthly_revenue * 12 : 0,
      weekly_revenue: site.monthly_revenue ? site.monthly_revenue / 4.33 : 0,
      service_delivery_type: serviceDeliveryType,
      profit_margin: site.monthly_revenue && site.monthly_cost ? 
        ((site.monthly_revenue - site.monthly_cost) / site.monthly_revenue) * 100 : 0
    };
  });

  // Tabulator columns
  const tabulatorColumns = [
    { title: "Name", field: "name", headerFilter: true, sorter: "string", width: 200 },
    { 
      title: "Service Type", 
      field: "service_delivery_type", 
      headerFilter: "list", 
      headerFilterParams: { values: { direct: "Direct", contractor: "Contractor" } },
      formatter: "text"
    },
    { title: "Address", field: "address", headerFilter: true },
    { title: "City", field: "city", headerFilter: true },
    { title: "State", field: "state" },
    { title: "Representative", field: "representative", headerFilter: true },
    { 
      title: "Weekly Revenue", 
      field: "weekly_revenue", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Monthly Revenue", 
      field: "monthly_revenue", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Annual Revenue", 
      field: "annual_revenue", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Monthly Cost", 
      field: "monthly_cost", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Profit Margin", 
      field: "profit_margin", 
      formatter: "progress", 
      formatterParams: {
        min: 0,
        max: 100,
        color: ["red", "orange", "green"],
        legendColor: "#000000",
        legendAlign: "center",
      },
      sorter: "number"
    },
    { title: "Status", field: "status", headerFilter: "list", headerFilterParams: { values: { active: "Active", inactive: "Inactive", pending: "Pending" } } },
    { 
      title: "Actions", 
      formatter: "html", 
      width: 120,
      headerSort: false,
      formatterParams: {
        html: (cell: any) => `<a href="/sites/${cell.getData().id}" class="text-primary hover:underline">View</a>`
      }
    }
  ];

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
                title="Grid View"
              >
                <LayoutGrid size={14} />
              </Button>
              <Button 
                variant={viewMode === 'simple-table' ? 'default' : 'outline'} 
                className="rounded-none border-0 h-8 w-8 p-0"
                size="sm"
                onClick={() => setViewMode('simple-table')}
                title="Simple Table"
              >
                <List size={14} />
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                className="rounded-none border-0 h-8 w-10 p-0 text-xs"
                size="sm"
                onClick={() => setViewMode('table')}
                title="Advanced Table"
              >
                <span>Table+</span>
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
          ) : viewMode === 'simple-table' ? (
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
          ) : (
            <TabulatorView 
              data={enhancedSiteData}
              columns={tabulatorColumns}
              title="Client Sites"
              initialSort={[{ column: "name", dir: "asc" }]}
              groupBy={["status", "city", "state"]}
              filename={`client-${clientId}-sites-export`}
            />
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
