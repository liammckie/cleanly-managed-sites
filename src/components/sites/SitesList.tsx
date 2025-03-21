
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
import { Plus, Search } from 'lucide-react';

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
      
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 glass-input"
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] glass-input">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[140px] glass-input">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map(site => (
            <SiteCard key={site.id} {...site} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-lg text-muted-foreground">No sites found matching your criteria.</p>
          <Button className="mt-4" asChild>
            <Link to="/sites/create">Create New Site</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
