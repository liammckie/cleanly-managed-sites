
import React, { useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { contactsApi } from '@/lib/api/contacts';

interface EntitySearchSelectorProps {
  entityType: string;
  assignmentType?: 'single' | 'all_sites' | 'all_clients';
  entityId?: string;
  searchTerm?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onEntitySelect?: (id: string, name: string) => void;
}

export function EntitySearchSelector({ 
  entityType, 
  assignmentType = 'single',
  entityId,
  searchTerm,
  value,
  onChange,
  onSearchChange,
  onEntitySelect
}: EntitySearchSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchTerm || '');
  const [searchResults, setSearchResults] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // If using external search handler
    if (onSearchChange) {
      onSearchChange(query);
    }
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await contactsApi.searchEntities(query, entityType);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching entities:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEntity = (entityId: string, entityName: string) => {
    if (onChange) {
      onChange(entityId);
    }
    
    if (onEntitySelect) {
      onEntitySelect(entityId, entityName);
    }
    
    setOpen(false);
  };

  // Determine button text based on various props
  const getButtonText = () => {
    if (assignmentType === 'all_sites') return "All Sites";
    if (assignmentType === 'all_clients') return "All Clients";
    if (searchTerm) return searchTerm;
    
    const selectedEntity = searchResults.find(entity => entity.id === (value || entityId));
    return selectedEntity ? selectedEntity.name : "Select Entity...";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={assignmentType !== 'single'}
        >
          {getButtonText()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search entity..."
            onValueChange={handleSearch}
            value={searchQuery}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center h-14">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              "No entity found."
            )}
          </CommandEmpty>
          <ScrollArea className="max-h-[200px] overflow-y-auto">
            <CommandGroup>
              {searchResults.map((entity) => (
                <CommandItem
                  key={entity.id}
                  value={entity.name}
                  onSelect={() => handleSelectEntity(entity.id, entity.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (value === entity.id || entityId === entity.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {entity.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
