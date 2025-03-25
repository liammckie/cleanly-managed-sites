
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSites } from '@/hooks/useSites';
import { useClients } from '@/hooks/useClients';
import { SiteCard } from './SiteCard';
import { SiteFilters } from './SiteFilters';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { SiteListHeader } from './SiteListHeader';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SiteRecord } from '@/lib/types';

export function SitesList() {
  const navigate = useNavigate();
  const { data: sites = [], isLoading: sitesLoading, error: sitesError } = useSites();
  const { clients, isLoading: clientsLoading } = useClients();
  const [filteredSites, setFilteredSites] = useState<SiteRecord[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    client: '',
    sortBy: 'name',
    sortDirection: 'asc',
  });

  // Convert sites data to array if it's not already
  const sitesArray = Array.isArray(sites) ? sites : [];
  
  // Apply filters and sorting to sites
  useEffect(() => {
    if (!sitesArray) return;
    
    let result = [...sitesArray];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(site => 
        site.name.toLowerCase().includes(searchLower) ||
        site.address?.toLowerCase().includes(searchLower) ||
        site.client_name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(site => site.status === filters.status);
    }
    
    // Apply client filter
    if (filters.client) {
      result = result.filter(site => site.client_id === filters.client);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const propA = (a as any)[filters.sortBy] || '';
      const propB = (b as any)[filters.sortBy] || '';
      
      if (typeof propA === 'string' && typeof propB === 'string') {
        return filters.sortDirection === 'asc' 
          ? propA.localeCompare(propB)
          : propB.localeCompare(propA);
      } else {
        const valA = propA || 0;
        const valB = propB || 0;
        return filters.sortDirection === 'asc' 
          ? valA - valB
          : valB - valA;
      }
    });
    
    setFilteredSites(result);
  }, [sitesArray, filters]);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection: prev.sortBy === sortBy && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleAddNewSite = () => {
    navigate('/sites/new');
  };
  
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  const handleSiteSelect = (siteId: string) => {
    navigate(`/sites/${siteId}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'secondary';
      case 'lost':
        return 'destructive';
      case 'on_hold':
      case 'on-hold':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  if (sitesLoading || clientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (sitesError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error loading sites</AlertTitle>
        <AlertDescription>
          {sitesError.message || 'An error occurred while fetching site data. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SiteListHeader siteCount={filteredSites.length} />
        <Button onClick={handleAddNewSite} className="md:ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Site
        </Button>
      </div>
      
      <SiteFilters 
        clients={clients} 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onSort={handleSort}
      />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <SiteCard 
              key={site.id}
              site={site}
              onClick={() => handleSiteSelect(site.id)}
              clientName={site.client_name || getClientName(site.client_id || '')}
              statusBadge={
                <Badge variant={getStatusColor(site.status || '') as any}>
                  {site.status}
                </Badge>
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No sites match your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
