
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteCard } from './SiteCard';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Search } from 'lucide-react';
import { SiteRecord } from '@/lib/types';
import { ViewToggle } from '@/components/ui/data-table/ViewToggle';
import { TabulatorView } from '@/components/ui/data-table/TabulatorView';
import { formatCurrency } from '@/lib/utils';

export function SitesList() {
  const { sites, isLoading, error } = useSites();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'table'>('table');

  // Filter sites based on search and status
  const filteredSites = sites.filter(site => {
    // Filter by search term
    const matchesSearch = 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.representative && site.representative.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (site.client_name && site.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate annual billing amount
  const getAnnualBilling = (site: SiteRecord) => {
    if (!site.monthly_revenue) return null;
    return site.monthly_revenue * 12;
  };

  // Get service delivery type from billing details
  const getServiceDeliveryType = (site: SiteRecord) => {
    if (site.billing_details && typeof site.billing_details === 'string') {
      try {
        const billingDetails = JSON.parse(site.billing_details);
        return billingDetails.serviceDeliveryType || 'direct';
      } catch (e) {
        return 'direct';
      }
    }
    return 'direct';
  };

  // Table columns for tabulator
  const tabulatorColumns = [
    { title: "Name", field: "name", headerFilter: true, sorter: "string", width: 200 },
    { title: "Client", field: "client_name", headerFilter: true, sorter: "string" },
    { 
      title: "Service Type", 
      field: "service_delivery_type", 
      headerFilter: "list", 
      headerFilterParams: { values: { direct: "Direct", contractor: "Contractor" } },
      formatter: "plaintext", // Changed from "text" to "plaintext"
      mutator: function(value: any, data: any) {
        return data.service_delivery_type || 'direct';
      }
    },
    { title: "Address", field: "address", headerFilter: true },
    { title: "City", field: "city", headerFilter: true },
    { title: "State", field: "state", headerFilter: true },
    { title: "Postcode", field: "postcode", headerFilter: true },
    { title: "Representative", field: "representative", headerFilter: true },
    { 
      title: "Weekly Revenue", 
      field: "weekly_revenue", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      headerFilter: "number",
      headerFilterPlaceholder: "Filter...",
      topCalc: "sum",
      topCalcFormatter: "money",
      topCalcFormatterParams: { precision: 2, symbol: "$" },
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" },
      mutator: function(value: any, data: any) {
        return data.monthly_revenue ? data.monthly_revenue / 4.33 : 0;
      }
    },
    { 
      title: "Monthly Revenue", 
      field: "monthly_revenue", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      headerFilter: "number",
      headerFilterPlaceholder: "Filter...",
      topCalc: "sum",
      topCalcFormatter: "money",
      topCalcFormatterParams: { precision: 2, symbol: "$" },
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
      topCalc: "sum",
      topCalcFormatter: "money",
      topCalcFormatterParams: { precision: 2, symbol: "$" },
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" },
      mutator: function(value: any, data: any) {
        return data.monthly_revenue ? data.monthly_revenue * 12 : 0;
      }
    },
    { 
      title: "Monthly Cost", 
      field: "monthly_cost", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      headerFilter: "number",
      headerFilterPlaceholder: "Filter...",
      topCalc: "sum",
      topCalcFormatter: "money",
      topCalcFormatterParams: { precision: 2, symbol: "$" },
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
      sorter: "number",
      mutator: function(value: any, data: any) {
        if (!data.monthly_revenue || !data.monthly_cost || data.monthly_revenue <= 0) return 0;
        const margin = ((data.monthly_revenue - data.monthly_cost) / data.monthly_revenue) * 100;
        return Math.round(margin * 10) / 10; // Round to 1 decimal place
      }
    },
    { title: "Status", field: "status", headerFilter: "list", headerFilterParams: { values: { active: "Active", inactive: "Inactive", pending: "Pending" } } },
    { title: "Phone", field: "phone", headerFilter: true, visible: false },
    { title: "Email", field: "email", headerFilter: true, visible: false },
    { title: "Custom ID", field: "custom_id", headerFilter: true, visible: false },
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-8 text-center border border-border bg-card">
        <p className="text-lg text-destructive">Error loading sites: {error.message || 'Unknown error'}</p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Add service delivery type data for the table view
  const enhancedSiteData = filteredSites.map(site => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sites</h2>
        <Button asChild className="gap-2">
          <Link to="/sites/create">
            <Plus size={18} />
            <span>Create New Site</span>
          </Link>
        </Button>
      </div>
      
      <div className="border border-border rounded-lg bg-card p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
      </div>
      
      {filteredSites.length > 0 ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map(site => (
              <SiteCard
                key={site.id}
                id={site.id}
                name={site.name}
                address={site.address}
                city={site.city}
                status={site.status as any}
                representative={site.representative}
                phone={site.phone}
                annualBilling={site.monthly_revenue ? site.monthly_revenue * 12 : null}
              />
            ))}
          </div>
        ) : (
          <TabulatorView 
            data={enhancedSiteData}
            columns={tabulatorColumns}
            title="Site List"
            initialSort={[{ column: "name", dir: "asc" }]}
            groupBy={["client_name", "service_delivery_type", "status", "city", "state"]}
            filename="sites-export"
          />
        )
      ) : (
        <div className="rounded-lg p-8 text-center border border-border bg-card">
          <p className="text-lg text-muted-foreground">No sites found matching your criteria.</p>
          <Button className="mt-4" asChild>
            <Link to="/sites/create">Create New Site</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
