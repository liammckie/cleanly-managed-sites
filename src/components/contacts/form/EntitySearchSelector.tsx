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
  value?: string;
  onChange: (value: string) => void;
}

export function EntitySearchSelector({ entityType, value, onChange }: EntitySearchSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
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

  const selectedEntity = searchResults.find(entity => entity.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedEntity ? selectedEntity.name : "Select Entity..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search entity..."
            onValueChange={handleSearch}
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
                  onSelect={() => {
                    onChange(entity.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === entity.id ? "opacity-100" : "opacity-0"
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
