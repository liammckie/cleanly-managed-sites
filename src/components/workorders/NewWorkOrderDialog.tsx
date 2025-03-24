import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SiteRecord, ClientRecord } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { WorkOrderForm } from './WorkOrderForm';
import { Building2, Search, Filter, X } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { searchApi } from '@/lib/api/searchApi';

interface NewWorkOrderDialogProps {
  sites: SiteRecord[];
  onSuccess: () => void;
}

interface SiteSelectionForm {
  siteId: string;
  clientId?: string;
  stateFilter?: string;
  searchQuery?: string;
}

export const NewWorkOrderDialog = ({ sites: allSites, onSuccess }: NewWorkOrderDialogProps) => {
  const [selectedSite, setSelectedSite] = useState<SiteRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const { clients, isLoading: isLoadingClients } = useClients();
  
  const availableStates = useMemo(() => {
    const states = allSites
      .map(site => site.state)
      .filter((state, index, self) => 
        state && self.indexOf(state) === index
      )
      .sort();
    return states;
  }, [allSites]);

  const form = useForm<SiteSelectionForm>({
    defaultValues: {
      siteId: '',
      clientId: '',
      stateFilter: '',
      searchQuery: '',
    },
  });

  const filteredSites = useMemo(() => {
    return allSites.filter(site => {
      if (selectedClientId && site.client_id !== selectedClientId) {
        return false;
      }
      
      if (stateFilter && site.state !== stateFilter) {
        return false;
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          site.name.toLowerCase().includes(query) ||
          (site.address && site.address.toLowerCase().includes(query)) ||
          (site.city && site.city.toLowerCase().includes(query)) ||
          (site.client_name && site.client_name.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [allSites, searchQuery, stateFilter, selectedClientId]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await searchApi.searchEntities(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const onSubmit = (data: SiteSelectionForm) => {
    const site = allSites.find(s => s.id === data.siteId);
    if (site) {
      setSelectedSite(site);
    }
  };

  const handleSearchResultClick = (result: any) => {
    if (result.type === 'site') {
      const site = allSites.find(s => s.id === result.id);
      if (site) {
        setSelectedSite(site);
      }
    } else if (result.type === 'client') {
      setSelectedClientId(result.id);
      const client = clients.find(c => c.id === result.id);
      if (client) {
        setSearchQuery(client.name);
      }
    }
    setSearchResults([]);
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowClientSelector(false);
    
    const clientSites = allSites.filter(site => site.client_id === clientId);
    if (clientSites.length === 1) {
      setSelectedSite(clientSites[0]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    form.setValue('searchQuery', '');
  };

  const clearFilters = () => {
    setSelectedClientId('');
    setStateFilter('');
    setSearchQuery('');
    form.reset({
      siteId: '',
      clientId: '',
      stateFilter: '',
      searchQuery: '',
    });
  };

  if (allSites.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          You need to create a site before you can create a work order.
        </p>
        <Button asChild>
          <a href="/sites/create">Create Site</a>
        </Button>
      </div>
    );
  }

  if (selectedSite) {
    return <WorkOrderForm site={selectedSite} onSuccess={onSuccess} />;
  }

  const ClientSelectorDialog = () => (
    <Dialog open={showClientSelector} onOpenChange={setShowClientSelector}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Client</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoadingClients ? (
            <div className="p-4 text-center">Loading clients...</div>
          ) : (
            <div className="grid gap-2">
              {clients.map(client => (
                <div
                  key={client.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleClientSelect(client.id)}
                >
                  <div className="font-medium">{client.name}</div>
                  {client.city && (
                    <div className="text-sm text-muted-foreground">
                      {client.city}{client.state ? `, ${client.state}` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select a site for this work order</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                type="button"
                className={cn(
                  "text-xs",
                  !(selectedClientId || stateFilter || searchQuery) && "opacity-50 pointer-events-none"
                )}
              >
                Clear filters
              </Button>
            </div>

            <div className="relative">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search clients or sites..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowClientSelector(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-md max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="p-2 hover:bg-accent cursor-pointer flex items-center space-x-2"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <Badge variant="outline" className="text-xs">
                        {result.type === 'client' ? 'Client' : 'Site'}
                      </Badge>
                      <span>{result.name}</span>
                      {result.identifier && (
                        <span className="text-xs text-muted-foreground">
                          ({result.identifier})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 min-h-6">
              {selectedClientId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>Client: {clients.find(c => c.id === selectedClientId)?.name}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedClientId('')}
                  />
                </Badge>
              )}
              {stateFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>State: {stateFilter}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setStateFilter('')}
                  />
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Filter by Client</FormLabel>
                <Select 
                  value={selectedClientId} 
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Filter by State</FormLabel>
                <Select 
                  value={stateFilter} 
                  onValueChange={setStateFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All states</SelectItem>
                    {availableStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {filteredSites.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No sites found matching your criteria.
              </div>
            ) : (
              filteredSites.map((site) => (
                <Card 
                  key={site.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    form.setValue('siteId', site.id);
                    onSubmit({ siteId: site.id });
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate">{site.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {site.client_name && (
                        <span className="block font-medium">{site.client_name}</span>
                      )}
                      <span>
                        {site.address}, {site.city}, {site.state}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {filteredSites.length > 0 && (
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!form.watch('siteId')}>
                Continue
              </Button>
            </div>
          )}
        </form>
      </Form>
      <ClientSelectorDialog />
    </div>
  );
};
