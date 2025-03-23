
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

export function SitesList() {
  const { sites, isLoading, error } = useSites();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');

  // Filter sites based on search and status
  const filteredSites = sites.filter(site => {
    // Filter by search term
    const matchesSearch = 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.representative && site.representative.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Table columns for tabulator
  const tabulatorColumns = [
    { title: "Name", field: "name", headerFilter: true, sorter: "string", width: 200 },
    { title: "Address", field: "address", headerFilter: true },
    { title: "City", field: "city", headerFilter: true },
    { title: "State", field: "state" },
    { title: "Representative", field: "representative", headerFilter: true },
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
    { title: "Status", field: "status", headerFilter: "list", headerFilterParams: { values: { active: "Active", inactive: "Inactive", pending: "Pending" } } },
    { 
      title: "Actions", 
      formatter: "html", 
      width: 120,
      formatterParams: {
        html: (cell: any) => `<a href="/sites/${cell.getData().id}" class="text-primary hover:underline">View</a>`
      }
    }
  ];

  // Format currency for display
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "—";
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

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
            data={filteredSites}
            columns={tabulatorColumns}
            title="Site List"
            initialSort={[{ column: "name", dir: "asc" }]}
            groupBy={["status", "city", "state"]}
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
