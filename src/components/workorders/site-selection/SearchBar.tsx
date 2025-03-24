
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setShowClientSelector: (show: boolean) => void;
  searchResults: any[];
  handleSearchResultClick: (result: any) => void;
  selectedClientId: string;
  stateFilter: string;
  setSelectedClientId: (id: string) => void;
  setStateFilter: (state: string) => void;
  clients: any[];
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  setShowClientSelector,
  searchResults,
  handleSearchResultClick,
  selectedClientId,
  stateFilter,
  setSelectedClientId,
  setStateFilter,
  clients,
}: SearchBarProps) => {
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
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
    </>
  );
};
