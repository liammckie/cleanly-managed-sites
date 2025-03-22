
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
import { Plus, Search, LayoutGrid, List, X } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function SitesList() {
  const { sites, isLoading, isError, error } = useSites();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Replace single selection filters with multi-selection arrays
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [cityFilters, setCityFilters] = useState<string[]>([]);
  const [clientFilters, setClientFilters] = useState<string[]>([]);
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // For grid view
  const tableItemsPerPage = 10; // For table view
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilters, cityFilters, clientFilters]);
  
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
  const statuses = ['active', 'inactive', 'pending'];
  
  // Helper to toggle an item in a filter array
  const toggleFilter = (filters: string[], setFilters: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setFilters(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilters([]);
    setCityFilters([]);
    setClientFilters([]);
    setSearchTerm('');
  };
  
  // Remove a single filter tag
  const removeFilter = (type: 'status' | 'city' | 'client', value: string) => {
    switch(type) {
      case 'status':
        setStatusFilters(prev => prev.filter(item => item !== value));
        break;
      case 'city':
        setCityFilters(prev => prev.filter(item => item !== value));
        break;
      case 'client':
        setClientFilters(prev => prev.filter(item => item !== value));
        break;
    }
  };
  
  const filteredSites = sites.filter(site => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
                         site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (site.address && site.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (site.representative && site.representative.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status (if any status filters are selected)
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(site.status);
    
    // Filter by city (if any city filters are selected)
    const matchesCity = cityFilters.length === 0 || cityFilters.includes(site.city);
    
    // Filter by client (if any client filters are selected)
    const clientName = getClientName(site);
    const matchesClient = clientFilters.length === 0 || clientFilters.includes(clientName);
    
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
  
  // Count active filters
  const totalActiveFilters = statusFilters.length + cityFilters.length + clientFilters.length + (searchTerm ? 1 : 0);

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
            {/* Status Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Status {statusFilters.length > 0 && <Badge className="ml-1">{statusFilters.length}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters.includes(status)}
                    onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* City Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  City {cityFilters.length > 0 && <Badge className="ml-1">{cityFilters.length}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cities.map(city => (
                  <DropdownMenuCheckboxItem
                    key={city}
                    checked={cityFilters.includes(city)}
                    onCheckedChange={() => toggleFilter(cityFilters, setCityFilters, city)}
                  >
                    {city}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Client Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Client {clientFilters.length > 0 && <Badge className="ml-1">{clientFilters.length}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Filter by Client</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {clients.map(client => (
                  <DropdownMenuCheckboxItem
                    key={client}
                    checked={clientFilters.includes(client)}
                    onCheckedChange={() => toggleFilter(clientFilters, setClientFilters, client)}
                  >
                    {client}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
        
        {/* Active Filters Display */}
        {totalActiveFilters > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {/* Search term tag */}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                <span>Search: {searchTerm}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSearchTerm('')}>
                  <X size={12} />
                </Button>
              </Badge>
            )}
            
            {/* Status tags */}
            {statusFilters.map(status => (
              <Badge key={`status-${status}`} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                <span>Status: {status}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFilter('status', status)}>
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            {/* City tags */}
            {cityFilters.map(city => (
              <Badge key={`city-${city}`} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                <span>City: {city}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFilter('city', city)}>
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            {/* Client tags */}
            {clientFilters.map(client => (
              <Badge key={`client-${client}`} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                <span>Client: {client}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFilter('client', client)}>
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            {/* Clear all button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
        )}
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
