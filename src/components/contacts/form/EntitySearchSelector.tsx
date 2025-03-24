
import React, { useState, useEffect } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { EntityType, AssignmentType } from '../contactSchema';
import { contactsApi } from '@/lib/api/contactsApi';
import { Building, Store, Truck } from 'lucide-react';

interface EntitySearchSelectorProps {
  entityType: EntityType;
  assignmentType: AssignmentType;
  entityId: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEntitySelect: (id: string, name: string) => void;
}

export function EntitySearchSelector({ 
  entityType, 
  assignmentType, 
  entityId,
  searchTerm,
  onSearchChange,
  onEntitySelect
}: EntitySearchSelectorProps) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Perform search for entities
  useEffect(() => {
    const searchEntities = async () => {
      if (searchTerm.length < 2) return;
      
      setIsSearching(true);
      try {
        const results = await contactsApi.searchEntities(searchTerm, entityType);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching entities:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchEntities();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, entityType]);

  // Don't show for internal contacts or bulk assignments
  if (entityType === 'internal' || assignmentType !== 'single') {
    return null;
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'client': return <Building className="h-4 w-4" />;
      case 'site': return <Store className="h-4 w-4" />;
      case 'supplier': return <Truck className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Select {entityType}</FormLabel>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search for ${entityType}...`}
          className="pl-8"
        />
      </div>
      {searchTerm.length > 0 && (
        <div className="border rounded-md max-h-48 overflow-y-auto">
          {isSearching ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                className={`p-2 cursor-pointer hover:bg-accent flex items-center ${entityId === result.id ? 'bg-muted' : ''}`}
                onClick={() => onEntitySelect(result.id, result.name)}
              >
                {getEntityIcon(result.type)}
                <div className="ml-2">
                  <div>{result.name}</div>
                  {result.identifier && (
                    <div className="text-xs text-muted-foreground">
                      {result.identifier}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-sm text-muted-foreground">
              No results found. Please try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
