
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
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
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={filters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="on_hold">On Hold</option>
            <option value="lost">Lost</option>
          </Select>
        </div>
        
        {/* Client filter */}
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select
            id="client"
            value={filters.client}
            onValueChange={(value) => onFilterChange('client', value)}
          >
            <option value="">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </div>
        
        {/* Sort controls */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort by</Label>
          <div className="flex gap-2">
            <Select
              id="sort"
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange('sortBy', value)}
            >
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="client_name">Client</option>
              <option value="address">Address</option>
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
