
import React, { useState, useEffect } from 'react';
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
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SiteRecord } from '@/lib/types';

export function SitesList() {
  const { sites, isLoading, isError, error } = useSites();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // For grid view
  const tableItemsPerPage = 10; // For table view
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, cityFilter, clientFilter]);
  
  // Get unique cities and clients for filters
  const cities = Array.from(new Set(sites.map(site => site.city))).sort();
  
  // For clients, we need to account for the client_id field instead of the clients object
  // This handles if client data was joined in the query
  const getClientName = (site: SiteRecord) => {
    // Check if client name is available through a joined client record
    if (site.client_name) {
      return site.client_name;
    }
    return 'Unknown';
  };
  
  const clients = Array.from(new Set(sites.map(site => getClientName(site)))).sort();
  
  const filteredSites = sites.filter(site => {
    // Filter by search term
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (site.address && site.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (site.representative && site.representative.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    
    // Filter by city
    const matchesCity = cityFilter === 'all' || site.city === cityFilter;
    
    // Filter by client
    const clientName = getClientName(site);
    const matchesClient = clientFilter === 'all' || clientName === clientFilter;
    
    return matchesSearch && matchesStatus && matchesCity && matchesClient;
  });

  // Pagination logic
  const itemsPerCurrentView = viewMode === 'grid' ? itemsPerPage : tableItemsPerPage;
  const totalPages = Math.ceil(filteredSites.length / itemsPerCurrentView);
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * itemsPerCurrentView,
    currentPage * itemsPerCurrentView
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Generate array of pages for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than max, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Add first page
      pages.push(1);
      
      // Add middle pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) {
        pages.push(-1); // Indicator for ellipsis
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push(-1); // Indicator for ellipsis
      }
      
      // Add last page
      pages.push(totalPages);
    }
    
    return pages;
  };

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
        <p className="text-lg text-destructive">Error loading sites: {(error as any)?.message || 'Unknown error'}</p>
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
        <div className="flex flex-col md:flex-row gap-4">
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
          
          <div className="flex flex-wrap gap-3">
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
            
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                className="rounded-none border-0"
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                className="rounded-none border-0"
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredSites.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedSites.map(site => (
                <SiteCard 
                  key={site.id} 
                  id={site.id}
                  name={site.name}
                  address={site.address}
                  city={site.city}
                  status={site.status as any}
                  representative={site.representative}
                  phone={site.phone}
                  clientName={getClientName(site)}
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
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Representative</TableHead>
                    <TableHead>Annual Billing</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSites.length > 0 ? (
                    paginatedSites.map(site => (
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
                          {getClientName(site) || "—"}
                        </TableCell>
                        <TableCell>
                          <div>{site.address}</div>
                          <div className="text-muted-foreground text-sm">{site.city}</div>
                        </TableCell>
                        <TableCell>{site.representative || "—"}</TableCell>
                        <TableCell>{formatCurrency(getAnnualBilling(site))}</TableCell>
                        <TableCell>
                          <StatusBadge status={site.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No sites found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {getPageNumbers().map((page, index) => (
                  page === -1 ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <span className="flex h-9 w-9 items-center justify-center">...</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
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
