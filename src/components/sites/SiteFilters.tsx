
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ClientRecord } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';

interface SiteFiltersProps {
  filters: {
    search: string;
    status: string;
    client: string;
    sortBy: string;
    sortDirection: string;
  };
  clients: ClientRecord[];
  onFilterChange: (key: string, value: string) => void;
  onSort: (sortBy: string) => void;
}

export function SiteFilters({ filters, clients, onFilterChange, onSort }: SiteFiltersProps) {
  return (
    <div className="space-y-4 bg-card rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search filter */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by name or address"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        
        {/* Status filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Client filter */}
        <div className="space-y-2">
          <Label>Client</Label>
          <Select
            value={filters.client}
            onValueChange={(value) => onFilterChange('client', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort controls */}
        <div className="space-y-2">
          <Label>Sort by</Label>
          <div className="flex gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="client_name">Client</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onFilterChange('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')}
              className="flex-shrink-0"
              aria-label={`Sort ${filters.sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            >
              <ArrowUpDown className={`h-4 w-4 ${filters.sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Reset filters button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            onFilterChange('search', '');
            onFilterChange('status', '');
            onFilterChange('client', '');
            onFilterChange('sortBy', 'name');
            onFilterChange('sortDirection', 'asc');
          }}
          size="sm"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
