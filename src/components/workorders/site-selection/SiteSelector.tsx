
import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SiteRecord, ClientRecord } from '@/lib/types';
import { useClients } from '@/hooks/useClients';
import { searchApi } from '@/lib/api/searchApi';
import { SearchBar } from './SearchBar';
import { FilterSelectors } from './FilterSelectors';
import { SiteGrid } from './SiteGrid';
import { ClientSelectorDialog } from './ClientSelectorDialog';

interface SiteSelectorProps {
  sites: SiteRecord[];
  onSiteSelect: (site: SiteRecord) => void;
}

interface SiteSelectionForm {
  siteId: string;
  clientId?: string;
  stateFilter?: string;
  searchQuery?: string;
}

export const SiteSelector = ({ sites: allSites, onSiteSelect }: SiteSelectorProps) => {
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
      if (selectedClientId && selectedClientId !== 'all-clients' && site.client_id !== selectedClientId) {
        return false;
      }
      
      if (stateFilter && stateFilter !== 'all-states' && site.state !== stateFilter) {
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
      onSiteSelect(site);
    }
  };

  const handleSearchResultClick = (result: any) => {
    if (result.type === 'site') {
      const site = allSites.find(s => s.id === result.id);
      if (site) {
        onSiteSelect(site);
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
      onSiteSelect(clientSites[0]);
    }
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

  const handleSiteSelect = (siteId: string) => {
    form.setValue('siteId', siteId);
    onSubmit({ siteId });
  };

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
                className={!(selectedClientId || stateFilter || searchQuery) ? "opacity-50 pointer-events-none" : "text-xs"}
              >
                Clear filters
              </Button>
            </div>

            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowClientSelector={setShowClientSelector}
              searchResults={searchResults}
              handleSearchResultClick={handleSearchResultClick}
              selectedClientId={selectedClientId}
              stateFilter={stateFilter}
              setSelectedClientId={setSelectedClientId}
              setStateFilter={setStateFilter}
              clients={clients}
            />

            <FilterSelectors 
              selectedClientId={selectedClientId}
              setSelectedClientId={setSelectedClientId}
              stateFilter={stateFilter}
              setStateFilter={setStateFilter}
              clients={clients}
              availableStates={availableStates}
            />
          </div>

          <SiteGrid 
            sites={filteredSites} 
            handleSiteSelect={handleSiteSelect} 
          />

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
      <ClientSelectorDialog 
        showClientSelector={showClientSelector}
        setShowClientSelector={setShowClientSelector}
        clients={clients}
        isLoadingClients={isLoadingClients}
        handleClientSelect={handleClientSelect}
      />
    </div>
  );
};
