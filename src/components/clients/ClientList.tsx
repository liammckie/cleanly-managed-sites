
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientCard } from './ClientCard';
import { Plus, Search } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { ClientRecord } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ClientDashboard } from './ClientDashboard';
import { ViewToggle } from '@/components/ui/data-table/ViewToggle';
import { TabulatorView } from '@/components/ui/data-table/TabulatorView';

export function ClientList() {
  const { clients, isLoading, isError, error } = useClients();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  
  // Update status filter when URL params change
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    } else {
      setStatusFilter('all');
    }
  }, [searchParams]);
  
  // Update URL when status filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    
    if (value === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', value);
    }
    
    setSearchParams(searchParams);
  };
  
  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    // Filter by search term
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.address && client.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Table columns for tabulator
  const tabulatorColumns = [
    { title: "Name", field: "name", headerFilter: true, sorter: "string", width: 200 },
    { title: "Contact", field: "contact_name", headerFilter: true },
    { title: "Email", field: "email", headerFilter: true },
    { title: "Phone", field: "phone" },
    { title: "City", field: "city", headerFilter: true },
    { title: "Status", field: "status", headerFilter: "list", headerFilterParams: { values: { active: "Active", inactive: "Inactive", pending: "Pending" } } },
    { 
      title: "Actions", 
      formatter: "html", 
      width: 120,
      formatterParams: {
        // Using a data-attribute to store the client ID for event handling
        html: (cell: any) => `<a href="/clients/${cell.getData().id}" class="text-primary hover:underline">View</a>`
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

  if (isError) {
    return (
      <div className="rounded-lg p-8 text-center border border-border bg-card">
        <p className="text-lg text-destructive">Error loading clients: {(error as any)?.message || 'Unknown error'}</p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Clients</h2>
        <Button asChild className="gap-2">
          <Link to="/clients/create">
            <Plus size={18} />
            <span>Create New Client</span>
          </Link>
        </Button>
      </div>
      
      <ClientDashboard />
      
      <div className="border border-border rounded-lg bg-card p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
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
      
      {filteredClients.length > 0 ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                id={client.id}
                name={client.name}
                contact_name={client.contact_name}
                email={client.email}
                phone={client.phone}
                address={client.address}
                city={client.city}
                status={client.status as any}
              />
            ))}
          </div>
        ) : (
          <TabulatorView 
            data={filteredClients}
            columns={tabulatorColumns}
            title="Client List"
            initialSort={[{ column: "name", dir: "asc" }]}
            groupBy={["status", "city"]}
            filename="clients-export"
          />
        )
      ) : (
        <div className="rounded-lg p-8 text-center border border-border bg-card">
          <p className="text-lg text-muted-foreground">No clients found matching your criteria.</p>
          <Button className="mt-4" asChild>
            <Link to="/clients/create">Create New Client</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
