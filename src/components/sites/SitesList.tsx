
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
import { SiteCard, SiteStatus } from './SiteCard';
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

type Site = {
  id: string;
  name: string;
  address: string;
  city: string;
  status: SiteStatus;
  representative: string;
  phone?: string;
};

// Mock data for demonstration
const mockSites: Site[] = [
  {
    id: '1',
    name: 'ABC Office Building',
    address: '123 Business St',
    city: 'Sydney',
    status: 'active',
    representative: 'John Smith',
    phone: '(02) 1234 5678',
  },
  {
    id: '2',
    name: 'Riverside Plaza',
    address: '45 Harbor Rd',
    city: 'Melbourne',
    status: 'active',
    representative: 'Sarah Johnson',
    phone: '(03) 8765 4321',
  },
  {
    id: '3',
    name: 'Central Mall',
    address: '789 Shopping Ln',
    city: 'Brisbane',
    status: 'inactive',
    representative: 'Michael Brown',
  },
  {
    id: '4',
    name: 'Tech Park Tower',
    address: '567 Innovation Ave',
    city: 'Perth',
    status: 'pending',
    representative: 'Emily Wilson',
    phone: '(08) 9876 5432',
  },
  {
    id: '5',
    name: 'Harbor View Hotel',
    address: '321 Ocean Dr',
    city: 'Gold Coast',
    status: 'active',
    representative: 'David Lee',
    phone: '(07) 2468 1357',
  },
  {
    id: '6',
    name: 'Sunset Corporate Center',
    address: '987 Business Pkwy',
    city: 'Adelaide',
    status: 'inactive',
    representative: 'Lisa Taylor',
  },
];

export function SitesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // For grid view
  const tableItemsPerPage = 10; // For table view
  
  const filteredSites = mockSites.filter(site => {
    // Filter by search term
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.representative.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    
    // Filter by city
    const matchesCity = cityFilter === 'all' || site.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });
  
  // Get unique cities for the filter
  const cities = Array.from(new Set(mockSites.map(site => site.city))).sort();

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
  const StatusBadge = ({ status }: { status: SiteStatus }) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
          
          <div className="flex gap-4">
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
                <SiteCard key={site.id} {...site} />
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
                    <TableHead>Contact</TableHead>
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
                          <div>{site.address}</div>
                          <div className="text-muted-foreground text-sm">{site.city}</div>
                        </TableCell>
                        <TableCell>{site.representative}</TableCell>
                        <TableCell>{site.phone || "—"}</TableCell>
                        <TableCell>
                          <StatusBadge status={site.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
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
